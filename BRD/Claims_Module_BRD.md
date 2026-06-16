# Business Requirements Document
## Claims & Insurance Module — COEMS

**Document Reference:** COEMS-CLM-BRD-001
**Version:** 1.0
**Date:** 2026-06-16
**Status:** Draft

---

## 1. Description

The Claims & Insurance module is designed to provide a centralised system for creating, managing, tracking, and resolving maritime claims across vessel operations within the COEMS platform.

The module replaces existing manual and fragmented processes (emails, Excel trackers, broker correspondence) with a unified digital claims workflow integrated directly into the COEMS platform.

It enables:

- Standardised claims recording across all vessel operations
- Structured classification of claims by context — Standalone (operational incidents without a prior HSEQ incident record) and Incident Related (claims derived from a recorded HSEQ incident)
- Centralised tracking of claim details including broker, insurer, financial exposure, and resolution status
- Linkage of claims to HSEQ incidents, fixtures, voyages, and insurance records
- A complete financial view per claim covering cost allocation, settlement, recovery, and net exposure
- Integration with the Legal Review module for legal oversight and document tracking
- Integration with the Voyage module, allowing claims to be initiated directly from within a voyage context
- Multi-party management — surveyors, lawyers, adjusters, correspondents, and engineers can be tracked per claim

Claims can be created either directly from the Claims Hub or from within the Voyage NEW module's combined Incident / Claim tab, ensuring seamless integration with operational workflows.

The system supports two types of claim context:

- **Standalone** — A claim arising from an operational event not yet formally recorded as a HSEQ incident. Initiated from the Voyage module. Contains a simplified 12-field notification form. Claim context is locked and non-editable when created via the Voyage module.
- **Incident Related** — A full-form claim linked to an existing HSEQ incident record. Created from the Claims Hub directly. Contains the complete claims management form including broker, insurance, liability, resolution, and external parties sections.

Mockup link — http://localhost:5173 (local development server)

---

## 2. Key Components

### 2.1 Claim Creation & Management

- Claims can be created via:
  - Claims Hub (standalone entry via the "New Claim" button)
  - Voyage NEW module (via the combined Incident / Claim tab → Add New ▾ → Claim option)
- Overlay-based data entry interface (right-side slide-in Sheet panel)
- Auto-generated Claim No. following the format: `CLM-[Current Year]-[Sequential Number]` (e.g. CLM-2024-001)
- The Claim No. is read-only once generated
- The form is driven by the **Claim Context** selection — choosing Standalone or Incident Related renders a different form layout within the Overview tab
- Required fields for saving a new claim: **Type of Claim**, **Claimant**, **Claim Status**
- In Create Mode, only the **Overview** tab is visible; all other tabs (Legal Review, Incidents, Insurance, Financials, Closure, Docs) become available only after the claim is saved and opened in Edit Mode
- The **Create Claim / Update Claim** footer buttons are always present; Cancel closes the overlay without saving

### 2.2 Claim Context Classification

Claim Context is the primary classification that determines the form layout, origin rules, and downstream workflow of a claim.

| **Claim Context** | **Badge Colour** | **Origin** | **Form Layout** |
| --- | --- | --- | --- |
| Standalone | Purple | Created from the Voyage NEW module | Simplified 12-field notification form |
| Incident Related | Blue | Created from the Claims Hub directly | Full form with incident linking, broker, insurance workflow, liability, resolution, and external parties sections |

**Locking rules:**

- Claims created via the Voyage NEW module have Claim Context locked to **Standalone** — it is displayed as a static read-only badge and cannot be changed. The Vessel and Voyage fields are also pre-populated from the originating voyage and rendered read-only.
- Claims created from the Claims Hub have an editable Claim Context Select. Changing the selection between Standalone and Incident Related immediately switches the Overview tab form layout.

**Changing context:** If a user changes Claim Context from Incident Related to Standalone (or vice versa) while filling the form, the form section switches accordingly. Data entered in fields that do not exist in the new layout is preserved in state but not displayed.

### 2.3 Claims Listing & Data Management

