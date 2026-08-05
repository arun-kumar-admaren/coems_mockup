# Business Requirements Document
## Engineering Module — COEMS Platform

**Document Reference:** COEMS-ENG-BRD-001
**Version:** 1.0
**Date:** 2026-08-03
**Project:** COEMS (Commercial Operations & Enterprise Management System)

---

## 1. Description

The Engineering module is the technical work-management hub in the COEMS platform. It captures Engineering Requests raised against a commercial **Scope** or **Fixture**, breaks the request down into discipline-specific engineering work (Hydro, Structural, CAD, Projects, Cargo Planning, and other disciplines), tracks the tasks and time spent by the engineering team against that work, and stores the supporting documents and discussion.

The module enables:

- Centralised creation and management of Engineering Projects (requests) linked to a Scope or Fixture
- A discipline-based breakdown of engineering work within a single project (Engineering Tasks tab)
- A module-wide task tracker independent of any single project, in both list and Kanban form
- Time logging against tasks and roll-up reporting via configurable Group WorkLogs widgets
- Quotation tracking for the cost of engineering work
- Project-level and discipline-level file storage, plus a module-wide Document Search
- A full activity/audit trail via the Timeline tab and per-tab History sections
- Administrator-maintained reference lists (Loading Method, Engineering Type) that drive dropdowns across the module
- A beta geographic Map view of engineering-related vessels/projects
- Soft-delete and Trash/Restore lifecycle management, plus Duplicate for reusing a prior request as a starting point

Engineering Projects follow an auto-generated numbering format similar to `UHL-P-[YYYY]-[NNN]` (e.g., `UHL-P-2026-047`), alongside a separate system-generated Request Number (e.g., `ER-2026-0046`).

---

## 2. Key Components

### 2.1 Engineering Listing Page

The listing page is the primary hub for viewing and managing all Engineering Projects, accessible from the main navigation as its own top-level module, **Engineering** (alongside Chartering, Operations, Management, and SecureLoad).

**Status tab bar:**

All | New Inquires | Under Discussion | Request Finalized | Submitted | Revision Request | Completed | Cancelled | On Hold

The active tab filters the listing by Project Status.

**Header toolbar:**

| Element | Details |
|---|---|
| Search Bar | Keyword search across listing fields |
| Add Filter | Opens advanced filter panel on listing fields |
| Add Engineering Project | Opens the Add New Engineering Project creation panel |
| List / Trash | View toggle — active records / soft-deleted records |
| Kebab Menu (⋮) | Contains: Delete Engineering Request, Duplicate Engineering Request, Document Manager, Hide Sum Row, Request Task Template List |
| Column settings icon | Opens the show/hide/reorder columns panel |

**Table columns (default order):**

| # | Column | Details |
|---|---|---|
| 1 | ID | Internal numeric ID |
| 2 | Eng Project Number | Auto-generated project number (e.g., UHL-P-2026-047); clickable to open the detail panel |
| 3 | Name | Project name |
| 4 | Deadline | Date; "None" if not set |
| 5 | Loading Method | e.g., Lift-On/Roll-Off; drawn from the Loading Method reference list |
| 6 | Stowage Instruction | Free text |
| 7 | Priority | Badge — Low / Medium / High |
| 8 | Scope/Fixture | "Scope" or "Fixture" — indicates the linked record type |
| 9 | Scope/Fixture No | Reference number of the linked Scope or Fixture |
| 10 | Vessel Type | "Unassigned" badge if not set |
| 11 | Intended Vessel | "Unassigned" badge if not set |
| 12 | Head Account | Client/account name |
| 13 | Progress | Percentage complete |
| 14 | Created By | User name |
| 15 | Modified By | User name |
| 16 | Eng Tags | Free-text tags |
| 17 | Project Client | Client name |
| 18 | BC Sync Failed | true/false flag (Business Central sync status) |
| 19 | Version | Record version number |
| 20 | Project Phase | Project phase value |
| 21 | Project Status | Project status value |
| 22 | Final Performer | Assigned performer |

**Footer:**
- Found N records (e.g., "Found 949 records")
- Items per page selector
- Page X of Y, Previous / Next pagination controls

