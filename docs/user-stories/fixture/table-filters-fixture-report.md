#### **Fixture Report - Table Filters**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I should be able to** apply filters on each column in the generated Fixture Report table
**So that** I can easily analyse and narrow down the report data, similar to Excel filtering behaviour.

> Follows **PCER - Report Table - Filters (COEMS-13214)**. It applies to the table on the **Reports** tab of a Fixture Report (see **Fixture Report - Report Table Listing**).

---

#### **acceptance criteria:**

1. **Filter icon**

   Each column header in the generated report table must have a **filter icon**. This includes the added columns (LAYCAN START, LAYCAN END, CONVERTED GROSS FREIGHT, CONVERTED MANAGEMENT FEE). The filter icon must work together with the column's drag-and-expand icon, and a narrow column must still show both.

2. **Filter dropdown panel**

   Clicking a column's filter icon must open a dropdown panel containing:

   * a **Search** input at the top,
   * a **Select All** checkbox,
   * a scrollable list of the **unique values** for that column, each with a checkbox,
   * a **(Blanks)** option (checkbox) when the column contains empty / null values, and
   * an **Apply** button at the bottom.

   The list must hold the unique values of the column in the **whole report** (all pages), not only those on the current page.

3. **Search behaviour**

   * Typing in **Search** must dynamically filter the value list shown in the dropdown. The match must contain the typed text and must not be case sensitive.
   * Search must **not** change the table results until **Apply** is clicked.

4. **Selection behaviour**

   * **Select All** must check / uncheck all the values currently available in the list (including **(Blanks)**, if present).
   * Users must be able to select **one or multiple** values.
   * If the user unchecks any single value, **Select All** must automatically become unchecked.
   * If the user manually checks all the values, **Select All** must become checked.

5. **Apply behaviour**

   * Clicking **Apply** must filter the report table rows based on the values selected for that column: a row is kept when its value in the column is one of the checked values (or the cell is empty, when **(Blanks)** is checked). The dropdown closes.
   * If no values are selected and **Apply** is clicked, the system must **auto-default to Select All** (the column is not filtered).
   * After **Apply**, the table must go back to **page 1**, and the paging text must show the number of rows left, for example **"1 – 25 of 120"**.

6. **Active filter indication**

   When a filter is applied, the filter icon in that column header must visually indicate an **active filter** state.

7. **Several columns**

   * Filtering one column must **not reset** the filters applied on other columns.
   * A row is shown only if it matches the filter of **every** filtered column.

8. **Persistence & reset**

   * Re-opening the filter dropdown must show the **previously selected values** for that column.
   * To remove a filter, the user checks **Select All** and clicks **Apply**.
   * The filters must stay while the user pages through the table, shows or hides columns, resizes columns, or goes to the Charts and Pivot Table tabs and back. They are **not saved** with the report.

9. **No rows left**

   If the filters leave no row, the table must show the message **"No fixtures match the applied filters."** instead of rows.

10. **What the filters change**

    The filters change **only the rows shown in the Reports tab table**. They must not change the fixtures in the report (the Date Range and Based on decide that), the summary tiles, the Charts or the Pivot Tables.

