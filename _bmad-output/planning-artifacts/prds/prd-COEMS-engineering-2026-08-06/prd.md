---
title: "COEMS Engineering Module"
status: draft
created: 2026-08-06
updated: 2026-08-06
project: COEMS
scope: Engineering module (standalone module — Engineering listing, Engineering Project detail panel, Engineering Task tracker, Group WorkLogs, reference lists, Document Search, Map)
---

# PRD: COEMS Engineering Module

## 1. Overview

### 1.1 Problem Statement

Engineering work at UES is raised against a commercial Scope or Fixture but spans multiple disciplines (Hydro, Structural, CAD, Projects, Cargo Planning, and others), each with its own status, tasks, files, and cost. Without a dedicated module, this work is tracked ad hoc, making it hard to see workload across disciplines, hold engineers accountable for time logged, or find documents attached to a request.

The Engineering module (accessible as its own top-level navigation entry, alongside Chartering, Operations, Management, and SecureLoad) is a **standalone module** that manages Engineering Projects independently, linking each one to a Scope or Fixture via a reference relationship.

### 1.2 What the Module Does

The Engineering module provides:

1. **Engineering listing** — a searchable, filterable, status-tabbed table of all Engineering Projects.
2. **Add New Engineering Project** — a creation panel that ties a new request to a Scope/Fixture and captures its core details.
3. **Engineering Project detail panel** — a right-side overlay with 8 tabs: Timeline, Details, Engineering Tasks, Scope/Fixture, Quotations, Comments, Files, Tasks.
4. **Engineering Task tracker** — a module-wide, cross-project task list/Kanban board.
5. **Group WorkLogs** — configurable time-tracking dashboard widgets.
6. **Reference lists** — Loading Method and Engineering Type, admin-maintained.
7. **Document Search** — module-wide file search.
8. **Map (BETA)** — geographic view of engineering-related vessels/projects.

---

## 2. Goals & Success Metrics

### 2.1 Goals

| # | Goal |
|---|------|
| G-1 | Engineering staff can find and triage their own requests and tasks from a single hub, filtered by status |
| G-2 | A single Engineering Project can be worked by multiple disciplines in parallel, each with its own status, tasks, files, and discussion |
| G-3 | Managers can see workload and time utilisation across the whole engineering team without opening individual projects |
| G-4 | Every document attached anywhere in the module is findable from one search, regardless of which project or discipline it belongs to |
| G-5 | The cost of engineering work (quotations) is tracked alongside the request itself |

### 2.2 Success Metrics

| Metric | Target | Counter-Metric |
|--------|--------|----------------|
| Time to locate all requests in a given status | < 20 seconds from sidebar click | Listing initial render must not exceed 2s with 900+ records |
| Draft-to-saved completion rate on Add New Engineering Project | ≥ 90% of opened panels result in a saved project | Measure abandonment via the unsaved-draft prompt |
| Discipline task visibility | 100% of tasks created under a discipline also appear in the project's consolidated Tasks tab and the global Engineering Task tracker | Any discrepancy is a data-sync defect |
| Document findability | A file attached under any discipline is returned by Document Search within one search | Missing results are a defect |

---

## 3. Users & Stakeholders

### 3.1 Primary Users

**Engineering Team (PIC Engineering, Assigned Engineers)**
- Monitors and triages Engineering Projects assigned to them or their office
- Breaks a project down into the disciplines needed and manages each discipline's tasks, files, and status
- Logs time against tasks

**Chartering / Commercial Team (PIC Chartering)**
- Raises Engineering Projects against a Scope or Fixture
- Monitors project progress and deadline against the commercial timeline

**Engineering Managers**
- Uses the Engineering Task tracker and Group WorkLogs to see cross-project workload and utilisation
- Maintains Loading Method and Engineering Type reference lists

### 3.2 System Actor

- Auto-generates sequential Engineering Project Numbers (format `UHL-P-[YYYY]-[NNN]`, e.g. `UHL-P-2026-047`) and a separate Request Number (format `ER-[YYYY]-[NNNN]`, e.g. `ER-2026-0046`) on record creation
- Auto-generates sequential Engineering Task numbers (format `ETSK-[NNNN]`, e.g. `ETSK-6376`)

