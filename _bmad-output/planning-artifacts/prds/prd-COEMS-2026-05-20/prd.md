---
title: "COEMS Legal Review Hub"
status: draft
created: 2026-05-20
updated: 2026-05-20
project: COEMS
scope: Legal Review Hub (standalone module — src/app/components/legal.tsx)
---

# PRD: COEMS Legal Review Hub

## 1. Overview

### 1.1 Problem Statement

The COEMS maritime operations platform manages complex commercial and legal workflows across Inquiries, Fixtures, and Scope items. Legal reviews — charter party vetting, NDA management, document sign-off — need to be tracked, assigned, and monitored in one place, without requiring legal staff to navigate into individual commercial records.

The Legal Review Hub (`src/app/components/legal.tsx`) is a **standalone module** accessible directly from the sidebar under "Legal Review". It manages its own review records independently, linking them to Inquiries, Fixtures, or Scope items via a reference relationship rather than embedding into those records.

### 1.2 What the Module Does

The Legal Review Hub provides two integrated surfaces in one component:

1. **Listing view** — A searchable, filterable table of all legal review records with status-coded badges and full-text search.
2. **Create / Edit Sheet** — A right-side panel for creating new reviews and editing existing ones, including task management with subtask support and a task detail overlay.

---

## 2. Goals & Success Metrics

### 2.1 Goals

| # | Goal |
|---|------|
| G-1 | Legal team can find and triage all pending reviews from a single hub, filtered by status |
| G-2 | Users can create a legal review, link it to one or more Inquiries / Fixtures / Scope items, and assign it to a reviewer |
| G-3 | Tasks within a review are trackable with ownership, priority, due date, and subtask decomposition |
| G-4 | Review status is always visible at a glance from the listing table |

### 2.2 Success Metrics

| Metric | Target | Counter-Metric |
|--------|--------|----------------|
| Time to locate all "To be reviewed by Legal" records | < 20 seconds from sidebar click | Hub initial render must not exceed 2s |
| Review creation completion rate (both required fields set) | ≥ 95% of opened Create Sheets result in a saved review | Measure form abandonment rate |
| Task assignment coverage | ≥ 80% of reviews with status "Under Review" have at least one assigned task | Task creation must not be a mandatory gate |

---

## 3. Users & Stakeholders

### 3.1 Primary Users

**Legal Team**
- Monitors the hub to triage pending and in-progress reviews
- Creates and updates review records; sets Legal Review Status
- Adds and manages tasks; assigns subtasks to team members

**Commercial / Operations Team**
- Creates review requests linked to specific Inquiries or Fixtures
- Monitors review status to unblock commercial workflows

**Management**
- Views the hub for portfolio-level overview of legal review status distribution

### 3.2 System Actor

- Auto-generates sequential Review Numbers in the format `REV-2026-NNNN` on record creation, persisted across sessions

---

## 4. Functional Requirements

### 4.1 Listing View

**FR-1.1** The system shall provide a top-level navigation entry labelled **"Legal Review"** (icon: Scale) in the Operations section of the main sidebar.

**FR-1.2** The listing view shall display a table of all review records with the following columns in order: **ID**, **Review Number**, **Review Type**, **Description**, **Legal Review Status**, **E Filing Number**, **Due Date**, **Review Raised By**, **To Be Reviewed By**, **Created Date**.

**FR-1.3** **Review Type** shall be rendered as a colored badge:
- `Documents` → blue (`bg-blue-100 text-blue-700`)
- `NDA` → purple (`bg-purple-100 text-purple-700`)
- Any unrecognised type → gray fallback

**FR-1.4** **Legal Review Status** shall be rendered as a colored badge:
- `Reviewed` → green (`bg-green-100 text-green-700`)
- `Under Review` → yellow (`bg-yellow-100 text-yellow-700`)
- `Not Required` → gray (`bg-gray-100 text-gray-700`)
- `To be reviewed by Legal` → red (`bg-red-100 text-red-700`)

**FR-1.5** The header shall provide a **status filter group** with tabs: `All`, `To be reviewed by Legal`, `Under Review`, `Reviewed`, `Not Required`. The active tab filters the table in real time without page reload.

**FR-1.6** The header shall provide a **search input** that filters the table in real time by: Review Number, Review Type, Description, or Legal Review Status (case-insensitive).

**FR-1.7** Clicking any table row shall open the Edit Sheet for that review record.

**FR-1.8** The footer shall display **"Found N record(s)"** reflecting the current filtered count.

