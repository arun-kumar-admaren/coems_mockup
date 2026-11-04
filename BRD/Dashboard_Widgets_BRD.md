# Business Requirements Document
## Dashboard — Customisable Widgets — COEMS Platform

**Document Reference:** COEMS-DASH-BRD-001  
**Version:** 1.2  
**Date:** 2026-10-13  
**Status:** Draft — items marked **[TBC]** are proposed defaults not yet confirmed with the product owner; see §7.2.  
**Project:** COEMS (Commercial Operations & Enterprise Management System)  
**Parent Module:** Platform Dashboard (first documented from the Engineering module — see COEMS-ENG-BRD-001, `BRD/Engineering_Module_BRD.md`)  
**Related User Stories:** Customisable Dashboard Widgets and one story per widget (see §9); baseline: [my-dashboard.md](../docs/user-stories/engineering/my-dashboard.md)

---

## 1. Description

The COEMS **Dashboard** page opens on a **My Dashboard** tab that today is a fixed page: a **My Tasks** panel, a live vessel **Map** and a **Worklogs** panel, always in the same place, always the same size, with no way to remove or add anything. Every user sees the same page whether or not they use all of it. The page was documented from the Engineering module's sidebar, but this BRD treats it as a **platform-wide dashboard**, available to every user and not only to Engineering users.

This enhancement turns My Dashboard into a **personal, widget-based canvas**. Each existing section becomes a widget, and users can add further widgets, resize them within limits, refresh them individually and remove the ones they do not need. Each user's arrangement is remembered across sessions.

The enhancement enables:

- A dashboard organised around what each user actually works with, rather than one fixed layout for everyone
- Five widget types: **My Tasks**, **Map**, **Worklogs**, **Select Reports** (charts and pivots from a chosen PCE Report) and **Voyage Estimate Status** (a list of Voyage Estimates, filterable by Mine / Office / All and by Status)
- Per-widget resizing within a defined minimum and maximum, and moving by dragging, with no overlap between widgets
- Per-widget **Refresh** and **Delete**
- A layout (which widgets, where, how big) that persists per user across sessions
- Availability to every user across the platform, with what each user sees decided by that user's own access
- Report charts and pivots on the landing page, so users no longer need to navigate into a report to see the figures they care about most

This BRD covers the **My Dashboard** tab only. The **Group Worklog Dashboard** tab and its own widgets are unchanged (see FR-9).

---

## 2. Key Components

### 2.1 Current Behaviour (Baseline)

Taken from the existing *Engineering – My Dashboard* story (documented from UAT). It was not re-verified on UAT for this BRD.

| Area | Current behaviour |
|---|---|
| Entry point | The **Dashboard** item at the top of the Engineering sidebar (the only place it has been documented) opens a page with two tabs: **My Dashboard** (default) and **Group Worklog Dashboard**. |
| My Dashboard layout | Three fixed sections: **My Tasks** panel, embedded vessel **Map**, **Worklogs** panel. They cannot be resized, removed, hidden or rearranged. |
| My Tasks | Quick filters **All** (default) / **Today** / **Tomorrow**; sort dropdown (default *Due Date - Ascending*) with eight options; empty state *"No tasks assigned to you!"*. |
| Map | Google Maps with live vessel markers worldwide, hover info card (Vessel Name, IMO, Type, Destination, ETA, Speed, Course, Status, source note, Last Updated), fullscreen control. |
| Worklogs | Date Range field (default current month) with presets and calendar; sub-tabs **Related Items / Tasks / Sub Tasks / Total**; horizontally scrollable table with one column per day. |
| Group Worklog Dashboard tab | The same widget-based dashboard as the standalone **Group WorkLogs** sidebar item, with its own **Add Group Worklog Widget** button. |
| Refresh | No per-section refresh control. |
| Persistence | Nothing to persist; the layout is fixed. |

### 2.2 Target Behaviour

My Dashboard shows a canvas of widgets. A user who has never customised it sees **My Tasks, Map and Worklogs** as widgets, arranged to resemble today's page. From there they can:

