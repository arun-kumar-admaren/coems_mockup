# Business Requirements Document
## Inquiry Module — COEMS Platform

**Document Reference:** COEMS-INQ-BRD-001  
**Version:** 1.0  
**Date:** 2026-06-18  
**Project:** COEMS (Commercial Operations & Enterprise Management System)

---

## 1. Description

The Inquiry module is the commercial entry point in the COEMS platform, designed to capture, manage, and progress cargo inquiries received from clients, brokers, and internal teams. An inquiry represents a freight enquiry for a cargo shipment and forms the foundation for subsequent commercial steps including indications, fixtures, and voyage estimates.

The module enables:

- Centralised creation and management of cargo inquiries
- AI-assisted inquiry creation from raw email content
- Structured capture of cargo, freight, port, voyage, chartering, and client data
- Version-controlled indication generation and management
- Linking of voyage estimates to inquiries
- Commercial workflow progression (Inquiry → Indication → Fixture)
- Full audit trail via View History
- Integration with the Legal Review module for contract review workflows
- Soft-delete and Trash/Restore lifecycle management

Inquiries follow an auto-generated numbering format: `CR-[YYYY]-[NNN]` (e.g., `CR-2026-676`).

---

## 2. Key Components

### 2.1 Inquiry Listing Page

The listing page is the primary hub for viewing and managing all inquiry records, accessible from the main sidebar under **Chartering → Inquiry**.

**Header toolbar:**

| Element | Details |
|---|---|
| Search Bar | Keyword search across inquiry fields |
| Add Filter | Opens advanced filter panel |
| Mine / Office / All | Ownership filter — records owned by the user / the user's office / all users |
| Inquiry / Indicated / All | Type filter — pure inquiries / inquiries with indications / all records |
| List / Trash | View toggle — active records / soft-deleted records |
| New Inquiry | Opens the New Inquiry creation overlay |
| Kebab Menu (⋮) | Contains: Delete Inquiry |

**Table columns (default order):**

| # | Column | Details |
|---|---|---|
| 1 | ID | System-generated sequential number; sortable (default descending) |
| 2 | Cargo Number | Auto-generated reference (format: CR-YYYY-NNN) |
| 3 | Name | Cargo/inquiry name |
| 4 | Laycan | Laycan date range |
| 5 | Related Scope | Linked scope record(s) |
| 6 | Gross Freight | Calculated gross freight value |
| 7 | Indication Type | Charter party type (e.g., GENCON fios, HEAVYCON 2007) |
| 8 | Unit Number | Number of cargo units |
| 9 | Description | Short cargo description |
| 10 | Total Volume | Total cargo volume (cbm) |
| 11 | Total Weight | Total cargo weight (mts) |

**Footer:**
- Found N records — reflects filtered count
- Items per page: 25 / 50 / 100 (selector)
- Range display: X – Y of Z
- Previous / Next pagination controls

**Default sort order:** Latest ID first (descending).

---

### 2.2 New Inquiry Creation

Inquiries can be created via two methods:

#### 2.2.1 Standard Create Form

Clicking **New Inquiry** opens a creation overlay with the following sections and fields:

**Cargo Details:**

| Field | Type | Required |
|---|---|---|
| Indication Type | Dropdown | Optional |
| Cargo Category | Dropdown | Mandatory |
| Cargo Subcategory | Dropdown | Optional |
| Cargo Name | Text | Mandatory |
| Base Currency | Dropdown (default: US Dollar) | Mandatory |
| Conversion Rate As On | Date Picker | Mandatory |

**Client:**

| Field | Type | Required |
|---|---|---|
| Related Scope | Dropdown / Search | Optional |
| Account | Dropdown / Search | Optional |
| Broker | Dropdown / Search | Optional |

**Commissions:**

