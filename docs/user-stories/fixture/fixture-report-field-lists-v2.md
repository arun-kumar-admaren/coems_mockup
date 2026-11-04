# New Fixture Report: field lists (v2.1, after the PO review, round 2)

**Written:** 2026-11-04, updated the same day for the PO's second round of changes. **Supersedes:** `fixture-report-pcer-field-lists.md` (2026-11-03).
**Basis:** the PO's changes of 2026-11-04, the real Fixture List **Export All** file from bctesting (`fixture-export-columns.md`, `fixture-export-columns.html`), and the Port Call Evaluation Report (PCER) as it behaves on bctesting.

## 0. What changed in round 2 (plus the columns field)

| # | Change | Result |
|---|---|---|
| 1 | **Offices** removed from the Add and Edit popup | All offices are always included. `FIXED BY` stays a column, so users can still chart or pivot by office. |
| 2 | **Conversion Date** removed from the popup | Only the currency is chosen. Each fixture is converted at **its own conversion date** (see 3b). |
| 3 | **Include Cancelled and Postponed fixtures** removed from the popup | All fixtures are included. `FIXTURE STATUS` is a column, so users can chart, pivot or filter by status. |
| 4 | **REPORT MONTH and REPORT YEAR** columns removed | Charts and pivots detect date columns and group them **by month or by year**, like Excel (see 4a). No extra columns. |
| 5 | Columns with several comma separated values **left out of the table, for now** | `PORT OF LOADING`, `PORT OF DISCHARGE` and `COMMISSIONS` (see 3a). |
| 6 | New popup field **Select required columns** | The user picks which table columns the report has (all selected by default). Charts and pivots can only use the selected ones (see 2 and 3). |

The sample page `fixture-report-sample-v2.html` was built before these changes and still shows the earlier fields. It will not be rebuilt: the mockup app (section 7) is the reference (PO: the mockup is enough).

## 1. What it is

A new report type, **Fixture Report**, in Reports → Create, built like the PCER:

1. The user fills a popup.
2. A table is generated: the columns of the Fixture List **Export All**, limited by the date range, plus a few added columns.
3. The user builds their own **Bar**, **Stacked Bar**, **Pie** and **Pivot Table** from that table, exactly as they do in the PCER today.

There are **no ready-made reports**, no Grouped Bar, and no Top N / Sort / Others. The old Fixture Reports menu (All Reports → Fixture Reports) is removed.

## 2. Popup: "Add New Fixture Report"

| # | Field | Type | Values / default | Notes |
|---|---|---|---|---|
| 1 | Report Name\* | Text | | |
| 2 | Based on\* | Dropdown | **Booking Date** (default), **Created Date**, **Laycan Start** | Decides which date the Date Range applies to: `BOOKING DATE`, the date part of `CREATED ON`, or `LAYCAN START`. A fixture with no value in that date is left out (in practice only for laycan). |
| 3 | Date Range\* | From and to | No default | The only period field. Both dates are included. |
| 4 | Convert to (currency)\* | Dropdown | US Dollar (default); every currency in the system | The currency of the two converted columns. |
| 5 | Select required columns\* | Multi-select dropdown | **All columns selected** (default) | Lists every table column (3a and 3b), with a search box and Select all / Clear all. At least one column must stay selected. Shows "All 82 columns" or "n of 82 columns". |

**Select required columns, rules:**
- The chosen columns, and only those, are in the table. Charts and pivot tables can only use them (their Axis, Stack By, Category, Rows, Columns, Filter and Value lists show just these columns).
- The table keeps its own Show/Hide column chooser, which then works within the selected columns (it hides columns from view; the popup decides which columns the report has).
- Fixtures are still selected by the other fields: a column that is not selected can still be the Based on date, and the date range, the conversion and the row count do not change.
- A summary tile such as "Converted Management Fee" is shown only while its column is selected.
- When editing a report, a column used by one of its charts or pivot tables cannot be deselected: Save is disabled with a message listing the columns, and those columns are tagged "used by a chart or pivot" in the list. The user keeps them, or deletes the chart or pivot first.

Buttons: Cancel, Create Report. The gear on the report reopens the same fields as "Edit Fixture Report".

**Removed:** Offices, Conversion Date, "Include Cancelled and Postponed fixtures" (round 2); Period (year), Customer Type and the year multi-select (round 1).

## 3. The generated table

One row per fixture, **every office and every fixture status**. Its columns are the ones chosen in the popup's **Select required columns** (all 82 by default in the mockup). Same Show/Hide and Reorder column chooser as the Fixture List and the PCER, working within the selected columns.