1. Open **Add Widget** and pick from the five widget types (single-instance types are greyed out once added)
2. Drag a widget's resize handle to make it larger or smaller, within limits, and drag the widget itself to move it
3. Click **Refresh** on a widget to reload only that widget's data
4. Click **Delete** on any widget, including the three defaults, to remove it
5. Return later, on any device, and find the dashboard exactly as they left it

### 2.3 Functional Requirements

Items marked **[TBC]** are not stated in the user story. They are proposed defaults listed in §7.2.

#### FR-1 Widget-Based Dashboard

- The My Dashboard tab renders widgets instead of fixed sections.
- **Default content:** for a user who has not customised the dashboard, My Tasks, Map and Worklogs appear as widgets. They are ordinary widgets and can be resized, refreshed and deleted like any other.
- **Voyage Estimate Status** is **not** part of the default content. Select Reports is not either. **[TBC]**
- Every widget has a **header** showing its title, a **Refresh** icon and a **Delete** control, and a **resize handle**. Widget-specific controls (filters, sub-tabs) sit in the body.
- If the user deletes every widget, the dashboard shows an empty state with a prompt to use **Add Widget**. **[TBC]**

#### FR-2 Add Widget

- An **Add Widget** control is available on the My Dashboard tab (proposed: top-right of the tab header). **[TBC]** It is not shown on the Group Worklog Dashboard tab, which keeps its own **Add Group Worklog Widget** button.
- Clicking it opens a list showing **only the widgets that can be added**, in this order:
  1. My Tasks
  2. Map
  3. Worklogs
  4. Select Reports
  5. Voyage Estimate Status
- The list contains nothing else: no navigation items, no Group Worklog widgets.
- **My Tasks, Map and Worklogs** are single-instance. Once on the dashboard, their entry in the list is **disabled**. It becomes enabled again when the widget is deleted.
- **Voyage Estimate Status** is single-instance in the same way.
- **Select Reports** is **not** disabled after use, because it can be added repeatedly for different reports and charts (see 2.4.4).
- Selecting **My Tasks, Map, Worklogs or Voyage Estimate Status** adds the widget directly with no further input. Selecting **Select Reports** opens a pop-up first.
- The list closes after a selection.

#### FR-3 Default Size and Placement of a New Widget

- A newly added widget appears at the **default minimum size** for its type.
- It is placed in the first free position without overlapping any other widget (proposed: scanning left-to-right, top-to-bottom). **[TBC]**
- If that position is below the visible area, the dashboard scrolls the new widget into view. **[TBC]**

#### FR-4 Resizing

- Every widget can be resized by the user to **increase or decrease** its size within defined limits.
- **Minimum:** a widget cannot be resized below the minimum allowed size for its type. The handle stops at the minimum.
- **Maximum:** a widget cannot be enlarged beyond a defined limit.
- The exact minimum and maximum sizes for each widget type, and the default first-load arrangement, are **not specified in this BRD**. They are set at design.
- While resizing, widget content must stay usable:
  - Tables and the Worklogs day grid scroll within the widget
  - Charts and the map scale to the new space
  - Controls are never clipped at or above the minimum size
- The new size is saved (FR-8).

#### FR-5 Layout and Overlap

- Multiple widgets coexist on the dashboard and **never overlap**.
- The layout **adjusts dynamically** when a widget is added, resized or removed: other widgets are shifted so that no overlap occurs, and the gap left by a removed widget is closed. **[TBC]** (proposed: vertical compaction)
- The layout adapts to the browser width, and widgets reflow rather than overlap or clip at narrower widths. **[TBC]**
- A widget can be **moved by dragging** it to a new position, following the behaviour of the existing COEMS widgets. Other widgets shift so that nothing overlaps, and the new position is saved (FR-8).

#### FR-6 Removing a Widget

- Every widget, including the three defaults, has a **Delete** control and can be removed at any time.
- Removal takes effect immediately, the layout reflows (FR-5) and the change is saved (FR-8).
- A single-instance widget's entry in **Add Widget** is re-enabled.
- Deleting follows the same behaviour as deleting the existing COEMS widgets, including whether a confirmation prompt appears.
- Deleting a widget removes only its place on this user's dashboard. The underlying data (tasks, worklogs, vessels, reports, voyage estimates) is untouched.
- A widget that is re-added comes back at its default minimum size with default settings. It does not remember its earlier state.

