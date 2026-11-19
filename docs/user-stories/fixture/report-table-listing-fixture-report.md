#### **Fixture Report - Report Table Listing**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I want** the system to generate a **Fixture Report** with a predefined set of columns after clicking **Create Report**
**So that** I can consistently analyse fixtures, freight and bookings across customers, offices, vessels, cargo types and periods, in one currency.

> Follows **PCER - Report Table Listing (COEMS-13099)**. The fields that decide which fixtures and columns the table has are in **Fixture Report - Create New Fixture Report**; this story defines the table itself. The columns are those of the Fixture List **Export All** (checked against the real export on bctesting, 2026-11-04), plus four added columns.

---

#### **acceptance criteria:**

1. **Report Generation**

   * When the user clicks **Create Report**, the system should generate a **Fixture Report** based on the defined criteria (the fields of the pop-up).
   * **Three tabs** named **"Reports"**, **"Charts"** and **"Pivot Table"** should be displayed in the main window.
   * The report should be displayed under the **"Reports" tab**. By default, the user should be navigated to the **Reports** tab.

2. **Rows**

   * The table must have **one row per fixture**, and each fixture must appear **once**.
   * A fixture must be a row when its **Based on** date (Booking Date, Created Date or Laycan Start) is **on or between the two dates of the Date Range**. This is for **every office and every fixture status**, including Cancelled and Postponed.
   * When **Based on = Laycan Start**, a fixture with no laycan is not a row. The Reports tab must state **how many fixtures were left out** for that reason.

3. **Columns (derived from the Fixture export)**

   * The columns of the report must be **derived from the Fixture export**: the file the user gets from **Export All** on the Fixtures listing page (more options menu → **Export All**).
   * The report must use the export's **column titles**, in the **export's order**, and show the **same value as the export** for the same fixture.
   * The report **adds four columns** that are not in the export (marked "new" below) and **leaves out three** export columns (see AC 6).
   * If a column of the export is later added, renamed or removed, the report must follow the export (see To be confirmed).

   The report should contain the following columns, **in the given order**, limited to the columns chosen in **Select required columns** (all columns by default). Where no rule is given, the value is the same as in the Fixture List **Export All**.

   | **#** | **Column Title** | **Type** | **Value / Rule** |
   | --- | --- | --- | --- |
   | 1 | ID | Number | Internal fixture ID |
   | 2 | NUMBER | Text | Fixture number |
   | 3 | CARGO NAME | Text | |
   | 4 | CARGO DESCRIPTION | Text | |
   | 5 | INTENDED VESSEL TYPE | Text | |
   | 6 | INTENDED VESSEL | Text | |
   | 7 | FINAL PERFORMER | Text | |
   | 8 | CARGO TYPE | Text | Called **Cargo Category** on the Fixture List |
   | 9 | UNIT NUMBER | Number | |
   | 10 | TOTAL VOLUME | Number | |
   | 11 | TOTAL WEIGHT | Number | |
   | 12 | FREIGHT RATE | Number | |
   | 13 | FREIGHT CALC TYPE | Text | |
   | 14 | CURRENCY | Text | The fixture's own currency (any currency of the system) |
   | 15 | GROSS FREIGHT | Number | In the row's **CURRENCY**, not converted |
   | 16 | FREIGHT COMMENTS | Text | |
   | 17 | BUY IN | Text | |
   | 18 | BUY IN FREIGHT CALC TYPE | Text | |
   | 19 | BUY IN FREIGHT RATE | Number | |
   | 20 | BUY IN GROSS FREIGHT RATE | Number | |
   | 21 | BALANCE | Number | |
   | 22 | BUY IN COMMENTS | Text | |
   | 23 | FIXTURE STATUS | Text | All statuses, including Cancelled and Postponed |
   | 24 | BOOKING DATE | Date | |
   | 25 | PROJECT NAME | Text | |
   | 26 | FIXTURE TYPE | Text | |
   | 27 | FIXED BY | Text | Called **Assigned Office** on the Fixture List |
   | 28 | PERSON IN CHARGE | Text | |
   | 29 | BAF | Text | |
   | 30 | BAF COMMENTS | Text | |
   | 31 | CHARTERING TERMS | Text | |
   | 32 | RELATED PROJECT | Text | |
   | 33 | HEAD ACCOUNT | Text | |
   | 34 | ACCOUNT | Text | |
   | 35 | SHIPPER | Text | |
   | 36 | BROKER | Text | |
   | 37 | BROKER COMMISSION | Number | |
   | 38 | MANAGEMENT FEE PERCENTAGE | Number | |
   | 39 | CHARTER PARTY SIGNED | Text | |
   | 40 | HARD COPY | Text | |
   | 41 | PDF | Text | |
   | 42 | MARKETING | Text | |
   | 43 | DELIVERY DATE | Date | |
   | 44 | REDELIVERY DATE | Date | |
   | 45 | TIME CHARTER RATE | Text | |
   | 46 | DEMURRAGE DURATION | Text | |
   | 47 | DEMURRAGE PDPR | Text | |
   | 48 | GROSS DEMURRAGE | Number | |
   | 49 | TRANSIT TIME | Text | |
   | 50 | VOYAGE NUMBER | Text | |
   | 51 | AGREEMENT TYPE | Text | |
   | 52 | CHARTERING RATING | Text | |
   | 53 | ENGINEERING RATING | Text | |
   | 54 | OPERATIONS RATING | Text | |
   | 55 | HSE ACTION RATING | Text | |
   | 56 | HSE COMMENTS | Text | |
   | 57 | PROGRESS | Number | A value such as "56 %" is held as the number 56 |
   | 58 | INVOICE STATUS | Text | As in the export (TO BE ISSUED, INVOICED, PAID, OVERDUE) |
   | 59 | MANAGEMENT FEE | Number | In the row's **CURRENCY**, not converted |
   | 60 | CREATED BY | Text | |
   | 61 | CREATED ON | Date and time | |
   | 62 | MODIFIED BY | Text | |
   | 63 | MODIFIED ON | Date and time | |
   | 64 | SEND TO OPERATIONS | Yes / No | |
   | 65 | RELATED ENG REQUESTS | Text | |
   | 66 | IS ASSIGNED TO VOYAGE | Yes / No | |
   | 67 | VOYAGE ID | Number | |
   | 68 | VOYAGE NAME | Text | |
   | 69 | BC SYNC FAILED | Yes / No | |
   | 70 | RELATED CARGO ID | Number | |
   | 71 | VERSION | Number | |
   | 72 | ENQUIRY NUMBER | Text | |
   | 73 | VOYAGE START DATE | Date and time | |
   | 74 | ORIGINAL FIXTURE ID | Number | |
   | 75 | HANDOVER OPERATIONS | Number | |
   | 76 | HANDOVER INCON | Number | |
   | 77 | OPM TECHNICAL DOCS REQUIRED | Number | |
   | 78 | ADDITIONAL INCOME EXPENSE | Text | List of IDs, for example [4582] |
   | 79 | **LAYCAN START** (new) | Date | Start date of the fixture's **first laycan** (Laycan 1 on the Fixture List). Blank when the fixture has no laycan. |
   | 80 | **LAYCAN END** (new) | Date | End date of the first laycan |
   | 81 | **CONVERTED GROSS FREIGHT** (new) | Number | **GROSS FREIGHT** converted into the report's **Convert to** currency (see AC 5) |
   | 82 | **CONVERTED MANAGEMENT FEE** (new) | Number | **MANAGEMENT FEE** converted the same way |

   The four added columns must be marked **"new"** in the column list and have a highlighted header.

