#### **Fixture Report - Edit & Update Report**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a user,**
**I want to** be able to edit the report details from the **Fixture Report** page
**So that** I can easily update and maintain accurate report information, such as the date range, the currency and the columns, without creating the report again.

> Follows **PCER - Edit & Update Report (COEMS-13176)**. The fields and validations are those of **Fixture Report - Create New Fixture Report**; this story adds what changes when an existing report is edited, mainly the effect on its charts and pivot tables.

---

#### **acceptance criteria:**

1. **Triggering the Edit Overlay Popup**

   * A **"Settings" icon** (gear) should be available in the **Header section** of the Fixture Report page.
   * Selecting the "Settings" icon should open a pop-up window named **"Edit Fixture Report"**.

2. **Popup Layout and Fields**

   * The pop-up layout should be the same as that of the **"Add New Fixture Report"**: Report Name, Based on, Date Range, Convert to (currency) and Select required columns.
   * The **field validations** should be the same as those of the "Add New Fixture Report". Refer to the user story: **Fixture Report - Create New Fixture Report**.
   * By default, **all fields should be auto-populated** based on the respective report data: the saved name, Based on, Date Range, currency and **the saved selection of columns** (the field shows "All n columns" or "x of n columns").
   * Users should be able to **edit** these fields.

3. **Buttons**

   Two buttons are required at the bottom: **Save** and **Cancel**.

   * **Save** → saves the changes. A message window with the message **"Report detail has been updated successfully"** should be generated.
     * The **Save** button must stay **disabled** while any field is invalid (the same rules as **Create Report**), or while a column used by a chart or pivot table is deselected (AC 5).
   * **Cancel** → ignores the changes and closes the window. No need to save a draft.

4. **What happens when the report is saved**

   Once saved, the report should be updated with the new data:

   * The **table** must be generated again with the new fields: the fixtures whose **Based on** date is in the new **Date Range**, with the new **Based on** date, the converted columns in the new **Convert to** currency (each fixture at its own conversion date, as when the report was created), and **only the newly selected columns**.
   * The **report name** must be updated in the report's tab, in the page header and in the **Reports listing**. **Modified By** and **Modified On** in the listing must show the user who saved and the date.
   * The header line (Based on label, date range, currency) and the summary tiles (number of fixtures, converted totals) must show the new values.
   * Every existing **chart** and **pivot table** must be calculated again on the new table. Their names and settings stay the same.
   * The report's **Share access** must not change, and the report keeps its ID and its place in the list.

5. **Columns used by charts and pivot tables**

   * A column that is used by a chart or a pivot table of this report (X Axis, Y Axis, Stack By, Category, Value, or a pivot Rows, Columns, Filters or Values field) must **not be deselectable** in **Select required columns**. In the list it must be tagged **"used by a chart or pivot"**.
   * If a used column is deselected (for example with **Clear all**), **Save** must be disabled and a message must say which columns the charts or pivot tables use, and that the user must keep them selected or delete those charts and pivot tables first.
   * A column that no chart or pivot table uses can be deselected and selected again at any time.
   * Changing **Based on**, **Date Range** or **Convert to** is always allowed. A column that is not selected can still be the Based on date.

6. **Cancel and closing**

   * **Cancel**, the close icon or leaving the pop-up must not change the report in any way.
   * Opening the pop-up again must show the saved values, not the discarded changes.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report page → Header | **Settings** icon that opens **Edit Fixture Report** |
| Edit Fixture Report pop-up | Same fields and validations as Add New; pre-filled; **Save** and **Cancel** |
| Report page, listing | Updated name, table, header, tiles, charts, pivot tables; Modified By / On |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* Creating a Fixture Report (see **Create New Fixture Report**) and copying one (see the listing page story).
* The **Refresh** button of the report page.
* Editing, moving, resizing and deleting a chart (see **Fixture Report - Report Dashboard**) and working with pivot tables.
* Changing the Share access of the report (see **Fixture Report - Share Functionality**).
* Saving a draft of an edit.

---

#### **To be confirmed:**

* **Who may edit a Fixture Report.** The PCER story does not say. Proposed default: the owner, and users the report is shared with who have edit access, as in the other report types. Confirm whether a report under **'Others'** or an **archived** report can be edited.
* **A pivot table filter value that no longer exists.** If the new Date Range removes the value a pivot table filter was set to (for example a month), proposed default: the filter returns to showing all values.
* **No fixtures in the new range.** Proposed default: saving is allowed, and the report shows the empty message "No fixtures match these fields."; charts and pivot tables show the same message.
* **Report name.** Decided 2026-11-05: a name already used by another report is allowed (see the Create story).
* **Show / Hide, filters and column widths.** Tested on the PCER (bctesting, 2026-11-05): saving an edit with no change kept the hidden columns and the applied table filter. Proposed default for the Fixture Report: the same, and the widths the user set are kept too. A column that is deselected in **Select required columns** and selected again returns visible, with its width. (See **Fixture Report - Report Table - Show Hide / Reorder**.)
* **Message after Save.** The PCER story says **"Report detail has been updated successfully"**, but the PCER on bctesting shows **"Updated successfully"**. Proposed default: the wording of the story.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (regeneration time for large date ranges).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