11. **Filter behaviour by column**

    The filter list of each column depends on its data type. **Every column of the report table has the filter.** The table below lists **all of them**, in the table's order, with the type of each column as in **Fixture Report - Report Table Listing**. A report shows only the columns chosen in **Select required columns**; the filter works the same on each of them.

    | **#** | **Column Title** | **Data Type** | **Filter Behaviour** |
    | --- | --- | --- | --- |
    | 1 | ID | Number | Numeric checkbox list |
    | 2 | NUMBER | Text | Checkbox list + Search |
    | 3 | CARGO NAME | Text | Checkbox list + Search |
    | 4 | CARGO DESCRIPTION | Text | Checkbox list + Search |
    | 5 | INTENDED VESSEL TYPE | Text | Checkbox list + Search |
    | 6 | INTENDED VESSEL | Text | Checkbox list + Search |
    | 7 | FINAL PERFORMER | Text | Checkbox list + Search |
    | 8 | CARGO TYPE | Text | Checkbox list + Search |
    | 9 | UNIT NUMBER | Number | Numeric checkbox list |
    | 10 | TOTAL VOLUME | Number | Numeric checkbox list |
    | 11 | TOTAL WEIGHT | Number | Numeric checkbox list |
    | 12 | FREIGHT RATE | Number | Numeric checkbox list |
    | 13 | FREIGHT CALC TYPE | Text | Checkbox list + Search |
    | 14 | CURRENCY | Text | Checkbox list + Search |
    | 15 | GROSS FREIGHT | Number | Numeric checkbox list |
    | 16 | FREIGHT COMMENTS | Text | Checkbox list + Search |
    | 17 | BUY IN | Text | Checkbox list + Search |
    | 18 | BUY IN FREIGHT CALC TYPE | Text | Checkbox list + Search |
    | 19 | BUY IN FREIGHT RATE | Number | Numeric checkbox list |
    | 20 | BUY IN GROSS FREIGHT RATE | Number | Numeric checkbox list |
    | 21 | BALANCE | Number | Numeric checkbox list |
    | 22 | BUY IN COMMENTS | Text | Checkbox list + Search |
    | 23 | FIXTURE STATUS | Text | Checkbox list + Search |
    | 24 | BOOKING DATE | Date | Date grouped checkbox list |
    | 25 | PROJECT NAME | Text | Checkbox list + Search |
    | 26 | FIXTURE TYPE | Text | Checkbox list + Search |
    | 27 | FIXED BY | Text | Checkbox list + Search |
    | 28 | PERSON IN CHARGE | Text | Checkbox list + Search |
    | 29 | BAF | Text | Checkbox list + Search |
    | 30 | BAF COMMENTS | Text | Checkbox list + Search |
    | 31 | CHARTERING TERMS | Text | Checkbox list + Search |
    | 32 | RELATED PROJECT | Text | Checkbox list + Search |
    | 33 | HEAD ACCOUNT | Text | Checkbox list + Search |
    | 34 | ACCOUNT | Text | Checkbox list + Search |
    | 35 | SHIPPER | Text | Checkbox list + Search |
    | 36 | BROKER | Text | Checkbox list + Search |
    | 37 | BROKER COMMISSION | Number | Numeric checkbox list |
    | 38 | MANAGEMENT FEE PERCENTAGE | Number | Numeric checkbox list |
    | 39 | CHARTER PARTY SIGNED | Text | Checkbox list + Search |
    | 40 | HARD COPY | Text | Checkbox list + Search |
    | 41 | PDF | Text | Checkbox list + Search |
    | 42 | MARKETING | Text | Checkbox list + Search |
    | 43 | DELIVERY DATE | Date | Date grouped checkbox list |
    | 44 | REDELIVERY DATE | Date | Date grouped checkbox list |
    | 45 | TIME CHARTER RATE | Text | Checkbox list + Search |
    | 46 | DEMURRAGE DURATION | Text | Checkbox list + Search |
    | 47 | DEMURRAGE PDPR | Text | Checkbox list + Search |
    | 48 | GROSS DEMURRAGE | Number | Numeric checkbox list |
    | 49 | TRANSIT TIME | Text | Checkbox list + Search |
    | 50 | VOYAGE NUMBER | Text | Checkbox list + Search |
    | 51 | AGREEMENT TYPE | Text | Checkbox list + Search |
    | 52 | CHARTERING RATING | Text | Checkbox list + Search |
    | 53 | ENGINEERING RATING | Text | Checkbox list + Search |
    | 54 | OPERATIONS RATING | Text | Checkbox list + Search |
    | 55 | HSE ACTION RATING | Text | Checkbox list + Search |
    | 56 | HSE COMMENTS | Text | Checkbox list + Search |
    | 57 | PROGRESS | Number | Numeric checkbox list |
    | 58 | INVOICE STATUS | Text | Checkbox list + Search |
    | 59 | MANAGEMENT FEE | Number | Numeric checkbox list |
    | 60 | CREATED BY | Text | Checkbox list + Search |
    | 61 | CREATED ON | Date and time | Date grouped checkbox list |
    | 62 | MODIFIED BY | Text | Checkbox list + Search |
    | 63 | MODIFIED ON | Date and time | Date grouped checkbox list |
    | 64 | SEND TO OPERATIONS | Yes / No | Checkbox list |
    | 65 | RELATED ENG REQUESTS | Text | Checkbox list + Search |
    | 66 | IS ASSIGNED TO VOYAGE | Yes / No | Checkbox list |
    | 67 | VOYAGE ID | Number | Numeric checkbox list |
    | 68 | VOYAGE NAME | Text | Checkbox list + Search |
    | 69 | BC SYNC FAILED | Yes / No | Checkbox list |
    | 70 | RELATED CARGO ID | Number | Numeric checkbox list |
    | 71 | VERSION | Number | Numeric checkbox list |
    | 72 | ENQUIRY NUMBER | Text | Checkbox list + Search |
    | 73 | VOYAGE START DATE | Date and time | Date grouped checkbox list |
    | 74 | ORIGINAL FIXTURE ID | Number | Numeric checkbox list |
    | 75 | HANDOVER OPERATIONS | Number | Numeric checkbox list |
    | 76 | HANDOVER INCON | Number | Numeric checkbox list |
    | 77 | OPM TECHNICAL DOCS REQUIRED | Number | Numeric checkbox list |
    | 78 | ADDITIONAL INCOME EXPENSE | Text | Checkbox list + Search |
    | 79 | LAYCAN START | Date | Date grouped checkbox list |
    | 80 | LAYCAN END | Date | Date grouped checkbox list |
    | 81 | CONVERTED GROSS FREIGHT | Number | Numeric checkbox list |
    | 82 | CONVERTED MANAGEMENT FEE | Number | Numeric checkbox list |

    **How each data type works:**

    | **Data Type** | **Filter Behaviour** | **Example columns** | **Example (How It Works)** |
    | --- | --- | --- | --- |
    | Text | Checkbox list + Search | NUMBER, ACCOUNT, FIXTURE STATUS, INVOICE STATUS, CURRENCY, CARGO TYPE, BUY IN COMMENTS | **ACCOUNT** data: Deugro, Vestas, Deugro → filter list: Deugro, Vestas. Selecting **Deugro** shows every fixture of that account. **FIXTURE STATUS** data: Discharged, Cancelled, Discharged → selecting **Cancelled** shows only the cancelled fixtures. |
    | Number | Numeric checkbox list | GROSS FREIGHT, CONVERTED GROSS FREIGHT, UNIT NUMBER, PROGRESS | **PROGRESS** data: 20, 56, 56, blank → filter list: **(Blanks)**, 20, 56. Selecting **56** shows both rows with that value. |
    | Date / Date and time | Date grouped checkbox list | BOOKING DATE, CREATED ON, MODIFIED ON, LAYCAN START | **CREATED ON** data: 10/06/2025 08:15, 10/06/2025 16:45, 11/06/2025 10:00, blank → filter list: **(Blanks)**, 10/06/2025, 11/06/2025. Selecting **10/06/2025** shows both entries of that date, whatever the time. |
    | Yes / No | Checkbox list | SEND TO OPERATIONS, IS ASSIGNED TO VOYAGE, BC SYNC FAILED | Filter list: **Yes**, **No** |

    * Text values are listed A to Z, numbers from the lowest to the highest, dates from the oldest to the latest. Dates are shown as dd/mm/yyyy.
    * For a **Date and time** column the filter works on the **date only**.
    * Every other column behaves according to its data type.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report → **Reports** tab → table header | Filter icon on every column; dropdown with Search, Select All, values, (Blanks) and Apply |
