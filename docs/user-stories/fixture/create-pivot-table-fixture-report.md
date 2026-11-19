#### **Fixture Report - Create Pivot Table**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a user,**
**I want to** access a **Pivot Table** as a separate tab inside the Fixture Report page, and create a pivot table using an **"Add New"** overlay where I can select fields and configure **Filters, Rows, Columns and Values** using drag and drop
**So that** I can build flexible pivot tables for analysis without depending on fixed templates or manual calculations.

> Follows **PCER - Create Pivot Table (COEMS-14199)**. The pivot table is built from the table of the Fixture Report (see **Fixture Report - Report Table Listing**). It replaces the fixed Fixture Reports pages: for example "fixtures and freight by customer and year" is a pivot table with the customer in Rows, the year in Columns and the converted freight in Values.

---

#### **acceptance criteria:**

1. **Pivot Table tab availability**

   * The Fixture Report page should contain a tab named **"Pivot Table"**, next to the **Reports** and **Charts** tabs.
   * Clicking the **Pivot Table** tab opens the pivot workspace within the Fixture Report page.
   * The pivot tables of the report are listed by name in a side panel, and the one the user selects is shown. A report with no pivot table shows the empty state *"No pivot data found. Click "Add New" to create a pivot table."* (see **Fixture Report - Edit Pivot Table**).

2. **Add New Pivot Table action**

   * The **Pivot Table** tab header contains an action button named **"Add New"**.
   * Clicking **Add New** opens an **overlay (modal)** on top of the Fixture Report page.

3. **Add overlay UI layout (Pivot Builder overlay)**

   * The overlay title should be **"Add New Pivot Table"**.
   * The overlay should include:
     * a **Close (X)** icon in the top right,
     * an input text field **Pivot Table Name** (mandatory),
     * a section titled **"Drag and drop Fields to add to report."**,
     * a **list of the dataset fields**: every column of the Fixture Report table (the columns chosen in **Select required columns**, whether or not they are hidden in the table view),
     * four pivot configuration zones: **Filters**, **Columns**, **Rows** and **Values**, and
     * the action buttons **Cancel** and **Add**.

4. **Drag-and-drop pivot configuration**

   Users should be able to:

   * **drag** fields from the field list and **drop** them into **Filters**, **Rows**, **Columns** and **Values**,
   * **move** fields between the pivot zones after placement,
   * **reorder** fields within a zone using drag and drop, and
   * **remove** fields from a zone by dragging them out.

5. **Different zone behaviours**

   * **Filters zone**
     * Fields placed in **Filters** behave as **pivot-level filters** and do not appear as pivot rows or columns.
     * Filters should support **multiple options**: for each filter field, the user can select one or more of its values (all values are selected until the user chooses).
     * Applying a filter updates the **pivot values, the subtotals and the grand totals**.
   * **Rows zone**
     * Fields placed in **Rows** define the **vertical grouping structure** of the pivot table.
     * Several row fields create a **hierarchy**, top-down in the order of the fields.
     * The pivot output supports: **expand / collapse** for each hierarchy level, **indentation** for the hierarchy, and **subtotals** for each row level (if enabled).
   * **Columns zone**
     * Fields placed in **Columns** define the **horizontal grouping** of the pivot table.
     * Several column fields are supported and create **nested columns**.
     * Columns expand dynamically, based on the distinct values in the data.
   * **Values zone**
     * Fields placed in **Values** are the **measures**. The user can add **several value fields**, which are displayed **side by side**.
     * Each value field has an **Aggregation Option** dropdown: **Sum**, **Count**, **Average**.
     * The values respect all the filters, the row hierarchy and the column grouping.
     * Each value field entry must display: the **field name**, the **aggregation label** (default or selected) in brackets, and a **dropdown arrow** for that field, which opens the **Aggregation Option** dropdown. For example the entry reads **"Vessel (Count) ▾"**, and for a non-number field such as Vessel the dropdown lists only **Count**. (The PCER story calls this control a settings icon; on the PCER screen it is a dropdown arrow.)
     * When a **Number** column is added to Values, the default aggregation is **Sum**.
     * When a **non-number** column (Text, Date, Date and time, Yes / No) is added to Values, the default aggregation is **Count**.
     * The system must **prevent invalid aggregations**: **Sum** and **Average** are not offered for a non-number column, so only **Count** can be chosen for it.