- Centralised claims list view accessible from the sidebar under Claims & Insurance
- The listing page header includes:
  - Search bar (searches across Claim No, Claim Title / Description, and Vessel)
  - Filters button (opens a Popover with four filter dropdowns)
  - Status toggle group: **All / Open / Close**
  - New Claim button
- The Filters button turns blue when any filter is active
- A **Clear All** link appears inside the Filters popover when any filter or the search query is active — resets all filters and the search bar simultaneously
- Table columns available on the listing:

| **Column** | **Column** |
| --- | --- |
| Claim No | Claim Context |
| Linked Incident | Type of Claim |
| Type of Cover | Broker |
| Leading Insurer | Date of Incident |
| Date of Notification | Claim Estimate |
| Claimant | Description |
| Status | Additional Insurance |
| Actions (sticky right column) | |

- **Claim No** — displayed in blue text with hover underline; clicking opens the Edit overlay
- **Claim Context** — rendered as a pill badge (Standalone = purple, Incident Related = blue)
- **Linked Incident** — displays a shield icon and incident number if linked; otherwise `—`
- **Claim Estimate** — right-aligned, format: `{amount} {currency}`; `—` if zero
- **Status** — pill badge: Open = blue, Close = green
- **Additional Insurance** — "Yes" (green text), "No" (grey text), or `—`
- **Actions** — kebab menu icon; sticky column that remains visible during horizontal scroll
- Minimum table width enforced (1500 px) with horizontal scroll for narrower viewports
- Row hover state: light blue highlight; entire row is clickable to open the Edit overlay

### 2.4 Search & Filter

- **Search bar** — real-time free-text search across: Claim No, Claim Title (description), and Vessel. Matches on partial substring, case-insensitive
- **Filters popover** — four independent filter dropdowns:

| **Filter** | **Values** |
| --- | --- |
| Claim Context | All Contexts / Standalone / Incident Related |
| Claim Type | All Types / (all 18 Claim Types from reference data) |
| Status | All Statuses / Open / Close |
| Vessel | All Vessels / (dynamic list derived from current claim records) |

- All active filters AND the search query are combined — a claim must satisfy every active condition to appear in the listing

### 2.5 Claim Edit Overlay — Header Summary Bar

The header summary bar is visible only in Edit Mode. It is displayed as a grey card above the tab navigation.

**Row 1 — Read-Only Fields:**

| Label | Notes |
| --- | --- |
| Claim Number | Auto-generated; read-only |
| Type of Claim | Read-only |
| Type of Cover | Read-only |

**Row 2 — Quick-Edit Fields:**

| Label | Input Type | Values |
| --- | --- | --- |
| Created By | Read-only text | Populated at creation |
| Claim Status | Select | Open / Close |
| Priority | Select | None / Low / Medium / High / Overdue |

**Header kebab menu (⋮) — Edit Mode only:**

- Export as PDF
- Copy Template
- Send as Email

### 2.6 Tab Structure — Edit Mode

The following tabs are available in Edit Mode only (hidden in Create Mode):

| **Tab** | **Contents** |
| --- | --- |
| Overview | Claim details form (Standalone or Incident Related layout) |
| Legal Review | Embedded Legal Review records linked to this claim |
| Incidents | Link and view HSEQ incidents associated with this claim |
| Insurance | Insurance workflow status and deductible details |
| Financials | Cost allocation, claim values, thresholds, recovery, and summary |
| Closure | Formal closure checklist and settlement finalisation |
| Docs | Document checklist for supporting claim documentation |

### 2.7 Overview Tab — Standalone Claim Form

Displayed when `Claim Context = Standalone`. Intended for rapid notification of an operational incident directly from the Voyage module.