| Field | Type | Required |
|---|---|---|
| Choose Type | Dropdown (HQ, Broker, etc.) | Optional |
| Choose Name | Text / Dropdown | Optional |
| Add Rate | Numeric (%) | Optional |
| Apply To | Multi-select tags (Additional Freight / Detention & Demurrage / Freight) | Optional |

Multiple commission lines can be added via **Add New Commission**.

**Port of Loading:**

| Field | Type | Required |
|---|---|---|
| Search Ports | Dropdown / Search | Mandatory |
| Loading Terms | Dropdown | Optional |
| LAY/CAN | Date Range Picker | Optional |
| Unit/Number | Numeric (nos) | Optional |
| Total Volume | Numeric (cbm) | Mandatory |
| Total Weight | Numeric (mts) | Mandatory |
| Freight Ton | Numeric (frts) | Optional |
| Loading Term Remarks | Free Text | Optional |

Multiple ports of loading can be added via the **+** button.

**Port of Discharge:**

| Field | Type | Required |
|---|---|---|
| Search Ports | Dropdown / Search | Mandatory |
| Discharge Term | Dropdown | Optional |
| Unit/Number | Numeric (nos) | Optional |
| Total Volume | Numeric (cbm) | Optional |
| Total Weight | Numeric (mts) | Optional |
| Freight Ton | Numeric (frts) | Optional |
| Transit Requirements | Dropdown | Optional |
| Discharge Term Remarks | Free Text | Optional |

Multiple ports of discharge can be added via the **+** button.

**Cargo Measurement Summary (auto-calculated):**

| Field | Details |
|---|---|
| Unit/Number | Sum of all cargo units across ports |
| Total Volume | Aggregate volume (cbm) |
| Total Weight | Aggregate weight (mts) |
| Freight Ton | Aggregate freight tons (frts) |

**Cargo Income/Expense:**

| Field | Type |
|---|---|
| Account Head | Dropdown |
| Particulars | Text |
| Terms | Dropdown (default: Lumpsum) |
| Rate | Numeric |
| Qty | Numeric |
| Amount | Auto-calculated |

**Freight Details:**

| Field | Type | Required |
|---|---|---|
| Freight Calc Type | Radio button (Lumpsum / Units / Volume / Weight / Freight Ton) | Mandatory |
| Freight Currency | Dropdown (default: US Dollar) | Mandatory |
| Freight Rate | Numeric | Optional |
| Gross Amount | Auto-calculated, read-only | — |

**Chartering:**

| Field | Type | Required |
|---|---|---|
| Fixed By (Offices) | Dropdown | Optional |
| Person in Charge | User Selector | Optional |

**Optional Fields (via "Add Fields" button):**

The following fields can be added to the create form on demand:

| Field | Notes |
|---|---|
| Commission | Adds commission section if not already present |
| Cargo Description | Free text description of the cargo |
| Cargo Dimensions | Opens cargo dimension entry (see §2.3.2) |
| Intended Vessel | Vessel selector |
| Intended Vessel Type | Vessel type dropdown |
| Port of Discharge | Adds a discharge port entry (shown in red when required) |
| Port of Loading | Adds a loading port entry (shown in red when required) |

**Action Buttons:**
- **Extract Details** — available in the email flow (see §2.2.2)
- **Create Estimate** — checkbox; when checked, creates a linked voyage estimate on save
- **Save** — creates the inquiry record

---

#### 2.2.2 New Inquiry from Email (AI-Assisted)

A specialised creation mode that allows users to paste raw email content to auto-populate inquiry fields using AI extraction.

**Workflow:**

1. Click **New Inquiry** — a dialog appears with two options:
   - **Resume** — continue an in-progress unsaved inquiry
   - **Create New** — open a fresh form
2. On **Create New**, the overlay opens in a two-panel layout:
   - **Left panel:** Free-text area with placeholder "Paste your email below" — users paste the raw cargo inquiry email
   - **Right panel:** Structured form fields (same as §2.2.1)