#### FR-7 Refresh

- Every widget has a **Refresh** icon in its header.
- Refresh reloads **only that widget's data**, using the widget's current filters or selection. It does not change size, position or configuration, and does not reload other widgets.
- A loading indicator is shown while refreshing. If the reload fails, the widget shows an inline error with a retry option and keeps its last data visible. **[TBC]**
- For Select Reports, each chart tile has its own Refresh.

#### FR-8 Persistence

- The dashboard's **layout and configuration** are saved per user and restored on the next session, including when the user signs in from a different browser or device:

| Persisted | Detail |
|---|---|
| Which widgets are on the dashboard | Including each Select Reports chart tile and its PCER |
| Position | Of every widget |
| Size | Of every widget |
| Voyage Estimate Status filters | Ownership option and status |

- Changes are saved **automatically** when a widget is added, resized, moved or removed. There is no separate "Save layout" action.
- Each user has their own dashboard. One user's changes never affect another's.
- A user with no saved layout sees the default content (FR-1).
- **Voyage Estimate Status filters are stored once the widget is added.** From the moment the widget is on the dashboard, its ownership option and status are part of the saved configuration. They start at **Mine** and **All**, are updated as the user changes them, and are restored in later sessions. Deleting the widget discards its stored filters. **[TBC]** (saved automatically as soon as the user changes them; see §7.2, item 3)
- **The filters of the other widgets are not stored.** My Tasks (quick filter and sort) and Worklogs (Date Range) return to their defaults on each load (Worklogs: current month).
- If the same user has the dashboard open in two sessions, the most recent save wins. **[TBC]**

#### FR-9 Group Worklog Dashboard Unchanged

- The **Group Worklog Dashboard** tab, its **Add Group Worklog Widget** button, its widgets and its kebab-menu actions (Delete Widget, Reset Form, Save Filter, Export Excel) are unchanged.
- The same feature remains reachable from the **Group WorkLogs** sidebar item.
- Group Worklog widgets are not offered in the new **Add Widget** list.

#### FR-10 Platform-Wide Availability and Access

- The dashboard is **platform-wide**. It is available to every COEMS user who can open the Dashboard, not only to Engineering users.
- Access is **user-based only**. What a user can add and see in a widget follows that user's own access to the underlying data. There is no role-based or group-based widget configuration.
- **Select Reports:** the Select PCER dropdown lists only the PCE Reports the user has access to, and Select Chart / Pivot offers only charts from those reports.
- Where the Dashboard sits in the navigation for users outside Engineering is not specified here (§7.2, item 1).

### 2.4 Widget Catalogue

| Widget | How it is added | Once added | Instances |
|---|---|---|---|
| My Tasks | Click — added directly | Option disabled in Add Widget | One |
| Map | Click — added directly | Option disabled in Add Widget | One |
| Worklogs | Click — added directly | Option disabled in Add Widget | One |
| Select Reports | Click — pop-up opens | Option stays enabled | Many |
| Voyage Estimate Status | Click — added directly | Option disabled in Add Widget | One |

#### 2.4.1 My Tasks

- Carries **all existing filters** of the current My Tasks panel:
  - Quick filters **All** (default), **Today**, **Tomorrow**
  - Sort dropdown, default **Due Date - Ascending**; the eight options are Due Date (Ascending/Descending), Priority (Highest to Lowest / Lowest to Highest), Task No (Ascending/Descending), Task Name (Ascending/Descending)
- Empty state: **"No tasks assigned to you!"**
- **Refresh** reloads the user's tasks, applying the current quick filter and sort.
- The quick filter and sort are **not** stored. The widget returns to **All** and **Due Date - Ascending** on every load (FR-8).

#### 2.4.2 Map

- Shows the existing embedded vessel map:
  - Live vessel markers
  - Hover info card
  - Fullscreen control
  - Standard map controls
- Fullscreen continues to work at any widget size.
- **Refresh** reloads vessel positions.
- This is the My Dashboard map, **not** the separate **Map (BETA)** sidebar page.

#### 2.4.3 Worklogs