| **Field** | **Input Type** | **Required** | **Notes** |
| --- | --- | --- | --- |
| Claim Context | Static badge (locked from Voyage) or Select | Yes | Read-only if created via Voyage module |
| Vessel | Select | No | Pre-populated and locked if created from Voyage |
| Voyage | Text Input | No | Pre-populated and locked if created from Voyage |
| Related Fixtures | Multi-select lookup popover | No | Searchable by Fixture No, Vessel, Voyage |
| Date of Incident | Date Input | No | Standard date |
| Location | Text Input | No | e.g. "Port of Rotterdam", "At Sea" |
| Short Claim Description | Textarea | No | Min-height 80 px; displayed as Description in the listing |
| Damage as far as known | Textarea | No | Min-height 80 px |
| Steps taken so far | Textarea | No | Min-height 80 px |
| Required assistance from insurance | Select | No | Yes / No |
| Claimant | Text Input | Yes | Free text |
| Representative of claimant present | Text Input | No | Free text |
| Port Agent (full style) | Select | No | 15 port agencies from the Port Agents reference list |

### 2.8 Overview Tab — Incident Related Claim Form

Displayed when `Claim Context = Incident Related` (default). Full claim registration form.

**Core fields:**

| **Field** | **Input Type** | **Required** | **Notes** |
| --- | --- | --- | --- |
| Claim Context | Select | Yes | Standalone / Incident Related |
| Type of Claim | Select | Yes | 18 types (see Section 2.14) |
| Type of Cover | Select | No | 21 options (see Section 2.14) |
| Vessel | Select | No | From Vessels reference list |
| Voyage | Text Input | No | Free text |
| Related Fixtures | Multi-select lookup popover | No | Searchable by Fixture No, Vessel, Voyage |
| Broker | Select | No | 6 brokers from reference list |
| Broker Reference Number | Text Input | No | Free text |
| Leading Insurer | Text Input | No | Free text |
| Date of Notification to Broker | Date Input | No | Standard date |
| Claimant | Text Input | Yes | Free text |
| Claimant Reference Number | Text Input | No | Free text |
| PIC Legal | Select | No | Legal users list |
| Short Claim Description | Textarea | Yes | Min-height 80 px; shown as Description in listing |
| Claim Status | Select | Yes | Open / Close |
| Priority | Select | No | None / Low / Medium / High / Overdue |

**Edit-only fields (visible in Edit Mode only):**

| **Field** | **Input Type** | **Notes** |
| --- | --- | --- |
| Date Settled | Date Input | Advisory warning shown if Status = Close and no date entered; cannot precede Created Date |
| Claim Duration | Read-only computed | `Date Settled − Created Date` in calendar days; blue badge if both dates are set |
| Status Description | Textarea | Free text notes on current status |

**Liability & Recovery section:**

| **Field** | **Input Type** | **Values** |
| --- | --- | --- |
| Liability Position | Select | Liable / Not Liable / Under Review / Shared Liability |
| Recovery Right Exists | Select | Yes / No |
| Recovery Against | Select (conditional) | Owner / Charterer / Shipper / Receiver / Terminal / Stevedore / Insurer / Surveyor / Other — visible only if Recovery Right Exists = Yes |
| Recovery Route | Select (conditional) | Insurance / Contractual / Legal / Direct Settlement / Arbitration / Litigation / Other — visible only if Recovery Right Exists = Yes |
| Liability Assessment Notes | Textarea | Min-height 80 px |

**Resolution & Security section (Edit Mode only):**

| **Field** | **Input Type** | **Notes** |
| --- | --- | --- |
| Resolution Path | Select | Under Negotiation / Settlement / Defense / Recovery / Litigation / Arbitration / Closed without Action |
| Security Provided | Select | No (default) / Yes — selecting Yes reveals the Security sub-fields |
| Security Type | Select (conditional) | LOU / Bank Guarantee / Club Letter / Cash Deposit / Other; if "Other" a free-text input appears |
| Security Currency | Select (conditional) | USD / EUR / GBP / SGD / AED / Other |
| Security Amount | Number Input (conditional) | Must be > 0 |
| Security Issued Date | Date Input (conditional) | Standard date |
| Security Released Date | Date Input (conditional) | Must be on or after Security Issued Date; leave blank if security is still active |
| Resolution Notes | Textarea | Advisory recommendation label when path is Defense / Litigation / Arbitration / Closed without Action |

**External Parties section (Edit Mode only):**

