#### **USER Story:**

**As a** Management-module user responsible for keeping COEMS and Business Central in sync,
**I want to** see a "Logs" listing of every update COEMS has sent to Business Central for syncing,
**So that** I can confirm master/reference data changes made in COEMS (e.g. a Port being added or updated) have actually reached Business Central, and quickly spot and investigate any sync that failed.

> Checked live against the Management module (`coems.bctesting.admaren.org`): the sidebar currently has Customers, Port Agency, Offices, Fixtures, Incidents, Legal Review, Insurance, Claims, Voyage, **General Ledger BC**, **General Ledger**, then a Reports group (Fixture Reports, Reports) — no "Logs" entry exists today.
>
> This is **not** the same as the two existing Ledger pages, which are easy to confuse with it:
> - **General Ledger BC** (`/management/invoice-listing`) shows financial entries flowing **from** Business Central **into** COEMS (Entry No, Posting Date, Document Type, GL Account, etc.) — inbound accounting data.
> - **General Ledger** (`/management/income-expense-list`) shows COEMS's own internal income/expense ledger across fixtures — not sync activity at all.
>
> Neither tracks the **outbound** direction this story is about: a record changed in COEMS (Port, Office, Account Head, Vessel, Customer, etc.) being pushed **to** Business Central. The Settings → Administration → Integrations page (`/settings/integration`) was also checked — it lists only "Coach Solutions" and "Navis" as configured integrations, with no Business Central card, so the BC sync connection is managed outside that page.

---

#### **acceptance criteria:**

1. **New "Logs" entry in the Management sidebar**

   * A new sidebar item, **Logs**, is added to the Management module, positioned near General Ledger / General Ledger BC (its natural neighbours, being the other Business-Central-related entries).
   * Opens a listing page titled "Logs."

2. **One row per outbound sync event**

   * Every time a COEMS master/reference-data record is created or updated and that change is sent to Business Central for syncing, one log line item is created.
   * Example (from the request): a **Port** added or updated in COEMS → Business Central sync → one Logs row is created recording that event.
   * The same applies to every other entity type COEMS syncs outbound to Business Central (e.g. Offices, Account Heads, Vessel Category/Type, Customers — whichever master-data entities the integration actually pushes; see Out of Scope).

3. **Column set**

   The listing uses the following columns:

   | Column | Purpose |
   | --- | --- |
   | Log ID | Unique reference for the log entry itself |
   | Module / Entity Type | What kind of COEMS record triggered the sync — e.g. Port, Office, Account Head, Vessel |
   | Record Name | The specific record that was synced — e.g. the Port's name |
   | Action | Created / Updated / Deleted |
   | Sync Status | Success / Failed / Pending — a business-readable summary, for quick scanning and filtering |
   | Response Code | The raw HTTP status code returned by Business Central (e.g. 200, 400, 401, 404, 500), shown alongside Sync Status rather than replacing it — a 400 (bad data sent from COEMS) and a 500 (BC-side server error) need different fixes, so this lets support/engineering triage the failure type without opening the row detail every time |
   | Synced On | Date & time the sync was sent/completed |
   | BC Reference No. | The corresponding Business Central record ID/number, once returned |
   | Triggered By | The COEMS user whose change caused the sync |
   | Remarks | Populated with the error detail when Sync Status = Failed; blank otherwise |

4. **Search & Filter**

   * A Search field and an "Add Filter" panel are available, consistent with every other Management listing page (Fixtures, Claims, General Ledger, etc.).
   * Filterable at minimum by Module/Entity Type, Action, Sync Status, Response Code, Synced On (date range), and Triggered By.

5. **Row detail**

   * Clicking a log row opens a detail view showing the full record of what was sent to Business Central and the response received (including the full response body, not just the Response Code shown in the listing), so a failed sync can be diagnosed without leaving COEMS.

6. **Failed syncs are visually distinguishable**

   * Rows with Sync Status = Failed (i.e. a non-2xx Response Code) are visually flagged (e.g. a red status badge, consistent with status-badge conventions used elsewhere in COEMS) so they stand out in the list without needing to open each row.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Management → sidebar | New "Logs" entry added, positioned near General Ledger / General Ledger BC |
| Logs listing page | New page: one row per outbound COEMS → Business Central sync event, per the column set in AC 3 |
| Logs → Search & Filter | Search box + Add Filter panel, filterable by Module, Action, Sync Status, Synced On, Triggered By |
| Logs → row click | Opens a detail view with the full sent payload and BC response |
| Logs → Failed rows | Visually flagged (status badge) |

---

#### **Out of Scope:**

* The exact, complete list of entity types that sync outbound to Business Central — confirmed conceptually (Port is the example given), but the full set (which of Offices, Account Heads, Vessel Category/Type, Own Vessels, Customers, etc. actually push to BC today) was not inspected in the backend/integration config and needs confirmation before build.
* A manual "Retry Sync" action for failed entries — not requested; would need a separate decision on whether retries are automatic, manual, or not supported at all.
* Any change to the existing **General Ledger** or **General Ledger BC** pages — both are unaffected; this is a new, separate page.
* Configuring or exposing the Business Central connection itself on the Integrations settings page — out of scope; this story only adds visibility into sync activity, not connection management.
* Real-time/live-updating log entries vs. periodic refresh — not specified; assumed to behave like every other COEMS listing page (loads on open/refresh, not a live feed).
* Exporting the Logs listing (PDF/Excel) — not requested.
