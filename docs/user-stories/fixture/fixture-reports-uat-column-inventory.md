# Fixture Reports: current-state column inventory (UAT)

**Captured:** 2026-11-03 on UAT (`coems.uat.admaren.org`), Year = 2026, all offices.
**Purpose:** reference for the requirement to retire the fixed **Fixture Reports** pages and let users create these reports themselves under **Reports**, using the **Fixture List** as the data source.
**Status:** analysis only. No user story or BRD has been written yet; scope decisions are listed in section 6.
**PO feedback (Sajith Salim, Teams, 2026-11-03):** *remove TCE*; *for reports 1 to 10, add all column headers*; *list as one*. TCE is out of scope. The combined list is in section 3a and in `fixture-reports-all-column-headers.html` (pasteable into Teams).

---

## 1. Where it lives today

Sidebar → **All Reports** has two children:

| Item | Route | What it is |
|---|---|---|
| **Fixture Reports** | `/dashboard/fixture-overview` | Fixed dashboard with 11 tabs (this document) |
| **Reports** | `/reports/listing/view` | List of user-created reports (Mine / Others, Archived toggle, Search). **Create** offers *New Fleet Plan*, *New Budget Report*, *New Port Call Evaluation Report*. Each report opens as its own tab with a Share button and an edit (gear) dialog. |

There is no fixture report type under **Reports** today.

## 2. Filters (shared by tabs 1 to 10; verified 2026-11-03)

| Filter | Values |
|---|---|
| Based on | Booking Date · LAY-CAN / Voyage Date |
| Offices | Multi-select, all 22 offices (labelled *Select Offices* on Offices, Vessel) |
| Year | Default 2026. 2015 … 2026 and *Select Date Range* (seen on Fixture and Customer). *All* seen on the Fixture tab only; the Yearly Overview list starts at 2015 |

Defaults: Based on = Booking Date (blank on Yearly Overview), Offices = all 22 selected, Year = 2026. Small differences: the Offices field is labelled *Select Offices* on Offices and Vessel.

Extra filter: **Customer Type** only on Top Ten Customers and Customer, with options *Account* (default), *Head Account*, *Shipper*. No other tab among 1 to 10 has it. (TCE had its own filters and is out of scope.)

All tabs have an **Update** button and a ⋮ menu.

## 3. The 11 reports and their table columns

| # | Tab (route) | Table title | Columns |
|---|---|---|---|
| 1 | **Fixture** (`/dashboard/fixture-overview`) | Fixture Report | `UNITS` · one column per month of the period (JAN-2026 … OCT-2026) · `TOTAL`. Rows: FIXTURE, INDICATIONS, CONVERSION RATE (%), EXCHANGE RATE, INDICATIONS PER FIXTURE, EUR, USD, TOTAL IN USD |
| 2 | **Top Ten Customers** (`/dashboard/top-ten-customers`) | Top Ten Customers | `CUSTOMER` · `FIXTURE` · `EUR` · `USD` · `TOTAL`. Rows: top 10, *Others*, *Totals* |
| 3 | **Customer** (`/dashboard/customer-overview`) | Customers | `CUSTOMER` · `COUNT` · `EUR` · `USD` · `TOTAL IN USD` (+ *Totals* row) |
| 4 | **Person In Charge** (`/dashboard/person-in-charge`) | Person In Charge | `PIC` · `COUNT` · `EUR` · `USD` · `TOTAL IN USD` (+ *Totals* row) |
| 5 | **Offices** (`/dashboard/usg-offices`) | Offices | `UHL OFFICES` · `COUNT` · `EUR` · `USD` · `TOTAL IN USD` (+ *Totals* row) |
| 6 | **Vessel** (`/dashboard/vessel`) | Vessels | `FINAL PERFORMER` · `COUNT` · `EUR` · `USD` · `TOTAL IN USD` (+ *Totals* row) |
| 7 | **Vessel Type** (`/dashboard/vessel-type`) | Vessel Type | `VESSEL TYPE` · `COUNT` · `EUR` · `USD` · `TOTAL IN USD` (+ *Totals* row) |
| 8 | **Cargo Type** (`/dashboard/cargo-type`) | Cargo Type | `CARGO TYPE` · `COUNT` · `EUR` · `USD` · `TOTAL IN USD` (+ *Totals* row) |
| 9 | **Yearly Overview** (`/dashboard/yearly-overview`) | Currency | `UNITS` · `2026` (one column per selected year). Rows: Count, USD, EUR, Total In USD |
| 10 | **Customer Satisfaction** (`/dashboard/customer-satisfaction`) | Customer Satisfaction | `RATINGS` · `NOT RATED` · `WILL BOOK AGAIN` · `TOTAL`. Rows: Chartering, Operations, Engineering, *Totals* |
| 11 | **TCE** (`/dashboard/tce-report`), *out of scope, removed per PO 2026-11-03* | TCE Report | `Vessel` · `Voyage` · `Start` · `End` · `TCE` · `January` … `December`. Grouped by vessel with one row per voyage; footer rows with the monthly total and an *Average*. Cells are shaded red for $0 or negative. |