6. **Date columns in Rows, Columns and Filters (Fixture Report)**

   * The Date and Date and time columns of the Fixture Report are: BOOKING DATE, DELIVERY DATE, REDELIVERY DATE, CREATED ON, MODIFIED ON, VOYAGE START DATE, LAYCAN START and LAYCAN END.
   * When one of them is placed in **Rows**, **Columns** or **Filters**, its field entry must show the grouping in brackets and a **dropdown arrow**, like a Values entry (for example **"BOOKING DATE (Year) ▾"**).
   * The dropdown must have **two options**: **Year (Default)** and **Month**, as in the charts (see **Fixture Report - Create Bar Chart**). **Year** groups by year (2022); **Month** groups by year and month together (2022-03). The time of a Date and time column is ignored.
   * Changing the option updates the field entry and the pivot table.
   * A column that is not a date column has no such dropdown in Rows, Columns or Filters.
   * Fixtures with no value in the date column are shown as one group named **(Blank)**.

7. **Pivot output generation**

   * Clicking **Add** should create the pivot table and **close the overlay**.
   * The pivot table should be created as a **new pivot table instance** under the **Pivot Table** tab, and the pivot table **title** should display the user-entered **Pivot Table Name**.
   * The pivot table should be generated using the configuration selected in the overlay: **Filters, Rows, Columns and Values**.
   * The output has **Row Labels** and **Column Labels**, and a **Grand Total** row and column. With several value fields, there is a grand total for each of them.
   * Row and column labels are in this order: dates in **time order**, numbers from the **lowest to the highest**, text from **A to Z**. Fixtures with an empty value are shown under **(Blank)**.
   * A cell with no fixtures shows **0**.

8. **Cancel and close**

   * Clicking **Cancel** closes the overlay **without creating** a pivot table.
   * Clicking the **Close (X)** icon closes the overlay **without creating** a pivot table.
   * **No changes are applied** unless the user clicks **Add**.

9. **Validation rules**

   * **At least one field must be placed in Values.** If **Values** is empty, **Add** must be blocked and a validation error shown.
   * **At least one grouping field must exist in Rows or Columns.** If both **Rows** and **Columns** are empty, **Add** must be blocked and a validation error shown.
   * The **Pivot Table Name** is mandatory: **Add** must stay blocked until it is filled.

10. **Data of the pivot table**

    The pivot table must:

    * use the data of the **generated Fixture Report table** (the fixtures of the report's Date Range, with every office and status), and
    * **update automatically when the report is refreshed** or edited.
    * The filters, the hidden columns and the column order of the **Reports** tab do not change the pivot table (see **Fixture Report - Table Filters** and **Show Hide / Reorder**).

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report page | New tab **Pivot Table** |
| Pivot Table tab | **Add New** button; list of the report's pivot tables; the selected pivot table |
| **Add New Pivot Table** overlay | Name, field list, zones Filters / Columns / Rows / Values, Cancel and Add |
| Pivot output | Row and column labels, hierarchy, subtotals, grand totals |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* **Editing** a pivot table after it is created, and the side panel with the list of pivot tables (see **Fixture Report - Edit Pivot Table**), and **deleting** a pivot table (not written yet).
* The **Bar**, **Stacked Bar** and **Pie** charts, and the **Reports** tab.
* Exporting the pivot table, and calculated fields or custom formulas.
* Putting a pivot table on the My Dashboard widgets.

---

#### **To be confirmed:**

* **Decided 2026-11-05: date grouping in a pivot table (AC 6).** The PCER story has no date grouping for pivot tables. It is added because the Product Owner asked that date columns are grouped by month and year, as in Excel. A date field in Rows, Columns or Filters gets a **dropdown with two options, Year and Month**, like the aggregation dropdown of a Values entry.
* **Values zone and non-number fields.** The PCER story says the Values fields "must be aggregated numeric measures" and also gives a default aggregation of **Count** for a non-numeric field. This story allows any column in Values, with **Count** as the only aggregation for a non-number column.
* **Validation messages.** The PCER story says "a validation error is shown" without wording. On the PCER, an empty Values zone shows **"At least one Value field is required"**. Proposed for the other rule: **"At least one field must be added to Rows or Columns."**
* **Subtotals "if enabled".** The PCER story does not say how subtotals are enabled. Proposed default: a subtotal row for each parent level whenever there is more than one row field, with the expand / collapse control on those rows.
* **Where the filter values are chosen.** Proposed default: above the pivot table, one multi-select list for each field in Filters, with all values selected at first. Confirm whether the chosen values are saved with the pivot table.
* **Search in the field list.** The report has up to 82 fields. Proposed default: a search box above the field list.
* **Many columns and rows.** A field with many values (for example ACCOUNT, with about 200) in Rows or Columns gives as many rows or columns. As for the charts, assumed no limit (the table scrolls). Confirm.
* **Pivot table names.** Proposed default: two pivot tables of one report may have the same name, as for charts.
* **Dates in the filter list.** Proposed default: a date filter lists the groups chosen in Date Group By (for example the years).

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (pivot generation time for reports with many fixtures and many columns).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