- **Initial state:** the worklogs for the **current month** are shown. The range the user selects is **not** stored, so the widget returns to the current month on every load (FR-8).
- The user selects a different range with the **existing Date Range filter**: presets (Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month), a two-month calendar for a custom range, and **OK**.
- The existing sub-tabs (**Related Items, Tasks, Sub Tasks, Total**) and the day-by-day table are retained. The table scrolls horizontally inside the widget.
- **Refresh** reloads the worklogs for the currently selected Date Range.

#### 2.4.4 Select Reports

Clicking **Select Reports** opens a pop-up. It does not add a widget until the user confirms.

| Field | Type | Behaviour |
|---|---|---|
| Select PCER | Single-select dropdown | Lists **all the available PCE Reports**, meaning only those the user has access to. |
| Select Chart / Pivot | **Multi-select** dropdown | Lists all available charts inside the **selected PCER**. If the PCER has no charts, the field is **empty**. The user can select **several** charts. **No duplicates are allowed.** |

- Once confirmed, the selected charts are displayed on the dashboard. Each chart shows the **PCER name as a subheading**, for reference.
- Each selected chart is shown as its **own tile** (widget). It has its own title (the chart name), Refresh, Delete and resize handle, and follows FR-3 to FR-8 individually. **[TBC]**
- The pop-up has **Add** and **Cancel** actions. **Add** is enabled only once a PCER and at least one chart are selected. Changing the PCER clears the chart selection. **[TBC]**
- **No duplicates:** the same chart cannot be selected twice. This applies across the whole dashboard, so a chart already on the dashboard cannot be added again. **[TBC]**
- Select Reports remains available in **Add Widget** after use, so the user can add charts from the same or another PCER later.

#### 2.4.5 Voyage Estimate Status

An additional widget requested alongside the story. Clicking **Voyage Estimate Status** adds a box that **lists Voyage Estimates**, with an ownership filter and a status filter.

- Appears in **Add Widget** as **Voyage Estimate Status**.
- **Added directly on click.** There is no pop-up and no configuration step.
- Shows a **list of Voyage Estimates**. It **scrolls** inside the widget. There is no paging.

| Filter | Type | Options | Default |
|---|---|---|---|
| Ownership | Toggle button group (one active) | **Mine**, **Office**, **All** | Mine |
| Status | Dropdown | **All**, **Preplanning**, **Firm**, **Ready to Transfer**, **Transferred** | All |

- **Mine** shows estimates **created by the logged-in user**. **Office** shows estimates created by users in **every office the logged-in user belongs to**. **All** shows every estimate.
- Choosing a status lists only estimates currently in that status. **All** shows every status.
- **The two filters apply together**, for example *Office* with *Firm* shows only the Firm estimates created by users in any office the user belongs to.
- When nothing matches, the widget shows an empty state, for example "No voyage estimates found". **[TBC]**
- List columns: **Estimate Number, Estimate Name, Vessel Name, Status, Created By**.
- Clicking an **Estimate Number** opens that Voyage Estimate's record.
- **Refresh** reloads the list, keeping the selected ownership option and status.
- The selected ownership option and status are stored for the user once the widget is added, and restored in later sessions (FR-8).
- Single-instance and not on the default dashboard. All common rules (FR-3 to FR-8) apply.

### 2.5 Business Rules Summary

| # | Rule |
|---|---|
| BR-1 | My Dashboard is widget-based. The three existing sections are its default widgets. |
| BR-2 | Add Widget lists only the five widget types. Group Worklog widgets are not part of it. |
| BR-3 | My Tasks, Map and Worklogs are single-instance. Once added, they are disabled in Add Widget until deleted. Voyage Estimate Status follows the same rule. |
| BR-4 | Select Reports is repeatable. Its PCER dropdown lists all available PCE Reports the user has access to. Its Chart / Pivot dropdown is multi-select, empty if the PCER has no charts, and allows no duplicates. |
| BR-5 | Each Select Reports chart displays its PCER name as a subheading. |
| BR-6 | A new widget appears at its default minimum size. |
| BR-7 | A widget can never be resized below its minimum allowed size. |
| BR-8 | Widgets never overlap. The layout reflows on add, resize and remove. |
| BR-9 | Every widget can be refreshed and deleted. Refresh affects that widget only. |
| BR-10 | Layout and configuration (selection, position, size) persist per user across sessions. The Voyage Estimate Status filters persist too. The filters of the other widgets do not. |
| BR-11 | Worklogs opens on the current month, and the user changes the range with the existing Date Range filter. The range is not remembered. |
| BR-12 | The Group Worklog Dashboard is unchanged and remains available. |
| BR-13 | Voyage Estimate Status lists Voyage Estimates, filtered by Mine / Office / All and by Status (All, Preplanning, Firm, Ready to Transfer, Transferred). Both filters apply together. |
| BR-14 | The dashboard is platform-wide. What each user can add and see follows that user's own access only. |

