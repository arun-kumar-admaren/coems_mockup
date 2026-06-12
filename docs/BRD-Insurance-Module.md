# Business Requirements Document

## 1. Description

The Insurance module is designed to provide a centralised system for creating, managing, tracking, and monitoring marine insurance policies across vessel operations, fixture agreements, and crew activities within the COEMS platform.

The module replaces existing manual and fragmented processes (emails, Excel sheets, broker correspondence) with a unified digital workflow integrated within the COEMS platform.

It enables:

- Standardised insurance policy recording across Fixture, Vessel, and Crew categories
- Structured classification of cover types with category-driven field dependencies
- Centralised tracking of policy details including broker, insurer, cover period, and financial limits
- Linkage of insurance records to operational modules (Fixture and Vessel)
- Integration with the Legal Review module for compliance and document review tracking
- Role-based access control to protect data integrity

Insurance records can be created either directly from the Insurance module or from within the Fixture and Vessel edit overlays, ensuring seamless integration with operational workflows.

The system supports three categories of insurance records:

- **Fixture** — Covers charterers' liability, cargo, and contract-related risks
- **Vessel** — Covers hull, machinery, P&I, and vessel-specific risks
- **Crew** — Covers crew liability, medical, repatriation, and personal risks

Mockup link — http://localhost:5173 (local development server)

---

## 2. Key Components

### 2.1 Insurance Record Creation & Management

- Insurance creation via:
  - Insurance module (standalone entry via "New Insurance" button)
  - Fixture module (Insurance tab within the Fixture edit overlay)
  - Vessel module (Insurance tab within the Vessel edit overlay in Settings)
- Overlay-based data entry interface with flat scrollable form
- Auto-generated Insurance No. following the format: `INS-[Current Year]-[Sequential Number]` (e.g. INS-2026-001)
- Form is organised into four sections:
  - **Cover Details** — Category & Entity, Cover & Policy, Financials
  - **Parties** — Broker, Insurer
  - **Workflow & Dates** — Key Dates
  - **General** — Status, Created By, Remarks
- Core fields include:
  - Insurance Category (Fixture / Vessel / Crew)
  - Linked Entity (Fixture Number / Vessel Name / Crew description) — conditional on category
  - Type of Cover — filtered dropdown dependent on Insurance Category
  - Insurance Type / Clause Type
  - Policy Number and Policy / Cover Reference
  - Currency, Deductible, Limit of Liability / Sum Insured
  - Broker, Broker Reference Number, Broker Contact
  - Leading Insurer, Insurer Contact
  - Date of Notification to Broker, Cover Start Date, Cover End Date
  - Insurance Status, Created By, Remarks
- The **Create Insurance** button is enabled only when mandatory fields are filled:
  - Insurance Category
  - Linked Entity (Fixture / Vessel / Crew)
  - Type of Cover
  - Insurance Status

### 2.2 Insurance Classification Framework

- Insurance Category drives the Type of Cover dropdown and the linked entity field
- Changing the Insurance Category resets the Type of Cover selection

| **Insurance Category** | **Available Type of Cover Options** |
| --- | --- |
| Fixture | Charterers' P&I, FD&D / Defence, Cargo Liability, Additional Contractual Insurance, Bunkers Cover, Container / Equipment Cover |
| Vessel | Hull & Machinery, Owners' P&I, War Risks, Loss of Hire, Pollution Liability, Wreck Removal, Marine Liability / Property Damage |
| Crew | Crew Liability, Medical Expenses, Repatriation, Death & Disability, Crew Wages, Personal Effects |

- Insurance Type / Clause Type is an independent field with the following options:
  - Institute Cargo Clauses A / B / C
  - Institute Time Clauses Hull
  - Institute Voyage Clauses Hull
  - Institute War Clauses (Ship)
  - P&I Rules
  - Bespoke / Other

### 2.3 Insurance Edit Overlay

- Opening an Insurance record from the listing page launches the Edit Insurance overlay
- The overlay header displays key read-only summary fields:
  - Insurance No, Insurance Category, Type of Cover, Cover Period, Created By
  - **Insurance Status** is the only field editable directly from the header; changes automatically sync to the Overview tab