### Non-table content on each page

| Tab | Also shows |
|---|---|
| Fixture | Five status tiles, each split EUR / USD: **Cancelled** (n nos, gross freight), **Postponed** (n nos, gross freight), **To Be Issued**, **Invoiced**, **Paid** (management fee). Charts: *Fixture Numbers* (per month) and *Fixture Amount* (EUR, USD, Total USD per month). |
| Top Ten Customers | One donut chart (share of Total, with *Others*) |
| Customer, Person In Charge, Offices, Vessel, Vessel Type, Cargo Type | Four donuts: **Total USD**, **Fixture** (count), **EUR**, **USD**, grouped by the same field as the table |
| Yearly Overview | Donut of USD vs EUR |
| Customer Satisfaction | Three donuts (Chartering, Operations, Engineering): Not Rated vs Will Book Again |
| TCE | *Quarterly* (Q1–Q4) chart and *Monthly Average* chart |

## 3a. All column headers of reports 1 to 10, as one list

TCE is excluded (PO). Headers are the UAT labels. Where two labels mean the same thing they are kept as separate lines and noted.

| # | Column header | Type | Used in report(s) | Note |
|---|---|---|---|---|
| 1 | `CUSTOMER` | Group by | 2, 3 | Account (Customer Type filter) |
| 2 | `PIC` | Group by | 4 | Person In Charge |
| 3 | `UHL OFFICES` | Group by | 5 | Assigned Office |
| 4 | `FINAL PERFORMER` | Group by | 6 | Final Performer |
| 5 | `VESSEL TYPE` | Group by | 7 | Intended Vessel Type (to confirm) |
| 6 | `CARGO TYPE` | Group by | 8 | Cargo Category |
| 7 | `RATINGS` | Group by | 10 | Rows are Chartering, Operations, Engineering |
| 8 | `UNITS` | Row label | 1, 9 | Label column only; its rows are the measures below |
| 9 | `COUNT` | Measure | 3 to 8 (Count row in 9) | Number of fixtures |
| 10 | `FIXTURE` | Measure | 2 (FIXTURE row in 1) | Same as COUNT, different label |
| 11 | `EUR` | Measure | 2 to 8 (row in 1, 9) | Gross Freight in EUR |
| 12 | `USD` | Measure | 2 to 8 (row in 1, 9) | Gross Freight in USD |
| 13 | `TOTAL IN USD` | Measure | 3 to 8 (row in 1, 9) | EUR converted plus USD; needs a defined rate |
| 14 | `TOTAL` | Measure | 1, 2, 10 | Three meanings: total across months (1), same as TOTAL IN USD (2), number of ratings (10) |
| 15 | `NOT RATED` | Measure | 10 | Count |
| 16 | `WILL BOOK AGAIN` | Measure | 10 | Count |
| 17 | `INDICATIONS` | Measure | 1 | **Not on the Fixture List** (Inquiry) |
| 18 | `CONVERSION RATE (%)` | Measure | 1 | Fixtures ÷ Indications; depends on 17 |
| 19 | `EXCHANGE RATE` | Measure | 1 | **Not on the Fixture List**; source unclear |
| 20 | `INDICATIONS PER FIXTURE` | Measure | 1 | Indications ÷ Fixtures; depends on 17 |
| 21 | `JAN-2026` … `OCT-2026` | Period | 1 | One column per month of the selected period |
| 22 | `2026` | Period | 9 | One column per selected year |

## 4. Pattern across the reports

- Reports 3–8 are one report with a different group-by field: `[group field] | Count | EUR | USD | Total in USD`, plus four donuts. Report 2 is the same with a Top 10 limit and an *Others* row.
- Report 9 is the same measures (Count, USD, EUR, Total in USD) laid out by year instead of by group.
- Report 1 is the same measures by month, plus Indications, Conversion Rate and Exchange Rate.
- Report 10 is a count of rating values for three rating fields.
- Report 11 (TCE) is a different kind of report: per voyage, per month. It does not follow the pattern above. Out of scope per PO.

