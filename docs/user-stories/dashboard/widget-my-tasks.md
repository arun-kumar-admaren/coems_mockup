#### **USER Story:**

**As a user,**
**I want to** add a **My Tasks** widget to my dashboard with a single click, with all the existing task filters available inside it
**So that** I can see the tasks assigned to me and narrow them down to what matters today, without leaving the dashboard.

> Part of **"Customisable Dashboard Widgets"** (the My Dashboard tab of the platform-wide Dashboard shows widgets instead of fixed sections). This story covers the **My Tasks** widget only. The behaviour common to every widget (default minimum size, resizing within limits, moving, Refresh, Delete, per-user persistence, no overlap) is defined there and applies here too.

---

#### **acceptance criteria:**

1. **Adding the widget**

   * The **Add Widget** list on the My Dashboard tab must include **My Tasks**.
   * When the user clicks **My Tasks**, the widget must be **added to the dashboard directly**, with no pop-up and no configuration step.
   * The new widget must appear at its **default minimum size**, without overlapping any other widget.

2. **All existing filters available in the widget**

   The widget must offer every filter of the existing My Tasks panel:

   * Quick filter buttons: **All** (default/active), **Today**, **Tomorrow**
   * A sort dropdown, default **"Due Date - Ascending"**, with these options: Due Date - Ascending, Due Date - Descending, Priority - Highest to Lowest, Priority - Lowest to Highest, Task No - Ascending, Task No - Descending, Task Name - Ascending, Task Name - Descending
   * When no tasks match the current filter, the empty state **"No tasks assigned to you!"**

3. **Disabled in "Add Widget" once added**

   * Once My Tasks is on the dashboard, its option in **Add Widget** must be **disabled**, so only one My Tasks widget can exist.
   * If the widget is deleted, the option must become **enabled** again.

4. **Shown by default**

   * For a user who has not customised the dashboard, My Tasks must appear as a widget by default. The user can delete it at any time.

5. **Refresh**

   * The widget header must show a **Refresh** icon. Clicking it must reload the user's tasks, keeping the currently selected quick filter and sort.
   * Refresh must not change the widget's size or position, and must not reload any other widget.

6. **Resize and move**

   * The user must be able to increase or decrease the widget's size within the defined limits, and must not be able to reduce it below its minimum allowed size.
   * At minimum size, the quick filters, the sort dropdown and the task list must remain usable. The task list scrolls inside the widget when it does not fit.
   * The user must be able to move the widget by dragging it, in the same way as the existing COEMS widgets can be moved. The other widgets must shift so that nothing overlaps.

7. **Delete and persistence**

   * The widget must have a delete control that removes it from the dashboard. The remaining widgets must adjust so that no gap or overlap is left.
   * Deleting must behave as deleting the existing COEMS widgets does, including whether a confirmation is asked.
   * Whether My Tasks is on the dashboard, and its position and size, must persist for the user across sessions.

8. **Filters are not remembered**

   * The quick filter and the sort are not saved. On every load the widget returns to **All** and **Due Date - Ascending**.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| My Dashboard → Add Widget | New **My Tasks** entry; added in one click; disabled while the widget is on the dashboard |
| My Dashboard → My Tasks widget | Existing My Tasks panel (quick filters, sort, empty state) hosted inside a resizable, refreshable, deletable widget |

---

#### **Out of Scope:**

* Any new My Tasks filter, sort option or column. The widget carries only what the existing panel already has.
* The **Group Worklog Dashboard** tab.
* Task Tracker, the task detail overlay and task creation.