---

### 2.2 Add New Engineering Project

Clicking **Add Engineering Project** opens an **"Add New Engineering Project"** side panel.

**Unsaved-draft handling:** if a prior draft exists, the panel first prompts **"You have unsaved changes."** with **Resume** (restore the draft) or **Create New** (discard it and start blank).

**Engineering Details:**

| Field | Type | Required |
|---|---|---|
| Name | Text | Mandatory |
| Description | Textarea | Optional |
| Scope/Fixture | Dropdown — Scope / Fixture | Mandatory |
| Scope/Fixture No | Searchable dropdown, scoped to the Scope/Fixture selection | Mandatory |
| Deadline | Date picker (with timezone display) | Optional |
| Engineering Project Number | Text | Mandatory |
| Priority | Dropdown — Low / Medium / High | Optional (defaults to Medium) |
| Assigned UES Offices | Multi-select chips | Optional (defaults to requester's office) |
| PIC Engineering | Multi-select chips (users) | Optional (defaults to current user) |
| Loading Methods | Dropdown — see §2.9 | Optional |

**Engineering Tasks:**
- **Add Engineering Tasks** — pre-selects which discipline groups (Hydro, Structural, CAD, Projects, Cargo Planning, Others) are created on the project.

**Port Details:**
- **Add Port** — attaches one or more ports to the project.

**Stowage:**
- **Stowage Instructions** — free-text textarea.

**Action buttons:** Save (always visible at top); Close (✕) — discards the form and triggers the unsaved-draft prompt on next open.

---

### 2.3 Engineering Project Detail Panel

Clicking a project in the listing opens a right-side detail panel.

**Header:**

| Element | Details |
|---|---|
| Project Number | e.g., UHL-P-2026-047 |
| % Completed | Overall progress indicator |
| Priority | Badge |
| Request Number | System-generated (e.g., ER-2026-0046) |
| PIC Chartering | Assigned chartering contact |
| Vessel Type / Vessel | "None" if not assigned |
| Deadline | Date or "None" |
| PIC Engineering | Assigned engineering contact |
| View/refresh icons | Row of icon actions above the summary strip |
| Close (✕) | Closes the panel |

**Tabs, in order:** Timeline | Details | Engineering Tasks | Scope/Fixture | Quotations | Comments | Files | Tasks

---

#### 2.3.1 Timeline Tab (default)

- Chronological activity feed: record creation, status/field updates, each entry showing the acting user, timestamp, and a **"Show Details"** expander.
- **"Add an Action"** button to log a manual timeline entry.

---

#### 2.3.2 Details Tab

**Request Details:**

| Field | Notes |
|---|---|
| Project Client | |
| Engineering Tags | |
| Name | |
| Description | |
| Engineering Project Number | |
| Project Status | |
| Project Phase | |
| Scope/Fixture | Scope or Fixture |
| Scope/Fixture No | |
| Deadline | |
| Priority | |
| Assigned UES Offices | |
| PIC Engineering | |
| Loading Methods | |

**Port Detail:** Add Port action.
**Stowage Instructions:** free text.
**History:** collapsible field-level change log for the project.

All fields must be editable in place by users with Engineering edit permission, syncing immediately with the listing and Timeline tab.

---

#### 2.3.3 Engineering Tasks Tab

Sub-tab bar: **Hydro | Structural | CAD | Projects | Cargo Planning | Others**

Each discipline sub-tab contains:

| Section | Details |
|---|---|
| Engineering Details | Name, Status (e.g., Under Discussion), **Send for Approval** action, Engineering Type (see §2.9), Deadline, Assigned Engineers, Description |
| Tasks | Add Task (library_add icon) + kebab menu (⋮) per task, scoped to this discipline |
| Files | Add File, scoped to this discipline |
| Conversations | Start New Conversation, scoped to this discipline |
| History | Collapsible change log for this discipline |

Disciplines are pre-selected at project creation (§2.2) or added later; a discipline not selected does not appear as a sub-tab.

---

#### 2.3.4 Scope/Fixture Tab

Read-only mirror of the linked commercial record:

| Section | Fields |
|---|---|
| Cargo Details | Add Cargo action; cargo item(s) of the linked Scope/Fixture |
| Fixture Details | PIC Chartering, Intended Vessel Type, Vessel, Final Performer, Head Account |
| Port of Loading | Table: Port, Laycan Start, Laycan End |
| Port of Discharge | Table: Port |
| Chartering Terms | Commercial terms summary |
| History | Collapsible change log |

If the project is linked to a Scope rather than a Fixture, the equivalent Scope-side details are shown instead of Fixture Details. All data here is edited from the Chartering module, not from Engineering.

---

#### 2.3.5 Quotations Tab

Lists quotations raised against the project (amount, status); shows an empty state when none exist; includes a collapsible History section. *(Quotation-creation fields were not observable in UAT against a record with no existing quotations — to be confirmed against a populated record before build.)*

---

#### 2.3.6 Comments Tab

Project-wide conversation via **"Start New Conversation"**, distinct from the discipline-scoped conversations inside each Engineering Tasks sub-tab. Each comment shows the posting user and timestamp.

---

#### 2.3.7 Files Tab

Project-level file upload/listing (name, upload date, downloadable), distinct from discipline-scoped files inside Engineering Tasks. All files (project- or discipline-level) are discoverable via Document Search / Document Manager (§2.10).

---

#### 2.3.8 Tasks Tab

Consolidated view of every task across all disciplines for this project:

| Element | Details |
|---|---|
| Add Filter | Filter the consolidated list (e.g., by discipline, status, assignee) |
| Add Task | Create a task directly from this tab |
| Task rows | Status badge + kebab menu (⋮) per task |
| Total Effective Time | Sum of logged time across all tasks in the project |
| History | Collapsible change log |

Tasks stay in sync across this tab, their originating discipline sub-tab, and the module-wide Engineering Task tracker (§2.7).

---

### 2.4 Kebab Menu Actions (Listing)

| Action | Description |
|---|---|
| Delete Engineering Request | Soft-deletes selected project(s) to Trash |
| Duplicate Engineering Request | Creates a new draft project copying Engineering Details, Port Details, and Stowage Instructions |
| Document Manager | Opens the same document search capability as the Document Search sidebar item (§2.10) |
| Hide Sum Row | Toggles a summary row on the grid |
| Request Task Template List | Manages reusable task templates for Engineering Tasks disciplines |

---

### 2.5 Search & Filter

**Search (real-time, keyword):** filters the listing across visible record fields.

**Add Filter:** structured filter conditions on listing fields (e.g., Priority, Loading Method, Vessel Type, Project Client, Created By), combinable with the active status tab.

---

### 2.6 Show/Hide & Reorder Columns

A column-settings icon opens a panel listing every listing column with a visibility checkbox; columns are drag-reorderable; preferences persist per user, consistent with the Claims and Insurance listings. The row-selection checkbox column cannot be hidden.

---

### 2.7 Engineering Task Tracker

Accessible from the sidebar as **Engineering Task**, independent of any single project.

**View-mode bar:** My Task | All Tasks | List | Kanban | Archived

**List view columns:** ID, Number (e.g., ETSK-6376), Name, Description, Status, Priority, Start Date, Due Date, Reporter, Assignee, Time Logged, Cumulative Time, WIP/Usage %, Is Flagged.

**Kanban view:** columns Todo | In Progress | Review | Done; cards show task name, linked Engineering Project number, discipline (Engineering Type), assignee avatar, completion checkmark when Done; **Group By**: Task, Assignee, Sub Task. Dragging a card between columns updates its Status and syncs back to the originating project.

**Add Task**, **Search**, and **Add Filter** are available in both views.

---

### 2.8 Group WorkLogs

Accessible from the sidebar as **Group WorkLogs** — a configurable dashboard of time-tracking widgets.

Each widget: Date Range picker + Update button; kebab menu (⋮) for widget-level actions; own filter control.

**Add Group Working Widget** fields: Name, Groups, Users, Offices, Module, Related Item, Categorized By, Period Grouping (e.g., Days), metric selector (e.g., Logged Time). Widgets with no matching worklogs show **"No worklogs available!"** instead of an empty chart.

---

### 2.9 Reference Lists — Loading Method & Engineering Type

Simple administrator-maintained master-data lists, each with Search, an Add button, and a table of values with edit (pencil) / delete (trash) actions, paginated with a configurable items-per-page selector.

- **Loading Method** — e.g., Lift-On/Lift-Off, Roll-On/Roll-Off, Float-On/Float-Off, None, Roll-On/Lift-Off, Lift-On/Roll-Off (6 values at time of writing).
- **Engineering Type** — discipline/analysis types used in the Engineering Tasks tab, e.g., Other, DPM, Sea Fastening, Lifting Plan, Stowage Plan, Feasibility, Vessel Informations, Prices, Motion Analysis, FEM Analyses, and more (26 values at time of writing).

Values added here are immediately available in the corresponding dropdowns on the Add/Edit Engineering Project form and the Engineering Tasks tab.

---

### 2.10 Document Search

Accessible from the sidebar as **Document Search** — a dedicated search page (Search box + Add Filter) covering files uploaded via any project-level Files tab or any discipline-level Files section across the module. Shows a **"No Records Found..."** empty state when nothing matches. This is the same underlying capability as **Document Manager** in the listing kebab menu (§2.4).

---

### 2.11 Map (BETA)

Accessible from the sidebar as **Map**, marked **BETA** — an interactive (Google Maps-based) view with colour-coded pins for vessels/projects, standard pan/zoom, and a list/print toggle. Pin data, colour legend, and click-through behaviour are not yet finalised and should be confirmed with the Engineering team before this is treated as a stable, supported feature.

---

### 2.12 Delete, Duplicate & Trash

**Delete:** soft-deletes selected project(s) via the listing kebab menu; deleted records move to Trash and are not editable.

**Duplicate:** copies a project's Engineering Details, Port Details, and Stowage Instructions into a new draft, requiring the user to set a new Engineering Project Number before saving.

**Trash view:** toggled via List/Trash in the listing header; supports Restore (back to List) or permanent delete. Soft-deleted projects do not appear in any status tab or count.

---

## 3. Project Scope

### 3.1 In Scope

- Engineering listing page with full column set, status tabs, pagination, search, and filters
- Show/hide and reorder columns on the listing
- Add New Engineering Project creation form, including unsaved-draft Resume/Create New handling
- Full detail panel with 8 tabs: Timeline, Details, Engineering Tasks, Scope/Fixture, Quotations, Comments, Files, Tasks
- Discipline-based breakdown of engineering work (Hydro, Structural, CAD, Projects, Cargo Planning, Others), each with its own status/approval flow, tasks, files, conversations, and history
- Read-only Scope/Fixture mirror within the Engineering detail panel
- Project-level and discipline-level file storage
- Module-wide Engineering Task tracker (List and Kanban views, My Task/All Tasks/Archived)
- Group WorkLogs configurable time-tracking dashboard
- Loading Method and Engineering Type reference-list administration
- Module-wide Document Search / Document Manager
- Map (BETA) geographic view
- Delete, Duplicate, and Trash/Restore lifecycle for Engineering Projects
- Kebab menu actions: Delete Engineering Request, Duplicate Engineering Request, Document Manager, Hide Sum Row, Request Task Template List

### 3.2 Out of Scope

- Full Fixture/Scope module workflows (covered in separate BRDs)
- Financial settlement, invoicing, or Business Central sync remediation (BC Sync Failed is surfaced as a flag only)
- Quotation creation/approval workflow details (flagged for confirmation — see §2.3.5)
- Finalised Map (BETA) pin semantics and legend (pending the feature exiting beta)
- Request Task Template List management details (observed as an entry point only; template CRUD flow not yet documented)
- External engineering software/CAD tool integrations

---

## 4. Business Drivers

- Provide a single, structured entry point for engineering work raised against commercial Scope/Fixture records
- Let multiple engineering disciplines work on the same request in parallel, each with its own status, tasks, and files, without stepping on each other
- Give engineering managers visibility into workload and utilisation across the team via the Engineering Task tracker and Group WorkLogs
- Track the cost of engineering work through Quotations, alongside the request itself
- Provide traceability of every change through the Timeline tab and per-tab History sections
- Keep dropdown data (Loading Method, Engineering Type) centrally maintained instead of hard-coded
- Make every uploaded document findable module-wide via Document Search, regardless of which project or discipline it was attached under

---

## 5. Assumptions

- Engineering Project Number format follows `UHL-P-[YYYY]-[NNN]` (or the equivalent prefix for the originating office); Request Number is separately system-generated (e.g., `ER-[YYYY]-[NNNN]`)
- "Scope/Fixture" and "Scope/Fixture No" link to existing records in the Chartering module's Scope and Fixture data
- Assigned UES Offices and PIC Engineering/PIC Chartering draw from the COEMS user/office directory
- Vessel data (Vessel Type, Vessel/Intended Vessel) is pulled from the COEMS vessel registry
- "Send for Approval" on a discipline moves that discipline's status out of "Under Discussion"; the full approval workflow states beyond that were not exhaustively observed in UAT
- Tasks created anywhere (discipline sub-tab, project Tasks tab, or the global Engineering Task tracker) refer to the same underlying task record
- Time logged against tasks feeds both the project's "Total Effective Time" and the Group WorkLogs widgets

---

## 6. Constraints

- Quotation-creation fields could not be confirmed in UAT (the explored record had no quotations) — must be verified against a populated record before this area of the spec is treated as final
- Map is explicitly labelled BETA; its behaviour may change before general availability
- BC Sync Failed reflects a Business Central integration outcome outside this module's control — Engineering can only surface the flag, not resolve the underlying sync
- Column visibility, order, and filter state may be user-session specific
- Request Task Template List (kebab menu) was identified as an entry point but its full template-management flow needs a follow-up UAT pass

---

## 7. User Stories Reference

| Story | Description | File |
|---|---|---|
| Listing Page | View, filter by status tab, and act on all Engineering Projects | `listing-page-engineering.md` |
| Search & Filter | Apply keyword search and advanced filters on the listing | `search-filter-engineering.md` |
| Show/Hide & Reorder Columns | Tailor listing columns per user | `show-hide-reorder-engineering.md` |
| Add New Engineering Project | Raise a new engineering request against a Scope/Fixture | `add-new-engineering-project.md` |
| Delete, Duplicate & Trash | Soft-delete, duplicate, and restore projects | `delete-duplicate-trash-engineering.md` |
| Edit Overlay (Header/Timeline/Details) | View project summary, activity feed, and request details | `edit-overlay-engineering.md` |
| Engineering Tasks Tab | Manage discipline-specific work streams (Hydro/Structural/CAD/Projects/Cargo Planning/Others) | `engineering-tasks-tab.md` |
| Scope/Fixture Tab | View linked cargo and chartering details | `scope-fixture-tab-engineering.md` |
| Quotations Tab | Track quotations for engineering work | `quotations-tab-engineering.md` |
| Comments Tab | Hold project-wide conversation | `comments-tab-engineering.md` |
| Files Tab | Attach project-level files | `files-tab-engineering.md` |
| Tasks Tab | Consolidated task list per project | `tasks-tab-engineering.md` |
| Engineering Task Tracker | Module-wide task list/Kanban across all projects | `engineering-task-tracker.md` |
| Group WorkLogs | Configurable time-tracking dashboard | `group-worklogs-engineering.md` |
| Reference Lists | Maintain Loading Method and Engineering Type | `reference-lists-engineering.md` |
| Document Search | Module-wide file search | `document-search-engineering.md` |
| Map (BETA) | Geographic overview of engineering vessels/projects | `map-engineering.md` |

---

## 8. Mockup Reference

The UI design and screen flows for this module were documented directly from the live UAT environment (no prior BRD or prototype source existed for Engineering before this document).

**UAT Environment:** [https://coems.uat.admaren.org](https://coems.uat.admaren.org)

**User stories:** `docs/user-stories/engineering/` (17 files, listed in §7)