### 2.6 Edge Cases

| Scenario | Expected behaviour |
|---|---|
| User deletes My Tasks, then re-adds it | The Add Widget option is re-enabled. The widget returns at default minimum size with default filters (*All*, *Due Date - Ascending*). |
| User deletes all widgets | Empty state with an Add Widget prompt. The user can rebuild from the five types. |
| Resizing a widget into its neighbour | The neighbour is shifted rather than overlapped (FR-5). |
| Dragging a widget onto another widget | The other widget is shifted rather than overlapped (FR-5). |
| User has access to no PCE Reports | The Select PCER dropdown is empty. Nothing can be added from Select Reports. |
| Deleting a widget in the middle of the layout | The gap is closed and neighbours reflow. |
| Adding a widget when the visible area is full | The widget is placed in the next free position, below the fold, and scrolled into view. |
| PCER selected that has no charts | The Chart / Pivot field is empty. Nothing can be added from that PCER. |
| Chart already on the dashboard selected again | Not allowed (BR-4). |
| A chart or PCER is later removed or becomes inaccessible | The tile shows an "unavailable" message with Delete still working. **[TBC]** |
| Worklogs widget set to a custom range, page reloaded | Returns to the current month (BR-11, FR-8). |
| My Tasks set to *Tomorrow*, page reloaded | Returns to *All* and *Due Date - Ascending* (FR-8). |
| Voyage Estimate Status set to *Office* and *Firm*, user signs in again | The widget shows the same ownership option and status (FR-8). |
| Voyage Estimate Status deleted, then added again | It starts at *Mine* and *All*. Its earlier filters were discarded (FR-6, FR-8). |
| Dashboard opened on a narrower screen | Widgets reflow without overlap or clipped controls. |
| Same user on two browsers | Both see the last saved layout on next load. |
| Refresh clicked on one widget | Only that widget reloads. Others and the layout are unchanged. |
| Voyage Estimate Status set to *Office* and *Firm* | Only Firm estimates created by users in any office the user belongs to are listed. |
| Voyage Estimate Status: the user belongs to several offices | Office lists estimates created by users in all of those offices. |
| Voyage Estimate Status filters match nothing | The widget shows its empty state, not a blank list. **[TBC]** |
| Voyage Estimate Status: an estimate changes status while the dashboard is open | The list updates on the next Refresh or page load. There is no automatic refresh. |
| Voyage Estimate Status filters changed, then Refresh clicked | The list reloads with the same filters. |

---

## 3. Project Scope

### 3.1 In Scope

- Converting the **My Dashboard** tab from fixed sections to a widget canvas
- Default widgets: My Tasks, Map, Worklogs
- **Add Widget** list, with disabled state for single-instance widgets
- Five widget types, including **Select Reports** (PCER + multi-select Chart / Pivot) and **Voyage Estimate Status** (list of Voyage Estimates with Mine / Office / All and Status filters)
- Default minimum size, resize within limits, and a minimum-size guard
- Non-overlapping, dynamically reflowing layout, and moving widgets by dragging, following the existing COEMS widget behaviour
- Platform-wide availability, with access decided per user
- Per-widget **Refresh** and **Delete**
- Per-user persistence of selection, position and size across sessions, plus the Voyage Estimate Status filters
- Re-use of the existing My Tasks filters, the Map and the Worklogs Date Range filter inside their widgets

### 3.2 Out of Scope

