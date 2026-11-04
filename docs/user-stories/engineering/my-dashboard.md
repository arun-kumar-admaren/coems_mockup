#### **USER Story:**

**As an engineering user,**
**I want to** land on a personal dashboard showing my tasks, a live vessel map, and my logged work
**So that** I can see what I need to do today and how my time has been spent, without navigating into the listing or task tracker first.

---

#### **acceptance criteria:**

1. The **Dashboard** sidebar item (top entry in the Engineering module's sidebar) must open a page with two tabs: **"My Dashboard"** (default/active) and **"Group Worklog Dashboard"**. The Group Worklog Dashboard tab shows the same widget-based dashboard as the standalone **Group WorkLogs** sidebar item (same "Add Group Worklog Widget" button, same per-user/per-day table) — see "Engineering - Group WorkLogs" for full detail; it is one feature reachable from two navigation points, not two separate features.

2. The **My Dashboard** tab must show a **"My Tasks"** panel with:
   - Quick filter buttons: **All** (default/active), **Today**, **Tomorrow**
   - A sort dropdown (default: **"Due Date - Ascending"**) with the following options: Due Date - Ascending, Due Date - Descending, Priority - Highest to Lowest, Priority - Lowest to Highest, Task No - Ascending, Task No - Descending, Task Name - Ascending, Task Name - Descending
   - An empty state reading **"No tasks assigned to you!"** when no tasks match the current filter [the populated/non-empty state was not observed in this pass]

3. The My Dashboard tab must show an embedded **vessel map** (Google Maps) with:
   - Live vessel positions plotted worldwide as markers, each labelled with a short vessel code/callsign
   - A fullscreen expand control in the top-right corner of the map
   - Standard Google Maps controls/attribution (zoom, "Keyboard shortcuts", "Map data", "Terms")

4. Hovering a vessel marker on the map must show an info card with: **Vessel Name** (e.g. "TOMINI PAMPERO"), **IMO** number, **Type** (e.g. "DRY BULK"), **Destination**, **ETA** (date/time), **Speed** (in Kn), **Course** (in degrees), **Status** (e.g. "AT ANCHOR"), a source note (**"Updated from Terrestrial"**), a **Last Updated** timestamp, and a close (✕) control.

5. The My Dashboard tab must show a **"Worklogs"** panel with:
   - A **Date Range** field (default shown as the current month, e.g. "01/08/2026 - 31/08/2026") that opens a range picker on click, offering quick presets (**Today**, **Yesterday**, **Last 7 Days**, **Last 30 Days**, **This Month**, **Last Month**), a two-month calendar grid for custom range selection, and an **OK** button to confirm.
   - Sub-tabs: **Related Items**, **Tasks**, **Sub Tasks**, **Total**
   - A horizontally-scrollable table with one column per day across the selected date range (e.g. Sat 01 Aug, Sun 02 Aug, Mon 03 Aug, ...). [Not observed in this pass: what populates the day-column cells (e.g. hours logged that day) or the row structure under Related Items/Tasks/Sub Tasks/Total, since no worklog data was present.]