| Table | Rows, paging text and empty message follow the applied filters |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* Conditions such as "greater than", "between" or "contains" on numbers, dates or text. Only value lists are in scope.
* Sorting the table by a column.
* Saving a set of filters with the report, or as the user's default.
* Filtering the **Charts** or **Pivot Tables** from the table filters (a pivot table has its own **Filters** field).
* Exporting the filtered table.

---

#### **To be confirmed:**

* **Do the table filters also limit the charts and pivot tables?** The PCER story does not say. Proposed default: **no**. They only narrow the table view (AC 10), and charts and pivot tables use the whole report.
* **The "Fixtures in this report" tile.** Proposed default: it keeps showing the total of the report, while the paging text shows the filtered count.
* **Very long lists of values.** A column such as NUMBER or ID has one value per fixture (about 1,900 in the export). Define a maximum number of values listed, with a message that Search finds the rest, or load the values on demand.
* **Values that depend on other filters.** Proposed default: a column's list shows all the values of the report, not only those left by the filters on other columns.
* **When filters are cleared.** Tested on the PCER (bctesting, 2026-11-05): filters stayed applied on **Refresh** and after **saving an edit** with no change. Proposed default: the same, and cleared when the report is closed (not tested).
* **Hidden columns.** **Fixture Report - Report Table - Show Hide / Reorder** says hidden columns show no filter icon, but not whether the filter stays applied. Tested on the PCER: hiding a column **keeps its filter applied**, and it is still active when the column is shown again. Proposed default: same as the PCER. The alternative is to remove the filter when the column is hidden, because the user cannot see a filter on a hidden column.
* **Clear button.** The PCER story lists only **Apply**, but the PCER dropdown also has a **Clear** button: it unticks every value, and **Apply** with nothing ticked shows all rows again (AC 5). Proposed default: include the same **Clear** button. Confirm.
* **Clearing all filters at once.** The PCER has no such button. With 82 columns, a **Clear all filters** button could help. Confirm.
* **(Blanks) option.** The story says it is shown when the column contains empty values. On the PCER, **(Blanks)** was listed for Port/Position although no row was empty. Proposed default: follow the story.
* **No-rows message (AC 9).** Not in the PCER story. Wording to be confirmed.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (filter response time on reports with many rows).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