**FR-1.9** The footer shall provide an **Items Per Page** selector (25 / 50 / 100) and pagination controls (previous / next). [ASSUMPTION: Pagination is currently UI-only; functional pagination is deferred until a backend data source is integrated — see OQ-1.]

**FR-1.10** An **"Add Review"** button in the header shall open the Create Sheet.

**FR-1.11** An **"Add Filter"** button shall be present in the header. [ASSUMPTION: Advanced filter functionality is not yet implemented; the button is a placeholder for a future multi-criteria filter panel — see OQ-2.]

**FR-1.12** An empty state shall display when no reviews exist, showing an icon, "No reviews yet" message, and a prompt to create the first one.

**FR-1.13** A filtered-empty state shall display when filters match no records: "No reviews match the current filter."

### 4.2 Create / Edit Sheet

**FR-2.1** The Create / Edit panel shall open as a right-side Sheet (`w-[560px]`) on desktop. The sheet title shall read "Create New Review" (create mode) or "Edit Review" (edit mode).

**FR-2.2** **Review Number** shall be displayed as a read-only field:
- Create mode: shows the next review number that will be assigned (`REV-2026-{NNNN}`)
- Edit mode: shows the review's assigned number
- Format: `REV-2026-` + zero-padded sequence number (4 digits minimum)

**FR-2.3** **Related To** (optional) shall be a multi-select dropdown using a Popover. Options: `None`, `Inquiry`, `Fixture`, `Scope`.
- Selecting `None` clears all other selections
- Selecting any non-None option removes `None` from the selection
- Changing `relatedTo` shall automatically prune the `items` list to only include items valid for the remaining selected categories

**FR-2.4** **Items** (optional) shall be a conditional multi-select Popover, visible only when at least one non-None category is selected in Related To. Items are grouped by category with a section header. Supported categories and their items:
- `Inquiry`: CR-2026-272, CR-2026-270, CR-2026-262, CR-2026-241
- `Fixture`: AEW-F-2026-407, AEW-F-2026-405, AEW-F-2026-401, AEW-F-2026-398
- `Scope`: Scope A, Scope B, Scope C

[ASSUMPTION: These item lists are currently hardcoded prototype data; production values shall be fetched dynamically from the respective modules — see OQ-3.]

**FR-2.5** **Review Type** (required) shall be a Select with values: `Documents`, `NDA`. The Save/Create button shall be disabled until this field is set.

**FR-2.6** **Description** (optional) shall be a multi-line Textarea with a maximum of 10,000 characters. A live character counter (`{n}/10000`) shall be displayed below the field.

**FR-2.7** **Legal Review Status** (required) shall be a Select with values: `To be reviewed by Legal`, `Under Review`, `Reviewed`, `Not Required`. The Save/Create button shall be disabled until this field is set.

**FR-2.8** **E Filing Number** (optional) shall be a text input, max 50 characters. Input shall be sanitized on every keystroke to strip non-alphanumeric characters (`/[^a-zA-Z0-9]/g`).

**FR-2.9** **Due Date** (optional) shall be a DatePicker. No date constraints apply.

**FR-2.10** **Review Raised By** (optional) shall be a Select populated from the system user list. Current users: Nikhil Mathew, John Doe, Tester Adminren, Aiswaryaa Adminren, Jacson Tom, Safna Basheer. [ASSUMPTION: This list shall be sourced dynamically from a COEMS user directory in production — see OQ-4.]

**FR-2.11** **To Be Reviewed By** (optional) shall be a Select using the same user list as Review Raised By (FR-2.10).

**FR-2.12** The **Save / Create button** shall be disabled unless both `reviewType` and `legalReviewStatus` are set. Button label: "Create Review" (create mode) / "Save Changes" (edit mode).

**FR-2.13** A **Cancel** button shall close the Sheet without saving changes.

### 4.3 Tasks (Edit Mode Only)

**FR-3.1** The Tasks section shall be visible only in **Edit mode**, not during initial record creation.

**FR-3.2** The Tasks section shall display a horizontally scrollable table with the following columns: expand/collapse toggle, Name, Labels, Reporter, Start Date, Flagged, Is Deliverable, Timezone, Priority, Status, Assignee, Due Date, Estimation.

**FR-3.3** **Add Task** button shall open the Task creation modal.

**FR-3.4** Clicking an existing task row shall open the Task detail overlay (view mode).

**FR-3.5** Each task row shall display a **"+" button** in the Due Date column that opens the Add Subtask modal for that task's ID.

**FR-3.6** Tasks with subtasks shall display an expand/collapse toggle (chevron). Expanding shows subtask rows indented beneath the parent with a visual connector line.