## 5. Can the Fixture List supply it?

Likely source columns on the Fixture List (to be confirmed when the story is written):

| Report | Likely Fixture List field(s) | Gap |
|---|---|---|
| Customer / Top Ten | Account (or Head Account, per *Customer Type*) | None |
| Person In Charge | Person In Charge | Multi-PIC fixtures appear as combined labels (e.g. "Christine Schou/Jakob Wittmann") |
| Offices | Assigned Office | None |
| Vessel | Final Performer (table header) / Intended Vessel | Many fixtures are *UNASSIGNED* |
| Vessel Type | Intended Vessel Type | None |
| Cargo Type | Cargo Category | None |
| Customer Satisfaction | Chartering / Engineering / Operations Rating | None |
| Yearly Overview, monthly Fixture table | Booking Date (or Laycan), Gross Freight, Currency | USD-converted total needs a defined exchange rate; the list has none |
| Status tiles | Invoice Status, Management Fee, Fixture Status | Confirm that Cancelled and Postponed exist as statuses |
| **Indications**, **Conversion Rate**, **Indications per Fixture** | Not on the Fixture List | Source is Inquiry |
| ~~TCE~~ | Out of scope (PO, 2026-11-03) | |

## 6. Open points

1. **Builder scope (decision pending):** all 11 reports are totals and charts, so a saved column-and-filter view alone cannot recreate any of them. Choices: tables and charts (donut at minimum), or tables only.
2. **Indications / Conversion Rate / Indications per Fixture / Exchange Rate:** the PO asked for all headers of reports 1 to 10, and these four (list items 17 to 20) are not Fixture List data. Drop them, or let a report also read Inquiry data and an exchange-rate source. UAT shows a flat 800 Indications every month, which may be test data.
3. ~~**TCE:**~~ resolved, removed from scope by the PO (2026-11-03).
4. **Currency:** define the EUR→USD conversion for *Total in USD* (rate source and date).
5. **Date basis:** fixed range versus a rolling period such as "current year".
6. **Visibility:** the old reports filter by Offices. Confirm a saved report should only include fixtures the viewer can already see.
7. **Starter reports:** whether to ship ready-made fixture reports users can copy, or start empty.
8. **Clean-up:** retire the Fixture Reports menu item and any role permissions that gate it; check for links or bookmarks to the 11 routes.

## 7. Defects and oddities seen on UAT (not part of the requirement)

- **Customer count gap:** Top Ten Customers and Customer total 103 fixtures; every other report totals 110. Probably fixtures with no Account are dropped (not confirmed).
- **Exchange Rate row (Fixture tab):** June shows 114 where other months show about 1,17, and the TOTAL is 12,45, which looks like a sum of monthly rates.
- **Header wording differs:** Top Ten uses FIXTURE and TOTAL; the other tables use COUNT and TOTAL IN USD. The Vessel report is titled "Vessels" but groups by Final Performer. The Offices column is labelled "UHL OFFICES".
- **Customer Satisfaction:** all three ratings show the same 26 Not Rated / 10 Will Book Again split, which looks like test data.

## 8. How PCER works today (reference pattern)

Checked 2026-11-03 on `coems.bctesting.admaren.org` (reports *Test PCER* id 324 and *testChart* id 185). Forms were opened and cancelled; nothing was saved.

