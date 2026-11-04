### Voyage - Integration with Navis (Bluetracker One) API for Arrival & Departure Report

Integrate the Navis (Bluetracker One) API with the Voyage module's "Arrival & Departure Report" section to retrieve detailed vessel data, including arrival, berthing, departure, bunkering, and fuel readings, from Navis's performance reports and auto-populate in the respective fields — as a second tracking-provider data source alongside the existing Coach Solutions integration.

Everything below reflects endpoints actually called live against the production Navis API (test vessel IMO 9972517), not just vendor documentation — corrections from what documentation alone would suggest are called out explicitly.

#### Acceptance Criteria

1. **API Integration:**
   * The system must be integrated with the Navis (Bluetracker One) API to fetch vessel data for Arrival, Berthing, Departure, Bunkering, and Fuel readings.
   * The API base URL is: `https://api.bluetracker.one` (interactive docs: `https://api.bluetracker.one/swagger/index.html`).
   * The user must provide the vessel's **IMO Number** — unlike Coach Solutions, Navis identifies vessels directly by IMO, so there is no separate "look up a Vessel ID" call. The IMO can be validated via `GET /api/v1/ships/{imoNumber}` (confirmed live: returns `200` with the vessel record if it is visible under the account, `403` if not).
   * The API key must be used for API access via the header `Authorization: ApiKey <key>` (a different scheme from Coach Solutions' unprefixed token) and must be sourced from proper secrets management, not committed to the repo or `.env.*` files.
   * Confirmed live — only two endpoints are needed:
      * `GET /api/v1/ships/{imoNumber}/reportsummaries` — batch performance-report data for a date range (carries event type, ports, and fuel).
      * `GET /api/v1/Bunker/{imoNumber}?year={year}` — bunker delivery records.
   * `GET /api/v1/reports/{reportId}/summary` must **not** be used — confirmed live to return `403 Forbidden` ("Access denied for the provided API Key") with the account's key. This is a hard dead end, not just a less efficient alternative.
   * `PageSize` is capped at 100 (confirmed: 150 → HTTP 400). `Page` is **0-indexed** — pagination must start at `Page=0` (or omit the parameter), not `Page=1`.

2. **Report Data:**
   * Once the IMO Number and API key are configured, the system will fetch the vessel's performance report data for the given period.
   * The report consists of one record per event/reading in the specified date range (Navis's equivalent of Coach Solutions' one-record-per-day, though Navis also emits extra records for events like anchoring that fall outside COEMS's three canonical events).
   * Each record contains the following vessel data:
      * **Event Type:** `EndOfSeaPassage`, `Arrival`, `Departure`, `Noon`, etc. — Navis's equivalent of Coach Solutions' "Activity."
      * **Vessel Name:** via a nested `ship` object on the record.
      * **Port:** a single field, `arrivalPortUnloc` — Navis does not carry a separate "Next Port" field the way Coach Solutions does. See the Departure Data correction below.
      * **Fuel Data:** Remaining fuel (ROB), bunkered fuel, and fuel consumption.
      * **Position:** present on the record but not required for any Arrival & Departure Report field in this story.

3. **Data Fetching and System Updates:** The system must retrieve and update the following details from the Navis `reportsummaries` API response into the COEMS system:
   * **Arrival Data:**
      * Event Type: `"EndOfSeaPassage"` (Navis's equivalent of Coach Solutions' "End of Sea Passage").
      * Arrival Port: the `arrivalPortUnloc` value from the record where Event Type is `"EndOfSeaPassage"`.
      * Arrival Date & Time: the `timeStampUtc` value from the same record.
   * **Berthing Data:**
      * Event Type: `"Arrival"` — confirmed live that Navis's literal `Arrival` event means arrival *at berth*, equivalent to Coach Solutions' "Arrival at Berth" activity.
      * Berthing Port: the `arrivalPortUnloc` value from the record where Event Type is `"Arrival"`.
      * Berthing Date & Time: the `timeStampUtc` value from the same record.
   * **Departure Data:**
      * Event Type: `"Departure"`.
      * Departure Port: the `arrivalPortUnloc` value from the record where Event Type is `"Departure"`. **Correction (confirmed live):** the schema also defines a `departurePortUnloc` field, but across 42 live sample records it was populated in only 1 case — and not on a `Departure` record. `arrivalPortUnloc` is populated on every record regardless of event type, including the live `Departure` record itself, and must be used instead.
      * Departure Date & Time: the `timeStampUtc` value from the same record.
   * **Fuel Data:**
      * Arrival Fuel:
         * The fuel data at Arrival is identified by the `"Arrival"` event type (the same record used for Berthing Data above).
         * Retrieve Fuel Remaining on Board (`robFuelHfoLs` for VLSFO-equivalent; `robFuelMgo`/`robFuelMgoLs`/`robFuelMgoLls` for MGO-equivalent) and Port (`arrivalPortUnloc`) from the record.
         * Note: the schema also has a `robFuelHfo` field, which the vendor documents as an overlapping reading of the same physical tank as `robFuelHfoLs` — the two must not be summed. `robFuelHfoLs` is the field to use.
      * Departure Fuel:
         * The fuel data at Departure is identified by the `"Departure"` event type.
         * Retrieve the same Fuel Remaining on Board fields and Port (`arrivalPortUnloc`) from that record.
   * **Bunkering Data** (Navis-specific — Coach Solutions has no separate bunker-delivery feed):
      * Bunkered quantity and date are already present directly on a `reportsummaries` record — `bunkerFuelHfo` (HFO-equivalent) and `bunkerFuelMgo` (MGO-equivalent) — on whichever record's timestamp coincides with the delivery. No separate matching step is required to populate these two fields.
      * **Correction:** there is no "`bunkerFuelMgo` family" — the schema (confirmed via the live OpenAPI spec, 718 properties on `PerformanceReportSummary`) declares exactly one Mgo-side bunker field, `bunkerFuelMgo`. The HFO side does have a family — `bunkerFuelHfo`, `bunkerFuelHfoLs`, `bunkerFuelHfoHs`, `bunkerFuelHfoLls` — but only `bunkerFuelHfo`/`bunkerFuelHfoLs` have ever been populated in this account's live data, since every observed delivery has been `HFOLS`/`MGOLLS` grade. `bunkerFuelHfoHs` and `bunkerFuelHfoLls` are declared but unverified — if this vessel/account ever bunkers an HS-grade or LLS HFO delivery, confirm those fields populate the same way before relying on them.
      * **These keys are absent from the JSON entirely — not `null` — on any record that isn't the exact bunkering moment.** Confirmed by inspecting raw key presence (not just value): on a non-bunkering record, `"bunkerFuelHfo" in record` is `False`, the property is not serialized at all. Across the 5 known delivery-day windows (14 report records total), only 5 carry any `bunkerFuel*` key. A naive check of "a" or "any" `reportsummaries` record — rather than specifically the one whose timestamp matches a delivery — will not find these fields, which is expected, not a bug.
      * Confirmed live, **8 of 8** real examples (re-verified against the account's full bunker history, including 2 deliveries added after the original check): a bunker delivery's timestamp always exactly matches a `reportsummaries` record's `timeStampUtc`, and the delivered amount matches that record's `bunkerFuelHfo`/`bunkerFuelMgo` value exactly.
      * For detail the report doesn't carry (fuel grade/`isoGrade`, BDN reference number), call `GET /api/v1/Bunker/{imoNumber}?year={year}` and join to the matching report by **exact `bunkerDateUtc == timeStampUtc` equality** — not a date-range or tolerance match. The `bunkerReportId` field on `Bunker` records does **not** join to a report's `id` (confirmed by direct live test) and must not be used for matching.
      * If a `Bunker` record is ever found with no exact-timestamp match on any report, it must be flagged for admin review rather than silently dropped or matched to the nearest record.

4. All the above Data should be auto-populated in the respective fields, and a Notification icon should be enabled whenever an update is there in the Report
   1. All the Data should be editable by the User

5. The 'Update' button should be renamed to 'Confirm & Update' (unchanged — the same button serves both Coach Solutions- and Navis-sourced records).

---

#### Out of scope

* Per-vessel provider assignment (choosing which integration is authoritative for a given vessel) and the shared, administrator-governed Fuel Mapping / Event Mapping tables — these belong to the separate **Port Call Data Reconciliation v2** feature (status: Draft, not yet built).
* Two-way sync back to Navis.
* Automatic failover between Coach Solutions and Navis for a given vessel.
* On-demand/ad-hoc refresh from the UI — ingestion remains a scheduled pull, consistent with Coach Solutions today.
* Backfilling historical report data when a vessel's provider assignment changes.

#### Open items

1. **FuelMapping / EventMapping admin tables** — still design-only; this story's Event Type recognition (AC 3) and fuel-field selection (AC 3, Fuel Data) will need to be re-pointed at those tables once built, rather than hardcoded.
2. **`coems_core` refactor** — the existing derivation methods key off two hardcoded Coach Solutions activity GUIDs and a `'Departure'` string check; adding Navis needs either a second hardcoded branch or the planned mapping table first.
3. **`NoonReportData` provider field** — undecided whether raw stored reports need a `provider` field for traceability.
4. **In-flight reassignment handling** — behavior if an administrator changes a vessel's provider mid-ingestion-cycle is unresolved in the parent feature's PRD.
5. **`coach_value` / `CoachData` naming** — legacy naming in the REST contract/frontend is a rename candidate now that a second provider exists; functionally harmless either way.
6. **`bunkerFuelHfoHs` / `bunkerFuelHfoLls` are unverified** — declared in the schema alongside `bunkerFuelHfo`/`bunkerFuelHfoLs`, but this account has never bunkered an HS-grade or LLS-grade HFO delivery, so these two fields have never been observed populated. If the fuel-mapping table (item 1) needs to classify those grades, confirm live that they populate the same way (present only on the matching record, absent elsewhere) before relying on them.