### 4.4 Task Create / Edit Modal

**FR-4.1** The Task modal shall render as a portal (`createPortal`) over the Sheet (z-index: 500) to avoid stacking context clipping. It shall have a backdrop that closes the modal on click.

**FR-4.2** Modal title:
- "Add New Task" when creating a new root task
- "Add Sub Task" when adding a subtask (shows parent task name as read-only)
- "Edit Task" when editing an existing task

**FR-4.3** Required fields: **Name**, **Estimation**, **Is Deliverable**. The Save button shall be disabled until all three are set.

**FR-4.4** Optional fields: Labels (Label 1 / Label 2), Description, Reporter, Start Date (native date input), Flagged (Yes / No), Timezone, Priority (Low / Medium / High; default: Medium), Status (TODO / IN PROGRESS / DONE; default: TODO), Assignee, Due Date (native date input).

**FR-4.5** Name validation state: underline turns red while the field is empty.

**FR-4.6** Estimation format hint: `2w 4d 6h 45m`. No pattern validation enforced — free text accepted.

**FR-4.7** **Create Another** checkbox shall be available in create mode only (hidden in edit mode). When checked, saving a task resets the form and keeps the modal open for the next task.

**FR-4.8** When adding a subtask, the modal shall display the parent task name as a read-only **Parent Task** field.

**FR-4.9** Saving a subtask shall nest it under the parent task's `subtasks` array and auto-expand the parent task row in the table.

### 4.5 Task Detail Overlay

**FR-5.1** The Task Detail overlay shall render as a portal (z-index: 500, same level as task modal) with a backdrop. It shall display at 820×85vh.

**FR-5.2** The overlay header shall display the task's auto-generated identifier (`TSK-{id.slice(0,6).toUpperCase()}`), plus action controls: Refresh, Watch, Archive, More (⋮), and Close.

**FR-5.3** The overlay shall have two panels:
- **Left panel**: Task name (h2), Description, Sub Tasks section, Activity section
- **Right panel** (280px): Read-only display of all task metadata fields

**FR-5.4** The Sub Tasks section shall list any subtasks with their ID, name, priority badge, and status badge. Clicking a subtask opens that subtask's own detail overlay.

**FR-5.5** An **"Add Sub Task"** button (+ icon) in the Sub Tasks section header shall close the task detail overlay and open the Add Subtask modal for the same parent task.

**FR-5.6** The **Activity section** shall provide three tab options: `Comments`, `History`, `Work log`. Each shall display a placeholder empty state. A comment input with a user avatar shall be present in the Comments tab.

**FR-5.7** [ASSUMPTION] The user avatar initials ("TA") and the comment input are placeholder UI; actual comment submission, history tracking, and work log logging are not yet functional — see OQ-5.

**FR-5.8** Archive button is a visual placeholder; archive functionality is not yet implemented — see OQ-6.

### 4.6 Data Persistence

**FR-6.1** Review records shall be persisted to `localStorage` under the key `legal-reviews` (JSON array). The sequential counter shall be persisted under `legal-reviews-count`.

**FR-6.2** On application load, the hub shall restore reviews and counter from localStorage. Parse errors shall fail silently and initialize with an empty state.

[ASSUMPTION: localStorage is the current persistence layer for the prototype. Migration to a server-side API is planned — see OQ-1. The localStorage schema shall be treated as the authoritative data contract until API contracts are defined.]

---

## 5. Non-Functional Requirements

**NFR-1 — Render performance**
The listing view shall display up to 500 records without visible lag. Filtering (status tabs, search) shall update the visible table within one render cycle.

**NFR-2 — Input sanitization**
E Filing Number sanitization shall fire on every `onChange` event, not on blur. Non-alphanumeric characters must never appear in the field even momentarily.

**NFR-3 — Portal rendering**
The Task Modal and Task Detail Overlay both use `createPortal` to mount on `document.body`. This is required to avoid z-index clipping from the Sheet component's stacking context. This pattern must be preserved in any refactor.

**NFR-4 — Stale data pruning**
When a user deselects a Related To category, the Items list must be pruned immediately to remove any items that no longer belong to a selected category. Items from retained categories must be preserved.

**NFR-5 — Accessibility**
- All Select/Dropdown fields shall have associated visible labels
- Modals and overlays shall trap focus while open and restore focus to the triggering element on close
- The task table shall be navigable by keyboard (tab order) for primary actions

---

## 6. Constraints & Assumptions