- The edit overlay provides two tabs:
  - **Overview** — All creation fields, fully editable with the same validations as Add New Insurance. Includes Update Insurance and Cancel buttons
  - **Legal Review** — Allows linking or creating Legal Review records related to this Insurance record (see Section 2.6)
- The kebab menu (⋮) in the edit overlay provides:
  - Export
  - Delete Insurance (visible only to Admin and Super Admin roles)

### 2.4 Insurance Listing & Data Management

- Centralised insurance list view accessible from the sidebar
- The listing page header includes:
  - Search bar (searches across Insurance No, Category, Type of Cover, Broker, Leading Insurer, and Linked Entity)
  - Add Filter button
  - Status group filter tabs: All, Active, Pending, Approved, Expired, Cancelled, Rejected
  - List / Trash toggle button group
  - Archived toggle (Off by default)
  - New Insurance button
  - Kebab menu (Delete Selected, Archive Selected, Unarchive Selected)
  - Column Show/Hide & Reorder icon
- All 24 columns are available on the listing page (ID and Insurance No are fixed; remaining 22 columns are configurable):

| **Column** | **Column** |
| --- | --- |
| ID | Insurance No |
| Category | Linked Entity |
| Type of Cover | Insurance Type / Clause Type |
| Policy Number | Policy / Cover Reference |
| Currency | Deductible |
| Limit of Liability / Sum Insured | Broker |
| Broker Reference Number | Broker Contact |
| Leading Insurer | Insurer Contact |
| Date of Notification to Broker | Cover Start Date |
| Cover End Date | Insurance Status |
| Created By | Remarks |
| Created Date | Actions |

- Expandable row — each record with a linked entity shows an expand arrow that reveals a sub-row displaying the linked entity's identifier, type (colour-coded badge), and name
- Horizontal scrolling is implemented for column overflow
- Column width adjustment is available
- Records are sorted by created date and time — latest first
- Footer displays: total record count, items-per-page selector (25 / 50 / 100), range indicator, and Previous / Next pagination

### 2.5 Search & Filter

- **Search** — free text keyword search across: Insurance No, Category, Type of Cover, Insurance Type / Clause Type, Policy Number, Policy / Cover Reference, Broker, Broker Reference Number, Broker Contact, Leading Insurer, Insurer Contact, Insurance Status, Created By, Remarks
- **Add Filter** — panel listing all available filters in alphabetical order with a search box inside the panel:
  - Text + checkbox list: Insurance No, Category, Linked Entity, Type of Cover, Insurance Type / Clause Type, Policy Number, Policy / Cover Reference, Currency, Broker, Broker Reference Number, Broker Contact, Leading Insurer, Insurer Contact, Insurance Status, Created By
  - Numeric range (Min / Max): Deductible, Limit of Liability / Sum Insured
  - Date range (From / To): Date of Notification to Broker, Cover Start Date, Cover End Date, Created Date
- Multiple filters can be applied simultaneously

### 2.6 Column Show / Hide & Reorder

- A Show/Hide icon is available at the top-right corner of the column titles row
- On clicking, two tabs are displayed:
  - **Show/Hide** — includes a search field, Select All option, and checkboxes for each configurable column; Update button applies changes
  - **Reorder** — includes a drag-and-drop list of column titles; Reset and Update buttons
- ID and Insurance No are mandatory fixed columns; all other 21 columns are configurable

### 2.7 Delete & Restore

- **Delete** (Admin / Super Admin only):
  - Available via the kebab menu in the List tab when at least one record is selected
  - Confirmation pop-up: *"Are you sure you want to delete the selected insurance records?"*
  - On confirmation: toast — *"Insurance record deleted successfully"*; records moved to Trash tab
- **Trash tab** — displays soft-deleted records; search and filter are available; records cannot be opened or edited
- **Restore**:
  - Available via the kebab menu in the Trash tab when at least one record is selected
  - Confirmation pop-up: *"Are you sure you want to restore the selected insurance records?"*
  - On confirmation: toast — *"Insurance record restored successfully"*; records returned to List tab

### 2.8 Archive & Unarchive

