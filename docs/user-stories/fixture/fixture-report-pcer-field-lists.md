# New Fixture Report (PCER pattern): field lists and how each of the 10 reports is rebuilt

> **Superseded on 2026-11-04** by `fixture-report-field-lists-v2.md`, after the PO review. The PO dropped the Period field, the Grouped Bar, Top N and the replication of the 10 old reports, and asked for the table to be the Fixture List Export All plus converted amounts. Kept here only for history.

**Written:** 2026-11-03. **Basis:** the 10 Fixture Reports on UAT (TCE removed by the PO), the Fixture List, and PCER as it behaves on `coems.bctesting.admaren.org`. See `fixture-reports-uat-column-inventory.md` for the source observations.

## 1. Verdict

Yes. With a PCER-style **Fixture Report** (popup → generated table → Charts / Pivot Table), all 10 reports can be rebuilt except **three rows of report 1** (Indications, Conversion Rate (%), Indications per Fixture), which are not Fixture List data.

Two additions to PCER's chart and pivot forms are needed to avoid gaps, plus one change to the popup:

1. **Top N + Others + Sort** on Pie, Bar, Stacked Bar and Pivot (needed for *Top Ten Customers*).
2. **Grouped Bar Chart** as a new chart type (needed for the *Fixture Amount* chart; the PO also asked for it).
3. **Year as multi-select** in the popup (needed for *Yearly Overview* to show several years).

| # | Report | Can be rebuilt? | Needs |
|---|---|---|---|
| 1 | Fixture | Yes, except Indications, Conversion Rate (%), Indications per Fixture | Grouped Bar for the amount chart; popup Conversion Date; Include Cancelled/Postponed checkbox |
| 2 | Top Ten Customers | Yes | Top N + Others + Sort |
| 3 | Customer | Yes | Nothing new |
| 4 | Person In Charge | Yes | Nothing new |
| 5 | Offices | Yes | Nothing new |
| 6 | Vessel | Yes | Nothing new |
| 7 | Vessel Type | Yes | Nothing new |
| 8 | Cargo Type | Yes | Nothing new |
| 9 | Yearly Overview | Yes | Year multi-select |
| 10 | Customer Satisfaction | Yes (three small pivots instead of one table) | Rule for which fixtures are counted |

## 2. Popup: "Add New Fixture Report"

Same pattern as PCER's *Add New Port Call Evaluation Report*. The gear on the report page reopens it as *Edit Fixture Report*.

| # | Field | Type | Values / default | Why |
|---|---|---|---|---|
| 1 | Report Name\* | Text | | Needed for the Reports list (PCER and Budget have it) |
| 2 | Based on\* | Dropdown | Booking Date (default), LAY-CAN / Voyage Date | Same as the old filter |
| 3 | Period\* | Year multi-select (All, 2015 … current year) **or** Select Date Range | Current year | Same as the old Year filter; multi-select lets Yearly Overview show several years |
| 4 | Offices\* | Multi-select | All 22 offices selected | Same as the old filter |
| 5 | Currency\* | Read-only | US Dollar | Report currency, as in the Budget report |
| 6 | Conversion Date\* | Date | Today | Date of the EUR → USD rate used for *Total in USD* |
| 7 | Include Cancelled and Postponed fixtures | Checkbox | Off (to confirm) | Needed for the Cancelled / Postponed tiles of report 1 |

Buttons: **Cancel**, **Create Report**.

*Customer Type* is not a popup field: Account, Head Account and Shipper are all columns of the table, and the chart or pivot picks one.

## 3. Generated table ("Reports" sub-tab)

One row per fixture. Text columns allow Count only in pivots; numeric columns allow Count, Sum, Average.