3. Click **Extract Details** — the system parses the email and auto-populates all matching fields in the right panel
4. User reviews and corrects any extracted values
5. Click **Save** to create the inquiry

**Behaviour notes:**
- Fields extracted from the email are pre-filled and editable
- Required fields not found in the email remain highlighted in red
- The "Create Estimate" checkbox is available at the bottom of the form

---

### 2.3 Inquiry Detail Overlay

Clicking any row in the listing page opens the Inquiry Detail as a right-side drawer overlay. The overlay is non-modal — the listing remains visible behind it.

#### 2.3.1 Header Summary

Displayed at the top of the overlay, above the tabs:

| Field | Details |
|---|---|
| CARGO NO | Auto-generated cargo number (e.g., CR-2026-676) — primary identifier |
| Account | Linked client account |
| Intended Vessel | Assigned vessel name |
| Created By | User who created the record (displayed as a badge) |
| Created On | Record creation date |
| Modified By | Last user to edit the record (displayed as a badge) |
| Modified On | Last modification date |

**Top action bar:**
- **Kebab Menu (⋮):** View History / Create Indication / Make a Fixture / Make a Copy
- **Close (✕):** Closes the overlay

---

#### 2.3.2 Cargo Tab

The Cargo tab captures the primary cargo and freight details for the inquiry.

**Indication Type:**

| Field | Type |
|---|---|
| Indication Type | Read-only display (e.g., GENCON fios, HEAVYCON 2007, HEAVYLIFTVOY, CONLINE fios) |

**Cargo Details:**

| Field | Type |
|---|---|
| Cargo Name | Text |
| Cargo Description | Text |
| Unit/Number | Numeric (nos) |
| Total Volume | Numeric (cbm) |
| Total Weight | Numeric (mts) |
| Freight Ton | Numeric (frts) |
| Cargo Type | Dropdown (e.g., Breakbulk & Bulk) |
| Cargo Type Subcategory | Dropdown (e.g., Big Bags, container cargo) |

**Freight Details:**

| Field | Type |
|---|---|
| Freight Calc Type | Radio (Lumpsum / Units / Volume / Weight / Freight Ton) |
| Freight Currency | Dropdown |
| Freight Rate | Numeric ($ per unit) |
| Gross Amount | Auto-calculated, read-only |
| Transit Requirements | Dropdown |
| Payment Terms | Free text |
| Freight Payment Schedule | Free text |

**Cargo Dimensions:**

- **Add Cargo Dimensions** button adds a new cargo dimension entry
- Each entry is displayed in a labelled fieldset (Cargo 1, Cargo 2, etc.) with a delete (trash) button

Per cargo dimension entry:

| Field | Type |
|---|---|
| Cargo Name | Text |
| Stowage | Dropdown (Both / Deck / Under Deck) |
| Stackable | Checkbox (Yes / No) |
| Length | Numeric (m) |
| Breadth | Numeric (m) |
| Height | Numeric (m) |
| Volume | Numeric (cbm) — auto-calculated from L×B×H |
| Weight | Numeric (mts) |
| No of Units | Numeric (nos) |
| SQM | Numeric (m²) |

---

#### 2.3.3 Chartering Tab

The Chartering tab captures commercial scope linkage, vessel assignment, demurrage, and bunker details.

**Scope Details:**

| Field | Type |
|---|---|
| Related Scope | Linked scope record (read-only display) |

**Chartering:**

| Field | Type |
|---|---|
| Fixed By (Offices) | Dropdown (owning office) |
| Person In Charge | User selector |
| Intended Vessel Type | Dropdown |
| Intended Vessel | Vessel selector |

**Demurrage:**

| Field | Type |
|---|---|
| Demurrage Rate | Numeric |
| Demurrage Unit | Dropdown (default: Day) |
| Demurrage Duration | Numeric |
| Demurrage Remarks | Free text |

**Bunker Details:**

