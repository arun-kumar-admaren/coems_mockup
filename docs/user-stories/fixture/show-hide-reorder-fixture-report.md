#### **Fixture Report - Report Table - Show Hide / Reorder**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I want to** show / hide columns and reorder columns in the Fixture Report page table
**So that** I can customise the table layout to match my reporting and analysis needs.

> Follows **PCER - Report Table - Show Hide / Reorder (COEMS-13216)**. It applies to the table on the **Reports** tab of a Fixture Report (see **Fixture Report - Report Table Listing**). It works within the columns chosen in **Select required columns**: that field decides which columns the report has, this option only decides which of them the table shows and in what order.

---

#### **acceptance criteria:**

1. **Configuration option**

   The Fixture Report page table must include a **Show/Hide & Reorder** configuration option in the **top right corner** of the report (table).

2. **Opening the configuration**

   Opening the configuration must present **two tabs / sections**:

   * **Show/Hide**
   * **Reorder**

3. **Show/Hide tab**

   The Show/Hide view must display:

   * a **Search** input to quickly find column names,
   * a **Select All** checkbox, and
   * a **scrollable list of all available column titles** with checkboxes. The list must hold every column of the report (the columns chosen in **Select required columns**), in the table's current order, **except ID and NUMBER** (see below). The four added columns (LAYCAN START, LAYCAN END, CONVERTED GROSS FREIGHT, CONVERTED MANAGEMENT FEE) must keep their **"new"** tag.

   **Behaviour:**

   * **ID** and **NUMBER** must **always be visible** in the table. They must **not be listed** in the Show/Hide view, so they cannot be hidden, and **Select All** and **Update** never affect them.
   * **Checked** columns = **visible** in the table.
   * **Unchecked** columns = **hidden** from the table.
   * By default every column is checked.
   * The user should be able to select / deselect **multiple** columns.
   * **Select All** checks / unchecks all columns in the list. It applies to **all** the columns of the list, also when a search is active and shows only some of them (as in the PCER). It must show a partly ticked state while only some columns are ticked.
   * **Search** must filter the column list shown.
   * The view must include an **Update** button:
     * Clicking **Update** applies the visibility changes to the table **immediately** and closes the panel.
     * Closing the panel **without** clicking **Update** must **not** apply changes.

4. **Reorder tab**

   The Reorder view must display a **list of the columns** of the report, in the table's current order. **ID** and **NUMBER** are in this list too: they can be moved, but they cannot be hidden. Columns that are **hidden** are in the list as well, so that they keep their place when they are shown again.

   The user must be able to change the column order using the controls on each column, as in the PCER:

   * **Move to top**,
   * **Move up**,
   * **Move down**, and
   * **Move to bottom**.

   The view must include:

   * a **Reset** option to restore the **default column order** (the order in **Fixture Report - Report Table Listing**: the Fixture export's columns, then LAYCAN START, LAYCAN END, CONVERTED GROSS FREIGHT and CONVERTED MANAGEMENT FEE), and
   * an **Update** button to apply the new order.

   **Behaviour:**

   * Clicking **Update** must immediately reflect the new column order in the Fixture Report table **header and rows**, and close the panel.
   * Clicking **Reset** must restore the default order in the table **immediately** (no **Update** needed) and close the panel. **Reset** changes only the order: columns that are hidden stay hidden.
   * Closing without an update must **not** apply changes.
   * Reordering must **not break filtering**: the filters must still map to the correct columns after the reorder. A column must keep its **width** when it is moved.

5. **General behaviour**

   The updated table configuration must work together with the other table features:

   * **Filters remain available on visible columns**: a filter applied on a column keeps working after the columns are reordered.
   * **Hidden columns must not show filter icons** in the table.
   * A column keeps its width when it is hidden and shown again.
   * Hiding or moving a column changes **only the table view**. The column is still part of the report, and the **Charts** and **Pivot Tables** can still use it. The **Select required columns** field decides which columns the report has: a column that is not selected there is not in the Show/Hide or Reorder list.
   * **The configuration must persist for the session only.** It must stay while the report is open (while the user pages through the table, filters it, resizes columns, switches to the Charts and Pivot Table tabs and back, on **Refresh**, and when an edit of the report is saved) and when the user closes the report and opens it again in the same session. On the **next login**, the columns must return to the default visibility and order. The configuration of one report does not change another report.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report → **Reports** tab → top right of the table | **Show/Hide & Reorder** configuration option with the tabs **Show/Hide** and **Reorder** |
| Table header and rows | Show the visible columns in the chosen order |
| Table filters | Filter icons only on visible columns; filters follow the columns when reordered |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* Choosing which columns the report has (**Select required columns**, in the Create and Edit pop-ups).
* Resizing columns and the table filters (separate stories).
* Sorting the table by a column.
* Saving named layouts or views.
* The order of the fields in the Charts and Pivot Table lists.

---

#### **To be confirmed:**

* **ID and NUMBER and the report's columns.** These two columns are always visible and not in the Show/Hide list (Product Owner's direction). They are **not** locked in **Select required columns**, so a report can be created without them (decided 2026-11-05). In such a report they are not in the table, and the Show/Hide list could hide every remaining column. Proposed default for that case only: **Update** is disabled with the message **"Select at least one column."**
* **ID and NUMBER in the Reorder list.** The direction was about Show/Hide only. Proposed default: they stay in the Reorder list and can be moved. The alternative is to keep them fixed as the first two columns.
* **Column widths and the session.** The layout resets at the next login, but column widths are saved per user (see **Fixture Report - Report Table Listing**). Confirm that this difference is wanted.
* **Tested on the PCER (bctesting, Test PCER, 2026-11-05)** and followed in this story, to be confirmed for the Fixture Report:
  * **Select All with a search active.** It ticked / unticked **all** columns, not only the ones the search listed (AC 3). The alternative is to limit it to the listed columns.
  * **Reorder controls.** The PCER reorder list has **Move to top / up / down / bottom** buttons and **no drag handle** (AC 4). Drag and drop is therefore not in this story; the PCER story allows "drag and drop and/or move controls".
  * **Hidden columns in the Reorder list.** They are listed in their place, with no "hidden" marker (AC 4).
  * **Reset.** It restores the default order at once, closes the panel and does not show hidden columns again (AC 4).
* **A hidden column that has a filter applied.** On the PCER, hiding a column **keeps its filter applied**: the table stayed filtered (4 of 11 rows), and the filter was still active when the column was shown again. Because a hidden column has no filter icon, the user cannot see or remove that filter until the column is shown. Proposed default: same as the PCER. The alternative is to remove the filter when the column is hidden (see **Fixture Report - Table Filters**).
* **Editing the report.** The PCER edit pop-up has no column selection, so the effect of changing **Select required columns** could not be compared. On the PCER, **saving an edit** (nothing changed) and **Refresh** both kept the hidden columns and the applied filter. Proposed default for the Fixture Report when **Select required columns** is changed: a column that is removed also leaves the saved configuration, and a column that is added later appears visible at its default position.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads.

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
