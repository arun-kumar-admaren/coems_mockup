# New Fixture Report: field lists (v2, after the PO review)

**Written:** 2026-11-04. **Supersedes:** `fixture-report-pcer-field-lists.md` (2026-11-03).
**Basis:** the PO's changes of 2026-11-04, the real Fixture List **Export All** file from bctesting (`fixture-export-columns.md`, `fixture-export-columns.html`), and the Port Call Evaluation Report (PCER) as it behaves on bctesting.
**Sample:** `fixture-report-sample-v2.html` shows everything below with real bctesting data.

## 1. What it is

A new report type, **Fixture Report**, in Reports → Create, built like the PCER:

1. The user fills a popup.
2. A table is generated: every column of the Fixture List **Export All**, limited by the date range, plus a few added columns.
3. The user builds their own **Bar**, **Stacked Bar**, **Pie** and **Pivot Table** from that table, exactly as they do in the PCER today.

There are **no ready-made reports**, no Grouped Bar, and no Top N / Sort / Others. The old Fixture Reports menu (All Reports → Fixture Reports) is removed.

## 2. Popup: "Add New Fixture Report"

| # | Field | Type | Values / default | Notes |
|---|---|---|---|---|
| 1 | Report Name\* | Text | | |
| 2 | Based on\* | Dropdown | **Booking Date** (default), **Created Date**, **Laycan Start** | Decides which date the Date Range applies to: `BOOKING DATE`, the date part of `CREATED ON`, or `LAYCAN START`. A fixture with no value in that date is left out (in practice only for laycan). |
| 3 | Date Range\* | From and to | No default | The only period field. Both dates are included. |
| 4 | Offices | Multi-select | All selected | Filters on `FIXED BY`. **To confirm: the PO did not say whether this stays.** |
| 5 | Convert to (currency)\* | Dropdown | US Dollar (default); every currency in the system | The currency of the two converted columns |
| 6 | Conversion Date\* | Date | Today | Date of the exchange rate (same idea as the Budget report) |
| 7 | Include Cancelled and Postponed fixtures | Checkbox | Off | When off, fixtures with FIXTURE STATUS Cancelled or Postponed are left out |

Buttons: Cancel, Create Report. The gear on the report reopens the same fields as "Edit Fixture Report".

**Removed from the earlier design:** the Period (year) field, the Customer Type field, and the year multi-select.

## 3. The generated table

