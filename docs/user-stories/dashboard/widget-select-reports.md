#### **USER Story:**

**As a user,**
**I want to** add report charts and pivots to my dashboard by choosing a PCE Report and the charts I want from it
**So that** I can keep the figures I care about on my dashboard, without opening the report each time.

> Part of **"Customisable Dashboard Widgets"** (the My Dashboard tab of the platform-wide Dashboard shows widgets instead of fixed sections). This story covers the **Select Reports** widget only. The behaviour common to every widget (default minimum size, resizing within limits, moving, Refresh, Delete, per-user persistence, no overlap) is defined there and applies here too.

---

#### **acceptance criteria:**

1. **Opening the pop-up**

   * The **Add Widget** list on the My Dashboard tab must include **Select Reports**.
   * When the user clicks **Select Reports**, a **pop-up menu** must open. Nothing is added to the dashboard until the user has made a selection in it.

2. **Select PCER**

   * The pop-up must have a **Select PCER** dropdown field.
   * The dropdown must list **all the available PCE Reports**, meaning only the reports the logged-in user has access to.

3. **Select Chart / Pivot**

   * The pop-up must have a **Select Chart / Pivot** dropdown field.
   * It must list **all the available charts inside the selected PCER**.
   * If the selected PCER has **no charts available**, the field must be **empty**.
   * The user must be able to select **multiple** charts.
   * **No duplicates** are allowed: the same chart cannot be selected more than once.

4. **Charts displayed on the dashboard**

   * Once the user has selected the PCER and the charts, the **selected charts must be displayed on the dashboard**.
   * For reference, the **PCER name must appear as a subheading in each chart**.
   * Each chart must appear at its **default minimum size**, without overlapping any other widget.

5. **Can be added again**

   * Unlike My Tasks, Map and Worklogs, the **Select Reports** option is **not** disabled in **Add Widget** after charts have been added. [The story lists the disabling condition for the other three widgets only.] The user can open the pop-up again to add charts from the same or another PCER.

6. **Refresh**

   * Each chart must show a **Refresh** icon in its header. Clicking it must reload that chart's data.
   * Refresh must not change the chart's size or position, and must not reload any other widget.

7. **Resize and move**

   * The user must be able to increase or decrease a chart's size within the defined limits, and must not be able to reduce it below its minimum allowed size.
   * The chart, its title and the PCER subheading must stay readable at minimum size.
   * The user must be able to move a chart by dragging it, in the same way as the existing COEMS widgets can be moved. The other widgets must shift so that nothing overlaps.

8. **Delete and persistence**

   * Each chart must have a delete control that removes it from the dashboard. The remaining widgets must adjust so that no gap or overlap is left.
   * Deleting must behave as deleting the existing COEMS widgets does, including whether a confirmation is asked.
   * The charts on the dashboard (including which PCER each belongs to), and their positions and sizes, must persist for the user across sessions.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| My Dashboard → Add Widget | New **Select Reports** entry that opens a pop-up |
| Select Reports pop-up | **Select PCER** (all available PCE Reports) and **Select Chart / Pivot** (multi-select, no duplicates, empty if the PCER has no charts) |
| My Dashboard → report charts | Each selected chart is shown with its PCER name as a subheading, and is resizable, refreshable and deletable |

---

#### **Out of Scope:**

* Creating, editing or deleting PCE Reports, charts or pivots. Only existing ones are displayed.
* Changing a chart's own filters or configuration from the dashboard.
* Exporting or printing a chart from the dashboard.
* The **Group Worklog Dashboard** tab.

---

#### **To be confirmed:**

* **What PCER / PCE Report stands for**, and what a "Chart / Pivot" is inside it. The terms are used here as written in the source story.
* **One tile per chart, or one widget holding all the charts chosen in a single pop-up.** This story assumes **one tile per chart**, because the PCER name has to appear as a subheading in each chart.
* **How far "no duplicates" reaches.** The story only prevents choosing the same chart twice within the field. Proposed default: it also prevents adding a chart that is already on the dashboard.
* **The pop-up's buttons and behaviour.** Proposed default: **Add** and **Cancel**, with **Add** enabled once a PCER and at least one chart are selected, and the chart selection cleared when the PCER changes.
* **What a chart tile shows if its chart or report is later removed or becomes inaccessible.** Proposed default: an "unavailable" message, with delete still working.