- **Add Bunker Details** button adds a new bunker entry
- Each entry has a delete button

Per bunker entry:

| Field | Type |
|---|---|
| Fuel | Dropdown (fuel type) |
| Proposed Bunker Rate | Numeric |
| BAF Remark | Free text |

---

#### 2.3.4 Client Tab

The Client tab manages the client relationship and commission structure for the inquiry.

**Client:**

| Field | Type |
|---|---|
| Account | Linked client account (+ button to add) |
| Broker | Linked broker |

**Commission Structure:**

Displayed as an editable table:

| Column | Details |
|---|---|
| Type | Commission type (HQ / Broker / etc.) |
| Name | Commission name (e.g., Management Fee) |
| Apply To | Multi-select tags (Additional Freight / Detention & Demurrage / Freight) |
| Percentage | Commission rate (%) |
| Amount | Calculated amount ($) |
| Delete (✕) | Removes the commission line |

- **Total** row displays the aggregate commission amount
- New commission lines can be added inline via a blank row at the bottom of the table
- Fields: Choose Cost Type, Choose Name, Apply To, Rate %

---

#### 2.3.5 Port Calls Tab

The Port Calls tab manages port assignments, cargo quantities per port, and loading/discharging time calculations.

**Port of Loading:**

- **Add Port Of Loading** button adds a new loading port entry
- Each port entry has a delete button

Per loading port entry:

| Field | Type |
|---|---|
| Port | Port name and country (e.g., Hamburg (Germany)) |
| LAY/CAN | Date range |
| Loading Terms | Dropdown |
| Unit/Number | Numeric (nos) |
| Total Volume | Numeric (cbm) |
| Total Weight | Numeric (mts) |
| Freight Ton | Numeric (frts) |
| Loading Terms Remarks | Free text |

**Port of Discharge:**

- **Add Port Of Discharge** button adds a new discharge port entry
- Each port entry has a delete button

Per discharge port entry:

| Field | Type |
|---|---|
| Port | Port name and country (e.g., Shanghai (China)) |
| Discharge Terms | Dropdown |
| Unit/Number | Numeric (nos) |
| Total Volume | Numeric (cbm) |
| Total Weight | Numeric (mts) |
| Freight Ton | Numeric (frts) |
| Transit Requirements | Dropdown |
| Discharge Term Remarks | Free text |

**Loading/Discharging Days:**

Displayed as a table with a **+** button to add entries:

| Column | Details |
|---|---|
| Port | Port name with type indicator (L = Loading, D = Discharge) |
| Type | Work type (e.g., Port working days) |
| Rate | Numeric |
| Unit | Unit of measurement (e.g., Number of Days) |
| Quantity | Numeric |
| Time | Calculated time (e.g., 2d 0h 0m) |
| Delete (✕) | Removes the entry |

- **Subtotal** row per port
- **Total Days** row at the bottom of the table

---

#### 2.3.6 Voyage Tab

The Voyage tab captures voyage cost parameters, contractual terms, and tax/agreement details.

**Voyage Cost:**

| Field | Type |
|---|---|
| Mobilization Charge | Numeric ($) |
| Demobilization Charge | Numeric ($) |
| Technical / Engineering Cost | Numeric ($) |

**Law Applicable:**

| Field | Type |
|---|---|
| Law Applicable | Free text |
| BIMCO Dispute Resolution | Dropdown |

**Canal Transit Clauses:**

| Field | Type |
|---|---|
| Canal Transit Clause | Dropdown / Free text |

**Tax Details:**

| Field | Type |
|---|---|
| Tax | Dropdown |

**Agreements:**

| Field | Type |
|---|---|
| Agreement Type | Dropdown |

---

#### 2.3.7 General Details Tab

The General Details tab captures additional operational and contractual clauses associated with the inquiry.

