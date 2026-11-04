#### **USER Story:**

**As a Legal or Chartering user,**
**I want** to report the time logged on legal reviews, by user and by review, in the Group Worklog Dashboard tab of the Chartering Dashboard, with the same widgets as in Engineering
**So that** Legal can see how much time each person spends on each review and track it for its KPIs, without exporting timesheets.

> Client request from Lena Pickenpack and Lukas Krag (UHL), 27.10.2026 call. Lena wants to track time per review for KPIs. The call asked for a work-log overview for reviews like Engineering's Group Worklogs, with a date range, office, group and user filters, and grouping on up to three levels (primary, secondary, tertiary).
>
> The feature already exists as the **Group Worklog Dashboard** tab ([group-worklogs-engineering.md](engineering/group-worklogs-engineering.md), [my-dashboard.md](engineering/my-dashboard.md)), and the Chartering Dashboard already shows it next to My Dashboard. This story adds **Legal Review** as a module that the widgets can report on. Everything else works as it does today.
>
> The logs it reports are the ones added with **Add work log** on a review's task ([legal-review-auto-task-and-work-log.md](legal-review-auto-task-and-work-log.md)).

---

#### **acceptance criteria:**

1. **Where the changes appear**

   * The changes below are made on the existing **Group Worklog Dashboard** tab of the Chartering Dashboard. The tab itself, its **Add Group Worklog Widget** button, the widgets and their kebab menu (⋮) and filter (funnel) icon stay as they are.
   * All existing functionality works as it does today. Only the differences in criteria 2 to 5 apply.

2. **"Legal Review" in the Module list**

   * The **Module** dropdown has a new value, **Legal Review**, next to the existing values (for example Engineering). It is offered in the **Add Group Worklog Widget** form and in each widget's own filter section.
   * When Legal Review is chosen, the widget reports the time logged on legal reviews. That time comes from the logs on each review's task: the ones added with **Add work log** in the review, and any added to that task elsewhere.
   * With any other module chosen, nothing changes.

3. **Related Item lists the legal reviews**

   * When **Module = Legal Review**, the **Related Item** field lists the legal reviews, and several can be selected. Each is shown by its review number, for example `UHL-L-2026-012`.
   * When one or more reviews are selected, the widget reports only the time logged on those reviews. When none is selected, reviews are not restricted, as Related Item works for Engineering today.
   * When the Module is changed, the Related Item selection is cleared, because its list changes.
   * Which reviews appear follows the existing visibility rules of the Legal Review module (criterion 6).

4. **The four grouping fields offer User and Legal Review**

   * **Categorised by**, **Group by**, **Secondary Grouping** and **Tertiary Grouping** share one list of values. When **Module = Legal Review**, all four offer only **User** and **Legal Review**.
   * **User** gives one row per user who logged time. **Legal Review** gives one row per review, shown by review number. They combine through the existing primary, secondary and tertiary grouping, for example Legal Review then User: each review, with the users who logged time on it.
   * **Categorised by** starts on **User**, as it does for Engineering.
   * Nothing blocks a value from being chosen in more than one of the fields, as in Engineering.
   * With any other module chosen, the four fields offer the values they offer today.
   * When the Module is changed, any selection in these four fields that the new module does not offer is cleared.

5. **Everything else works as shown in the Engineering screenshots**

   * **Date Range** works as today: the picker with its presets (Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month, Six Months, Yearly), the two-month calendar, **OK**, and the **Update** button. The **Offices**, **Groups** and **Users** filters (they decide whose logged time is counted), **Period grouping** (for example Days) and **Time Factor** (for example Logged Time) work as today.
   * The table works as today: one column per period across the date range, a **Total** column, a **Grand Total** row, horizontal scrolling, blank cells where nothing was logged, and **"No worklogs available!"** when there is nothing to show. A log counts on the day of its **Date Started**.
   * **Estimation:** for a Legal Review row the Estimation cell is blank, because a review's task carries no estimation.
   * **Cumulative logs**, where that column is shown: for a Legal Review row it is the total ever logged on the review's task, whatever the date range and whoever logged it, as for Engineering. It stays blank when **User** is the only grouping, as for Engineering.
   * The widget's kebab menu works for Legal Review widgets: **Delete Widget**, **Reset Form**, **Save Filter** and **Export Excel**.
     * **Save Filter** stores the Module, Related Item and the four grouping fields with the rest of the filter. Reopening the widget restores them.
     * **Export Excel** contains the same rows and columns as the screen.
   * The funnel icon, resizing and the other existing behaviours are unchanged.

6. **Which reviews a user sees**

   * The existing visibility rules of the Legal Review module apply. A user with the **Legal permission** sees every review. Any other user sees a review only if they raised it, or it was raised by someone from an office they have data access to.
   * Reviews a user cannot see do not appear in **Related Item**, and the time logged on them is not counted in the user's rows, Total or Grand Total.

7. **Engineering widgets are not affected**

   * Existing Engineering widgets, and the Engineering Dashboard and Group WorkLogs page, keep working exactly as they do now.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Group Worklog widget and Add Group Worklog Widget form → Module | New value **Legal Review** |
| Group Worklog widget and form → Related Item | With Legal Review, lists the legal reviews, multi-select |
| Categorised by, Group by, Secondary Grouping, Tertiary Grouping | With Legal Review, all four offer only User and Legal Review |
| Table, totals, filters, Date Range, kebab menu | No change; they work for Legal Review as for Engineering |
| Chartering Dashboard → Group Worklog Dashboard tab | No change; the tab already exists |

---

#### **Out of Scope:**

* Any other new filter, grouping level, Time Factor or module in the widgets.
* How widgets are stored or shared between the Engineering and Chartering tabs, and the Module a new widget starts on. Both stay as today.
* The **Group WorkLogs** sidebar item in the Chartering module.
* The elapsed duration from created to completed that Lena asked for. Still open with the client.
* How logs are recorded on a review's task (separate story).
* How archived or deleted reviews are counted.
* The Worklogs widget on My Dashboard.

---

#### **Open Points:**

None. Every point raised on the first draft has been decided.
