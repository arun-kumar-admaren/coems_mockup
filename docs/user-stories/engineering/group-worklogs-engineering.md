#### **USER Story:**

**As a user,**
**I want to** build configurable widgets that summarize logged time across the Engineering team
**So that** managers can see utilization by office, user, or module without exporting timesheets manually.

---

#### **acceptance criteria:**

1. The **Group WorkLogs** sidebar item must open a dashboard-style page of one or more time-tracking widgets.

2. Each widget must show a **Date Range** picker and an **Update** button to refresh the widget's data for that range.

3. An **"Add Group Working Widget"** button must open a form to configure a new widget with: Name, Groups, Users, Offices, Module, Related Item, Categorized By, Period Grouping (e.g. Days), and a metric selector (e.g. Logged Time).

4. Saving the widget form must add the widget to the dashboard, showing logged time broken down according to the chosen grouping and period.

5. Each existing widget must expose a kebab menu (⋮) for widget-level actions (e.g. edit, delete) and a filter control to refine the widget's own data without editing its configuration.

6. If no worklogs exist for the selected Offices/date range, the widget must indicate **"No worklogs available!"** rather than showing an empty chart.