Allows multiple external parties to be tracked per claim. Each entry is a card with a kebab menu (Remove).

| **Field** | **Input Type** | **Values** |
| --- | --- | --- |
| Type | Select | Surveyor / Lawyer / Correspondent / Adjuster / Engineer |
| Name | Text Input | Full name |
| Parent Company | Text Input | Company name |
| Date Appointed | Date Input | Standard date |
| Status | Select | Appointed / Active / Response Received / Closed |

- "+ External Party" button adds a new empty card
- Empty state: "No external parties added. Click '+ External Party' to add one."

### 2.9 Legal Review Tab

- Available in Edit Mode within the Claims edit overlay
- Renders the embedded Legal Review component linked to the current Claim record
- Provides the ability to create new Legal Review tasks or link existing reviews associated with this claim
- Full field-level specification is defined in the Legal Review BRD (COEMS-LR-BRD-001)

### 2.10 Incidents Tab

- Available in Edit Mode within the Claims edit overlay
- Allows linking of existing HSEQ incident records to the current claim
- Linked incidents populate the `incidentLinked` flag and `incidentNo` shown in the Claims Hub listing

### 2.11 Insurance Tab

- Available in Edit Mode within the Claims edit overlay
- Manages the insurance workflow status for the claim:
  - Insurance Workflow Status: Pending Submission / Submitted / Under Investigation / Approved
  - Reviewed by Insurance (boolean)
  - Approved by Insurance (boolean)
  - Signed Off Pending (boolean)
  - Deductible amount — set here; read by the Financials tab for threshold calculations

### 2.12 Financials Tab

- Available in Edit Mode within the Claims edit overlay
- Sections are rendered in this fixed order: **Cost Allocation → Claim Values → Insurance Thresholds → Recovery → Summary**

**Cost Allocation:**

- "+ Add Cost" button adds a new row to the cost table
- Each row has four data fields and a delete button
- Empty state: "No costs recorded yet. Click 'Add Cost' to begin."
- Total Costs is auto-calculated and displayed below the table

| **Column** | **Input Type** | **Values** |
| --- | --- | --- |
| Account Head | Select | Stevedoring / Port Expenses / Bunker Expenses / Crew Expenses / Repair & Maintenance / Survey Fees / Legal Fees / Agency Fees / Freight / Demurrage / Lashing / Securing / Cargo Handling / Insurance Premium / Other |
| Particulars | Text Input | Free text describing the specific cost |
| Recoverable By | Select | Insurance / Client / Non-recoverable. Set per cost line — allows granular recovery tracking across individual cost items within the same claim. |
| Invoices | Select | No Invoice / INV-2024-001 through INV-2024-005 |
| Amount | Number Input | Numeric USD value |

**Claim Values:**

| **Field** | **Input Type** | **Notes** |
| --- | --- | --- |
| Claim Estimate | Currency Input (USD) | Changing this value auto-derives Claim Size (unless manually overridden) |
| Claim Size | Select | 4 tiers — auto-derived from Claim Estimate vs Deductible (see below); manual override is possible with an "Auto-derive" reset button |
| Settlement Amount | Currency Input (USD) | Required |
| Settlement Currency | Select | USD / EUR / GBP / SGD / AED / Other. Non-USD: "Daily FX rate applied automatically by system." |

Claim Size auto-derivation logic:

| **Condition** | **Derived Value** |
| --- | --- |
| Estimate ≤ 0 | *(empty)* |
| Deductible > 0 AND Estimate < Deductible | Claim notification (below deductible) |
| Estimate < USD 75,000 | < USD 75k (small claim) |
| USD 75,000 ≤ Estimate ≤ USD 250,000 | USD 75k – 250k (big claim) |
| Estimate > USD 250,000 | > USD 250k (special claim) |

**Insurance Thresholds:**

| **Field** | **Type** | **Notes** |
| --- | --- | --- |
| Deductible (from Insurance) | Read-only | Seeded from the Insurance tab; edit via Insurance tab |
| Deductible Exceeded Flag | Auto-computed read-only | Red ("Yes — Deductible exceeded") if Claim Estimate or Settlement Amount > Deductible; Green ("No — Within deductible") otherwise; Grey if no deductible set |