One row per fixture. Same Show/Hide and Reorder column chooser as the Fixture List and the PCER (87 columns). **Column widths can be resized** as on the other COEMS listing pages: a grip at the right edge of each header is dragged to widen or narrow that column (minimum width applies; long text is cut off with "…" until widened; the new width applies to the header and every cell; other columns keep their width and the table scrolls sideways to fit). Widths are saved automatically per user and kept when a column is hidden and shown again; there is no "reset widths" control (same as the listing pages' story, `docs/user-stories/engineering/column-resize-engineering.md`).

### 3a. Columns from the export (81)

All 81 real columns of the Export All, in the export's order (`fixture-export-columns.md` has the full list). The blank index column the export starts with is **left out**. The table must also fix how some columns are stored, because charts and pivots need real dates and real numbers:

| Fix | Columns |
|---|---|
| Text to **date** (`dd/mm/yyyy`) | `BOOKING DATE`, `DELIVERY DATE`, `REDELIVERY DATE` |
| Text to **date-time** | `CREATED ON`, `MODIFIED ON`, `VOYAGE START DATE` |
| Text to **number** | `FREIGHT RATE`, `BUY IN FREIGHT RATE`, `BUY IN GROSS FREIGHT RATE`, `BALANCE`, `PROGRESS` (`'56 %'` becomes 56) |
| Yes/No columns | `SEND TO OPERATIONS`, `IS ASSIGNED TO VOYAGE`, `BC SYNC FAILED` shown as Yes / No so they can be grouped |

Names that differ from the Fixture List: `FIXED BY` is Assigned Office, `CARGO TYPE` is Cargo Category.

### 3b. Added columns (6)

| Column | Type | Definition |
|---|---|---|
| `LAYCAN START` | Date | Start date of the fixture's **first laycan** (Laycan 1 on the Fixture List). Not in the export. Empty when the fixture has no laycan. |
| `LAYCAN END` | Date | End date of the first laycan |
| `CONVERTED GROSS FREIGHT` | Number | `GROSS FREIGHT` converted from the row's `CURRENCY` into the **Convert to** currency, at the rate on the Conversion Date. Same currency means rate 1. |
| `CONVERTED MANAGEMENT FEE` | Number | `MANAGEMENT FEE` converted the same way |
| `REPORT MONTH` | Text, `yyyy-mm` | Month of the Based on date. Needed because pivots and charts cannot group a date by month. |
| `REPORT YEAR` | Text, `yyyy` | Year of the Based on date |

`REPORT MONTH` and `REPORT YEAR` are **my proposal, not yet seen by the PO**. Without them a user cannot build a monthly or yearly chart.

`CURRENCY`, `GROSS FREIGHT` and `MANAGEMENT FEE` stay exactly as in the export. Never sum `GROSS FREIGHT` across currencies; use the converted columns.

## 4. Charts and pivot (unchanged from the PCER)

Every field list below is the PCER's. All of them work on the table columns above. Count works on any column; Sum and Average work only on number columns.

| Form | Fields |
|---|---|
| **Bar Chart** | Chart Name\*, X Axis\*, Y Axis\*, Aggregation\* (Count / Sum / Average) |
| **Stacked Bar Chart** | Chart Name\*, X Axis\*, Y Axis\*, Aggregation\*, Stack By\*, Display In (Values / Percentage) |
| **Pie Chart** | Chart Name\*, Category (Slice By)\*, Value\*, Aggregation\* (the PCER pie also has an optional Year filter) |
| **Pivot Table** | Pivot Table Name\*, then drag columns into **Rows**, **Columns**, **Filters** and **Values** (each value has Count / Sum / Average) |

**Not included (dropped by the PO):** Grouped Bar Chart; Top N, Sort and "Others"; ready-made or template reports.

## 5. Rules in one place

- **Date Range:** keeps a fixture when its Based on date is on or between the two dates.
- **Conversion:** `converted = amount × rate(row currency → Convert to) on the Conversion Date`. If the currency is the same, the rate is 1.
- **Laycan Start:** only for Based on = Laycan Start. Fixtures with no laycan are left out. No fallback to Voyage Date.
- **Checkbox:** off means Cancelled and Postponed fixtures are not in the table, so charts and pivots never count them. On means they are in.
- **Blank values:** show as "(Blank)" in charts and pivots.

## 6. Open points for the PO

| # | Point | Notes |
|---|---|---|
| 1 | **Exchange rates** | Where the rate comes from, and what happens when a rate is missing (blank and a warning?). The old reports did not use one fixed rate: the bctesting Yearly Overview for 2022 implies exactly 1.06, while 2026 on UAT was about 1.17. |
| 2 | **Names of the converted columns** | `CONVERTED GROSS FREIGHT` and `CONVERTED MANAGEMENT FEE`. The PO said "converted amount" in the singular. |
| 3 | **REPORT MONTH / REPORT YEAR** | Approve adding them. |
| 4 | **Laycan rule** | First laycan entered (Laycan 1) versus earliest start. Agreed: no Voyage Date fallback, fixtures without a laycan left out. In the sample, 57 of the 1,354 fixtures booked up to 2025 have no laycan in the port text (the Fixture List's own laycan field may be more complete). |
| 5 | **Cancelled and Postponed** | The old reports appeared to leave out Cancelled fixtures but count Postponed ones (seen when comparing 2021 on bctesting). Should the checkbox be "Include Cancelled" only? |
| 6 | **Offices** | Does the Offices filter stay? |
| 7 | **Charts with many categories** | With Top N dropped, a pie or stack on a column with about 200 values (such as ACCOUNT) is unreadable. The sample shows the biggest 5 and groups the rest as Others; the PCER does not do this today. Decide the behaviour. |
| 8 | **Size** | The export is 1,926 fixtures × 82 columns (667 KB). A wide date range in production could be much larger. Define paging and any limit. |
| 9 | **PORT OF LOADING / PORT OF DISCHARGE** | One text with several ports and, for loading, laycan dates in brackets. Not usable for grouping as it is. |
| 10 | **Rounded amounts** | `GROSS FREIGHT` and `MANAGEMENT FEE` are whole numbers in the export. Confirm that is acceptable. |
| 11 | **Per-column filters** | The PCER table has them; the sample does not show them. |

## 7. In the mockup app (Version 2.0)

The COEMS mockup app now has this design. Switch the sidebar version to **v2.0**: the "Fixture Reports" item is replaced by **Reports**, which opens the reports list with **Create → New Fixture Report**. The popup, the 87-column table with a column chooser, the Charts tab (Bar, Stacked Bar, Pie) and the Pivot Table tab all work on 436 real bctesting fixtures booked in 2021 and 2022. A seeded "Fixture report 2022" shows example charts and pivots; a newly created report starts empty, as in the PCER. Version 1.0 is unchanged. Code: `src/app/components/reports.tsx`, `fixture-report*.tsx` and `fixture-report-data.ts`, data in `src/app/data/fixture-export-sample.json`.

## 8. What the standalone sample shows

`fixture-report-sample-v2.html` uses 1,354 real fixtures booked up to 2025 (2026 on bctesting is mostly test data and is left out). It has the popup, the 87-column table with a column chooser, four example charts and four example pivots, and forms to create more. Laycan Start and End there are read from the brackets in `PORT OF LOADING` (found for 96% of those fixtures), because the export has no laycan column. Exchange rates in the sample are made-up values (1 Euro = 1.17 US Dollar).