- **Archived toggle** (Off by default) — when switched On, shows archived records highlighted with a distinct colour
- **Archive** — available in the kebab menu; enabled when at least one non-archived record is selected; confirmation required; toast: *"Insurance record archived successfully"*
- **Unarchive** — available in the kebab menu of the Archived view; enabled when at least one archived record is selected; confirmation required; toast: *"Insurance record unarchived successfully"*
- **Mixed view** — when the Archived toggle is On, both archived and non-archived records are displayed; selecting records from both groups enables both Archive and Unarchive options simultaneously; the system acts on each record according to its current state

### 2.9 Integration with Core Modules

- **Fixture module**:
  - An Insurance tab is available inside the Fixture edit overlay
  - Users can Add New Insurance (Insurance Category and Fixture pre-filled) or Link existing records
  - Linked insurance records are displayed as cards grouped by Insurance Status
  - New records created from the Fixture overlay are also visible in the main Insurance module listing
- **Vessel module (Settings → Own Vessels)**:
  - An Insurance tab is available inside the Vessel edit overlay
  - Users can Add New Insurance (Insurance Category and Vessel pre-filled) or Link existing records
  - Same card and grouping behaviour as the Fixture Insurance tab
  - New records created from the Vessel overlay are also visible in the main Insurance module listing

### 2.10 Legal Review Integration (Insurance Edit Overlay)

- A **Legal Review** tab is available within the Insurance edit overlay
- Provides two actions:
  - **Add New Review** — opens the Create New Review overlay with Related To pre-set to the current Insurance No
  - **Link Review** — searchable dropdown to link existing reviews from the Legal Review module
- Linked reviews are displayed as cards showing: Review Number, Related To, Review Type, E Filing Number, Due Date, Review Raised By, Legal Review Status
- Clicking a card opens the Review Edit overlay
- Each card has a kebab menu with an **Unassign** option (with confirmation)
- Update Insurance and Cancel footer buttons are hidden when the Legal Review tab is active

### 2.11 User Permissions & Access Control

| **Action** | **All Roles** | **Admin / Super Admin** |
| --- | --- | --- |
| Create Insurance | ✅ | ✅ |
| Edit Insurance | ✅ | ✅ |
| Delete Insurance | ❌ | ✅ |
| Archive / Unarchive | ✅ | ✅ |

- Delete Insurance option is hidden from the kebab menu for non-Admin roles
- No additional permission checkbox is required in User settings — access is determined by the user's existing role assignment

---

## 3. Project Scope

The scope of this project includes the design and implementation of a centralised Insurance policy management module within the COEMS platform.

The module will:

- Digitise and standardise marine insurance policy recording
- Enable structured classification of cover types by category
- Provide visibility into the current insurance position across vessels, fixtures, and crew
- Facilitate tracking of policy details, key dates, and financial exposure
- Integrate insurance data with operational modules (Fixture and Vessel)
- Enforce role-based access control for data deletion

### 3.1 In Scope

- Insurance record creation from the Insurance module, Fixture overlay, and Vessel overlay
- Overlay-based UI for insurance data entry with category-driven field dependencies
- Auto-generated Insurance No.
- Cover type classification framework (Fixture / Vessel / Crew with specific options per category)
- Insurance listing page with 24 columns, search, filter, sorting, and pagination
- Column Show/Hide and Reorder functionality
- Status group filter tabs (All, Active, Pending, Approved, Expired, Cancelled, Rejected)
- Insurance edit overlay with read-only header summary and editable Overview tab
- Insurance Status inline edit from header (synced to Overview tab)
- Delete and Restore functionality (Admin / Super Admin only) with Trash tab
- Archive and Unarchive functionality with mixed-view support
- Insurance tab within the Fixture edit overlay (Add / Link / Card view / Unassign)
- Insurance tab within the Vessel edit overlay in Settings (Add / Link / Card view / Unassign)
- Legal Review tab within the Insurance edit overlay (Add / Link / Unassign)
- Role-based access control (Delete restricted to Admin / Super Admin)
- Toast notifications for all confirmed actions

### 3.2 Out of Scope