**Recovery:**

| **Field** | **Input Type** | **Notes** |
| --- | --- | --- |
| Recovery Amount | Currency Input (USD) | Enables Recovery Date when a value > 0 is entered |
| Recovery Date | Date Input | Disabled until Recovery Amount is entered |
| Outstanding Exposure | Read-only computed | (Settlement Amount + Total Costs) − Recovery Amount; Amber if > 0; Green if = 0 |

**Summary — Four KPI Cards:**

| **Card** | **Formula** | **Colour Logic** |
| --- | --- | --- |
| Total | Settlement Amount + Total Costs | Grey |
| Total Costs | Sum of all cost entries | Blue |
| Net Exposure | Settlement + Costs − Recovery | Amber if > 0; Green if = 0 |
| Recovery % | Recovery ÷ Total × 100 | Green ≥ 80 %; Yellow > 0 %; Grey = 0 % |

A currency note banner below the KPI cards states: "All values displayed and reported in USD — original currency and FX rate stored per entry for full audit trail. Daily exchange rates applied automatically by system."

### 2.13 Closure Tab

- Available in Edit Mode within the Claims edit overlay
- Manages the formal closure checklist and settlement finalisation for the claim
- Receives `claimStatus` and `createdDate` props to determine display and lock state

### 2.14 Docs Tab

- Available in Edit Mode within the Claims edit overlay
- A document checklist of standard supporting documents required for the claim
- Locked (read-only) when Claim Status = Close

### 2.15 Voyage Module Integration

**Overview:**

The Voyage NEW module (`Voyage v2`) includes a combined **Incident / Claim** tab in the Voyage Detail overlay. Users can initiate claims directly from within a voyage context. Claims created this way appear immediately in the Claims Hub.

**Combined tab in Voyage NEW:**

The "Incident / Claim" tab replaces the separate "Incidents" tab from Voyage v1.

Voyage NEW tab list: Port | Fixture | Voyage | Emission | Voyage Remarks | Incident/ Claim

**Split "Add New ▾" button:**

The tab provides a dropdown button with two distinct options:

| **Option** | **Action** |
| --- | --- |
| Incident | Opens the incident creation form |
| Claim | Opens the Standalone claim creation form |

**Standalone claim creation from Voyage:**

1. The Claim creation form opens with Claim Context forced to **Standalone**
2. Claim Context is displayed as a static read-only badge — not an editable dropdown
3. Vessel is pre-populated from the current voyage and locked (read-only)
4. Voyage is pre-populated from the current voyage number and locked (read-only)
5. The form presents the 12 Standalone fields (as defined in Section 2.7)
6. On save, the claim is written to browser `localStorage` under the key `voyage-claims`
7. A `CustomEvent('voyage-claims-updated')` is dispatched on `window`

**Live sync to Claims Hub:**

- The Claims Hub listens for the `voyage-claims-updated` event
- On receipt, it reads `localStorage['voyage-claims']`, deduplicates by claim `id`, and merges voyage-created claims with the static seed claims
- Voyage-created claims appear at the top of the listing
- Claims already present in the seed data (matched by `id`) are never overwritten by a voyage-created entry

**Claim Context identification in the Hub:**

- Voyage-created claims carry `claimContext: "Standalone"` — displayed with the purple Standalone badge
- All other claims display the blue Incident Related badge (default if the field is absent)

### 2.16 Reference Data

**Claim Types (18):**
Cargo | Commercial | Damage to hull | Equipment (disbursement) | H&M | H&M fixed and floating objects | H&M Particular average | HSE | Increased value | Other claim type | P&I cargo | P&I crew | P&I FD&D | P&I FFO | P&I personal injury | P&I pollution | Pre-loading survey (disbursement) | Strike & delay

