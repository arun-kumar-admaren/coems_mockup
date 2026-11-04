#### **USER Story:**

**As a user viewing a Group Worklog widget,**
**I want to** see the overall time logged to date against each row's lowest Engineering entity, next to its Estimation, and choose whether the Estimation and Cumulative logs columns are shown
**So that** I can compare the planned effort with the actual effort spent so far, and keep the table compact when I don't need those columns.

> Builds on **COEMS-19497 "Engineering - Show Estimates in Group Worklogs & Export reports"**, which added the **Estimation** column to the Group Worklog table. This story adds a **Cumulative logs** column beside it and two checkboxes to show/hide the two columns. It also amends COEMS-19497 AC 2: Estimation is still positioned before "Total", but is now followed by Cumulative logs (see AC 1 below).

---

#### **acceptance criteria:**

1. **New "Cumulative logs" column**

   A new column named **"Cumulative logs"** must be displayed in the Group Worklog table, positioned **immediately after "Estimation" and immediately before "Total"**:

   `… | Subtask | Estimation | Cumulative logs | Total | <period columns> …`

2. **Lowest Engineering entity per row**

   Cumulative logs must be determined from the **lowest Engineering hierarchy entity represented by each row**, using the same hierarchy and the same "lowest grouping level" rule as Estimation (COEMS-19497):

   | **Lowest Grouping Level** | **Cumulative logs Displayed** |
   | --- | --- |
   | Engineering | Overall time logged against the Engineering |
   | Engineering Type | Overall time logged against the Engineering Type |
   | Task | Overall time logged against the Task |
   | Subtask | Overall time logged against the Subtask |

   The value for a parent entity includes the time logged against everything beneath it (e.g. a Task's value includes its Subtasks, an Engineering Type's value includes all its Tasks and Subtasks).

   This is the same figure already shown in the Detail Overlay: for a **Task** row it must equal the Task's **"Cumulative Time"** (its own logged time plus all its Subtasks' — e.g. ETSK-6119: Time Tracking 3h 45m, Cumulative Time 64h 0m), and for a **Subtask** row it must equal the Subtask's **"Time Tracking"** (a Subtask has no Cumulative Time field, e.g. ETSK-7370: 2h 30m). The Group Worklog and the overlays must never disagree.

3. **"Overall … till date" — independent of the Date Range**

   Cumulative logs must be the **total of all time logged against the entity from the beginning up to today**. It does **not** depend on the selected Date Range or Period Grouping — changing the Date Range changes the "Total" and the period columns but never the Cumulative logs value of a row.

4. **Counts everyone's time**

   Cumulative logs must include time logged by **all users**, not only the users in the widget's current filter. Offices, Groups and Users filters decide **which rows are listed**, but never reduce the Cumulative logs value shown on a row. (This keeps it directly comparable with the entity's Estimation, which also covers the whole entity.)

5. **User-only categorisation**

   When **User** is the only selected categorisation and no Engineering hierarchy grouping is applied, the Cumulative logs column must remain **blank** (there is no Engineering entity on the row) — the same behaviour as Estimation.

6. **Format and refresh**

   * Cumulative logs must use the same time format as the "Total" column (e.g. `6h 30m`).
   * The Grand Total row must show a Cumulative logs total, calculated in the same way as the Grand Total of the Estimation column.
   * Values must refresh automatically whenever the user changes the report grouping (Group By, Secondary Grouping, Tertiary Grouping), Categorised By, Module, Related Item, or any filter that changes which rows are listed.

7. **"Show Estimation" and "Show Cumulative logs" checkboxes**

   * The widget's filter section must display two checkboxes — **"Show Estimation"** and **"Show Cumulative logs"** — on the same line as the **Date Range** field, immediately next to the **Update** button.
   * They must always be visible on that line (not hidden inside the expanded filter panel opened by the funnel icon).
   * Each Group Worklog widget has its own pair of checkboxes, alongside its own Date Range and Update button.

8. **Default state**

   When a widget is opened and the user has **not** saved a filter for it (see AC 11), **"Show Estimation" is ticked** and **"Show Cumulative logs" is unticked**, so the table looks as it does today until the user ticks "Show Cumulative logs".

9. **Show/hide behaviour**

   * Ticking a checkbox shows its column; unticking hides it. The change applies **immediately** to the table — the user does not need to click Update, and the widget's data is not reloaded.
   * Hidden columns must not leave a blank gap — the remaining columns close up. With both unticked, "Total" follows directly after "Subtask".
   * The two checkboxes are independent: either column can be shown without the other, and the column order from AC 1 is kept whichever are visible.
   * Showing or hiding the columns has no effect on the Total, the period columns, the Grand Total row, or the filters.

10. **Export mirrors the screen**

    When the Group Worklog report is exported (**Export Excel** in the widget's kebab menu), the export must include exactly the columns currently visible on screen. If "Show Estimation" or "Show Cumulative logs" is unticked, that column must be left out of the export; if ticked, it must be included, in the same position and format as on screen.

11. **Saved only through "Save Filter"**

    * The state of the two checkboxes must **not** be saved automatically. It is saved **only when the user clicks "Save Filter"** in the widget's kebab menu (⋮ → Delete Widget / Reset Form / **Save Filter** / Export Excel).
    * "Save Filter" must store the state of both checkboxes together with the widget's other saved filter settings. When the widget is opened later, it must restore the saved state of the checkboxes (and therefore of the two columns).
    * If the user changes a checkbox but does not click "Save Filter", the change applies only to the current view — after the page is reloaded or the widget is reopened, the last saved state (or the default from AC 8, if nothing was ever saved) applies again.
    * "Save Filter" applies to the widget it is clicked on; other widgets' saved checkbox states are unaffected.
    * "Reset Form" must return both checkboxes to their default state (AC 8) along with the rest of the filter form; it does not change the saved state until the user clicks "Save Filter" again.
---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Group Worklog widget → table | New "Cumulative logs" column between "Estimation" and "Total", with Grand Total |
| Group Worklog widget → filter section | New "Show Estimation" and "Show Cumulative logs" checkboxes next to the Date Range / Update button |
| Group Worklog widget → kebab menu | "Save Filter" also saves the two checkboxes; "Reset Form" returns them to default; "Export Excel" follows the visible columns |

---

#### **Out of Scope:**

* Changing how Estimation values are derived or displayed (COEMS-19497) beyond the show/hide checkbox and the new column order.
* Saving the checkbox selection by any means other than "Save Filter" — no auto-save, and it is not part of the widget's configuration form ("Add Group Worklog Widget" / edit).
* Any new filter, grouping, or Time Factor option.
