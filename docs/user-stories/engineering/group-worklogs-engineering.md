#### **USER Story:**

**As a user,**
**I want to** build configurable widgets that summarize logged time across the Engineering team
**So that** managers can see utilization by office, user, or module without exporting timesheets manually.

---

#### **acceptance criteria:**

1. The **Group WorkLogs** sidebar item must open a dashboard-style page of one or more time-tracking widgets. The same dashboard must also be reachable as the **"Group Worklog Dashboard"** tab on the Engineering **Dashboard** page (alongside "My Dashboard" — see "Engineering - My Dashboard") — both are the same underlying feature, not two separate ones.

2. Each widget must show a **Date Range** picker (e.g. "01/08/2026 - 31/08/2026") and an **Update** button to refresh the widget's data for that range.

3. An **"Add Group Worklog Widget"** button must open a form to configure a new widget with: Name, Groups, Users, Offices, Module, Related Item, Categorized By, Period Grouping (e.g. Days), and a metric selector (e.g. Logged Time).

4. Saving the widget form must add the widget to the dashboard, showing logged time broken down according to the chosen grouping and period.

5. A populated widget (e.g. "Group Worklog UES") must render as a table with:
   - A **User** column (one row per user in the widget's configured Groups/Users/Offices scope)
   - A **Total** column showing the aggregate logged time for that user across the selected date range (e.g. "24h 0m")
   - One column per day within the selected date range (e.g. Sat 01 Aug, Sun 02 Aug, Mon 03 Aug, ...), each cell showing that user's logged time for that specific day (e.g. "8h 30m"), left blank for days with no logged time

6. Each existing widget must expose a kebab menu (⋮, top-right of the widget) for widget-level actions (e.g. edit, delete) and a filter (funnel) icon to refine the widget's own data without editing its configuration.

7. If no worklogs exist for the selected Offices/date range, the widget must indicate **"No worklogs available!"** rather than showing an empty chart.