| Field | Type |
|---|---|
| Deck Shipment Liability | Dropdown / Free text |
| Transshipments Details | Free text |
| Ship-to-Ship Transfer Remark | Free text |
| Nomination of Berth at POL By | Dropdown / Free text |
| Nomination of Berth at POD By | Dropdown / Free text |
| MWS and date of approval | Free text |
| Sub Owners Approval Details | Free text |
| Owners to issue Operations Manual | Dropdown / Free text |
| Free time for loading (right to sail) | Free text |
| Total Free Time | Free text |
| Carrier's agent both ends | Free text |
| Cumulative Waiting Time | Free text |
| Lashing and securing standard | Free text |
| Termination Fee | Numeric / Free text |
| Subject | Free text |

---

#### 2.3.8 Accounting Tab

The Accounting tab provides a financial summary of the inquiry's income and expense lines.

**Accounting Details:**

| Field | Type |
|---|---|
| Base Currency | Dropdown (e.g., US Dollar) |
| Conversion Date | Date |

**Income/Expense Table:**

| Column | Details |
|---|---|
| Cost Category | Dropdown (e.g., Freight Charge, Commission) |
| Account Head | Dropdown (e.g., Freight, HQ) |
| Particulars | Text (e.g., Freight, Management Fee) |
| Terms | Dropdown (e.g., Lumpsum) |
| Qty | Numeric |
| Rate | Numeric or % |
| Amount | Calculated ($) |
| Delete (✕) | Removes the line |

- Each cost category section shows a **Subtotal**
- A **Total Income Expense** row appears at the bottom of the table
- New lines can be added via the **"Choose cost ca..."** dropdown at the bottom

---

#### 2.3.9 Indications Tab

The Indications tab manages version-controlled indication documents generated from the inquiry data.

**Listing:**

| Column | Details |
|---|---|
| Name | User-defined indication name |
| Version Number | Version label (e.g., V1) |
| Created By | User who created the indication |
| Created On | Creation date |
| Restore | Icon button to restore a prior indication version |

**Create Indication:**

- **Create Indication** button (top-right of tab) opens a modal
- Modal fields: Name (required text field), Create button
- Validation: Name field cannot be empty

**Indication Detail View:**

Clicking an indication row opens a two-panel view:

- **Left panel:** Indication name, creator, creation date/time, version number
- **Right panel:** Auto-generated indication text compiled from inquiry fields, including:
  - Vessel (MV [vessel] or sub tbn)
  - Laycan
  - Port of Loading (POL)
  - Port of Discharge (POD)
  - Cargo description, volume, weight
  - Freight rate and currency
  - Demurrage terms
  - Bunker basis
  - Tax/dues/duties clause
  - Standard terms reference
- **Copy** button — copies the full indication text to clipboard

---

#### 2.3.10 Voyage Estimates Tab

The Voyage Estimates tab displays all voyage estimates linked to this inquiry.

**Table columns:**

| Column | Details |
|---|---|
| Estimate Number | Auto-generated estimate reference (format: EST-YYYY-NNN) |
| Estimate Name | User-defined name |
| Vessel Name | Vessel associated with the estimate |
| Created On | Estimate creation date |
| Created By | User who created the estimate |
| Modified On | Last modification date |
| Modified By | Last user to modify the estimate |

- Estimates are linked during inquiry creation (via "Create Estimate" checkbox) or from the Voyage Estimate module
- Clicking an estimate row navigates to the full Voyage Estimate detail

---

#### 2.3.11 Legal Review Tab *(In Development)*

The Legal Review tab will be embedded within the Inquiry detail overlay, consistent with the implementation in the Fixture and Scope modules.

**Planned functionality:**
- Add New Review — creates a new legal review pre-linked to the current inquiry
- Link Review — search and link an existing review from the Legal Review Hub
- Review cards display: Review Number, Review Type, Legal Review Status, Due Date, Review Raised By, E Filing Number
- Unassign option available via card kebab menu (with confirmation)

Refer to **COEMS-LR-BRD-001** for full Legal Review module specification.

