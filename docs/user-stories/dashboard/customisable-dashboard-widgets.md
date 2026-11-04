#### **USER Story:**

**As a user,**
**I should be able to** customise my dashboard by adding, resizing, and removing widgets
**So that** I can view and organise information based on my preferences and priorities.

> The dashboard is **platform-wide**: it is available to every user, not only to Engineering users. This story covers the behaviour common to all widgets. The conditions specific to each widget are in their own stories (see the table at the end).

---

#### **acceptance criteria:**

1. **Widgets instead of fixed sections**

   * The My Dashboard tab must display **widgets** instead of fixed/static sections.

2. **Add Widget**

   * A user must be able to access an **"Add Widget"** option from the dashboard.
   * The "Add Widget" option must display **only the list of available widgets to add**. The available widgets are:
     * **My Tasks**
     * **Map**
     * **Worklogs**
     * **Select Reports**
     * **Voyage Estimate Status**
   * A user must be able to select a widget from the list and add it to the dashboard.

3. **Default widgets**

   * By default, the dashboard must display the existing items (**My Tasks**, **Map** and **Worklogs**) as widgets.
   * Users can delete these widgets at any time.

4. **Group Worklog Dashboard**

   * The **Group Worklog Dashboard** must remain available as part of the existing functionality.

5. **Default size**

   * Newly added widgets must appear on the dashboard in a **default minimum size**.

6. **Resize**

   * Each widget must support **resizing**, allowing the user to increase or decrease its size within defined limits.
   * The system must prevent a widget from being resized **below a minimum allowed size**.

7. **Move**

   * The user must be able to move a widget by dragging it, in the same way as the existing COEMS widgets can be moved.

8. **Delete**

   * Each widget must be able to be removed/deleted from the dashboard.
   * Deleting must behave as deleting the existing COEMS widgets does, including whether a confirmation is asked.

9. **Refresh**

   * Each widget must have a **Refresh** icon for refreshing its data. Refresh reloads that widget only.

10. **Layout**

    * Multiple widgets must be able to coexist on the dashboard **without overlap**.
    * The dashboard layout must **adjust dynamically** when widgets are added, resized or removed.

11. **Persistence**

    * The layout and configuration of the widgets (**position, size and selection**) must persist for the user across sessions. Each user has their own dashboard.
    * The layout is saved automatically on every change.
    * The filters of the **Voyage Estimate Status** widget (ownership option and status) must also be **stored** once the widget is added to the dashboard, and restored when the dashboard is opened again. Deleting the widget discards its stored filters.
    * The filters of the other widgets (for example the My Tasks quick filter or the Worklogs Date Range) are **not** remembered. Those widgets return to their default filters on every load.

12. **Access**

    * What a user can add and see in a widget follows that user's own access only. There is no role-based or group-based widget configuration.

---

#### **Widget-specific stories:**

| **Widget** | **Story** |
| --- | --- |
| My Tasks | [widget-my-tasks.md](widget-my-tasks.md) |
| Map | [widget-map.md](widget-map.md) |
| Worklogs | [widget-worklogs.md](widget-worklogs.md) |
| Select Reports | [widget-select-reports.md](widget-select-reports.md) |
| Voyage Estimate Status | [widget-voyage-estimate-status.md](widget-voyage-estimate-status.md) |

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Dashboard → My Dashboard tab | Fixed sections replaced by user-customisable widgets |
| Add Widget | New option listing the five available widgets |
| Every widget | Default minimum size, resize within limits, move, Refresh icon, delete, per-user persistence of layout and configuration |

---

#### **Out of Scope:**

* The **Group Worklog Dashboard** tab, its widgets and its own **Add Group Worklog Widget** button. It remains as it is today.
* Authoring or editing the reports, charts or data that widgets display.
* Sharing a layout with other users, default layouts per role, and any role-based or group-based widget configuration.
* A "reset dashboard to default" action.
* Automatic or scheduled refresh. Refresh is manual, per widget.
* The exact minimum and maximum widget sizes. They are set at design.

---

#### **To be confirmed:**

* Where the platform-wide Dashboard sits in the navigation for users outside Engineering, and whether My Tasks, Worklogs and Map show the same data for every user.
* Whether the Voyage Estimate Status filters are saved automatically as soon as the user changes them. Proposed: yes.
* The Select Reports details (see [widget-select-reports.md](widget-select-reports.md)).

See `BRD/Dashboard_Widgets_BRD.md` for the full requirements and the open items.