**Type of Cover (21):**
Charterer's liability (CL) | Charterer's loss of profit | Charterer's loss of use | Comp. carrier's liability (CCC) | Comp. general liability (CGL) | Ext. cargo liability cover (ECL) | Ext. contractual cover (ECC) | Extended crew cover | Extra war risk insurance (EWRI) | Freight, demurrage, defense (FD&D) | Hull and machinery (H&M) | Kidnap, ransom protection (K&R) | Loss of hire (LOH) | Northern Sea Route buy back (NSR) | Professional indemnity | Project insurance | Property insurance | Protection & Indemnity (P&I) | Strike and delay | TCL and FD&D | War

**Priority:** None | Low | Medium | High | Overdue

**Claim Status:** Open | Close

**Brokers (6):** Maritime Insurance Brokers | Global Marine Insurance | Seaborne Insurance Group | International Marine Brokers | Maritime Risk Solutions | Marine Legal & Insurance

**Vessels (12):** MV OCEAN STAR | MV PACIFIC VOYAGER | MV ATLANTIC PRIDE | MV SOUTHERN CROSS | MV EASTERN STAR | MV NORTHERN LIGHT | MV WESTERN SPIRIT | MV HORIZON | MV ARCTIC BREEZE | MV TROPICAL WAVE | MV GLOBAL TRADER | MV LIBERTY BELLE

**Port Agents (15):** Inchcape Shipping Services | GAC Shipping | Wilhelmsen Ships Service | Gulf Agency Company (GAC) | Svitzer | Anglo-Eastern | Columbia Ship Management | V.Ships | Bernhard Schulte Shipmanagement | Wallem Group | Transmar Agency | Pacific Basin Shipping | North Sea Shipping Agents | Meridian Port Services | Oceanbridge Maritime

**Legal Users (7):** Arun Kumar | Priya Nair | Ravi Shankar | Deepa Menon | Anoop Krishnan | Lakshmi Pillai | Suresh Babu

**Fixtures (seed data — 8 records):**

| **Fixture ID** | **Vessel** | **Voyage** |
| --- | --- | --- |
| FIX-2024-067 | MV OCEAN STAR | FAI 2601 |
| FIX-2024-089 | MV PACIFIC VOYAGER | FAI 2502 |
| FIX-2024-045 | MV ATLANTIC PRIDE | FAI 2498 |
| FIX-2024-112 | MV SOUTHERN CROSS | FAI 2312 |
| FIX-2024-056 | MV WESTERN SPIRIT | FAI 2499 |
| FIX-2024-134 | MV NORTHERN LIGHT | FAI 2601 |
| FIX-2024-118 | MV TROPICAL WAVE | FAI 2715 |
| FIX-2023-289 | MV HORIZON | FAI 1998 |

---

## 3. Project Scope

The scope of this project includes the design and implementation of a centralised maritime claims management module within the COEMS platform.

The module will:

- Digitise and standardise claims recording across all vessel operations
- Provide structured claim context classification (Standalone vs Incident Related) with context-driven form layouts
- Deliver a complete financial view per claim including cost allocation, settlement values, recovery tracking, and net exposure calculation
- Integrate claims data with the Voyage, HSEQ Incidents, Insurance, and Legal Review modules
- Enable claim initiation from within the Voyage NEW module with automatic sync to the Claims Hub
- Enforce contextual field locking for claims created via the Voyage module

### 3.1 In Scope

- Claim record creation from the Claims Hub (New Claim button)
- Claim record creation from the Voyage NEW module (Incident / Claim tab → Add New ▾ → Claim)
- Overlay-based UI for claim data entry with Claim Context-driven form switching
- Auto-generated Claim No. (`CLM-YYYY-NNN`)
- Claim Context classification (Standalone / Incident Related) with badge display in the listing
- Claims listing with 15 columns, search, and four-dimensional filter (Context, Type, Status, Vessel)
- Status toggle group (All / Open / Close)
- Claim Edit overlay with read-only header summary and full tab set
- Overview tab — Standalone 12-field form and full Incident Related form including Liability & Recovery, Resolution & Security, and External Parties sections
- Legal Review embedded tab
- Incidents embedded tab
- Insurance embedded tab with deductible data linked to the Financials tab
- Financials tab — Cost Allocation (Account Head / Particulars / Recoverable By / Invoices / Amount), Claim Values, Insurance Thresholds, Recovery, and Summary KPI cards
- Closure embedded tab
- Docs checklist tab
- Voyage NEW combined Incident / Claim tab with split Add New button
- Standalone claim locking (Claim Context, Vessel, Voyage locked when created from Voyage)
- Cross-module live sync via `localStorage` and `CustomEvent`
- Header kebab menu (Export / Copy Template / Send as Email)
- Priority and Status quick-edit from the header summary bar