4. **Real dates, numbers and Yes / No**

   So that the columns can be grouped by month or year in charts and pivot tables, and summed or averaged, the columns above typed Date, Date and time, Number and Yes / No must hold **real dates, numbers and Yes / No values**, not text. (In the Export All file some of them are text, for example BOOKING DATE, CREATED ON, FREIGHT RATE and PROGRESS.)

   * **Date** columns are shown as **dd/mm/yyyy**; **Date and time** columns also show the time.
   * **Number** columns are right-aligned and shown with thousands separators.
   * **Yes / No** columns are shown as **Yes** or **No**.
   * **Empty or unavailable data** must be shown as **blank**.

5. **Converted amounts**

   * The report has no conversion date of its own. Every fixture already has its own conversion currency and conversion date, so **CONVERTED GROSS FREIGHT** and **CONVERTED MANAGEMENT FEE** must show the fixture's amount in the **Convert to** currency at the rate of **that fixture's own conversion date**. Two fixtures in one report can therefore use different rates.
   * An amount already in the **Convert to** currency must be shown unchanged.
   * A fixture with no usable rate or date must show a **blank** in the two converted columns, with no warning.
   * **GROSS FREIGHT**, **MANAGEMENT FEE** and **CURRENCY** stay exactly as in the export. Amounts in different currencies must not be added together: the converted columns are the ones to total.