### 3.3 Access Control

A user only sees the Engineering module and Engineering Task tracker at all if their user record has the **"Engineering/Eng Tasks"** Module Access flag enabled (administered outside the module — see FR-19.2). Department = "Engineering" identifies the user pool that Engineering-specific fields (PIC Engineering, Assigned Engineers) are populated from, but is a separate attribute from the Module Access flag.

---

## 4. Functional Requirements

### 4.1 Engineering Listing Page

**FR-1.1** The system shall provide a top-level navigation entry labelled **"Engineering"**, separate from Chartering, Operations, Management, and SecureLoad.

**FR-1.2** The listing shall provide a **status tab bar**: `All`, `New Inquires`, `Under Discussion`, `Request Finalized`, `Submitted`, `Revision Request`, `Completed`, `Cancelled`, `On Hold`. The active tab filters the listing by Project Status.

**FR-1.3** The listing table shall display the following columns: a row-selection checkbox (always visible, feeds FR-12.1), **ID**, **Name** (clickable to open the detail panel), **Eng Project Number** (e.g. `UHL-P-2026-047` or a bare numeric reference), **Description**, **Deadline** (date or "None"), **Loading Method** (or "None"), **Stowage Instruction**, **Priority** (badge: Low / Medium / High), **Scope/Fixture** ("Scope" or "Fixture"), **Scope/Fixture No**, **Vessel Type** ("Unassigned" badge if not set), **Intended Vessel** ("Unassigned" badge if not set), **Head Account** (or "None"), **Progress** (%), **Created By**, **Modified By**, **Eng Tags**, **Project Client**, **BC Sync Failed** (true/false), **Version**, **Project Phase**, **Project Status**, **Final Performer**. Column order is user-configurable (FR-13) — the order listed here reflects one observed session, not a fixed sequence.

**FR-1.4** A **Search** box shall filter the listing live across visible record fields (e.g. Name, Eng Project Number).

**FR-1.5** An **"Add Filter"** control shall allow structured filter conditions on listing fields (e.g. Priority, Loading Method, Vessel Type, Project Client, Created By), combinable with the active status tab.

**FR-1.6** A **"List" / "Trash"** toggle shall switch between active records and soft-deleted records — see FR-12.

**FR-1.7** A grid-level kebab menu (⋮) shall provide: **Delete Engineering Request**, **Duplicate Engineering Request**, **Document Manager**, **Hide Sum Row**, **Request Task Template List** — see FR-12 and FR-16.

**FR-1.8** A column-settings icon shall open a show/hide/reorder panel — see FR-13.

**FR-1.9** The footer shall display **"Found N records"** and provide an **Items per page** selector and Previous/Next pagination.

**FR-1.10** An **"Add Engineering Project"** button shall open the creation panel — see FR-2.

### 4.2 Add New Engineering Project

**FR-2.1** Clicking **"Add Engineering Project"** shall open an **"Add New Engineering Project"** panel. If a prior draft exists, the panel shall first prompt **"You have unsaved changes."** with **Resume** (restore the draft) or **Create New** (discard and start blank).

**FR-2.2** The panel shall present an **Engineering Details** section with the following fields:

