# Business Requirements Document
## Legal Review Module — COEMS Platform

**Document Reference:** COEMS-LR-BRD-001  
**Version:** 1.0  
**Date:** 2026-06-01  
**Project:** COEMS (Commercial Operations & Enterprise Management System)

---

## 1. Description

The Legal Review module is designed to provide a centralised system for creating, managing, tracking, and reviewing legal documents and agreements across vessel and commercial operations within the COEMS platform.

The module replaces existing manual and fragmented processes (emails, Excel sheets, shared drives) with a unified digital workflow integrated within the COEMS platform.

It enables:

- Standardised legal review record creation and tracking
- Structured review lifecycle management
- Task and subtask management within each review
- Integration with Inquiry, Fixture, and Scope modules
- Flexible column visibility and reorder preferences per user
- Archive, restore, and soft-delete capabilities
- Role-based access control for legal review records

Legal Reviews can be created either directly within the Legal Review module (standalone) or from within the Inquiry, Fixture, or Scope edit overlays, ensuring seamless integration with commercial and operational workflows.

The system supports the following review types:

- Documents
- NDA (Non-Disclosure Agreement)

---

## 2. Key Components

### 2.1 Legal Review Creation & Management

- Legal review creation via:
  - Legal Review Hub (standalone entry — "Add Review" button)
  - Inquiry module (Legal Review tab — "Add New Review")
  - Fixture module (Legal Review tab — "Add New Review")
  - Scope module (Legal Review tab — "Add New Review")
- Overlay/sheet-based data entry interface
- Auto-generated review numbering system following the format: `REV-[YYYY]-[XXXX]` (e.g., `REV-2026-0001`)
- System-generated sequential ID per record

**Core fields include:**

| Field | Details |
|---|---|
| Review Number | Auto-generated, read-only |
| Related To | Multi-select (Inquiry, Fixture, Scope) |
| Items | Linked record IDs grouped by category (Inquiry / Fixture / Scope) |
| Review Type | Dropdown — Documents, NDA |
| Description | Free text |
| Legal Review Status | Dropdown — To be reviewed by Legal / Under Review / Reviewed / Not Required |
| E Filing Number | Alphanumeric input |
| Due Date | Date picker |
| Review Raised By | User selector |
| To Be Reviewed By | User selector |
| Created Date | System-generated, read-only |

**Context-aware pre-population:**  
When a review is created from within an Inquiry, Fixture, or Scope overlay, the **Related To** field is pre-set to the respective module type, and the current record is pre-selected in the **Items** field.

---

### 2.2 Review Type & Status Classification

**Review Types:**

| Value | Badge Style |
|---|---|
| Documents | Blue (`bg-blue-100 text-blue-700`) |
| NDA | Purple (`bg-purple-100 text-purple-700`) |

**Legal Review Statuses:**

| Status | Badge Style |
|---|---|
| To be reviewed by Legal | Red (`bg-red-100 text-red-700`) |
| Under Review | Yellow (`bg-yellow-100 text-yellow-700`) |
| Reviewed | Green (`bg-green-100 text-green-700`) |
| Not Required | Grey (`bg-gray-100 text-gray-700`) |

---

### 2.3 Task Management

The Legal Review module supports structured task and subtask management within each review record.

- Task Management is available **only in Edit mode** of a Legal Review, not during initial creation.
- Each review can have multiple tasks; each task can have multiple subtasks.

**Task fields:**

| Field | Type | Required |
|---|---|---|
| Name | Free text | Mandatory |
| Labels | Free text | Optional |
| Description | Free text | Optional |
| Reporter | Free text | Optional |
| Assignee | Free text | Optional |
| Start Date | Date picker | Optional |
| Due Date | Date picker | Optional |
| Flagged | Yes / No | Optional |
| Is Deliverable | Yes / No | Mandatory |
| Timezone | Dropdown | Optional |
| Priority | Low / Medium / High | Optional |
| Status | TODO / IN PROGRESS / DONE | Optional |
| Estimation | Free text (e.g., 2w 4d 6h 45m) | Mandatory |

**Task Detail Overlay** (on clicking a task row):

- **Left Panel:** Task Name, Description, Sub Tasks (clickable), Activity (Comments / History / Work Log tabs)
- **Right Panel:** Read-only metadata — Labels, Priority, Status, Flagged, Start Date, Due Date, Assignee, Estimation, Timezone, Created Date, Last Modified Date
- **Action Buttons:** Refresh, Watch, Archive, More (⋮), Close

