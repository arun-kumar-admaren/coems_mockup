#### **Fixture Report - Edit Pivot Table**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a user,**
**I want to** view a list of the existing pivot tables in a side panel within the **Pivot Table** tab, open any pivot table by selecting it, and edit an existing pivot table using a **settings (gear) icon**
**So that** I can easily manage, review and modify previously created pivot tables without recreating them from scratch.

> Follows **PCER - Edit Pivot Table (COEMS-14368)**. The pivot table is created in **Fixture Report - Create Pivot Table**; this story covers the **side panel with the list of pivot tables**, how a pivot table is displayed, and **editing** it.

---

#### **acceptance criteria:**

1. **Pivot Table listing in the side panel**

   * The **Pivot Table** tab should display a **side panel on the left** listing all the pivot tables of the selected Fixture Report.
   * Each pivot table in the list should be displayed by its **Pivot Table Name**.
   * The list should support **scrolling** when the number of pivot tables exceeds the visible area.
   * The currently selected pivot table should be **visually highlighted** in the side panel.

2. **Default pivot selection**

   When the **Pivot Table** tab is opened:

   * If **at least one** pivot table exists, the **first pivot** in the list should be **selected by default**, and loaded and displayed automatically in the main content area.
   * If **no** pivot table exists, the main content area should show an **empty state**: *"No pivot data found. Click "Add New" to create a pivot table."*

3. **Selecting a pivot table**

   * Users should be able to click on **any pivot name** in the side panel.
   * On selection:
     * the clicked pivot becomes the **active selection**,
     * the previously selected pivot is **deselected**, and
     * the selected pivot is **loaded and displayed** in the main section.

4. **Pivot table display in the main section**

   * The main section should display the **Pivot Table Name** as the title.
   * The pivot table output should be based on the **saved configuration**, which is the configuration defined at creation or at the last edit: **Filters, Rows, Columns and Values**, including the aggregation of each Value field and the Year / Month choice of each date field.
   * Users can **interact** with the pivot table (**expand / collapse** rows) **without changing the saved configuration**.

5. **Settings (Edit) icon**

   * A **Settings icon** (gear) should be displayed in the **header area of the selected pivot table** in the main section.
   * The Settings icon should be **visible only when a pivot table is selected and displayed**.
   * Clicking the Settings icon opens an **"Edit Pivot Table"** overlay.
   * The overlay opens **on top of the Pivot Table tab**, without navigating away. The background (the pivot list and the pivot table) stays visible but **inactive**.

6. **Edit Pivot Table overlay: pre-populated**

   The overlay has the same layout as **Add New Pivot Table** (Pivot Table Name, the list of fields, the zones Filters, Columns, Rows and Values, the **Close (X)** icon). All the configuration in it must be **pre-populated exactly as saved** at creation or at the last edit:

   * the **same fields**,
   * the **same placement** (Filters / Rows / Columns / Values),
   * the **same order** within each zone, and
   * the **same aggregation** of each Value field and the same **Year / Month** choice of each date field.

7. **Modifying the pivot table**

   Users should be able to modify the pivot configuration by:

   * **adding** new fields,
   * **removing** existing fields,
   * **moving** fields between Filters, Rows, Columns and Values, and
   * **reordering** fields within a zone,

   and to **edit the Pivot Table Name**. The drag and drop, the zone behaviours and the validation rules are those of **Fixture Report - Create Pivot Table**: the name is mandatory, at least one field must be in **Values**, and at least one field must be in **Rows** or **Columns**.

8. **Saving the changes**

   * The overlay has the buttons **Update** and **Cancel**. **Update** must be blocked while a validation rule is not met.
   * Clicking **Update** saves the changes and closes the overlay. The changes must be **reflected immediately**: the pivot table is shown again with the new configuration, the new name appears in the title and in the side panel, and the pivot keeps its place in the list and stays selected.
   * Clicking **Cancel** or the **Close (X)** icon closes the overlay **without any change** to the pivot table.

9. **Users with View permission**

   A user who has only **View** permission on the report (see **Fixture Report - Share Functionality**) can select pivot tables in the side panel and expand / collapse rows, but must **not** see the **Settings** icon.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report → **Pivot Table** tab | Side panel with the list of pivot tables; default selection; highlight; empty state |
| Pivot table main section | Title, saved configuration, expand / collapse without saving |
| Pivot table header | **Settings (gear)** icon |
| **Edit Pivot Table** overlay | Pre-populated; add, remove, move and reorder fields; edit the name; **Update** / **Cancel** |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* Creating a pivot table (**Create Pivot Table**).
* **Deleting** a pivot table. The PCER story does not cover it, and it is not part of this story.
* Renaming a pivot table anywhere other than the **Edit Pivot Table** overlay.
* Exporting the pivot table.

---

#### **To be confirmed:**

* **Buttons of the Edit overlay.** The PCER story does not name them. Proposed default: **Update** and **Cancel**, as in the Edit Chart overlay of the PCER.
* **Order of the list.** The PCER story does not say. Proposed default: the order of creation, oldest first. A new pivot table is added at the end and becomes the selected one.
* **Which pivot is selected when the user returns to the tab.** The PCER story selects the first pivot when the tab is opened. Proposed default: follow the story every time the tab is opened.
* **Expand / collapse state.** Proposed default: it is not saved. A pivot table opens with its rows in the default state, and the state is lost when the user selects another pivot.
* **Filter values chosen on the pivot table.** Whether the values the user picks for a filter field are saved with the pivot (see **Create Pivot Table**). Proposed default: not saved; the pivot opens with all values selected.
* **Validation messages.** Same as in **Create Pivot Table**. Proposed default for an invalid edit: **Update** stays disabled, with the same messages.
* **Delete.** Where and how a pivot table is deleted, and whether it asks for a confirmation as a chart does. Not described in the PCER story.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads.

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