- **Group Worklog Dashboard** tab and its widgets — unchanged
- Changes to the standalone **Group WorkLogs** and **Map (BETA)** sidebar items
- Authoring or editing PCE Reports, charts or pivots. This enhancement only displays existing ones
- Creating, editing or deleting Voyage Estimates, or changing their status, from the Voyage Estimate Status widget. It is read-only
- Custom widget types or user-built widgets
- Multiple dashboards or extra dashboard tabs per user
- Sharing a layout with other users, admin-defined default layouts per role, or any role-based or group-based widget configuration
- A "reset dashboard to default" action
- Automatic or scheduled refresh. Refresh is manual, per widget
- Storing the My Tasks and Worklogs filters (quick filter, sort, Date Range). Only the Voyage Estimate Status filters are stored
- Exporting or printing the whole dashboard
- A dedicated mobile layout beyond the reflow in FR-5

---

## 4. Business Drivers

- Let each user organise the landing page around their own priorities instead of a one-size-fits-all page
- Surface the data users check most (tasks, logged time, vessel positions, report charts, voyage estimate status) in one place, so they do not have to navigate into each module
- Reduce clutter by letting users remove sections they never use
- Bring report charts and pivots, currently reached by opening the report, onto the dashboard
- Give users visibility of the Voyage Estimate pipeline from the landing page
- Make the dashboard something users configure once and rely on, because it is remembered

---

## 5. Assumptions

- The dashboard in the story is the existing **Dashboard → My Dashboard** tab, documented from the Engineering module's sidebar, as the story's references to My Tasks, Worklogs, Map and the Group Worklog Dashboard match that page. It is **platform-wide**, available to every user and not only to Engineering users (confirmed 2026-10-13).
- The **Map** widget is the **existing My Dashboard vessel map** (live vessel markers with hover info card), not the Map (BETA) sidebar page.
- "Existing items" shown by default means My Tasks, Map and Worklogs.
- **PCER** and **PCE Report** are used as named in the story. The term is not defined elsewhere in the project documentation and needs confirming, as does what a **Chart / Pivot** is within a report.
- Each Select Reports chart is its own tile, because the story requires the PCER name as a subheading **in each chart**.
- A user only sees PCE Reports, Voyage Estimates and other data they are already permitted to see. Access is user-based only (confirmed 2026-10-13).
- Layout is stored against the **user account** on the server, so it follows the user across browsers and devices, not in the browser.
- The existing My Tasks, Map and Worklogs components can be re-hosted inside resizable widgets without functional change.
- **Voyage Estimate Status** is a fifth widget added to the story's four. Its list, filters, status values, columns and defaults were supplied on 2026-10-13. **Mine** means estimates created by the user. **Office** means estimates created by users in every office the user belongs to.
- The four status values (Preplanning, Firm, Ready to Transfer, Transferred) are assumed to be the Voyage Estimate module's full status list. Only *Preplanning* is visible in the prototype's estimate header, so the other three were not checked.

---

## 6. Constraints

- Minimum and maximum widget sizes depend on each widget's content, so they are set at design and are not specified in this BRD. For example, the Worklogs widget needs room for its Date Range field, four sub-tabs and several day columns.
- Only the Voyage Estimate Status filters are stored. A user who changes the My Tasks or Worklogs filters finds them back at their defaults on reload.
- Select Reports depends on the PCE Reports data being available to render inside a variable-size tile.
- Every widget loads its own data, so a dashboard with many chart tiles will issue many concurrent requests. Each widget must load and fail independently.
- Existing Group Worklog widgets keep their explicit **Save Filter** model. The dashboard layout autosaves. The two models coexist by design.

---

## 7. Decisions Log

### 7.1 Confirmed Decisions