**Subtask behaviour:**
- Each task row has a "+" button to add a subtask linked to the parent.
- Parent tasks auto-expand to show newly added subtasks.
- Parent tasks have an expand/collapse toggle for subtask visibility.

---

### 2.4 Review Lifecycle & Workflow

Review lifecycle statuses:

```
To be reviewed by Legal → Under Review → Reviewed
                                       → Not Required
```

- Reviews are initially created with a status set by the creating user.
- The Legal team manages status updates throughout the review lifecycle.
- Status is tracked and visible on both the Legal Review Hub listing and within embedded tabs in Inquiry / Fixture / Scope overlays.

---

### 2.5 Integration with Core Modules

**Inquiry Module:**
- Legal Review tab within the Inquiry edit overlay
- Options: Add New Review (pre-filled) / Link Review (searchable dropdown)
- Review cards displayed with: Review Number, Related To, Review Type, E Filing Number, Due Date, Review Raised By, Legal Review Status
- Unassign option available via card kebab menu (with confirmation pop-up)

**Fixture Module:**
- Legal Review tab within the Fixture edit overlay
- Same behaviour as Inquiry tab (pre-set to "Fixture" context)

**Scope Module:**
- Legal Review tab within the Scope edit overlay
- Same behaviour as Inquiry/Fixture tab (pre-set to "Scope" context)

**Link Review (shared behaviour across all modules):**
- Searchable dropdown to link existing reviews from the Legal Review hub
- Search by: Review Number, Review Type, Legal Review Status
- Already-linked reviews are excluded from search results

---

### 2.6 Legal Review Listing Page (Hub)

Centralised legal review list view accessible from the main sidebar under **Operations → Legal Review**.

**Header section:**

| Element | Details |
|---|---|
| Search Bar | Real-time keyword search (left side of header) |
| Add Filter | Opens advanced filter panel (alphabetical filter list, scrollable, with search) |
| List / Trash toggle | List (default) shows active reviews; Trash shows soft-deleted reviews |
| Archived toggle | Off (default) shows active reviews; On shows archived reviews |
| Add Review | Opens Create New Review overlay |
| Kebab Menu (⋮) | Contains: Delete Selected Review, Archive Selected Reviews, Unarchive Selected Reviews |
| Column Show/Hide & Reorder | Icon at top-right of column header row |

**Table columns (default order):**

| # | Column | Details |
|---|---|---|
| 1 | Expand/Collapse (▶) | Shown when a review has linked records; expands to sub-rows |
| 2 | ID | System-generated sequential number |
| 3 | Review No | Auto-generated (e.g., REV-2026-0001) |
| 4 | Review Type | Colour-coded badge (Documents / NDA) |
| 5 | Description | Truncated display; dash when empty |
| 6 | Legal Review Status | Colour-coded badge |
| 7 | E Filing Number | Plain text; dash when empty |
| 8 | Due Date | Plain text; dash when empty |
| 9 | Review Raised By | Plain text; dash when empty |
| 10 | To Be Reviewed By | Plain text; dash when empty |
| 11 | Created Date | ISO date (YYYY-MM-DD) |

**Expandable Related Records (sub-rows):**

Each review linked to one or more records shows an expand arrow. Sub-rows display:

| Sub-list Column | Details |
|---|---|
| Item | ID of the linked record (e.g., CR-2026-272, AEW-F-2026-407) |
| Type | Category badge — Inquiry (sky), Fixture (violet), Scope (orange) |
| Name | Display name of the linked record |

**Footer:**
- Found N record(s) — reflects filtered count
- Items per page: 25 / 50 / 100
- Range display: X – Y of Z
- Previous / Next pagination controls

**Default sort order:** Latest created date/time first.  
**Horizontal scrolling** is enabled to accommodate the full column set.  
**Column width adjustment** is available for resizing columns.

---

### 2.7 Search & Filter

**Search (real-time, multi-field):**

Users can search by entering keywords across:
- Review Number
- Review Type
- Description
- Legal Review Status
- E Filing Number
- Review Raised By
- To Be Reviewed By

**Advanced Filter (Add Filter panel):**

| Filter Name | Filter Type |
|---|---|
| Review No | Search text + checkbox list |
| Related To | Search text + checkbox list (Inquiry, Fixture, Scope) |
| Items | Search text + checkbox list (grouped by category) |
| Review Type | Search text + checkbox list (Documents, NDA) |
| Description | Free-text keyword match |
| Legal Review Status | Search text + checkbox list (all 4 statuses) |
| E Filing Number | Search text + checkbox list |
| Due Date | Date range selector (From & To) |
| Review Raised By | Search text + checkbox list |
| To Be Reviewed By | Search text + checkbox list |
| Created Date | Date range selector (From & To) |

