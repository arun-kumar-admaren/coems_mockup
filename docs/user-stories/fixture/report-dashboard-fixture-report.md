#### **Fixture Report - Report Dashboard**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I want to** add new chart widgets (Bar Chart, Stacked Bar Chart, Pie Chart) to the **Charts** dashboard of a Fixture Report and manage them by dragging, resizing, editing and removing
**So that** I can customise the dashboard layout and view the insights in the format and position I prefer.

> Follows **PCER - Report Dashboard (COEMS-13225)**. The **Charts** sub-tab of the Fixture Report is a dashboard of chart widgets built from the report's table. The fields of each chart are defined in the chart creation stories of the Fixture Report (**Fixture Report - Create Bar Chart**, and the ones for the Stacked Bar Chart and the Pie Chart). The **Pivot Table** has its own sub-tab (see To be confirmed).
> Checked against the Port Call Evaluation Report on bctesting (Test PCER, 2026-11-05): the **Create New** button offers Bar, Stacked Bar and Pie; each widget has a drag handle at the top left, a Settings icon and a trash icon at the top right, and a resize handle at the bottom right.

---

#### **acceptance criteria:**

1. **Add New Widget**

   * The user should be able to click **Create New** on the **Charts** dashboard.
   * The system should display the widget type options under **Create New**:
     * **Bar Chart**
     * **Stacked Bar Chart**
     * **Pie Chart**
   * Selecting a type must open the creation overlay for that chart type. When the user creates the chart, the system should create the selected widget and display it **immediately** on the dashboard.
   * The user should be able to add **multiple** widgets to the dashboard.
   * A new widget must appear at the **top left** of the dashboard, before the older widgets (newest first). The other widgets move to make room, and no widgets overlap.

2. **Widget Container**

   * The system should display each created chart widget inside a **dotted container box**, with the chart name as its title.
   * The system should display a **Delete / Remove icon** (trash icon) in each widget container.
   * The system should display a **Settings icon** in each widget container.
   * The system should display a **drag handle** (tooltip **"Drag chart"**) at the top left of the container, and a **resize handle** at the bottom right corner of the container.

3. **Drag & Drop (Repositioning Widgets)**

   * The user should be able to drag any widget, by its drag handle, and place it in the desired position within the dashboard area.
   * The system should update the widget's position **immediately** after the user drops it.
   * The system should ensure that widgets can be repositioned **independently**, without affecting the content of the other widgets. The widgets must not overlap.

4. **Edit Widget (Settings icon + pre-filled edit overlay)**

   * The user should be able to click the **Settings icon** to edit the widget.
   * Clicking it should open the **same overlay as the one used for adding the chart**, with these differences:
     * The overlay title should be **"Edit Chart"**.
     * All existing chart configuration values should be **pre-filled**: the chart name and the fields of that chart type (for a Bar Chart: Chart Name, X-Axis, Date Group By when the X-Axis is a date, Y-Axis and Aggregation; for a Stacked Bar Chart also Stack By and Display In; for a Pie Chart: Category (Slice By), Value, Aggregation and Year (Filter)).
     * The **chart type cannot be changed**: a Bar Chart stays a Bar Chart.
     * The overlay should provide **Update Chart** and **Cancel** actions.
   * When the user clicks **Cancel**, the system should close the overlay **without applying any changes** to the chart.
   * When the user clicks **Update Chart**, the system should **validate the inputs** (the same rules as when the chart is created) and apply the changes to the widget.
   * The system should keep the widget's layout (**position and size**) unchanged after an edit, unless the user explicitly changes it by dragging or resizing.
   * The fields list of the overlay shows only the columns chosen in **Select required columns**.

5. **Resize Widgets**

   * The user should be able to **resize** any widget using the resize handle on the widget container.
   * The system should resize the widget container dynamically while the user resizes it.
   * The system should automatically adjust the chart content to fit correctly in the new widget size.
   * The system should enforce a **minimum widget size**, so that the chart stays readable and its title and icons stay visible.
   * The system should **save each widget's position and size** after the user moves or resizes it.
   * The system should **restore the saved layout** (position and size of every widget) when the user comes back to the Charts dashboard or refreshes the page.

6. **Remove Widgets**

   * The user should be able to remove a widget by clicking the **trash icon**.
   * The system should display a **confirmation prompt** before removing the widget: **"Are you sure you want to delete this widget?"**, with the buttons **Yes** and **No**.
   * The system should remove the widget from the dashboard **only after** the user confirms with **Yes**. The other widgets then move to close the gap.
   * The system should keep the widget **unchanged** if the user clicks **No**.

7. **Widgets and the report**

   * Each widget is calculated from the rows of the report's table (the report's Date Range). When the report is **refreshed** or **edited**, every widget must be calculated again. Its settings and layout stay the same.
   * A column used by a widget cannot be deselected in **Select required columns** while the widget exists (see **Fixture Report - Edit & Update Report**).

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report → **Charts** tab | **Create New** with Bar, Stacked Bar and Pie; dashboard of chart widgets |
| Chart widget | Dotted container, drag handle, resize handle, Settings icon, trash icon |
| Edit Chart overlay | Same overlay as creation, pre-filled, **Update Chart** / **Cancel** |
| Delete prompt | "Are you sure you want to delete this widget?" Yes / No |
| Layout | Position and size of each widget saved and restored |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* The fields, validations and look of each chart type (Bar, Stacked Bar, Pie), the tooltips, and grouping dates by month or year (the chart creation story).
* The **Pivot Table** sub-tab.
* The **Reports** sub-tab (the table).
* Exporting or printing a chart, and putting a chart on the My Dashboard widgets.

---

#### **To be confirmed:**

* **Pivot Table as a widget.** The PCER story lists **Pivot Table** among the widgets added under Add New on the Charts dashboard. On the PCER as built, **Create New** offers only the three charts, and the pivot tables are on their own **Pivot Table** sub-tab. This story follows the build. Confirm, or whether pivot tables should be widgets of this dashboard too.
* **Button name.** The PCER story says **Add New**; the PCER screen shows **Create New**. This story uses **Create New**.
* **Who sees and changes the layout.** The PCER story does not say whether the layout belongs to the report or to each user. Proposed default: the layout is part of the **report**, so everyone with access sees it; **Edit** users and the owner can drag, resize, edit and delete widgets, and **View** users can only look (see **Fixture Report - Share Functionality**).
* **Minimum and default size.** The PCER story gives no values. Define the minimum width and height, the default size, and how many widgets fit in a row.
* **Number of widgets.** Whether to limit the number of charts in one report.
* **Empty dashboard.** The message shown when the report has no charts yet. Proposed default: *"No charts created yet. Click "Create New" to generate your first chart."*
* **Delete.** Whether deleting a chart is blocked, or only confirmed, when it is shown on the My Dashboard widgets (not applicable until that is built for Fixture Reports).

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (drag and resize behaviour on small screens).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