- Full claims processing and settlement workflows
- Automated premium calculation or invoice generation
- Integration with external insurance portals or broker systems
- Advanced analytics dashboards and reporting beyond the listing view
- Document storage and attachment management (e.g. policy documents, certificates)
- Renewal workflow and automated expiry notifications
- Multi-currency conversion and exchange rate management

---

## 4. Business Drivers

- Eliminate manual and duplicate policy data entry across emails and spreadsheets
- Improve data consistency and accuracy of insurance records across operational teams
- Ensure full visibility of insurance coverage positions linked to specific fixtures and vessels
- Enable faster retrieval and audit of policy information during claims or legal review events
- Provide management with consolidated visibility of active and expiring insurance coverage
- Reduce risk of uninsured exposure through structured recording of cover periods and limits
- Enhance operational efficiency by embedding insurance management directly into the Fixture and Vessel workflows
- Support compliance and audit requirements through structured data and role-based access controls

---

## 5. Assumptions

- All insurance records are associated with at least one operational entity: a Fixture, Vessel, or Crew group
- Users will provide insurance details at the time of policy placement or renewal
- The Insurance team / operations team is responsible for maintaining accurate policy data
- Insurance Category, Type of Cover, and Clause Type master lists will be maintained and updated as needed
- Users have appropriate system access to create and edit insurance records based on their role
- Broker and Insurer master data will be maintained in the system
- Claims linkage and premium accounting will be handled in separate modules
- Legal Review integration is managed through the existing Legal Review module

---

## 6. Constraints

- Type of Cover dropdown values are strictly dependent on the selected Insurance Category — any change to the category resets the field
- Cover End Date must not be earlier than Cover Start Date
- The Insurance No. is system-generated and cannot be manually entered or edited
- Delete functionality is restricted to Admin and Super Admin roles and cannot be bypassed
- Character limits apply: Remarks — 10,000 characters; E Filing Number — 50 alphanumeric characters
- Data quality depends on manual input accuracy by users
- User adoption and training are required for consistent and complete data entry
- Performance considerations for records with multiple linked entities, reviews, and history entries

---

## 7. Mock up – Screen Shots

### 7.1 Insurance Listing Page

*(Accessible from sidebar → Insurance)*

- Displays all insurance records in a tabular format
- Header contains: Search, Add Filter, Status Group Tabs, List/Trash, Archived toggle, New Insurance button, Kebab menu, Column Show/Hide icon
- Table columns: Insurance No (colour-coded), Category badge, Type of Cover, Linked Entity, and all other configured columns
- Footer shows record count, items per page, and pagination

### 7.2 Create New Insurance Overlay

*(Opens on clicking "New Insurance")*

- Right-side slide-in panel
- Sections: Cover Details (Category & Entity, Cover & Policy, Financials), Parties (Broker, Insurer), Workflow & Dates (Key Dates), General
- Insurance Category selection dynamically shows/hides the entity field (Fixture / Vessel / Crew) and filters the Type of Cover dropdown
- Create Insurance button is disabled until mandatory fields are filled
- Cancel button closes without saving

### 7.3 Insurance Edit Overlay

*(Opens on clicking a record row)*

- Right-side slide-in panel with summary header (Insurance No, Category, Type of Cover, Cover Period, Status, Created By)
- Insurance Status is editable directly from the header
- Tabs: Overview (editable form) and Legal Review (review cards with Add/Link options)
- Footer: Update Insurance and Cancel buttons (hidden on Legal Review tab)

### 7.4 Insurance Tab inside Fixture Edit Overlay

*(Fixture → Edit Overlay → Insurance tab)*

- Displays insurance cards linked to the selected Fixture
- Cards grouped by Insurance Status order: Active → Pending → Approved → Expired → Cancelled → Rejected
- Add New Insurance opens a pre-filled overlay (Category = Fixture, Fixture = current)
- Link Insurance dropdown searches existing records

### 7.5 Insurance Tab inside Vessel Edit Overlay

*(Settings → Own Vessels → Vessel → Insurance tab)*

- Same Add/Link/Card behaviour as the Fixture Insurance tab
- Pre-fills Insurance Category = Vessel and Vessel = current vessel name
- New records created here are also visible in the main Insurance module listing