| Question | Decision |
|---|---|
| Is the dashboard fixed or widget-based? | Widget-based. |
| What can be added? | My Tasks, Map, Worklogs, Select Reports, and **Voyage Estimate Status** (added after the story). |
| What does Voyage Estimate Status show? *(2026-10-13)* | A list of Voyage Estimates in a widget, added directly on click. |
| Which filters does it have? *(2026-10-13)* | A Mine / Office / All filter group, and a Status dropdown with the values All, Preplanning, Firm, Ready to Transfer, Transferred. |
| Which columns does the list show? *(2026-10-13)* | Estimate Number, Estimate Name, Vessel Name, Status, Created By. |
| What does "Mine" mean? *(2026-10-13)* | Voyage Estimates created by the logged-in user. |
| What does "Office" mean? *(2026-10-13)* | Voyage Estimates created by users in every office the logged-in user belongs to. |
| What are the default filters? *(2026-10-13)* | Ownership filter **Mine**. Status **All**. |
| Does clicking an Estimate Number open the estimate? *(2026-10-13)* | Yes, it opens the Voyage Estimate record. |
| One Voyage Estimate Status widget or several? *(2026-10-13)* | One only. Its Add Widget option is disabled once added. |
| Is it on the default dashboard? *(2026-10-13)* | No. It is off by default. |
| Does the "Voyage Estimate Status" label change now that it is a list? *(2026-10-13)* | No. The label stays. |
| Paged list or scrolling list? *(2026-10-13)* | Scrolling, inside the widget. |
| What shows by default? | The existing items (My Tasks, Map, Worklogs), as widgets. |
| Can default widgets be removed? | Yes, at any time. |
| Does the Group Worklog Dashboard change? | No. It remains available. |
| How are My Tasks / Map / Worklogs added? | One click, added directly. The option is then disabled in Add Widget. |
| What does My Tasks include? | All the existing filters. |
| What range does Worklogs start with? | The current month. The user changes it from the existing filter. |
| How does Select Reports work? | Pop-up with Select PCER (dropdown of all PCE Reports) and Select Chart / Pivot (multi-select; empty if none; no duplicates). The PCER name is a subheading on each chart. |
| Size of a new widget | Default minimum size. |
| Can widgets be resized? | Yes, within defined limits, and never below the minimum. |
| Per-widget controls | Resize, Refresh icon, Delete. |
| What persists? | Position, size and selection, per user, across sessions. |
| Overlap | None. The layout adjusts dynamically. |
| Engineering-only or platform-wide? *(2026-10-13)* | Platform-wide. |
| Minimum and maximum widget sizes? *(2026-10-13)* | Not specified in this BRD. Set at design. |
| Can widgets be dragged to new positions? *(2026-10-13)* | Yes, following the existing COEMS widgets. |
| Are widget filters remembered across sessions? *(2026-10-13)* | Only for Voyage Estimate Status, once the widget is added. The My Tasks and Worklogs filters are not remembered. *(Clarified the same day, after an earlier answer was read as covering every widget.)* |
| Does deleting a widget ask for confirmation? *(2026-10-13)* | Same as the existing COEMS widgets. |
| Which PCE Reports can a user pick from? *(2026-10-13)* | Only those the user has access to. |
| Who can see the widgets? *(2026-10-13)* | User-based access only. |
| Does the layout save automatically? *(2026-10-13)* | Yes, on every change. |

### 7.2 Open Items — To Be Confirmed

| # | Question | Proposed default (in this BRD) |
|---|---|---|
| 1 | **Platform-wide placement and data:** where the Dashboard sits in the navigation for users outside Engineering, and whether My Tasks, Worklogs, Map and Voyage Estimate Status show the same data for every user. | The existing Dashboard entry point is made available to all users. Widgets keep their current data rules, and each user sees only what their own access allows. |
| 2 | **Select Reports details:** is each chart its own tile? Does "no duplicates" apply across the whole dashboard or only within one pop-up? What are the pop-up's buttons, and what happens when the PCER changes? What does a tile show if its chart or report is later removed or the user loses access? What does PCER stand for? | Own tile each. Dashboard-wide. **Add** / **Cancel**, Chart / Pivot cleared on PCER change. "Unavailable" message on the tile. Definition of PCER to be supplied. |
| 3 | **Minor interface defaults marked [TBC] in §2.3 and §2.4:** where the Add Widget button sits, the empty state after every widget is deleted, where a new widget is placed and scrolled into view, how the layout reflows after a removal and on narrow screens, the error and retry on a failed Refresh, two sessions open at once, the "No voyage estimates found" wording, Select Reports not being on the default dashboard, and the Voyage Estimate Status filters being saved as soon as the user changes them. | As written in those sections. |

---

## 8. Dependencies and Risks