---

### 2.4 Kebab Menu Actions (Detail Overlay)

Accessible via the **⋮** icon at the top of the detail overlay:

| Action | Description |
|---|---|
| View History | Opens a modal showing a field-level audit log of all changes to the record |
| Create Indication | Shortcut to create a new indication (same as the button in the Indications tab) |
| Make a Fixture | Converts the inquiry into a Fixture record, carrying forward relevant data |
| Make a Copy | Creates a duplicate of the current inquiry as a new record |

**View History modal:**

Displays a chronological audit log per user action:
- User name and timestamp
- List of field-level changes, each showing: field name, old value (→), new value

---

### 2.5 Search & Filter

**Search (real-time, keyword):**

Searches across key inquiry fields including Cargo Number, Name, Description, Indication Type.

**Advanced Filter (Add Filter panel):**

Filters available include (not exhaustive):

| Filter | Type |
|---|---|
| Cargo Number | Search text + checkbox list |
| Name | Free-text keyword |
| Laycan | Date range |
| Related Scope | Search + checkbox list |
| Indication Type | Search + checkbox list |
| Total Volume | Numeric range |
| Total Weight | Numeric range |
| Gross Freight | Numeric range |

- Multiple filters can be combined simultaneously
- Owner filter (Mine / Office / All) is always visible in the header toolbar
- Type filter (Inquiry / Indicated / All) is always visible in the header toolbar

---

### 2.6 Delete & Restore (Trash)

**Delete:**
- Available via **Delete Inquiry** from the listing page kebab menu (⋮)
- Confirmation required before deletion
- Deleted records are **soft-deleted** and moved to the Trash view
- Records in Trash are not editable

**Trash view:**
- Accessed via the **Trash** toggle in the listing header
- Shows all soft-deleted inquiry records
- Restore option available (returns the record to the active List)

---

## 3. Project Scope

### 3.1 In Scope

- Inquiry listing page with full column set, pagination, and filters
- Standard inquiry creation form
- AI-assisted inquiry creation from email content (Extract Details)
- Resume in-progress unsaved inquiry
- Optional field toggle (Add Fields)
- Full detail overlay with 10 tabs: Cargo, Chartering, Client, Port Calls, Voyage, General Details, Accounting, Indications, Voyage Estimates, Legal Review (in development)
- Cargo dimension entry per inquiry (multiple entries, L/B/H/Volume/Weight/Units/SQM)
- Commission structure management (multiple lines, apply-to tags)
- Port of Loading and Port of Discharge management (multiple entries per inquiry)
- Loading/Discharging Days calculation table
- Voyage cost fields and contractual terms capture
- General Details tab for operational clauses
- Accounting tab with income/expense line management
- Indication creation, versioning, and auto-generated indication text
- Indication restore (revert to prior version)
- Voyage Estimates tab linking to EST records
- Legal Review tab embedding (in development — see COEMS-LR-BRD-001)
- Kebab menu actions: View History, Create Indication, Make a Fixture, Make a Copy
- Field-level audit trail via View History modal
- Soft-delete and Trash/Restore
- Owner and type filter toggles (Mine / Office / All; Inquiry / Indicated / All)

### 3.2 Out of Scope

- Full Fixture module workflows (covered in a separate BRD)
- Full Voyage Estimate creation and management (covered in Voyage Estimate module)
- Automated email parsing without user review
- Financial settlement and invoice generation
- External charter party system integrations
- Automated notifications or alerts for indication expiry or Laycan windows
- Legal Review tab full functionality (deferred — in development)

---

## 4. Business Drivers

- Provide a single, structured entry point for all cargo inquiries received by the chartering team
- Eliminate manual inquiry tracking via email threads and spreadsheets
- Accelerate the commercial workflow from inquiry receipt to indication issue
- Enable traceability of all changes through a field-level audit trail
- Support the Indicated filter to distinguish inquiries that have reached the indication stage
- Allow rapid fixture conversion directly from an inquiry, minimising data re-entry
- Integrate voyage cost estimation at the inquiry stage via linked Voyage Estimates
- Embed legal review capability to ensure charter party terms are reviewed before fixture