### 3.2 Out of Scope

- Advanced search (multi-field filter panel with text / numeric range / date range per field — planned for a future phase)
- Column Show/Hide and Reorder functionality on the listing
- Archive / Unarchive and Delete / Restore (Trash tab) functionality
- Pagination and items-per-page selector
- Automated claim number sequencing across users (currently client-side counter)
- Full document attachment and file management per claim
- Automated notifications and escalation alerts (e.g. overdue claims)
- Multi-currency conversion with live exchange rate feeds
- Reporting and analytics dashboards beyond the Financials tab summary cards
- Integration with external broker or P&I Club portals
- Premium calculation and invoice generation

---

## 4. Business Drivers

- Eliminate manual claim tracking across emails, spreadsheets, and fragmented correspondence files
- Provide a single source of truth for all active and historical maritime claims
- Improve visibility of financial exposure across the claims portfolio through the Financials tab
- Enable faster response to incidents by allowing immediate claim notification from within the Voyage module (Standalone context)
- Reduce risk of under-reported claims through direct integration with HSEQ incident records
- Ensure complete audit trails for each claim including broker correspondence, insurer appointments, cost allocations, and resolution steps
- Improve recovery tracking and outstanding exposure visibility across the claims portfolio
- Support legal oversight through integration with the Legal Review module per claim
- Enable management to monitor claim lifecycle from notification to closure with priority and status visibility
- Reduce onboarding time for new operations staff through a standardised, guided claims workflow

---

## 5. Assumptions

- All Incident Related claims are associated with a vessel and at least one HSEQ incident record
- Standalone claims may be raised before a formal HSEQ incident record is created; they represent the initial notification of an operational event
- Claims initiated from the Voyage module are always Standalone — they cannot be created as Incident Related from that context
- The Claims team and Operations team are jointly responsible for maintaining accurate claim data
- Broker and Insurer names are entered as free text; a master data list for insurers will be maintained separately
- Claim Type, Type of Cover, and Priority master lists will be maintained as code-level reference data and updated as needed
- The Deductible shown in the Financials tab is sourced from the Insurance tab of the same claim and is not manually entered in the Financials tab
- Legal Review, Incidents, Insurance, Closure, and Docs sub-module specifications are governed by their respective BRDs
- The Voyage NEW tab ("Incident / Claim") is available only in Voyage v2 (`version="v2"`); Voyage v1 retains the original separate Incidents tab

---

## 6. Constraints

- Claim Context is locked and non-editable for claims created from the Voyage module — it cannot be changed to Incident Related after creation via that path
- Vessel and Voyage fields are pre-populated and locked for Voyage-initiated claims
- The Claim No. is system-generated and cannot be manually entered or edited
- Tabs beyond Overview (Legal Review, Incidents, Insurance, Financials, Closure, Docs) are visible only in Edit Mode — they are not shown during initial claim creation
- Date Settled cannot precede the claim's Created Date
- Security Released Date cannot precede Security Issued Date
- Security Amount must be greater than 0 if entered
- Cost Allocation rows require at least an Account Head selection to be meaningful — there is no server-side validation on empty rows in the current implementation
- Cross-module data synchronisation between the Voyage module and the Claims Hub is client-side only (localStorage + CustomEvent); server-side persistence requires a backend implementation in later phases
- Claim data entered during the same browser session without saving will be lost on page refresh — there is no auto-save draft mechanism in the current implementation
- All financial calculations in the Financials tab are performed client-side in USD; multi-currency conversion is logged but not computed in the current phase

---

## 7. Mockup — Screen Descriptions

### 7.1 Claims Hub Listing Page