- **Name** (text, mandatory)
- **Description** (textarea, optional)
- **Scope/Fixture** (dropdown — Scope / Fixture, mandatory)
- **Scope/Fixture No** (searchable dropdown scoped to the Scope/Fixture selection, mandatory)
- **Deadline** (date picker with timezone display, optional)
- **Engineering Project Number** (text, mandatory, unique — e.g. `UHL-P-2026-047`)
- **Priority** (dropdown — Low / Medium / High, optional, defaults to Medium)
- **Assigned UES Offices** (multi-select chips, optional, defaults to requester's office)
- **PIC Engineering** (multi-select chips of users, optional, defaults to current user)
- **Loading Methods** (dropdown sourced from the Loading Method reference list — see FR-16.1, optional)

**FR-2.3** An **Engineering Tasks** section shall provide **"Add Engineering Tasks"** to pre-select which discipline groups (Hydro, Structural, CAD, Projects, Cargo Planning, Others) are created on the project.

**FR-2.4** A **Port Details** section shall provide **"Add Port"** to attach one or more ports to the project.

**FR-2.5** A **Stowage** section shall provide a **Stowage Instructions** textarea (optional, free text).

**FR-2.6** A **Save** button shall be present at all times; a close (✕) discards the form (triggering FR-2.1's prompt on next open).

**FR-2.7** On save, the new project shall appear under the **New Inquires** status tab (and under **All**), with Progress defaulted to 0%.

### 4.3 Engineering Project Detail Panel — Header & Tabs

**FR-3.1** Clicking a project in the listing shall open a right-side detail panel with a header showing: **Project Number**, an overall **% Completed** indicator, **Priority**, **Request Number** (e.g. `ER-2026-0046`), **PIC Chartering**, **Vessel Type** / **Vessel** ("None" if unassigned), **Deadline**, **PIC Engineering**, view/refresh icon actions, and a close (✕) control.

**FR-3.2** The panel shall present tabs in this order: **Timeline | Details | Engineering Tasks | Scope/Fixture | Quotations | Comments | Files | Tasks**.

### 4.4 Timeline Tab

**FR-4.1** The Timeline tab shall be selected by default and shall show a chronological activity feed (record creation, status/field updates), each entry showing the acting user, timestamp, and a **"Show Details"** expander.

**FR-4.2** An **"Add an Action"** button shall let the user log a manual timeline entry.

### 4.5 Details Tab

**FR-5.1** The Details tab shall show a **Request Details** section with: **Project Client**, **Engineering Tags**, **Name**, **Description**, **Engineering Project Number**, **Project Status**, **Project Phase**, **Scope/Fixture**, **Scope/Fixture No**, **Deadline**, **Priority**, **Assigned UES Offices**, **PIC Engineering**, **Loading Methods** — matching the fields captured at creation (FR-2.2).

**FR-5.2** A **Port Detail** section shall provide **"Add Port"**, and a **Stowage Instructions** field shall be present.

**FR-5.3** A collapsible **History** section shall show the full field-level change log for the project.

**FR-5.4** All fields on this tab shall be editable in place by users with Engineering edit permission; changes shall sync immediately to the listing and the Timeline tab.

### 4.6 Engineering Tasks Tab

**FR-6.1** The tab shall present a sub-tab bar for discipline groups: **Hydro | Structural | CAD | Projects | Cargo Planning | Others**.

**FR-6.2** Each discipline sub-tab shall show an **Engineering Details** section with: **Name**, **Status** (e.g. Under Discussion), a **"Send for Approval"** action, **Engineering Type** (dropdown sourced from the Engineering Type reference list — see FR-16.2), **Deadline**, **Assigned Engineers**, **Description**.

**FR-6.3** Each discipline sub-tab shall have its own **Tasks** section (an **"Add Task"** / library_add icon control plus a kebab menu (⋮) per task), its own **Files** section (**"Add File"**), and its own **Conversations** section (**"Start New Conversation"**) — all scoped to that discipline only.

**FR-6.4** Each discipline sub-tab shall include a collapsible **History** section.

**FR-6.5** Disciplines not pre-selected at creation (FR-2.3) or added later shall not appear as sub-tabs.

**FR-6.6** Tasks created under a discipline shall also appear in the project's consolidated Tasks tab (FR-11) and the global Engineering Task tracker (FR-14), tagged with their originating discipline.

### 4.7 Scope/Fixture Tab

**FR-7.1** The tab shall show a **Cargo Details** section (**"Add Cargo"**) listing cargo item(s) of the linked Scope/Fixture.

**FR-7.2** The tab shall show a **Fixture Details** section with: **PIC Chartering**, **Intended Vessel Type**, **Vessel**, **Final Performer**, **Head Account**; a **Port of Loading** table (Port, Laycan Start, Laycan End); a **Port of Discharge** table (Port); and a **Chartering Terms** section.

**FR-7.3** If the project is linked to a **Scope** rather than a **Fixture**, the equivalent Scope-side details shall be shown instead of Fixture Details.

**FR-7.4** All data on this tab shall be **read-only** from Engineering — it mirrors the source Scope/Fixture record, which is edited from the Chartering module.

**FR-7.5** A collapsible **History** section shall be present.

### 4.8 Quotations Tab

**FR-8.1** The tab shall list quotations raised against the project (amount, status), or show an empty state when none exist.

**FR-8.2** A collapsible **History** section shall be present.

**FR-8.3** [ASSUMPTION] Users with the relevant permission shall be able to add a new quotation capturing at minimum a quoted amount and status. The explored UAT record had no quotations, so the exact quotation-creation fields could not be confirmed — see OQ-1.

### 4.9 Comments Tab

**FR-9.1** A **"Start New Conversation"** button shall let the user post a project-wide text comment, showing the posting user and timestamp.

**FR-9.2** Comments here shall be distinct from the discipline-scoped conversations inside Engineering Tasks sub-tabs (FR-6.3).

### 4.10 Files Tab

**FR-10.1** The project-level Files tab shall let the user upload one or more files against the project, listed with at least file name and upload date, and downloadable.

**FR-10.2** Files here shall be distinct from discipline-scoped files inside Engineering Tasks sub-tabs (FR-6.3).

**FR-10.3** All files (project- or discipline-level) shall be discoverable via Document Search / Document Manager (FR-17).

### 4.11 Tasks Tab

**FR-11.1** The tab shall show a consolidated list of every task across all disciplines for this project.

**FR-11.2** An **"Add Filter"** control shall filter this list (e.g. by discipline, status, assignee); an **"Add Task"** button shall create a task directly from this tab.

**FR-11.3** Each task row shall show a status badge and a kebab menu (⋮) for task-level actions.

**FR-11.4** A **"Total Effective Time"** summary shall show the sum of logged time across all tasks in the project.

**FR-11.5** A collapsible **History** section shall be present.

**FR-11.6** Tasks here shall stay in sync with their originating discipline sub-tab (FR-6) and the global Engineering Task tracker (FR-14).

### 4.12 Kebab Menu, Delete, Duplicate & Trash

**FR-12.1** The grid kebab menu (⋮) shall provide **Delete Engineering Request** (soft-deletes selected project(s) to Trash) and **Duplicate Engineering Request** (creates a new draft copying Engineering Details, Port Details, and Stowage Instructions, requiring a new Engineering Project Number before save).

**FR-12.2** The **"List" / "Trash"** toggle (FR-1.6) shall show only soft-deleted projects when Trash is selected. From Trash, the user shall be able to **Restore** a project or permanently delete it.

**FR-12.3** Soft-deleted projects shall not appear in any status tab or count while in Trash.

**FR-12.4** The kebab menu shall also provide **Document Manager** (same capability as FR-17) and **Hide Sum Row** (toggles a grid summary row).

**FR-12.5** [ASSUMPTION] **Request Task Template List** manages reusable task templates for Engineering Tasks disciplines; its full template-management flow was identified as an entry point only and not exhaustively documented — see OQ-2.

### 4.13 Show/Hide & Reorder Columns

**FR-13.1** A column-settings icon shall open a panel listing every listing column (FR-1.3) with a visibility checkbox.

**FR-13.2** Unchecking a column shall hide it immediately; re-checking shall restore it in its prior position.

**FR-13.3** Columns shall be drag-reorderable within the panel, reflected immediately on the grid.

**FR-13.4** Column visibility and order preferences shall persist per user across sessions, consistent with the Claims and Insurance listings.

**FR-13.5** The row-selection checkbox column shall always remain visible.

### 4.14 Engineering Task Tracker

**FR-14.1** The **"Engineering Task"** sidebar item shall open a module-wide task tracker, independent of any single Engineering Project.

**FR-14.2** A view-mode bar shall offer: **My Task | All Tasks | List | Kanban | Archived**.

**FR-14.3** **My Task** shall show only tasks assigned to the current user; **All Tasks** shall show every task across every accessible project; **Archived** shall show tasks archived off the active board.

**FR-14.4** The **List** view shall show columns: **ID**, **Number** (e.g. `ETSK-6376`), **Name**, **Description**, **Status**, **Priority**, **Start Date**, **Due Date**, **Reporter**, **Assignee**, **Time Logged**, **Cumulative Time**, **WIP/Usage %**, **Is Flagged**.

**FR-14.5** The **Kanban** view shall show columns **Todo | In Progress | Review | Done**; each card shall show task name, linked Engineering Project number, discipline (Engineering Type), assignee avatar, and a completion checkmark when Done.

**FR-14.6** The Kanban board shall support **Group By**: Task, Assignee, Sub Task.

**FR-14.7** An **"Add Task"** button shall create a task, requiring the user to select which Engineering Project (and discipline) it belongs to.

**FR-14.8** **Search** and **Add Filter** shall be available in both List and Kanban views.

**FR-14.9** Dragging a card between Kanban columns shall update that task's Status immediately and sync back to the originating project (FR-6.6, FR-11.6).

### 4.15 Group WorkLogs

**FR-15.1** The **"Group WorkLogs"** sidebar item shall open a dashboard of one or more time-tracking widgets.

**FR-15.2** Each widget shall show a **Date Range** picker and an **Update** button to refresh its data.

**FR-15.3** An **"Add Group Working Widget"** form shall configure a new widget with: **Name**, **Groups**, **Users**, **Offices**, **Module**, **Related Item**, **Categorized By**, **Period Grouping** (e.g. Days), and a metric selector (e.g. Logged Time).

**FR-15.4** Each widget shall expose a kebab menu (⋮) for widget-level actions and its own filter control.

**FR-15.5** A widget with no matching worklogs shall show **"No worklogs available!"** instead of an empty chart.

### 4.16 Reference Lists

There are four Engineering reference lists. **Loading Method** and **Engineering Type** are reachable both as their own entries in the Engineering module's sidebar and, along with **Engineering Tags** and **Project Client**, as cards under an "Engineering" section of the global **Settings → General Settings** area. All four follow the same flat-list CRUD pattern: a Search box, an "Add [X]" button (opens a panel with a single required Name field, Save/Discard), and a table (Name column + Actions: edit/delete), with pagination.

**FR-16.1** **Loading Method** — Search, **"Add Loading Method"**, table of values with edit/delete, pagination. Values at time of writing: Lift-On/Lift-Off, Roll-On/Roll-Off, Float-On/Float-Off, None, Roll-On/Lift-Off, Lift-On/Roll-Off (6 total).

**FR-16.2** **Engineering Type** — same pattern, holding the discipline/analysis types used in FR-6.2. Values at time of writing include: Other, DPM, Sea Fastening, Lifting Plan, Stowage Plan, Feasibility, Vessel Informations, Prices, Motion Analysis, FEM Analyses, and more (26 total).

**FR-16.3** **Engineering Tags** — same pattern (Settings card: "List of Engineering Tags"; form field: "Engineering Tag Name", required). Drives the **Eng Tags** listing column (FR-1.3) and the Engineering Tags field on the Details tab (FR-5.1). Empty (no tags created) at time of writing.

**FR-16.4** **Project Client** — same pattern (Settings card labelled "Engineering Project Client"; the list page itself is titled just "Project Client"; form field: "Project Client Name", required). Drives the **Project Client** listing column (FR-1.3) and the Project Client field on the Details tab (FR-5.1). Values at time of writing: UHL-Chartering, UHL-Wind, UHL-Projects, UML, UWL, UHT, Nauticore, UES — these read as internal UES-group entity/brand codes rather than external customer accounts; see OQ-6.

**FR-16.5** A value added to any of the four lists shall be immediately available in its corresponding dropdown/field elsewhere in the module.

**FR-16.6** [ASSUMPTION] Editing a value's label should update its display everywhere referenced without breaking existing records; deleting an in-use value should be blocked or require confirmation of impact — see OQ-3.

### 4.17 Document Search

**FR-17.1** The **"Document Search"** sidebar item shall open a dedicated search page (Search box + **"Add Filter"**) covering files uploaded via any project-level Files tab (FR-10) or any discipline-level Files section (FR-6.3) across the module.

**FR-17.2** When no search/filter has been entered, or nothing matches, the page shall show **"No Records Found..."**.

**FR-17.3** Each result shall show enough context (file name, originating Engineering Project, discipline if applicable, upload date/user) to identify the file and jump to its source record.

**FR-17.4** This capability is the same one exposed as **Document Manager** from the listing kebab menu (FR-12.4).

### 4.18 Map (BETA)

**FR-18.1** The **"Map"** sidebar item, marked **BETA**, shall open an interactive (Google Maps-based) view with colour-coded pins for vessels/projects, standard pan/zoom, and a list/print toggle.

**FR-18.2** [ASSUMPTION] Pin data, colour legend, and click-through behaviour were not exhaustively verified in UAT and should be confirmed with the Engineering team before this is treated as a stable, supported feature — see OQ-4.

### 4.19 User & Permission Administration (Cross-Module, Engineering-Relevant)

This is administered under the platform-wide **Settings → Administration → Users** screen, not inside the Engineering module itself, but directly governs who can use it.

**FR-19.1** The Users list (Settings → Administration → Users) shall show columns: **Name**, **Email/Username**, **Phone Number**, **Designation**, **Department**, **Roles**, **Is Active**, **PIC/Project Manager**. A user's **Department** may be set to **"Engineering"**; observed **Roles** for Engineering-department users include Engineer, Account Manager, Supercargo.

**FR-19.2** The Add/Edit User form shall include a **Module Access** checkbox group with (at least): **Fixture/Projects/Tasks**, **Operations**, **Voyage Estimate**, **Engineering/Eng Tasks**, **Map**. A user must have **"Engineering/Eng Tasks"** checked to access the Engineering module and the Engineering Task tracker.

**FR-19.3** The Add/Edit User form shall include an **"Add Offices for Data Access"** multi-select, sourced from: **UES India**, **UES Pakistan**, **United Engineering Solutions**. This is the source list for the **Assigned UES Offices** field on Add New Engineering Project (FR-2.2) and the Details tab (FR-5.1).

**FR-19.4** [ASSUMPTION] It was not confirmed in UAT whether "Engineering/Eng Tasks" module access alone is sufficient to edit records, or whether the office(s) a user has Data Access to further restrict which Engineering Projects they can see/edit (e.g. a UES Pakistan user seeing only Pakistan-office projects) — see OQ-7.

---

## 5. Non-Functional Requirements

**NFR-1 — Listing performance**
The Engineering listing shall remain responsive with 900+ records; initial render shall not exceed 2s, and status-tab/search/filter changes shall update the visible table within one render cycle.

**NFR-2 — Cross-surface task sync**
A task's Status, Assignee, and logged time must be consistent everywhere it's shown (discipline sub-tab, project Tasks tab, global Engineering Task tracker) with no perceptible lag between an edit and its reflection elsewhere.

**NFR-3 — Draft preservation**
Add New Engineering Project must not silently discard user input; navigating away without saving must always be recoverable via the Resume/Create New prompt (FR-2.1).

**NFR-4 — Read-only boundary enforcement**
The Scope/Fixture tab (FR-7) must never allow edits to propagate back to the source Scope/Fixture record from within Engineering.

**NFR-5 — Accessibility**
All Select/Dropdown fields shall have associated visible labels; the detail panel's tabs and Kanban board shall be operable via keyboard.

---

## 6. Constraints & Assumptions

| ID | Type | Statement |
|----|------|-----------|
| C-1 | Constraint | Engineering Project Number and Request Number are system-assigned formats; the Project Number is user-entered at creation but must be unique |
| C-2 | Constraint | Scope/Fixture and Scope/Fixture No are mandatory at creation and determine the read-only content of the Scope/Fixture tab |
| C-3 | Constraint | The Scope/Fixture tab is read-only from Engineering; edits happen in the Chartering module |
| C-4 | Constraint | A discipline sub-tab only exists if pre-selected at creation or added later — it is not a fixed set of 6 tabs on every project |
| C-5 | Constraint | Access to the Engineering module and Engineering Task tracker is gated by the "Engineering/Eng Tasks" Module Access flag on the user record (FR-19.2), administered outside the module |
| A-1 | Assumption | Tasks created anywhere (discipline, project Tasks tab, global tracker) refer to the same underlying task record |
| A-2 | Assumption | Time logged against tasks feeds both "Total Effective Time" (FR-11.4) and Group WorkLogs widgets (FR-15) |
| A-3 | Assumption | Assigned UES Offices, PIC Engineering, and PIC Chartering are sourced from the COEMS user/office directory |
| A-4 | Assumption | Vessel Type / Vessel / Intended Vessel are sourced from the COEMS vessel registry |
| A-5 | Assumption | BC Sync Failed reflects a Business Central integration outcome outside Engineering's control |

---

## 7. Out of Scope

- Full Fixture/Scope module workflows (covered in separate BRDs/PRDs)
- Financial settlement, invoicing, or Business Central sync remediation
- Quotation approval workflow beyond basic amount/status capture (FR-8.3 pending confirmation)
- Finalised Map (BETA) pin semantics and legend
- Request Task Template List full management flow (FR-12.5 pending confirmation)
- External engineering software/CAD tool integrations

---

## 8. Open Questions

| ID | Question | Owner | Blocking? |
|----|----------|-------|-----------|
| OQ-1 | What fields does quotation creation actually capture (amount only, currency, line items, approval status)? Needs a UAT pass against a project with existing quotations. | Product | Yes — before FR-8 is built |
| OQ-2 | What does "Request Task Template List" actually manage — templates per discipline, per project type? What's the CRUD flow? | Product | No — deferred |
| OQ-3 | Should deleting an in-use Loading Method / Engineering Type value be hard-blocked, or allowed with a confirmation of impact? | Product | No — deferred |
| OQ-4 | What do the Map's pin colours represent (status? discipline? vessel type?), and what happens on pin click? | Product | Yes — before Map exits beta |
| OQ-5 | Is there a formal approval workflow beyond "Send for Approval" (FR-6.2) — who approves, and what happens after? | Product | Yes — before FR-6 approval flow is built out |
| OQ-6 | Is "Project Client" (FR-16.4) meant to represent internal UES-group entities/brands, or is it intended to eventually reference actual customer/account records? The current values (UHL-Chartering, UWL, Nauticore, etc.) suggest the former. | Product | No — deferred, but affects whether it should link to the Customers list also present in Settings |
| OQ-7 | Does a user's "Add Offices for Data Access" selection (FR-19.3) restrict which Engineering Projects they can see/edit to those offices, or is it informational only, with "Engineering/Eng Tasks" module access (FR-19.2) being the sole gate? | Architecture | Yes — before role-based visibility rules are built |

---

## 9. User Journeys

### UJ-1: Chartering Raises an Engineering Request Against a Fixture

**Persona:** Chartering / Commercial user
**Entry:** Sidebar → Engineering → "Add Engineering Project"
**Journey:** Panel opens → sets Scope/Fixture: Fixture → selects the Fixture No → enters Name and Engineering Project Number → sets Priority → adds Engineering Tasks: Hydro, Structural → sets Loading Method → clicks Save → project appears under "New Inquires" with 0% progress

### UJ-2: Engineering Team Works a Discipline

**Persona:** Engineer (PIC Engineering)
**Entry:** Engineering listing → clicks the project → Engineering Tasks tab → Hydro sub-tab
**Journey:** Reviews Engineering Details → adds a Task via "Add Task" → uploads a supporting file via "Add File" → starts a discussion via "Start New Conversation" → once work is ready, clicks "Send for Approval" → status moves out of "Under Discussion"

### UJ-3: Manager Reviews Team Workload

**Persona:** Engineering Manager
**Entry:** Sidebar → Engineering Task → Kanban view
**Journey:** Switches Group By to Assignee → reviews cards across Todo/In Progress/Review/Done per engineer → drags an overdue card from In Progress to Review → opens Group WorkLogs → adds a widget grouped by Office, Period: Days, Metric: Logged Time → reviews utilisation for the month

### UJ-4: Finding a Lost Document

**Persona:** Any user
**Entry:** Sidebar → Document Search
**Journey:** Searches by partial file name → result shows the file's originating Engineering Project and discipline → clicks through to the source record's Files/Engineering Tasks tab