- Filters are listed in alphabetical order within the panel.
- Multiple filters can be combined simultaneously.
- A search box is available within the filter list.

---

### 2.8 Column Show/Hide & Reorder

A Show/Hide icon is available in the top-right corner of the listing page column header.

**Show/Hide tab:**
- Search field, Update button, Select All option
- Checkbox list for column visibility control

**Reorder tab:**
- Reset button, Update button
- Drag-and-drop column reordering

**Configurable columns (Show/Hide & Reorder):**
- Related To, Items, Review Type, Description, Legal Review Status, E Filing Number, Due Date, Review Raised By, To Be Reviewed By, Created Date

**Mandatory (non-configurable) columns:**
- ID and Review No — always visible, not available in Show/Hide or Reorder

---

### 2.9 Archive & Unarchive

**Archive toggle (header):**
- OFF (default): Shows active, non-archived reviews
- ON: Shows archived reviews (highlighted in a distinct colour)

**Kebab menu — Archive Selected Reviews:**
- Enabled only when at least one non-archived review is selected
- Confirmation pop-up: *"Are you sure you want to archive the selected reviews?"* — Yes / No
- On Yes: Toast — *"Review archived successfully"*; item moves to archived list

**Kebab menu — Unarchive Selected Reviews:**
- Enabled only when at least one archived review is selected
- Confirmation pop-up: *"Are you sure you want to unarchive the selected reviews?"* — Yes / No
- On Yes: Toast — *"Review unarchived successfully"*; item returns to the List tab

**Mixed selection (when Archived toggle is ON):**
- Selecting non-archived reviews enables Archive option
- Selecting archived reviews enables Unarchive option
- Selecting both enables both options; the system acts on each accordingly

---

### 2.10 Delete & Restore (Trash)

**Delete (List tab kebab menu):**
- Enabled only when at least one review is selected
- Confirmation pop-up: *"Are you sure you want to delete the selected reviews?"* — Yes / No
- On Yes: Toast — *"Review deleted successfully"*; item moves to Trash tab
- Deleted reviews are **soft-deleted** and recoverable

**Trash tab:**
- Displays all soft-deleted reviews, ordered by deletion date/time (latest first)
- Supports same header features: Search, Add Filter, Column Show/Hide & Reorder
- Line items in Trash are **not openable** for editing

**Restore (Trash tab kebab menu):**
- Enabled only when at least one trashed review is selected
- Confirmation pop-up: *"Are you sure you want to restore the selected reviews?"* — Yes / No
- On Yes: Toast — *"Review restored successfully"*; item returns to the List tab

---

### 2.11 User Permissions

A role-based permission model controls Legal Review editing access.

**"Legal" Permission (User Settings):**
- Available as a checkbox in both the User Add and User Edit overlays
- Located under the "Board of Director" checkbox
- Optional; unchecked by default

| Scenario | Create | Edit | Delete |
|---|---|---|---|
| User has Legal permission | Yes | Yes | Yes |
| User does NOT have Legal permission | Yes | No | No |

- Restrictions are enforced across **all entry points** where Legal Review editing is possible (Hub, Inquiry tab, Fixture tab, Scope tab).
- Users without Legal permission can create reviews but cannot modify or delete existing ones, including records they created themselves.

---

## 3. Project Scope

The scope of this project includes the design and implementation of a centralised Legal Review management module within the COEMS platform.

The module will:

- Digitise and standardise legal review creation and tracking
- Enable structured task and subtask management within reviews
- Provide visibility into review statuses and pending legal actions
- Facilitate linkage of legal reviews to operational records (Inquiry, Fixture, Scope)
- Support flexible listing, filtering, and personalisation of the review hub
- Enforce role-based access to protect data integrity

### 3.1 In Scope