6. **Columns left out for now**

   These columns hold **several comma separated values** in one cell, which is of no use in charts, graphs or pivot tables, so they must **not** be in the table:

   | **Column** | **Why** |
   | --- | --- |
   | PORT OF LOADING | Several ports, with laycan dates in brackets |
   | PORT OF DISCHARGE | Several ports |
   | COMMISSIONS | Several parties with amounts |

   * Other text columns that contain commas only as part of one value (company names such as "Ormat Pacific, Inc.", comments, cargo descriptions) stay.
   * The Reports tab must say which columns are left out and why.
   * The blank row-number column that the Export All starts with must not be in the table.

7. **Show / Hide & Reorder columns**

   * The Reports tab must have a **Show/Hide & Reorder** configuration option in the top right corner of the table, so that the user can hide, show and reorder columns in the table view. Its behaviour is in **Fixture Report - Report Table - Show Hide / Reorder**.
   * A hidden or moved column is only changed in the table: it is still part of the report, and charts and pivot tables can still use it.

8. **Column widths can be resized**

   Column resizing must work as on the COEMS listing pages:

   * The header of each column must show a **drag-and-expand icon** at its right edge. Dragging it widens or narrows that column.
   * A column cannot be narrowed below a minimum width. Long text is cut off with "…" until the column is widened, and the full value is shown when the user hovers over the cell.
   * The new width applies to the header and to every cell of the column. Other columns keep their width, and the table scrolls sideways to fit.
   * The width is **saved automatically per user** and restored when the user comes back. A column that is hidden and shown again keeps its width.
   * There is no control to reset the widths.

9. **Table height and paging**

   * The table must use the free height of the screen below the report header, with the **header row fixed** and a vertical scroll for the rows.
   * The table must be paged: **25 rows per page**, with the text of the rows shown and the total (for example **"1 – 25 of 436"**), and **Previous** and **Next** buttons. **Previous** is disabled on the first page and **Next** on the last.

10. **No fixtures**

    If no fixture is in the Date Range, the Reports tab must show the message **"No fixtures match these fields."** instead of a table.

11. **Refresh**

    * A **Refresh** icon / button must be available in the **report view header section** of each generated report.
    * A tooltip must be displayed with the exact text: **"Refresh."**
    * The system must refresh the report using the **latest available data**, with the report's saved fields.
    * A **loading indicator** (progress indicator) must be shown while the report is refreshing.
    * Refreshing must not change the report's fields, charts, pivot tables, hidden columns or column widths, and must not change Modified By or Modified On.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report page → **Reports** tab | Table with one row per fixture and the columns of AC 3, **derived from the Fixture export (Export All)** |
| Added columns | LAYCAN START, LAYCAN END, CONVERTED GROSS FREIGHT, CONVERTED MANAGEMENT FEE |
| Table view | Show/Hide & Reorder option, resizable columns, paging, empty message |
| Report header | **Refresh** icon / button |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type. The table is built from the current Fixture List data, so Created On, Modified On and amounts show what the Fixture List holds when the report is generated or refreshed.

---

#### **Out of Scope:**

* The pop-up fields and creating the report (**Create New Fixture Report**) and editing it (**Edit & Update Report**).
* The **Charts** and **Pivot Table** tabs, including grouping dates by month or year.
* **Exporting** the report table to Excel (the Fixture List's Export All stays as it is).
* Per-column value filters (see **Fixture Report - Table Filters**) and sorting the table by a column (see To be confirmed).
* Port-level data (one row per port): the port columns are left out for now.
* Editing fixture data from the report.

---

#### **To be confirmed:**

* **Names of the converted columns.** Proposed: **CONVERTED GROSS FREIGHT** and **CONVERTED MANAGEMENT FEE**. The Product Owner spoke of "converted amount" in the singular.
* **Which laycan.** Proposed: the first laycan entered (Laycan 1), not the earliest. Fixtures with no laycan are left out, with no fallback to the Voyage Date.
* **Order of the rows.** Proposed default: by the **Based on** date, latest first.
* **Port and commission columns.** Left out "for now". A later option is one row per port, or a separate port table, so ports can be charted.
* **Size and paging.** The Export All file has about 1,900 fixtures by 82 columns; a wide date range with all offices and statuses can be much larger. Define server-side paging, items per page and any row limit or warning.
* **Rounded amounts.** GROSS FREIGHT and MANAGEMENT FEE are whole numbers in the export. Confirm that this is acceptable.
* **Sorting.** Sorting the table by a column is not part of this story. Confirm whether it is needed. (Column filters are in **Fixture Report - Table Filters**.)
* **Columns added to, renamed in or removed from the Fixture export later.** Proposed default: the report follows the export. A new column joins the Select required columns list for new reports; existing reports keep their own selection. A removed column drops out of the list and out of the reports that use it.
* **When the table is generated.** Proposed default: when the report is created, when an edit is saved, and on Refresh, as in the PCER.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (generation time for large date ranges).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