| Item | Detail |
|---|---|
| Reports / PCER data | Needs a way to list the PCE Reports the user has access to and, per report, its charts and pivots, plus a way to render each inside a resizable tile. Confirm availability before build. |
| Voyage Estimate data | Needs, per Voyage Estimate, its Status (Preplanning, Firm, Ready to Transfer, Transferred), its creator (for Mine) and the creator's office (for Office), plus the offices each user belongs to. Confirm these exist and match the Voyage Estimate module's own status list. |
| Per-user layout storage | A new per-user store for dashboard layout is required. It must save position, size, per-tile report selection and the Voyage Estimate Status filters. |
| Dashboard access outside Engineering | The Dashboard is documented from the Engineering sidebar, and access to the Engineering module is governed by a platform permission flag (see COEMS-ENG-BRD-001). A platform-wide Dashboard must be reachable by users who do not have that flag. See §7.2, item 1. |
| Existing components | My Tasks, Map and Worklogs must be refactored to work at variable sizes. The Worklogs table in particular must keep its horizontal scroll at small sizes. |
| Layout engine | Non-overlap with live reflow on add / resize / remove is the main technical risk. A proven grid-layout approach is preferable to custom logic. |
| Performance | Many widgets and chart tiles load concurrently. Each should load lazily and independently, and a failure in one must not block the rest. |
| Accidental deletion | Deleting a default widget is easy. Mitigated by re-enabling the option in Add Widget and by the existing COEMS widget delete behaviour. There is no "reset to default" action (out of scope). |
| Term clarity | PCER / PCE Report is undefined in the project documentation. Misreading it could mis-scope Select Reports. |

---

## 9. User Stories Reference

| Story | Description |
|---|---|
| [Customisable Dashboard Widgets](../docs/user-stories/dashboard/customisable-dashboard-widgets.md) *(this BRD)* | *As a user, I should be able to customise my dashboard by adding, resizing, and removing widgets, so that I can view and organise information based on my preferences and priorities.* Covers widgets replacing fixed sections, the Add Widget list, widget-specific conditions (My Tasks, Map, Worklogs, Select Reports), default minimum size, resizing within limits, Refresh and Delete per widget, persistence of layout and configuration, and non-overlapping dynamic layout. **Voyage Estimate Status** was added after the original text and is included in the saved story. |
| Dashboard Widget – My Tasks | Add My Tasks in one click with all existing filters; disabled in Add Widget once added ([widget-my-tasks.md](../docs/user-stories/dashboard/widget-my-tasks.md)) |
| Dashboard Widget – Map | Add the existing vessel map in one click; disabled in Add Widget once added ([widget-map.md](../docs/user-stories/dashboard/widget-map.md)) |
| Dashboard Widget – Worklogs | Add Worklogs in one click, current month first, range from the existing filter; disabled in Add Widget once added ([widget-worklogs.md](../docs/user-stories/dashboard/widget-worklogs.md)) |
| Dashboard Widget – Select Reports | Pop-up with Select PCER and multi-select Chart / Pivot; PCER name as subheading on each chart ([widget-select-reports.md](../docs/user-stories/dashboard/widget-select-reports.md)) |
| Dashboard Widget – Voyage Estimate Status | List of Voyage Estimates with a Mine / Office / All filter and a Status dropdown (All, Preplanning, Firm, Ready to Transfer, Transferred) ([widget-voyage-estimate-status.md](../docs/user-stories/dashboard/widget-voyage-estimate-status.md)) |
| Engineering – My Dashboard (baseline) | Current fixed My Dashboard tab: My Tasks, Map and Worklogs panels ([my-dashboard.md](../docs/user-stories/engineering/my-dashboard.md)) |
| Engineering – Group WorkLogs | The Group Worklog Dashboard, unchanged ([group-worklogs-engineering.md](../docs/user-stories/engineering/group-worklogs-engineering.md)) |
| Engineering – Map | The separate Map (BETA) page, unchanged ([map-engineering.md](../docs/user-stories/engineering/map-engineering.md)) |

---

## 10. Mockup Reference

No mockup has been built for this enhancement. The prototype's `src/app/components/dashboard.tsx` is a generic platform dashboard placeholder (four stat cards, no widgets), not the widget dashboard described here. The baseline in §2.1 comes from the existing Engineering – My Dashboard story.

**UAT Environment:** [https://coems.uat.admaren.org](https://coems.uat.admaren.org)