**Column widths can be resized** as on the other COEMS listing pages: a grip at the right edge of each header is dragged to widen or narrow that column (minimum width applies; long text is cut off with "…" until widened; the new width applies to the header and every cell; other columns keep their width and the table scrolls sideways to fit). Widths are saved automatically per user and kept when a column is hidden and shown again; there is no "reset widths" control (same as the listing pages' story, `docs/user-stories/engineering/column-resize-engineering.md`).

### 3a. Columns from the export (78 of 81)

The 81 real columns of the Export All (`fixture-export-columns.md` has the full list), in the export's order, **without** the three below. The blank index column the export starts with is also left out. The table must fix how some columns are stored, because charts and pivots need real dates and real numbers:

| Fix | Columns |
|---|---|
| Text to **date** (`dd/mm/yyyy`) | `BOOKING DATE`, `DELIVERY DATE`, `REDELIVERY DATE` |
| Text to **date-time** | `CREATED ON`, `MODIFIED ON`, `VOYAGE START DATE` |
| Text to **number** | `FREIGHT RATE`, `BUY IN FREIGHT RATE`, `BUY IN GROSS FREIGHT RATE`, `BALANCE`, `PROGRESS` (`'56 %'` becomes 56) |
| Yes/No columns | `SEND TO OPERATIONS`, `IS ASSIGNED TO VOYAGE`, `BC SYNC FAILED` shown as Yes / No so they can be grouped |

Names that differ from the Fixture List: `FIXED BY` is Assigned Office, `CARGO TYPE` is Cargo Category.

**Left out for now (3):** these hold several comma separated values in one cell, which is of no use for charts, graphs or pivots.

| Column | Why |
|---|---|
| `PORT OF LOADING` | Several ports, with laycan dates in brackets, e.g. `Djibouti (24/07/2022-10/08/2022), Dar Es Salaam` |
| `PORT OF DISCHARGE` | Several ports |
| `COMMISSIONS` | Several parties with amounts, e.g. `USG HQ(0E-10), GE (40906.25)`. Left out as well (PO confirmed). |

Other text columns also contain commas, but only as part of one value (company names such as `Ormat Pacific, Inc.`, free-text comments and cargo descriptions), so they stay (PO confirmed).

### 3b. Added columns (4)

| Column | Type | Definition |
|---|---|---|
| `LAYCAN START` | Date | Start date of the fixture's **first laycan** (Laycan 1 on the Fixture List). Not in the export. Empty when the fixture has no laycan. |
| `LAYCAN END` | Date | End date of the first laycan |
| `CONVERTED GROSS FREIGHT` | Number | `GROSS FREIGHT` converted from the row's `CURRENCY` into the **Convert to** currency, using the fixture's **own conversion date**. Same currency means no change. |
| `CONVERTED MANAGEMENT FEE` | Number | `MANAGEMENT FEE` converted the same way |

`CURRENCY`, `GROSS FREIGHT` and `MANAGEMENT FEE` stay exactly as in the export. Never sum `GROSS FREIGHT` across currencies; use the converted columns.

**Conversion rule (round 2):** the report has no conversion date of its own. Every fixture already has its own conversion currency and date, so the two converted columns show the amount converted into the report's currency at the rate of **that fixture's** conversion date. Two fixtures in the same report can therefore use different rates. A fixture with no usable rate or date shows a blank. (The mockup has no stored conversion date per fixture, so it uses the booking date and sample monthly Euro to US Dollar rates, 2021 to 2023.)

## 4. Charts and pivot (unchanged from the PCER)

Every field list below is the PCER's. All of them work on the table columns above. Count works on any column; Sum and Average work only on number columns.

| Form | Fields |
|---|---|
| **Bar Chart** | Chart Name\*, X Axis\*, Y Axis\*, Aggregation\* (Count / Sum / Average) |
| **Stacked Bar Chart** | Chart Name\*, X Axis\*, Y Axis\*, Aggregation\*, Stack By\*, Display In (Values / Percentage) |
| **Pie Chart** | Chart Name\*, Category (Slice By)\*, Value\*, Aggregation\* (the PCER pie also has an optional Year filter) |
| **Pivot Table** | Pivot Table Name\*, then drag columns into **Rows**, **Columns**, **Filters** and **Values** (each value has Count / Sum / Average) |

### 4a. Dates group by month and year (new)

There are no month or year columns in the table. Instead the system **detects date and date-time columns** (`BOOKING DATE`, `DELIVERY DATE`, `REDELIVERY DATE`, `CREATED ON`, `MODIFIED ON`, `VOYAGE START DATE`, `LAYCAN START`, `LAYCAN END`) and, wherever a chart or pivot groups by a column, lets the user pick how to group the date, as Excel does:

| Grouping | Shown as | Notes |
|---|---|---|
| **By month** (default) | `2022-03` | Year and month together, so months sort in time order and the same month of different years stays apart |
| **By year** | `2022` | |
| **By day** | `20/06/2022` | The date as it is |

Where it applies: **X Axis**, **Stack By**, **Category (Slice By)**, and the pivot **Rows**, **Columns** and **Filters** field. The measure fields (Y Axis, Value, pivot Values) stay plain columns. For a date-time column the time is ignored. Blank dates show as "(Blank)".

## 5. Rules in one place

- **Date Range:** keeps a fixture when its Based on date is on or between the two dates.
- **Offices and statuses:** all offices and all fixture statuses (including Cancelled and Postponed) are in the table.
- **Conversion:** `converted = amount × rate(row currency to Convert to) at the fixture's own conversion date`. Same currency: no change.
- **Laycan Start:** only for Based on = Laycan Start. Fixtures with no laycan are left out. No fallback to Voyage Date.
- **Dates in charts and pivots:** grouped by month, year or day, chosen by the user (4a).
- **Blank values:** show as "(Blank)" in charts and pivots.

## 6. Open points for the PO

| # | Point | Notes |
|---|---|---|
| 1 | **Conversion rate and date on the fixture** | **Closed.** Each fixture's conversion rate is stored in the database (PO confirmed, no issue). A fixture without a rate or date (not expected) shows blank converted columns, with no warning (PO: nothing more needed). |
| 2 | **Names of the converted columns** | `CONVERTED GROSS FREIGHT` and `CONVERTED MANAGEMENT FEE`. The PO said "converted amount" in the singular. |
| 3 | **Laycan rule** | First laycan entered (Laycan 1) versus earliest start. Agreed: no Voyage Date fallback, fixtures without a laycan left out. In the sample, 57 of the 1,354 fixtures booked up to 2025 have no laycan in the port text (the Fixture List's own laycan field may be more complete). |
| 4 | **Port and commission columns** | Left out "for now". `COMMISSIONS` is left out too. Later option: one row per port (or a separate port table) so ports can be charted. |
| 5 | **Date grouping choices** | Month, Year and Day, with Month as the default. Are quarters or weeks needed? |
| 6 | **Charts with many categories** | A pie or stack on a column with about 200 values (such as ACCOUNT) is unreadable. The mockup shows the biggest 5 and groups the rest as Others; the PCER does not do this today. Decide the behaviour. |
| 7 | **Size** | The export is 1,926 fixtures × 82 columns (667 KB). All offices and all statuses over a wide date range can be much larger in production. Define paging and any limit. |
| 8 | **Rounded amounts** | `GROSS FREIGHT` and `MANAGEMENT FEE` are whole numbers in the export. Confirm that is acceptable. |
| 9 | **Per-column filters** | The PCER table has them; the mockup does not show them. |

**Closed in round 2:** Offices filter (removed), Cancelled and Postponed (all included), REPORT MONTH / REPORT YEAR (replaced by date grouping), exchange-rate date (the fixture's own, stored in the database), `COMMISSIONS` left out, comma-containing company names kept.

## 7. In the mockup app (Version 2.0)

The COEMS mockup app has this design. Switch the sidebar version to **v2.0**: the "Fixture Reports" item is replaced by **Reports**, which opens the reports list with **Create → New Fixture Report**. The popup (five fields, including Select required columns), the table (82 columns by default) with a column chooser and resizable columns, the Charts tab (Bar, Stacked Bar, Pie) and the Pivot Table tab all work on 436 real bctesting fixtures booked in 2021 and 2022. A seeded "Fixture report 2022" shows example charts and pivots grouped by `BOOKING DATE (Month)`; a newly created report starts empty, as in the PCER. Version 1.0 is unchanged. Code: `src/app/components/reports.tsx`, `fixture-report*.tsx` and `fixture-report-data.ts`, data in `src/app/data/fixture-export-sample.json`. The mockup's exchange rates are sample values, not system rates.

## 8. What the standalone sample shows

`fixture-report-sample-v2.html` uses 1,354 real fixtures booked up to 2025 (2026 on bctesting is mostly test data and is left out). It was built **before the round 2 changes**, so it still has the Offices, Conversion Date and Cancelled/Postponed fields, the REPORT MONTH / REPORT YEAR columns and the port columns. It is not being kept up to date; use the mockup app for the current design.
