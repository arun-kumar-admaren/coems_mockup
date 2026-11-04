#### **USER Story:**

**As a user,**
**I want to** add a **Worklogs** widget to my dashboard with a single click, showing this month's worklogs and letting me change the date range
**So that** I can see how my time has been logged without leaving the dashboard.

> Part of **"Customisable Dashboard Widgets"** (the My Dashboard tab of the platform-wide Dashboard shows widgets instead of fixed sections). This story covers the **Worklogs** widget only. The behaviour common to every widget (default minimum size, resizing within limits, moving, Refresh, Delete, per-user persistence, no overlap) is defined there and applies here too.
>
> The **Group Worklog Dashboard** tab and its widgets are a different feature and are unchanged.

---

#### **acceptance criteria:**

1. **Adding the widget**

   * The **Add Widget** list on the My Dashboard tab must include **Worklogs**.
   * When the user clicks **Worklogs**, the widget must be **added to the dashboard directly**, with no pop-up and no configuration step.
   * The new widget must appear at its **default minimum size**, without overlapping any other widget.

2. **Current month shown initially**

   * When the widget is added, it must show the user's worklogs for the **current month**. For example, in October 2026 the Date Range field reads "01/10/2026 - 31/10/2026".

3. **Date range selected from the existing filter**

   * Once added, the user must be able to change the range with the **existing Date Range filter**. Clicking the field opens a range picker that offers:
     * Quick presets: **Today**, **Yesterday**, **Last 7 Days**, **Last 30 Days**, **This Month**, **Last Month**
     * A two-month calendar for choosing a custom range
     * An **OK** button to confirm
   * After the user confirms a range, the widget must show the worklogs for that range.
   * The selected range is **not remembered**. Each time the dashboard loads, the widget returns to the current month.

4. **Existing content retained**

   * The widget must keep the existing sub-tabs **Related Items**, **Tasks**, **Sub Tasks** and **Total**.
   * It must keep the table with one column per day of the selected range (e.g. Sat 01 Aug, Sun 02 Aug, Mon 03 Aug ...). The table scrolls horizontally inside the widget.
   * [Not confirmed: what the day cells show and the row structure under each sub-tab, because no worklog data was present when the current page was documented. The widget must behave exactly as the existing Worklogs panel does.]

5. **Disabled in "Add Widget" once added**

   * Once Worklogs is on the dashboard, its option in **Add Widget** must be **disabled**, so only one Worklogs widget can exist.
   * If the widget is deleted, the option must become **enabled** again.

6. **Shown by default**

   * For a user who has not customised the dashboard, Worklogs must appear as a widget by default. The user can delete it at any time.

7. **Refresh**

   * The widget header must show a **Refresh** icon. Clicking it must reload the worklogs for the Date Range currently selected, and keep the active sub-tab.
   * Refresh must not change the widget's size or position, and must not reload any other widget.

8. **Resize and move**

   * The user must be able to increase or decrease the widget's size within the defined limits, and must not be able to reduce it below its minimum allowed size.
   * At minimum size, the Date Range field and the sub-tabs must remain usable. The day-by-day table scrolls inside the widget when it does not fit.
   * The user must be able to move the widget by dragging it, in the same way as the existing COEMS widgets can be moved. The other widgets must shift so that nothing overlaps.

9. **Delete and persistence**

   * The widget must have a delete control that removes it from the dashboard. The remaining widgets must adjust so that no gap or overlap is left.
   * Deleting must behave as deleting the existing COEMS widgets does, including whether a confirmation is asked.
   * Whether Worklogs is on the dashboard, and its position and size, must persist for the user across sessions.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| My Dashboard → Add Widget | New **Worklogs** entry; added in one click; disabled while the widget is on the dashboard |
| My Dashboard → Worklogs widget | Existing Worklogs panel (Date Range filter, sub-tabs, day table) hosted inside a resizable, refreshable, deletable widget; opens on the current month |

---

#### **Out of Scope:**

* Any change to how worklogs are logged or calculated.
* The **Group Worklog Dashboard** tab, its Estimation and Cumulative logs columns, and its column resizing.
* Exporting worklogs from this widget.