| Part | What it does |
|---|---|
| **Create dialog** | Report Name\*, Date Range\*, Vessel Type, Vessel (multi-select chips), *Include TC Voyage port calls* checkbox, Port Stay Delay Metrics (Metric Name\*, From (Days)\*, To (Days)\*, Colour\*, + Add Metrics). **Create Report**. |
| **Report page** | Opens as a tab. Editable title (pencil), **Refresh**, gear (same dialog as *Edit Port Call Evaluation Report*, with Save), **Share**. Three sub-tabs: **Reports**, **Charts**, **Pivot Table**. |
| **Reports sub-tab** | The generated table, one row per port call, 18 columns: VESSEL, VOYAGE NUMBER, PORT/POSITION, ACTUAL TIME OF ARRIVAL (ATA), ACTUAL TIME OF SAILING (ATS), PLANNED PORT DAYS, ACTUAL PORT DAYS, COMMENTS, LAYDAYS, CANCELLING DAYS, LAYCAN DEVIATION, LAYCAN STATUS, DISCHARGE DATE, PORT STAY DEVIATION, PORT STAY DELAY STATUS, DELAY REASONS, RELATED SCOPE, RELATED PROJECT. Each header has an Excel-style value filter (search, Select All, Blanks, values, Clear / Apply). Column chooser icon, 25 rows per page. |
| **Charts sub-tab** | **+ Create New** offers *Bar Chart*, *Stacked Bar Chart*, *Pie Chart*. The Bar form has Chart Name\*, X Axis\*, Y Axis\*, Aggregation\* (default Count). The axis lists are the table's columns. (Neither report had a saved chart, so no rendered chart was seen; the Stacked Bar and Pie forms were not opened.) |
| **Pivot Table sub-tab** | List of saved pivots on the left, the selected pivot on the right, **+ Add New**. The form has Pivot Table Name\*, the table's columns as draggable fields, and four drop zones: **Rows, Columns, Filters, Values**. Values aggregation: text columns allow *Count* only; numeric columns allow *Count*, *Sum* (default), *Average*. A saved pivot renders with *Column Labels*, *Row Labels* and *Grand Total*, and has its own gear to edit. |

### What this means for the Fixture Report

- The PO's description (filters popup → generated table → charts and pivot built from it) is the PCER pattern with a different data source. The Reports / Charts / Pivot Table sub-tabs, Refresh, gear and Share can be reused.
- Charts and pivots only aggregate **columns of the generated table** (Count, Sum, Average). So the Fixture table needs numeric columns for **Gross Freight EUR**, **Gross Freight USD** and **Total in USD** (each fixture has one currency, so one of EUR/USD is 0), and a **Fixture Number** column to Count. It also needs **Booking Month / Quarter / Year** columns, since pivots have no date grouping.
- Gaps against the old reports: no *Top N + Others* (Top Ten Customers); PCER has *Stacked* bar, not *Grouped* bar (PO asked for grouped); the Bar form has one Y axis, so "EUR vs USD per customer" needs a series or group-by option.
- PCER's table is one row per port call; the Fixture table would be one row per fixture.

### Hands-on test (2026-11-03, with the user's go-ahead)

Created in *Test PCER* (id 324) on bctesting: three charts and one pivot, all named "Claude test - ...". Table used: 11 port calls of vessel TARBET SPIRIT.

| Item | Settings used | What it showed |
|---|---|---|
| **Bar Chart** | X = Port/Position, Y = Actual Port Days, Aggregation = Sum | One bar per port; calls to the same port are summed (Monrovia 12.5). Axis titles are the field names. No data labels. |
| **Stacked Bar Chart** | Same, plus **Stack By** = Voyage Number, Display In = Values (the other option is Percentage) | Legend of the stack values above the chart, one colour per value. |
| **Pie Chart** | Category (Slice By) = Port/Position, Value = Actual Port Days, Aggregation = Sum, **Year (Filter)** = 2026 | Legend at the side, no labels on the slices. Hover tooltip shows the aggregate and share, e.g. "Monrovia (sum): 12.5 (27.3%)". The Year filter is a multi-select listing only the years present in the data (here 2026). Only the Pie form has it. |
| **Pivot Table** | Rows = Port/Position, Columns = Voyage Number, Values = Actual Port Days (Sum) | Classic layout: *Row Labels*, *Column Labels*, an *Actual Port Days (Grand Total)* column and a *Grand Total* row. Row and column labels are sorted A to Z, empty cells show 0. **Add** stays disabled until at least one Value field is dropped ("At least one Value field is required"). |

Chart cards: title, gear (edit), trash (delete), a drag handle (tooltip "Drag chart") and a resize handle; newest first, up to three per row. No Top N, no sort and no data labels on any chart form.

Implications for the Fixture Report:
- The Pie form (Category + Value + Aggregation) reproduces the old donuts, for example slice by Customer, Sum of Total in USD.
- "EUR vs USD" cannot be two measures in one chart. Use a Stacked Bar with **Stack By = Currency** and Y = Total in USD, which shows the USD-equivalent split by original currency. So the Fixture table needs both a *Currency* column and a *Total in USD* column.
- Labels sort as text, so a month column must be written as `2026-01`, not `Jan-2026`, or months will sort A to Z.
- A pivot with several Values (Count of Fixture Number, Sum EUR, Sum USD, Sum Total in USD) would reproduce the old tables, including the Totals row.