*(Accessible from sidebar → Claims & Insurance)*

- Displays all claim records in a tabular format with horizontal scroll for column overflow
- Header contains: Search bar, Filters button (with active-state blue highlight), Status toggle group (All / Open / Close), and New Claim button
- Table columns include: Claim No (blue text, hover underline), Claim Context (colour-coded badge), Linked Incident (shield icon + number or `—`), Type of Claim, Type of Cover, Broker, Leading Insurer, Date of Incident, Date of Notification, Claim Estimate (right-aligned with currency), Claimant, Description, Status (badge), Additional Insurance, and a sticky Actions column
- Clicking any row opens the Edit overlay for that claim
- Empty state displays a search icon and "No claims found" text when filters return no results

### 7.2 Create New Claim Overlay

*(Opens on clicking "New Claim")*

- Right-side slide-in panel (50 % viewport width on large screens; full width on mobile)
- Header shows "New Claim" title and description
- Only the Overview tab is shown in Create Mode
- Claim Context Select renders either the Standalone 12-field form or the full Incident Related form depending on the selection
- Footer: Cancel and Create Claim buttons

### 7.3 Edit Claim Overlay

*(Opens on clicking a claim row)*

- Right-side slide-in panel with a grey header summary card (Claim No, Type of Claim, Type of Cover read-only; Claim Status and Priority editable selects; Created By read-only)
- Header kebab menu (⋮): Export as PDF, Copy Template, Send as Email
- Tab bar: Overview | Legal Review | Incidents | Insurance | Financials | Closure | Docs
- Footer: Cancel and Update Claim buttons

### 7.4 Overview Tab — Standalone

*(Edit overlay → Overview tab when Claim Context = Standalone)*

- Static "Standalone" badge at the top replacing the Claim Context Select (for Voyage-created claims)
- Vessel and Voyage shown as locked read-only fields
- 12-field form: Vessel, Voyage, Related Fixtures, Date of Incident, Location, Short Claim Description, Damage as far as known, Steps taken so far, Required assistance from insurance, Claimant, Representative of claimant present, Port Agent

### 7.5 Overview Tab — Incident Related

*(Edit overlay → Overview tab when Claim Context = Incident Related)*

- Full form with all sections: Core fields (Type of Claim, Type of Cover, Vessel, Voyage, Related Fixtures, Broker, Insurer, Claimant, PIC Legal, Description, Status, Priority), Date Settled + Claim Duration (edit only), Status Description, Liability & Recovery section, Resolution & Security section (edit only, with conditional Security sub-fields), External Parties section (edit only, card list with kebab)

### 7.6 Financials Tab

*(Edit overlay → Financials tab)*

- Section 1 — Cost Allocation: table grid with Account Head (dropdown), Particulars (text), Recoverable By (dropdown: Insurance / Client / Non-recoverable), Invoices (dropdown), Amount (number), and a delete button per row; "+ Add Cost" button; Total Costs subtotal row
- Section 2 — Claim Values: Claim Estimate (with auto-derived Claim Size and manual override), Settlement Amount, Settlement Currency
- Section 3 — Insurance Thresholds: Deductible (read-only from Insurance tab), Deductible Exceeded Flag (auto-computed colour badge)
- Section 4 — Recovery: Recovery Amount, Recovery Date (conditionally enabled), Outstanding Exposure (computed)
- Section 5 — Summary: four KPI cards (Total, Total Costs, Net Exposure, Recovery %) with colour logic; USD currency note banner

### 7.7 Voyage NEW — Incident / Claim Tab

*(Voyage NEW → Open voyage detail → Incident/ Claim tab)*

- Combined tab replacing the separate Incidents tab from Voyage v1
- Displays existing incidents and voyage-linked claims in a unified view
- "Add New ▾" split dropdown button with two options: Incident and Claim
- Selecting "Claim" opens the Standalone claim form with Claim Context locked, Vessel and Voyage pre-populated and read-only

---

*End of Document*

**Document Reference:** COEMS-CLM-BRD-001 | **Version:** 1.0 | **Date:** 2026-06-16
