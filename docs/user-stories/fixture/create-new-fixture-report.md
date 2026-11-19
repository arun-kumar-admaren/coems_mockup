#### **Fixture Report - Create New Fixture Report**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I want to** create a new **Fixture Report** from the **Reports** section
**So that** I can analyse fixtures by period, customer, office, vessel type, cargo type and more, in one currency and with the columns I need, and build my own charts and pivot tables from the result, without depending on fixed reports.

> Follows the pattern of **PCER - Create New Report (COEMS-13098)**: a pop-up, a generated table, then charts and pivot tables the user builds. This story covers **opening the creation pop-up, its fields and validations, and creating the report**. Fields agreed with the Product Owner on 2026-11-04.

---

#### **acceptance criteria:**

1. **Accessing the Report Creation Screen**

   **Given** that the user is in the **Reports** section
   **When** the user clicks **Create**, a new option named **"New Fixture Report"** should be available, along with the existing options (New Fleet Plan, New Budget Report, New Port Call Evaluation Report).

   Once **"New Fixture Report"** is clicked, a report creation pop-up titled **"Add New Fixture Report"** should display.

2. **Report creation pop-up**

   The pop-up must have the following fields. There are no sections: all fields are in one list. The pop-up must **not** have an Offices field, a Conversion Date field or an "Include Cancelled and Postponed fixtures" checkbox.

   | **Field Name** | **Input Type** | **M/O** | **Validations** |
   | --- | --- | --- | --- |
   | Report Name | Text Field | M | 1. Must not be empty (spaces only counts as empty). |
   | Based on | Dropdown (single select) | M | 1. Options: **Booking Date** (default), **Created Date**, **Laycan Start**.<br>2. It decides which date of the fixture the Date Range applies to: **Booking Date** is the fixture's Booking Date, **Created Date** is the date part of its Created On, **Laycan Start** is the start date of its first laycan (Laycan 1 on the Fixture List).<br>3. A fixture that has no value in the chosen date is not included in the report. In practice this happens only for Laycan Start, for fixtures with no laycan. There is no fallback to another date. |
   | Date Range | Date Range Selector (From and To) | M | 1. Both dates are required. No default value.<br>2. A fixture is included when its **Based on** date is on or between the two dates (**both dates are included**).<br>3. From must not be after To. If it is, the inline message **"The start date must not be after the end date."** must be shown and the report cannot be created.<br>4. A hint under the field must read **"Both dates are included"**. When Based on is Laycan Start it must read **"Fixtures with no laycan are left out"**. |
   | Convert to (currency) | Dropdown (single select) | M | 1. The dropdown must list **every currency available in the system**. Default: **US Dollar**.<br>2. It sets the currency of the two converted amount columns (CONVERTED GROSS FREIGHT and CONVERTED MANAGEMENT FEE).<br>3. There is no conversion date to choose. Every fixture already has its own conversion currency and conversion date, so each fixture's amount is converted into the chosen currency at the rate of **that fixture's own conversion date**. Two fixtures in one report can therefore use different rates.<br>4. An amount already in the chosen currency is shown unchanged. A fixture with no usable rate or date shows a blank in the two converted columns. |
   | Select required columns | Dropdown with Multiselect functionality | M | 1. The dropdown must list **every column of the Fixture Report table**, in the table's order, each with a checkbox: the columns of the Fixture List **Export All**, and four added columns (**LAYCAN START**, **LAYCAN END**, **CONVERTED GROSS FREIGHT**, **CONVERTED MANAGEMENT FEE**) marked with a **"new"** tag. PORT OF LOADING, PORT OF DISCHARGE and COMMISSIONS are not listed (they hold several comma separated values and are left out for now).<br>2. It must have a **search box** and the buttons **Select all** and **Clear all**.<br>3. **All columns are selected by default.** The closed field shows **"All n columns"** when all are selected, otherwise **"x of n columns"**.<br>4. At least one column must be selected. If none is, the inline message **"Select at least one column."** must be shown and the report cannot be created.<br>5. The report's table has the selected columns **and only those**. Charts and Pivot Tables can only use the selected columns.<br>6. The selection does not change which fixtures are included: a column that is not selected can still be the **Based on** date, and the date range, the conversion and the number of fixtures stay the same. |

3. **Fixtures included**

   * The report must include **every office** and **every fixture status** (including Cancelled and Postponed) whose **Based on** date is in the Date Range. The user can still group or filter by office (**FIXED BY**) or status (**FIXTURE STATUS**) later, because both are columns.
   * Each fixture must appear **once**, as one row of the table.

4. **Create Report button behaviour**

   The **Create Report** button must remain **disabled** until:

   * Report Name is filled.
   * Based on is selected.
   * Both Date Range dates are filled and From is not after To.
   * Convert to (currency) is selected.
   * At least one column is selected.

   The **Cancel** button must close the pop-up without creating anything.

5. **After the report is created**

   Clicking **Create Report** must:

   * close the pop-up,
   * add the report to the **Reports** listing with **Type = Fixture Report** (Created By, Created On, Modified By and Modified On filled as for the other report types), and
   * open the report in its own tab, showing the generated table: one row per fixture, with the selected columns, converted into the chosen currency.

   The new report must have the sub-tabs **Reports**, **Charts** and **Pivot Table**. It must start with **no charts and no pivot tables**, as the PCER does. The report header must show the report name, a line with the Based on label, the date range and the currency (for example *"Booking Date: 01/01/2022 to 31/12/2022 · converted to US Dollar at each fixture's own conversion date"*), and a **Fixtures in this report** tile with the number of rows. The **Converted Gross Freight** and **Converted Management Fee** tiles (totals in the chosen currency) must show only when their column is selected.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Reports → Create | New option **New Fixture Report** |
| Add New Fixture Report pop-up | Report Name, Based on, Date Range, Convert to (currency), Select required columns |
| Reports listing | New report type **Fixture Report** |
| New Fixture Report page | Header, summary tiles, sub-tabs Reports / Charts / Pivot Table (their content is in other stories) |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new report type, so there are no existing reports to migrate. The fixed Fixture Reports pages are replaced by this report (separate story).

---

#### **Out of Scope:**

* **Editing** a Fixture Report (the gear on the report) and refreshing it.
* The content of the **Reports** sub-tab (columns, data types, column widths, paging), the **Charts** sub-tab (Bar, Stacked Bar, Pie) and the **Pivot Table** sub-tab, including grouping dates by month or year.
* Removing the fixed **Fixture Reports** pages from the menu.
* An Offices filter, a Conversion Date, a Customer Type filter, a Period (year) selection and the "Include Cancelled and Postponed fixtures" option: all removed by the Product Owner.
* Ready-made reports or templates: users build their own.

---

#### **To be confirmed:**

* **Report Name uniqueness.** Decided 2026-11-05: two reports may have the same name, and there is no maximum length rule.
* **Who can create and see a Fixture Report.** The report includes all offices. Proposed default: the same access as the other report types in Reports.
* **Created Date and time zone.** Created Date is the date part of Created On. Confirm which time zone is used for that date.
* **Laycan Start.** Proposed: the first laycan entered (Laycan 1), not the earliest. Fixtures with no laycan are left out.
* **Size.** A wide date range with all offices and statuses can return many fixtures (the Export All file has about 1,900 fixtures by 82 columns). Define any maximum date range, row limit or warning.
* **Columns list.** The list follows the Fixture List Export All. Confirm that a column added to the Fixture List later is added to this list too (new reports only).

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (generation time for large date ranges).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