---

## 5. Assumptions

- Cargo Number format is `CR-[YYYY]-[NNN]` and is system-generated on creation
- Indication numbers are versioned (V1, V2, etc.) and the indication text is auto-generated by the system from the inquiry's current field values
- "Indicated" status is set automatically when at least one indication has been created against the inquiry
- "Make a Fixture" carries forward key cargo, port, client, and chartering fields to a new Fixture record
- "Make a Copy" creates a new inquiry with the same field values and a new Cargo Number
- Related Scope field links to records in the Scope module within COEMS
- User directory (for Person in Charge, Created By, Modified By) is managed within the COEMS user management system
- Vessel data (Intended Vessel, Intended Vessel Type) is pulled from the COEMS vessel registry
- Port data (Port of Loading, Port of Discharge) is drawn from the COEMS port master database
- Base Currency defaults to US Dollar; conversion rates are entered manually via the Conversion Rate As On date field

---

## 6. Constraints

- Loading/Discharging Days calculations are dependent on complete port and rate data being entered
- Gross Amount and Cargo Measurement Summary are auto-calculated and not directly editable
- Indication text generation is based on the current saved state of the inquiry at the time of indication creation
- The Legal Review tab is not yet functional and is pending development (see COEMS-LR-BRD-001)
- The "Create Estimate" checkbox at inquiry creation triggers Voyage Estimate creation; this flow depends on the Voyage Estimate module being operational
- Column visibility and filter state may be user-session specific

---

## 7. User Stories Reference

| Story | Description |
|---|---|
| Inquiry Listing | View and manage all inquiries from the Inquiry hub |
| Search & Filter | Apply keyword search and advanced filters on the listing page |
| Owner & Type Filter | Toggle between Mine / Office / All and Inquiry / Indicated / All views |
| New Inquiry (Standard) | Create a new inquiry via the structured creation form |
| New Inquiry from Email | Create an inquiry by pasting email content and using AI extraction |
| View Inquiry Detail | Open an existing inquiry and navigate tabs |
| Cargo Tab | View and manage cargo, freight, and cargo dimension details |
| Chartering Tab | View and manage scope linkage, vessel, demurrage, and bunker details |
| Client Tab | View and manage client account, broker, and commission structure |
| Port Calls Tab | View and manage loading/discharge ports and loading/discharging days |
| Voyage Tab | View and manage voyage cost, legal terms, canal clauses, and tax details |
| General Details Tab | View and manage operational and contractual clause details |
| Accounting Tab | View income/expense lines and total financial summary |
| Indications Tab | Create, view, and restore indication versions |
| Voyage Estimates Tab | View linked voyage estimates for the inquiry |
| Legal Review Tab | Add and manage legal reviews linked to the inquiry *(in development)* |
| View History | View field-level audit trail of all changes to an inquiry record |
| Create Indication | Create a new indication from the inquiry (shortcut via kebab menu) |
| Make a Fixture | Convert an inquiry into a Fixture record |
| Make a Copy | Duplicate an inquiry as a new record |
| Delete & Restore | Soft-delete an inquiry and restore from Trash |

---

## 8. Mockup Reference

The UI design and screen flows for this module are defined in the COEMS Figma prototype and the UAT environment.

**UAT Environment:** [https://coems.uat.admaren.org](https://coems.uat.admaren.org)

Key source files (prototype):

1. **Inquiry Listing Page** — `src/app/components/inquiry.tsx`
2. **Inquiry Detail Overlay** — `src/app/components/inquiry-detail.tsx`
3. **Embedded Legal Review Tab** — `src/app/components/legal-review-embedded.tsx`