| ID | Type | Statement |
|----|------|-----------|
| C-1 | Constraint | Review Number format is `REV-2026-{NNNN}` and is system-assigned; users cannot override it |
| C-2 | Constraint | Both `reviewType` and `legalReviewStatus` are required before a review record can be saved |
| C-3 | Constraint | E Filing Number accepts only alphanumeric characters, max 50 |
| C-4 | Constraint | Tasks section is only available in Edit mode, not during initial record creation |
| C-5 | Constraint | Task modal and Task Detail Overlay must render via `createPortal` to avoid Sheet stacking context |
| A-1 | Assumption | localStorage is the current persistence layer; API migration is planned |
| A-2 | Assumption | Items lists (Inquiry IDs, Fixture IDs, Scope items) are prototype data; production values will come from dynamic lookups |
| A-3 | Assumption | User lists (USERS array) are prototype data; production values will come from COEMS user directory |
| A-4 | Assumption | Pagination is UI-complete but not functionally implemented; all matching records are currently shown |
| A-5 | Assumption | "Add Filter" button is a placeholder; advanced filter functionality is deferred |
| A-6 | Assumption | Activity (Comments / History / Work log), Archive, Watch, and Refresh in task detail are placeholder UI |

---

## 7. Out of Scope

- Embedded `LegalReviewTab` within InquiryDetail / FixtureDetail overlays (separate component, separate PRD)
- Charter Party, Insurance, and Compliance data capture (belongs to InquiryDetail/FixtureDetail legal tabs)
- Comment submission and activity history persistence
- Archive functionality for tasks
- Notification or alerting on status changes
- Role-based access control (RBAC)
- PDF/export of review records
- Real-time collaborative editing

---

## 8. Open Questions

| ID | Question | Owner | Blocking? |
|----|----------|-------|-----------|
| OQ-1 | What is the target persistence architecture — REST API, GraphQL, or real-time sync? What is the migration plan from localStorage? | Architecture | Yes — before production |
| OQ-2 | What should "Add Filter" support? Multi-criteria (type + status + date range + assignee)? | Product | No — deferred |
| OQ-3 | Should the Items popover be dynamically fetched from the Inquiry and Fixture modules, or will a static reference table be maintained? | Architecture | Yes — before production |
| OQ-4 | Should the USERS list be sourced from a central directory service, or maintained as a configuration within the Legal module? | Architecture | Yes — before production |
| OQ-5 | What is the planned timeline and data model for Comments, History, and Work log on tasks? | Product | No — deferred |
| OQ-6 | Should Archive remove a task from the active list, soft-delete it, or move it to a separate archive view? | Product | No — deferred |

---

## 9. User Journeys

### UJ-1: Legal Team Triages Pending Reviews

**Persona:** Legal team member  
**Entry:** Main sidebar → Legal Review  
**Journey:** Lands on listing view → clicks "To be reviewed by Legal" status tab → sees all unreviewed records highlighted in red badges → clicks a row → Edit Sheet opens → updates Legal Review Status to "Under Review" → clicks "Save Changes" → status badge in listing updates to yellow

### UJ-2: Commercial User Creates a Review Linked to a Fixture

**Persona:** Commercial / Operations user  
**Entry:** Sidebar → Legal Review → "Add Review"  
**Journey:** Create Sheet opens → sets Related To: Fixture → Items popover shows AEW-F-2026-xxx options → selects the relevant fixture ID → sets Review Type: Documents → sets Legal Review Status: To be reviewed by Legal → enters Review Raised By: own name, To Be Reviewed By: legal team member → clicks "Create Review" → record appears in listing with red status badge

### UJ-3: Legal Team Manages Tasks on a Review

**Persona:** Legal team member  
**Entry:** Listing → click row → Edit Sheet → Tasks section  
**Journey:** Clicks "Add Task" → enters Name, sets Estimation, sets Is Deliverable: Yes → assigns to team member → sets Priority: High, Due Date → saves → task appears in task table → clicks task row → Task Detail overlay opens → views all fields in right panel → clicks "+ Add Sub Task" → Add Sub Task modal opens with parent task pre-filled → creates subtask → parent task row now shows expand chevron → expands to see subtask

### UJ-4: Legal Team Reviews a Completed Review

**Persona:** Legal team member  
**Entry:** Listing → filter: "Under Review"  
**Journey:** Finds completed review → opens Edit Sheet → changes Legal Review Status to "Reviewed" → verifies E Filing Number is entered → clicks "Save Changes" → record now shows green badge in listing → filter "Under Review" no longer shows this record