| # | Column | Type | Source on the Fixture List | Used by report |
|---|---|---|---|---|
| 1 | Fixture Number | Text | Number | All (Count) |
| 2 | Fixture Status | Text | Fixture Status (Cancelled, Delayed, Discharged, Loaded, Not Loaded, Postponed) | 1 |
| 3 | Invoice Status | Text | Invoice Status (Invoiced, Overdue, Paid, To Be Issued) | 1 |
| 4 | Booking Date | Date | Booking Date | Basis for all |
| 5 | Laycan Start | Date | Laycan (first laycan start; to confirm) | Basis for all |
| 6 | Report Date | Date | Booking Date or Laycan Start, per *Based on* | Basis for all |
| 7 | Report Year | Text `yyyy` | Derived from Report Date | 9 |
| 8 | Report Month | Text `yyyy-mm` | Derived from Report Date | 1 |
| 9 | Account | Text | Account | 2, 3 |
| 10 | Head Account | Text | Head Account | 2, 3 |
| 11 | Shipper | Text | Shipper | 2, 3 |
| 12 | Person In Charge | Text | Person In Charge | 4 |
| 13 | Assigned Office | Text | Assigned Office | 5 |
| 14 | Final Performer | Text | Final Performer | 6 |
| 15 | Vessel Type | Text | Intended Vessel Type (to confirm) | 7 |
| 16 | Cargo Category | Text | Cargo Category (called *Cargo Type* in the old report) | 8 |
| 17 | Chartering Rating | Text | Chartering Rating | 10 |
| 18 | Operations Rating | Text | Operations Rating | 10 |
| 19 | Engineering Rating | Text | Engineering Rating | 10 |
| 20 | Currency | Text | Currency (US Dollar / Euro) | 1, 9 |
| 21 | Gross Freight | Number | Gross Freight, original currency | 1 |
| 22 | Gross Freight EUR | Number | Gross Freight if Currency = Euro, else 0 | 1 to 9 |
| 23 | Gross Freight USD | Number | Gross Freight if Currency = US Dollar, else 0 | 1 to 9 |
| 24 | Exchange Rate | Number | EUR → USD rate on the Conversion Date | 1 |
| 25 | Total in USD | Number | Gross Freight USD + Gross Freight EUR × Exchange Rate | 1 to 9 |
| 26 | Management Fee EUR | Number | Management Fee if Currency = Euro, else 0 | 1 |
| 27 | Management Fee USD | Number | Management Fee if Currency = US Dollar, else 0 | 1 |

Notes: `yyyy-mm` is needed because pivot labels sort as text, so month names such as `Jan-2026` would sort A to Z (Apr, Aug, Dec ...) instead of in calendar order. Blank values (for example a fixture with no Account) should show as **(Unassigned)** so totals match the Fixture List. The old customer reports dropped them (103 vs 110 fixtures).

## 4. Field lists of the four forms (and the one new chart type)

Items marked **NEW** are additions to what PCER has today.

### Bar Chart
| Field | Notes |
|---|---|
| Chart Name\* | |
| X Axis\* | Any table column |
| Y Axis\* | Any table column |
| Aggregation\* | Count / Sum / Average |
| **NEW** Sort By, Order | X label or Y value; ascending or descending |
| **NEW** Top N, "Show the rest as Others" | Number; checkbox |

### Stacked Bar Chart
| Field | Notes |
|---|---|
| Chart Name\* | |
| X Axis\* | |
| Y Axis\* | |
| Aggregation\* | Count / Sum / Average |
| Stack By\* | Any table column |
| Display In | Values / Percentage |
| **NEW** Sort By, Order, Top N, Others | As for Bar |

### Pie Chart
| Field | Notes |
|---|---|
| Chart Name\* | |
| Category (Slice By)\* | Any table column |
| Value\* | Any table column |
| Aggregation\* | Count / Sum / Average |
| Year (Filter) | Multi-select of the years in the data |
| **NEW** Sort By, Order, Top N, "Show the rest as Others" | Needed for Top Ten Customers |
| **NEW (optional)** Show % on slices | The old donuts showed % on the slices; today the pie shows it only on hover |

### Pivot Table
| Field | Notes |
|---|---|
| Pivot Table Name\* | |
| Rows | Drag one or more table columns |
| Columns | Drag a table column |
| Filters | Drag a table column |
| Values\* | One or more columns, each with Count / Sum / Average (text columns: Count only) |
| **NEW** Sort rows by, Order | Row label or one of the values |
| **NEW** Top N rows, "Show the rest as Others" | Needed for Top Ten Customers |

### Grouped Bar Chart (NEW type, as the PO asked)
| Field | Notes |
|---|---|
| Chart Name\* | |
| X Axis\* | Any table column |
| Y Axis\* | **One or more** numeric columns, shown side by side |
| Aggregation\* | Count / Sum / Average |
| Group By | Optional; use instead of several Y columns to split bars by a column |
| **NEW** Sort By, Order, Top N, Others | As for Bar |

## 5. How each report is rebuilt