- Legal Review creation from the Hub and from Inquiry / Fixture / Scope module overlays
- Sheet/overlay-based UI for review data entry and editing
- Auto-generated review numbering (REV-YYYY-XXXX)
- Review type classification (Documents, NDA)
- Legal review status lifecycle management
- Task and subtask management within reviews
- Task Detail Overlay with left/right panel layout
- Embedded Legal Review tab in Inquiry, Fixture, and Scope edit overlays
- Link Review functionality (search and link existing reviews)
- Unassign review from linked module records
- Legal Review Hub listing with full column set
- Expandable sub-rows for linked records
- Real-time search across key fields
- Advanced filter panel (Add Filter)
- Status filter tabs (All / To be reviewed by Legal / Under Review / Reviewed / Not Required)
- Column Show/Hide & Reorder functionality
- Archive / Unarchive reviews
- Soft-delete and Restore (Trash tab)
- Role-based access control (Legal permission)
- Horizontal scrolling and column width adjustment
- Pagination controls (footer)
- localStorage-based data persistence (current phase)

### 3.2 Out of Scope

- Full claims processing and settlement workflows
- Financial accounting and invoicing logic
- Advanced analytics dashboards (beyond basic review status reporting)
- Automated legal notifications or external legal system integrations
- E-filing system integration (E Filing Number is entered manually)
- Functional pagination beyond client-side filtering (deferred)
- Floating chat button functionality (placeholder UI only in current phase)
- API/backend migration from localStorage (deferred to subsequent phase)

---

## 4. Business Drivers

- Eliminate manual and fragmented legal review tracking across email and shared documents
- Improve visibility and accountability for pending legal reviews across the commercial team
- Ensure compliance with legal review obligations for charter parties, NDAs, and regulatory documents
- Enable structured task management to support legal review workflows
- Reduce review delays by providing clear status tracking and responsible-party assignment
- Integrate legal review data with commercial records (Inquiry, Fixture, Scope) to avoid data silos
- Protect sensitive legal data through role-based access control

---

## 5. Assumptions

- Legal reviews are associated with one or more records from the Inquiry, Fixture, or Scope modules
- The Legal team holds the "Legal" permission and is responsible for editing and closing reviews
- Users without the Legal permission can initiate reviews but cannot edit or delete them
- Review numbering follows the format `REV-[Current Year]-[Sequential Number]` and is system-generated
- Items available in the Related To / Items fields are pulled from the active Inquiry, Fixture, and Scope records in COEMS
- Data persistence in the current phase relies on localStorage; API integration is planned for a future phase
- User directory for "Review Raised By" and "To Be Reviewed By" fields is maintained within the COEMS user management system

---

## 6. Constraints

- Items-by-category grouping depends on live data from Inquiry, Fixture, and Scope modules
- Data quality may vary due to manual input (E Filing Number, description fields)
- User adoption and training are required, particularly for the Legal permission setup
- Column visibility and reorder preferences are user-specific and must be persisted per user session
- Performance considerations for reviews with multiple linked records, tasks, and subtasks
- Horizontal scrolling is required due to the number of columns exceeding typical viewport width

---

## 7. User Stories Reference

The following user stories define the functional requirements for this module:

| Story | Description |
|---|---|
| Listing Page | View and manage all legal reviews from the Legal Review Hub |
| Search & Filter | Apply search and advanced filters on the listing page |
| Show/Hide & Reorder Columns | Customise column visibility and order |
| Archive / Unarchive | Archive and unarchive selected reviews |
| Delete / Restore (Trash) | Soft-delete reviews and restore from Trash tab |
| Tasks & Subtasks | Create and manage tasks and subtasks within a review |
| Legal Review Tab — Inquiry | Add and manage reviews from within the Inquiry overlay |
| Legal Review Tab — Fixture | Add and manage reviews from within the Fixture overlay |
| Legal Review Tab — Scope | Add and manage reviews from within the Scope overlay |
| User Permission — Legal | Assign role-based Legal permission to users |

---

## 8. Mockup Reference

The UI design and screen flows for this module are defined in the COEMS Figma prototype:

**Figma:** [HSEQ — Claims and Insurance](https://www.figma.com/make/PjdGE1qBvMmQxriNQlinKY/HSEQ---Claims-and-Insurance?fullscreen=1&t=FzwxQlL3lHIPCuNe-1)

Key screens include:

1. **Legal Review Hub — Listing Page** (`src/app/components/legal.tsx`)
2. **Create New Review Overlay** (sheet within `legal.tsx`)
3. **Edit Review Overlay** (sheet within `legal.tsx`, includes Task section)
4. **Task Modal** (`legal-review-tab.tsx`)
5. **Task Detail Overlay** (`legal-review-tab.tsx`)
6. **Embedded Legal Review Tab** (`legal-review-embedded.tsx`) — used in Inquiry, Fixture, Scope overlays