| # | Old element | Item | Settings |
|---|---|---|---|
| 1 | Monthly table: FIXTURE, EUR, USD, TOTAL IN USD, TOTAL | Pivot | Rows = Report Month. Values = Count of Fixture Number, Sum of Gross Freight EUR, Sum of Gross Freight USD, Sum of Total in USD. The Grand Total row replaces the old TOTAL column. Months run down instead of across; to keep months across, use Rows = Currency, Columns = Report Month, Values = Sum of Total in USD. |
| 1 | EXCHANGE RATE row | Pivot | Add Values = Average of Exchange Rate to the pivot above |
| 1 | INDICATIONS, CONVERSION RATE (%), INDICATIONS PER FIXTURE | **Not possible** | Not Fixture List data (Inquiry). Drop, or add Inquiry data later. |
| 1 | Tiles Cancelled / Postponed (count, gross freight EUR and USD) | Pivot | Popup checkbox on. Rows = Fixture Status. Values = Count of Fixture Number, Sum of Gross Freight EUR, Sum of Gross Freight USD. |
| 1 | Tiles To Be Issued / Invoiced / Paid (management fee EUR and USD) | Pivot | Rows = Invoice Status. Values = Sum of Management Fee EUR, Sum of Management Fee USD. (Also shows Overdue.) |
| 1 | Chart *Fixture Numbers* | Bar | X = Report Month. Y = Fixture Number. Count. |
| 1 | Chart *Fixture Amount* (EUR, USD, Total USD) | Grouped Bar | X = Report Month. Y = Gross Freight EUR, Gross Freight USD, Total in USD. Sum. (Without Grouped Bar, a Stacked Bar with Y = Total in USD and Stack By = Currency is close but shows EUR converted.) |
| 2 | Table: CUSTOMER, FIXTURE, EUR, USD, TOTAL + Others + Totals | Pivot | Rows = Account (or Head Account / Shipper). Values = Count of Fixture Number, Sum of Gross Freight EUR, Sum of Gross Freight USD, Sum of Total in USD. Sort by Total in USD descending, Top N = 10, Others on. |
| 2 | Donut | Pie | Category = Account. Value = Total in USD. Sum. Top N = 10, Others on. |
| 3 | Table: CUSTOMER, COUNT, EUR, USD, TOTAL IN USD | Pivot | Rows = Account (or Head Account / Shipper). Same four Values as report 2. |
| 3 | Four donuts (Total USD, Fixture, EUR, USD) | 4 × Pie | Category = Account. Values: Total in USD (Sum), Fixture Number (Count), Gross Freight EUR (Sum), Gross Freight USD (Sum). |
| 4 | Table + four donuts | Pivot + 4 × Pie | As report 3 with Person In Charge |
| 5 | Table + four donuts | Pivot + 4 × Pie | As report 3 with Assigned Office |
| 6 | Table + four donuts | Pivot + 4 × Pie | As report 3 with Final Performer |
| 7 | Table + four donuts | Pivot + 4 × Pie | As report 3 with Vessel Type |
| 8 | Table + four donuts | Pivot + 4 × Pie | As report 3 with Cargo Category |
| 9 | Table: Count, USD, EUR, Total In USD per year | Pivot | Rows = Report Year. Values = Count of Fixture Number, Sum of Gross Freight USD, Sum of Gross Freight EUR, Sum of Total in USD. Popup Period = the years wanted. |
| 9 | Donut USD vs EUR | Pie | Category = Currency. Value = Total in USD. Sum. (The old donut showed 86.8% / 13.2% on one day and 85% / 15% on another; confirm whether it is native or converted amounts.) |
| 10 | Three donuts (Chartering, Operations, Engineering) | 3 × Pie | Category = Chartering Rating / Operations Rating / Engineering Rating. Value = Fixture Number. Count. |
| 10 | Table: RATINGS × NOT RATED / WILL BOOK AGAIN / TOTAL | 3 × Pivot | One pivot per rating: Rows = the rating column. Values = Count of Fixture Number. Three small tables instead of one. |

## 6. Remaining gaps and decisions

| # | Item | Status |
|---|---|---|
| 1 | Indications, Conversion Rate (%), Indications per Fixture | **Cannot be rebuilt** from the Fixture List. Drop, or add Inquiry data. UAT shows a flat 800 Indications every month, so it may be placeholder data. |
| 2 | Top N + Others + Sort | New on Pie, Bar, Stacked Bar, Pivot |
| 3 | Grouped Bar Chart | New chart type |
| 4 | Year multi-select | Popup change |
| 5 | Exchange rate basis | Decide: one rate on the Conversion Date, or the rate on each fixture's booking date (the old report shows a different rate per month) |
| 6 | Include Cancelled / Postponed default | Decide. UAT shows Cancelled (0 nos) and Postponed (0 nos) tiles, so the main figures probably exclude them. |
| 7 | Customer Satisfaction population | The old report counts 36 fixtures against 110 in the other reports. The rule is unknown ("Discharged" does not explain it: 1,331 of 1,463 fixtures are Discharged). |
| 8 | "LAY-CAN / Voyage Date" | Define the date used when a fixture has several laycans (the list has Laycan 1 to 5) |
| 9 | Currencies other than EUR and USD | **They exist.** On bctesting, 9 fixtures booked in 2026 use Icelandic Krona (5), Singapore Dollar (2), Bulgarian Lev (1) or Norwegian Krone (1). Years 2020 to 2025 are EUR and USD only. The EUR and USD columns would not cover these; add a rule (for example a rate per currency) or an "Other currencies" column. |
| 10 | Which freight field | The tiles say "Gross Freight"; confirm the old reports use Gross Freight and not another freight field |
| 11 | Layout differences (not data) | Monthly table has months down; Customer Satisfaction is three small tables; pie shows % on hover unless the optional label is added |
