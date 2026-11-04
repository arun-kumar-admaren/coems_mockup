# Business Requirements Document

## Insurance Module — COEMS

**Document Reference:** COEMS-INS-BRD-001
**Version:** 3.0
**Date:** 2026-09-18
**Status:** Draft — comprehensive specification of the Insurance module's complete feature set.

---

## 1. Description

The Insurance module provides a centralised system for creating, managing, tracking, and monitoring marine insurance policies across vessel operations and fixture agreements within the COEMS platform.

The module replaces manual and fragmented processes (emails, Excel sheets, broker correspondence) with a unified digital workflow. It enables:

- Standardised insurance policy recording, created only from the Insurance module itself
- Structured selection of the type of cover from a single standardised list, shared with the Claims module
- Centralised tracking of policy details, including broker, insurer, cover period, and financial limits
- A "Related to" field on every Insurance record — exactly one Fixture or one Vessel, or neither, chosen from within the Insurance record itself
- Integration with the Legal Review and Claims modules for compliance and claims visibility
- Role-based access control to protect data integrity

Insurance is accessed from the Management module's sidebar only. Records are created solely through the Insurance module's own "New Insurance" action — the Fixture and Vessel edit overlays display their linked insurance records but cannot create or link new ones; that relationship is set from the Insurance record itself, via its own "Related to" field.

## 2. Key Components

1. Insurance Record Creation & Management (Insurance module only)
2. Related to — Fixture or Vessel linkage
3. Type of Cover — single standardised list, shared with Claims
4. Financials — common Coverage Values and Premium Details, plus cover-type-specific field groups with formulas
5. Parties — Broker (sourced from flagged Customers) and Insurer/Club
6. Legal Entity — mandatory, drives the Insurance Number prefix
7. Insurance Edit Overlay — header, Overview / Legal Review / Claims tabs
8. History
9. Insurance tab within the Fixture and Vessel edit overlays (view-only)
10. Insurance Listing & Data Management — Search, Filter, Column Show/Hide & Reorder, Archive/Unarchive, Delete & Restore
11. User Permissions & Access Control

## 3. Cover Details

Every Insurance record's Add/Edit overlay begins with a Cover Details section:

| Field | Type | Status | Notes |
| --- | --- | --- | --- |
| Related to | Dropdown — Fixture, Vessel | Optional | First field on the overlay. Selecting a value reveals a matching "Select Fixture" or "Select Vessel" dropdown. Switching this value clears whichever specific Fixture/Vessel was previously chosen. |
| Select Fixture | Dropdown — existing fixture numbers | Mandatory when Related to = Fixture | Visible only when Related to = Fixture. |
| Select Vessel | Dropdown — existing vessel names | Mandatory when Related to = Vessel | Visible only when Related to = Vessel. |
| Type of Cover | Dropdown — 16 standardised values (§4) | Mandatory | Same list regardless of Related to. |
| Intended Vessel | Dropdown — all available vessels | Optional | Fully independent of Related to / Select Fixture / Select Vessel — it does not read from, write to, clear, or get cleared by any of those fields. A plain standalone selection. |

An Insurance record relates to exactly one Fixture or exactly one Vessel — never both, and never more than one of either. There is no "Crew" category and no separate Insurance Category concept; Type of Cover alone classifies the record.

## 4. Type of Cover

Type of Cover is a single standardised dropdown list, shared identically with the Claims module, independent of Related to:

Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), Loss of Hire (LOH), Strike and Delay, Hull and Machinery (H&M), Increased Value (IV), FD&D (UHL as owner), Extra War Risk insurance (EWRI), War Risk, Extended Crew Cover (P&I extension), Comprehensive Carrier's Liability Cover (CCC), Comprehensive General Liability (CGL), Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC), Transport insurance, Professional indemnity.

Changing Type of Cover while adding or editing a record resets every field belonging to any of the cover-specific field groups (§6), plus the common Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax fields wherever they're calculated rather than manual (§6). The constant common fields (Currency, Sum Insured, Deductible, Daily Indemnity (LoH), Basis/Terms, Tax Rate (%), Premium Rate (%), Annual Premium) are unaffected. This only fires on an actual user change to the dropdown — opening an existing record for editing loads its saved data without clearing anything.

## 5. Financials — Coverage Values & Premium Details

These fields are always visible and editable, for every Type of Cover:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Currency | Dropdown — USD, EUR | Optional | Defaults to USD. Applies to all financial fields. |
| Sum Insured | Numeric | Mandatory | Minimum 0. Used directly in the Hull & Machinery + Increased Value formulas — there is no separate H&M-specific Sum Insured field. |
| Total Sum Insured (TSI) | Numeric | Optional | Calculated for Hull & Machinery + Increased Value, War Risks, and Loss of Hire; manual entry for the P&I family, Strike and Delay, Extended Covers, or when no Type of Cover is selected. |
| Deductible | Numeric | Mandatory | Minimum 0. The only deductible field in the form — there is no per-cover-type deductible field. |
| Daily Indemnity (LoH) | Numeric | Required when Type of Cover = Loss of Hire | Amber hint shown when required and empty. |
| Basis / Terms | Free text | Optional | Cover-specific structured term (e.g. 14/180/180), primarily relevant for Loss of Hire. |
| Premium Rate (%) | Numeric, up to 6 decimals | Optional | Stored as a numeric percentage. |
| Annual Premium | Numeric | Optional | — |
| Tax Rate (%) | Numeric | Optional | e.g. 3, 19. |
| Tax Amount | Numeric | Optional | Calculated for Hull & Machinery + Increased Value, Loss of Hire, the P&I family, Strike and Delay, and Extended Covers; manual entry for War Risks or when no Type of Cover is selected. When calculated, derived from whichever single field-set is active — a record only ever has one field-set populated. |
| Total Premium Incl. Tax | Numeric | Optional | Same calculated/manual split as Tax Amount. |

Leading Underwriter is not a common field — it belongs to Parties (§7), since it can genuinely differ from the vessel's H&M, IV, LoH, and War Risk cover.

## 6. Financials — Cover-Type-Specific Field Groups

Directly after the common Premium Details fields, six field groups render as collapsible/expandable line items, **collapsed by default**. Which group(s) show depends on the selected Type of Cover — every field within a shown group is always present, with no further conditional logic.

| Type of Cover | Group(s) shown |
| --- | --- |
| Hull and Machinery (H&M), Increased Value (IV) | Hull & Machinery + Increased Value |
| War Risk, Extra War Risk insurance (EWRI) | War Risks **and** Hull & Machinery + Increased Value (the War mirror needs IV Total from that group) |
| Loss of Hire (LOH) | Loss of Hire |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D |
| Strike and Delay | Strike and Delay |
| Comprehensive Carrier's Liability Cover (CCC), Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC) | Extended Covers (ECL/CCC/ECC) |
| Comprehensive General Liability (CGL), Transport insurance, Professional indemnity | None — only the common fields apply |

A calculated field is visually distinguished from a manual one: grey background, non-editable, with a small caption underneath showing the formula that produced it.

### Hull & Machinery + Increased Value

| Field | Type | Formula |
| --- | --- | --- |
| Disbursements | Currency | Manual entry |
| Freight Total Loss | Currency | Manual entry |
| Equipment (H&M) | Currency | Manual entry |
| Freight All Risks | Currency | Manual entry |
| IV Total | Currency | SUM(Disbursements + Freight Total Loss + Equipment + Freight All Risks) |
| AMD | Currency | Manual entry |
| Leading H&M Underwriter | Free text | Manual entry |
| Leading IV Underwriter | Free text | Manual entry |
| H&M Rate (%) | Percentage | Manual entry |
| IV Rate (%) | Percentage | Manual entry |
| H&M Premium | Currency | ROUND(Sum Insured × H&M Rate %, 0) |
| Upfront Performance Bonus (PB/CC) | Currency | Manual entry |
| H&M Premium Net of Upfront Performance Bonus | Currency | H&M Premium − Upfront Performance Bonus (PB/CC) |
| IV Premium | Currency | ROUND(IV Total × IV Rate %, 0) |
| Tax H&M | Currency | ROUND(H&M Premium Net of Upfront Performance Bonus × Tax Rate %, 2) |
| IV Tax Rate (%) | Percentage | Manual entry |
| Tax IV | Currency | ROUND(IV Premium × Tax Rate %, 2) |
| Total Net Premium (H&M+IV) | Currency | H&M Premium Net of Upfront Performance Bonus + IV Premium |
| Total Gross Premium Incl. Tax (H&M+IV) | Currency | Total Net Premium (H&M+IV) + Tax H&M + Tax IV — not shown as its own field; feeds the common Total Premium Incl. Tax |

### Loss of Hire

| Field | Type | Formula |
| --- | --- | --- |
| LoH Sum Insured | Currency | 180 × Daily Indemnity (LoH) |
| LoH Leading Underwriter | Free text | Manual entry |
| LoH Rate (%) | Numeric | Manual entry |
| LoH Premium | Currency | ROUND(LoH Sum Insured × LoH Rate %, 0) |

Tax (LoH) = ROUND(LoH Premium × Tax Rate %, 2) and Total Gross Premium Incl. Tax (LoH) = LoH Premium + Tax (LoH) are calculated internally but not shown as their own fields — they feed the common Tax Amount and Total Premium Incl. Tax fields directly, since Loss of Hire has only one contributing sub-cover.

### War Risks

| Field | Type | Formula |
| --- | --- | --- |
| War H&M (sum) | Currency | = Sum Insured (live mirror of Coverage Values' Sum Insured — not a separately entered figure) |
| War IV (sum) | Currency | = IV Total (live mirror of the H&M+IV group's IV Total) |
| War-Leading Underwriter | Free text | Manual entry |
| War Rate (%) | Percentage | Manual entry |
| War LoH Daily | Currency | Manual entry |
| War LoH Basis | Numeric | Manual entry |
| War LoH TSI | Currency | = SUM(War H&M (sum) + War IV (sum)) |

War Risks has no Tax or Total field of its own — the common Tax Amount and Total Premium Incl. Tax fields fall back to manual entry for a War Risk or EWRI record. A caption above the accompanying Hull & Machinery + Increased Value fields clarifies: "War Risk premium is calculated from Sum Insured / IV Total above. Hull & Machinery / Increased Value fields below are that cover's own details." Selecting Hull and Machinery or Increased Value directly does not also show the War Risks group.

### P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D

| Field | Type | Formula |
| --- | --- | --- |
| P&I Club | Free text | Manual entry |
| Gross Premium P&I Incl. R/I | Currency | Manual entry |
| Rate per GT Incl. R/I | Currency | Manual entry — no vessel Gross Tonnage field exists on the record to calculate from |
| R/I (Reinsurance) Alone | Currency | Manual entry |
| 10% OGD (Gard) / 10% PB (London) | Currency | Gross Premium P&I Incl. R/I − Net Premium P&I |
| Net Premium P&I | Currency | ROUND(Gross Premium P&I Incl. R/I × 0.9, 0) |
| Tax (P&I) | Currency | ROUND(Net Premium P&I × Tax Rate %, 2) |
| Total Premium Incl. Tax (P&I) | Currency | Net Premium P&I + Tax (P&I) |
| FD&D | Currency | Manual entry |
| Premium FD&D | Currency | Manual entry |
| Tax (FD&D) | Currency | ROUND(Premium FD&D × Tax Rate %, 2) |
| Total (FD&D) — Total Gross Premium Incl. Tax | Currency | Premium FD&D + Tax (FD&D) |
| C/L P&I | Currency | Manual entry |
| Premium TCL P&I | Currency | Manual entry |
| C/L FD&D | Currency | Manual entry |
| Premium TCL FD&D | Currency | Manual entry |

The common Tax Amount and Total Premium Incl. Tax fields are the sum of Tax (P&I) + Tax (FD&D), and Total Premium Incl. Tax (P&I) + Total (FD&D), respectively — this group has two contributing sub-covers, so the common field is their sum rather than identical to either.

### Strike and Delay

| Field | Type | Formula |
| --- | --- | --- |
| Insurer (Strike and Delay) | Free text | Manual entry |
| Daily Entered Sum | Currency | Manual entry |
| Rate (Strike and Delay) | Currency | Manual entry |
| Premium (Strike and Delay) | Currency | ROUND(Daily Entered Sum × Rate (Strike and Delay), 2) |
| Upfront NCB 10% | Currency | ROUND(Premium (Strike and Delay) × 10%, 2) |
| Premium Net of NCB | Currency | Premium (Strike and Delay) − Upfront NCB 10% |

Tax (Strike and Delay) = ROUND(Premium Net of NCB × Tax Rate %, 2) and Premium Incl. Tax (Strike and Delay) = Premium Net of NCB + Tax (Strike and Delay) are calculated internally but feed the common Tax Amount / Total Premium Incl. Tax fields directly rather than displaying separately.

### Extended Covers (ECL/CCC/ECC)

| Field | Type | Formula |
| --- | --- | --- |
| Cost of Extended Covers (ECL/CCC), Excl. Tax | Currency | Manual entry — the source formula references an external workbook not available to this system |
| Cost of Extended Covers (ECL/CCC), Incl. Tax | Currency | Cost of Extended Covers (ECL/CCC), Excl. Tax × 1.19 (a fixed 19% uplift, independent of Tax Rate %) — not shown as its own field |

The 19% uplift amount feeds the common Tax Amount field; the full Incl. Tax figure feeds the common Total Premium Incl. Tax field.

## 7. Parties

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Broker | Dropdown | Optional | Populated dynamically from Settings → Customers, limited to customers flagged **"Is Insurance Broker."** Updates live — flagging or unflagging a customer immediately changes the dropdown's options, without a page refresh. Unflagging a customer does not clear the value on any Insurance record that already selected them; their name simply stops appearing for new selections. |
| Insurer / Club | Dropdown | Mandatory | e.g. Gard P&I, NorthStandard, UK P&I Club, UK Defence Club, Skuld, West of England, American Club. |
| Leading Underwriter | Dropdown | Optional | Single-select, sourced live from the list of Legal users (users with the "Legal" permission enabled in Settings → User Add/Edit). Not a multi-select. |

The Settings → Customers listing shows a "Broker" badge inline against any customer flagged "Is Insurance Broker." The "Is Insurance Broker" checkbox itself lives in the Customer Add/Edit overlay, unchecked by default, optional.

## 8. Workflow & Dates

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Policy Start Date | Date picker | Mandatory | No date constraints. |
| Bi-annual Declaration to Broker | Checkbox | Optional | Positioned between Policy Start Date and Policy End Date. |
| Policy End Date | Date picker | Mandatory | Must not be earlier than Policy Start Date. |
| Date of Notification to Broker | Date picker | Optional | No date constraints. |
| Renewal Terms | Free text | Optional | e.g. +3%; as expiry. |

## 9. General

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Insurance Status | Dropdown — Foreseen, Active, Expired, Cancelled | Mandatory | Enables the Create button when filled. |
| Created By | Dropdown — user list | Optional | Auto-populates with the current logged-in user's name. |
| Remarks | Free text, max 10,000 chars | Optional | Character counter displayed. |

## 10. Legal Entity

A mandatory, single-select dropdown — the last field on both the Add and Edit overlay, after Remarks.

- On creation, defaults to the current user's "Preferred Legal Entity" (Personal Settings); the user may override it before saving.
- On Edit, shows the value already saved on the record, not re-defaulted.
- Drives the Insurance Number format: `[Legal Entity office code]-INS-[YYYY]-[XXX]` (e.g. `UHL-INS-2026-001`).
- Present as a listing column, a main-Search keyword, and an Add Filter entry (searchable checkbox list, alphabetical), combinable with other filters.

## 11. Insurance Edit Overlay

Clicking an Insurance record from the listing opens the edit overlay.

**Header (read-only, except Insurance Status):** Insurance Number, Type of Cover, Cover Period (Start Date – End Date), Created By, Insurance Status. Insurance Status is the only header field that's editable — for a Legal-permission user — and any change here is reflected on the Overview tab's own Insurance Status field. For a non-Legal user, the entire header, including Insurance Status, is read-only (§14).

**Kebab menu:** Delete Insurance (visible only to Legal-permission users, §14); View History (§13).

**Tabs:**
- **Overview** — every field from §3–§10, editable for Legal-permission users, read-only for everyone else.
- **Legal Review** — §12.
- **Claims** — §13.

## 12. Legal Review Tab

Displays every Legal Review linked to this Insurance record.

- **Add New Review** opens the Create New Review overlay with Related To pre-set to Insurance and this record's Insurance No. pre-selected. On creation, the review appears as a card here and in the Legal Review module.
- **Link Review** — a searchable, multi-select dropdown of existing reviews (search by Review Number). If a linked review is already related to other Inquiry/Fixture/Scope records, those stay set on its Related To field alongside this Insurance record. Already-linked reviews don't appear in the search results.
- Cards are grouped by status: To Be Reviewed, Under Review, Reviewed, Not Required. Each card shows Review Number, Related To, Review Type, E Filing Number, Due Date, Review Raised By, Legal Review Status.
- Clicking a card opens the Review's edit overlay on top of the Insurance edit overlay.
- Each card's kebab menu offers **Unassign** (with a Yes/No confirmation) — removes the card from this tab without deleting the review record itself.

## 13. Claims Tab

Displays every Claim linked to this Insurance record.

- Each linked claim is a read-only card, most recently linked first.
- Clicking a card opens that claim's edit overlay.
- Each card shows: Claim No, Claim Status, Description (truncated to two lines, shown only when present), Type of Claim, Claimant, Claim Estimate (formatted "USD {amount}", "—" when unset), Vessel, Date of Incident, Type of Cover.
- When no claims are linked, the tab shows a centered empty state: "No claims linked."

## 14. History

Available from the kebab menu ("View History") in the Insurance edit overlay header, opening a pop-up consistent with the Fixture module's History implementation.

- **Creation** — the record creation event, user, and timestamp.
- **Additions** — field name plus old and new values.
- **Updates** — field name plus previous and updated values.
- **Removals** — field name, previous value, and an indication it was deleted.

Every entry shows the user name, date/time of change, action performed (Created, Added, Updated, Removed), and the field's old/new values.

## 15. Insurance tab within Fixture and Vessel

The Fixture and Vessel edit overlays each carry an "Insurance" tab, alongside their other tabs.

- **View-only** — displays every linked Insurance record as a card. There is no Add New Insurance or Link Insurance action here; the only way to create the relationship is through the Insurance record's own "Related to" field.
- Cards are grouped by Insurance Status, in order: Active, Expired, Cancelled, Foreseen.
- Each card shows: Insurance No, Type of Cover, Insurance Status, Cover Period (Policy Start Date – Policy End Date), Broker, Insurer / Club, Leading Underwriter, Created By.
- Each card's kebab menu offers **Unassign** — clears this record's Related to / Select Fixture / Select Vessel link (with a Yes/No confirmation), without deleting the Insurance record itself.

## 16. Insurance Listing Page

Accessed via **Management → Insurance**.

**Header:** Search bar (left), Add Filter, Status group filter tabs (**All, Foreseen, Active, Expired, Cancelled**), List/Trash toggle, Archived toggle (off by default), New Insurance button, kebab menu (Delete Selected Insurance, Archive Selected Insurance, Unarchive Selected Insurance), Column Show/Hide & Reorder icon.

**Columns:** ID, Insurance No, Related to, Fixture, Vessel, Type of Cover, Currency, Deductible, Sum Insured, Total Sum Insured (TSI), Annual Premium, Premium Rate (%), Broker, Insurer / Club, Leading Underwriter, Date of Notification to Broker, Policy Start Date, Bi-annual Declaration to Broker, Policy End Date, Insurance Status, Created By, Remarks, Created Date, Legal Entity, Intended Vessel.

- **Related to** shows Fixture, Vessel, or a dash if neither was selected. **Fixture** shows the linked fixture number when Related to = Fixture, otherwise blank. **Vessel** shows the linked vessel name when Related to = Vessel, otherwise blank.
- **Expandable related records:** a row with a Related to value shows an expand arrow; expanding reveals the linked Fixture or Vessel as an indented sub-row with Item (identifier), Type (colour-coded badge), and Name columns. Multiple rows can be expanded at once.
- Records sort by created date and time, latest first.
- Horizontal scrolling and per-column width adjustment are both available, given the column count.

**ID** and **Insurance No** are mandatory, fixed-position columns — not available in Show/Hide or Reorder.

## 17. Search

A single search field in the header matches: Insurance No, Related to, Fixture, Vessel, Type of Cover, Broker, Insurer / Club, Leading Underwriter, Insurance Status, Created By, Remarks, Legal Entity. Entering a keyword returns every matching record as a line item.

## 18. Add Filter

Opens a scrollable, alphabetically ordered filter list with its own search box. Filters can be combined.

| Filter | Type |
| --- | --- |
| Insurance No | Search text + checkbox list |
| Related to | Search text + checkbox list (Fixture, Vessel) |
| Fixture | Search text + checkbox list |
| Vessel | Search text + checkbox list |
| Type of Cover | Search text + checkbox list |
| Currency | Search text + checkbox list (USD, EUR) |
| Deductible | Numeric range (Min & Max) |
| Sum Insured | Numeric range |
| Total Sum Insured (TSI) | Numeric range |
| Annual Premium | Numeric range |
| Premium Rate (%) | Numeric range |
| Broker | Search text + checkbox list |
| Insurer / Club | Search text + checkbox list |
| Leading Underwriter | Search text + checkbox list |
| Date of Notification to Broker | Date range |
| Policy Start Date | Date range |
| Bi-annual Declaration to Broker | Checkbox list |
| Policy End Date | Date range |
| Insurance Status | Search text + checkbox list (Foreseen, Active, Expired, Cancelled) |
| Created By | Search text + checkbox list |
| Created Date | Date range |
| Legal Entity | Search text + checkbox list |
| Intended Vessel | Search text + checkbox list |

## 19. Column Show/Hide & Reorder

A Show/Hide icon sits at the top-right of the listing's column header row, opening two tabs:

- **Show/Hide** — search field, Select All, Update button, and a checkbox list of every configurable column.
- **Reorder** — Reset and Update buttons, plus a drag-and-drop list of every configurable column.

Every column in §16 except ID and Insurance No is configurable in both tabs.

## 20. Archive & Unarchive

- An "Archived" toggle in the header (off by default) switches between active and archived records; archived records are visually highlighted.
- **Archive Selected Insurance** (kebab menu) is enabled once at least one non-archived record is selected; on confirmation, records move to the archived list and a toast confirms it.
- **Unarchive Selected Insurance** is enabled once at least one archived record is selected; works the same way in reverse.
- With the Archived toggle on, both archived and non-archived records show together (archived ones highlighted), and a mixed selection enables both actions simultaneously, each acting on the records it applies to.
- Archived/unarchived records reappear in their respective list sorted by created date and time, latest first.

## 21. Delete & Restore

- **Delete Selected Insurance** (kebab menu, List tab) is enabled once at least one record is selected, and visible/actionable only for Legal-permission users. On confirmation, records move to the Trash tab and a toast confirms it.
- **Trash tab** shows every deleted record, sorted by deletion date/time (latest first), with the same Search, Filter, and Column Show/Hide & Reorder as the List tab. Records here cannot be opened or edited.
- **Restore Selected Insurance** (kebab menu, Trash tab) is enabled once at least one trashed record is selected, and is likewise restricted to Legal-permission users. On confirmation, records return to the List tab, sorted by created date and time, latest first.

## 22. User Permissions

Access is governed by the existing "Legal" permission checkbox (Settings → User Add/Edit) — the same permission used by the Legal Review module. No separate Insurance-specific permission field exists.

- **Create** — available to every user, regardless of the Legal permission.
- **Edit** — Legal-permission users only. Opening a record as a non-Legal user loads it in read-only mode: every field is non-editable, and the Update action is unavailable. Legal-permission users get the normal editable overlay.
- **Delete / Restore** — Legal-permission users only, from the main listing page (List tab and Trash tab kebab menus respectively). Hidden/disabled for everyone else.
- **View** — available to every user, everywhere, regardless of the Legal permission.
- These rules apply consistently across every entry point where an Insurance record can be created, viewed, edited, or deleted — the standalone module, and any linked-module surface — and are enforced at the action level, not just hidden in the UI.

## 23. Project Scope

### In Scope

- Insurance record creation from the Insurance module only
- "Related to" (Fixture / Vessel, optional) with a dynamic Select Fixture / Select Vessel follow-up
- Standardised 16-value Type of Cover list, shared with Claims, independent of Related to
- Cover-type-specific financial field groups with formulas, collapsed by default
- Broker sourced live from Customers flagged "Is Insurance Broker"
- Leading Underwriter as a dropdown of Legal users
- Legal Entity field, driving the Insurance Number prefix
- Bi-annual Declaration to Broker checkbox
- Intended Vessel, standalone from Related to
- Insurance Status: Foreseen, Active, Expired, Cancelled
- Insurance listing page: full column set, search, filter, sorting, pagination, Column Show/Hide & Reorder
- Insurance edit overlay: read-only header (Insurance Status editable for Legal users), Overview / Legal Review / Claims tabs
- History (creation, additions, updates, removals)
- Insurance tab within Fixture and Vessel edit overlays — view-only
- Archive/Unarchive; Delete & Restore (Legal-permission only) with the Trash tab
- Role-based access control: Create open to all, Edit/Delete restricted to Legal-permission users
- Toast notifications for all confirmed actions

### Out of Scope

- Full claims processing and settlement workflows
- Automated premium calculation beyond the formulas in §6, or invoice generation
- Integration with external insurance portals or broker systems
- Advanced analytics dashboards and reporting beyond the listing view
- Document storage and attachment management (policy documents, certificates)
- Renewal workflow and automated expiry notifications

## 24. Business Drivers

- Eliminate manual and duplicate policy data entry across emails and spreadsheets
- Improve data consistency and accuracy of insurance records across operational teams
- Ensure full visibility of insurance coverage positions linked to specific fixtures and vessels
- Enable faster retrieval and audit of policy information during claims or legal review events
- Provide consolidated visibility of active and expiring insurance coverage
- Reduce the risk of uninsured exposure through structured recording of cover periods, limits, and formula-driven premium/tax figures
- Prevent duplicate or conflicting entry points for the same relationship, by making the Insurance record itself the single place a Fixture or Vessel linkage is created
- Support compliance and audit requirements through structured data, a full History trail, and role-based access controls

## 25. Assumptions

- An Insurance record may optionally declare a "Related to" relationship, but if declared, it is to exactly one Fixture or one Vessel — never both, never more than one
- Only Legal-permission users are responsible for maintaining, editing, and deleting policy data; any user may create a record
- Type of Cover is a single master list, shared identically with Claims, maintained centrally
- Broker options come from Customers flagged "Is Insurance Broker" in Settings — not a static list
- Insurer and P&I club master data is maintained in the system
- Legal Entity numbering follows `[Legal Entity office code]-INS-[Current Year]-[Sequential Number]`, system-generated
- Claims linkage is visible from Insurance's Claims tab but managed from the Claims module
- Legal Review integration is managed through the existing Legal Review module

## 26. Constraints

- Type of Cover is selected from a single standardised list, independent of Related to
- An Insurance record may relate to exactly one Fixture or one Vessel, never both — the UI shows only one of the two follow-up fields at a time
- Policy End Date must not be earlier than Policy Start Date
- The Insurance Number is system-generated and cannot be manually entered or edited
- Edit and Delete are restricted to Legal-permission users; Create is open to all
- Remarks is capped at 10,000 characters
- Fixture and Vessel edit overlays cannot create or link Insurance records — any new relationship is set from the Insurance record itself

---

# User Stories

## Insurance - Management module

**COEMS ID:** COEMS-20265

**USER Story:**
As a user, I should be able to access Insurance only in the Management module, so that I can easily locate and use Insurance in the appropriate module without confusion.

**Acceptance criteria:**
1. The Insurance option must be available in the sidebar menu of the Management module.
2. Insurance must not appear in the sidebar menu of any other module.
3. The Insurance feature retains its existing functionality regardless of which module it's accessed from.

---

## Insurance - Add Brokers in Customers (Settings)

**COEMS ID:** COEMS-19671

**USER Story:**
As a user, I want to flag certain customers in COEMS as Insurance Brokers and have those customers automatically populate the Broker dropdown in the Insurance module, so that broker selection is driven by live COEMS data rather than a static list.

**Acceptance criteria:**
1. A new checkbox — "Is Insurance Broker" — is added to the Settings → Customers add and edit overlays, positioned after the existing customer fields, unchecked by default, optional.
2. Checking it makes that customer's name available in the Insurance module's Broker dropdown.
3. The Broker dropdown (Add and Edit overlays) populates dynamically from Customers, only including those flagged "Is Insurance Broker," showing the Customer Name as the label, and showing a "No brokers available" empty state if none are flagged. The old static hardcoded list is removed entirely.
4. The dropdown reflects real-time changes: a newly flagged customer appears immediately (no refresh needed); unflagging a customer removes them from the dropdown going forward, but any Insurance record that already selected them keeps that stored value unchanged.
5. The Customers listing in Settings shows a "Broker" badge inline against any flagged customer.
6. Broker Reference Number and Broker Contact are unaffected by this story — those fields were later removed by COEMS-21188.

---

## Insurance - Show linked Claims

**COEMS ID:** COEMS-22227

**USER Story:**
As a User, I should be able to see the list of linked Claims in a Claims tab, so that I can understand the linked claims.

**Acceptance criteria:**
1. A new "Claims" tab is added to the Insurance edit overlay.
2. Each linked claim displays as a read-only card, most recently linked first.
3. Clicking a claim card opens that claim's edit overlay.
4. Each card shows: Claim No, Claim Status, Description (truncated to two lines, shown only when present), Type of Claim, Claimant, Claim Estimate ("USD {amount}", "—" when unset), Vessel, Date of Incident, Type of Cover.
5. When no claims are linked, the tab shows a centered empty state: "No claims linked."

---

## Insurance - New fields based on Type of Cover - Updates

**COEMS ID:** COEMS-21637

**USER Story:**
As a user managing Insurance records, I want to enter the financial details for whichever single Type of Cover a policy actually has, see the premium/tax figures the broker's actuarial spreadsheet would calculate automatically, and be steered toward only the field group that applies to my policy, so that I never duplicate a number in two places, never hand-calculate a formula the source spreadsheet already defines, and never see five other cover types' worth of irrelevant fields.

**Acceptance criteria:** as detailed in §5 and §6 of this document — common fields always visible; six cover-type-specific field groups, collapsed by default, shown per the Type of Cover mapping table; calculated fields visually distinguished with a formula caption; Total Sum Insured (TSI) / Tax Amount / Total Premium Incl. Tax switch between calculated and manual depending on Type of Cover; values reset when Type of Cover changes (not on opening an existing record); the old "Total insurance costs (rollup)" fields are removed entirely, since one record only ever has one populated field-set.

---

## Insurance - Implement History

**COEMS ID:** COEMS-21223

**USER Story:**
As a User, I want to view a history of changes made within the Insurance module via a History pop-up, so that I can track the timeline of updates and identify what was changed and by whom.

**Acceptance criteria:**
1. A "View History" option is available in the kebab menu of the Insurance edit overlay header.
2. It opens a pop-up matching the layout and behaviour of the Fixture module's View History.
3. The layout distinguishes Creation, Additions (field + old/new values), Updates (field + previous/updated values), and Removals (field + previous value, marked deleted).
4. Each entry shows user name, date/time, action performed, and field details with old and new values.

---

## Insurance - Add New Form Updates & Clean Up

**COEMS ID:** COEMS-21188

**USER Story:**
As a user managing Insurance records, I want a shorter, better-ordered add/edit form with corrected status values and a way to track biannual broker declarations, so that I only see fields that are actually used, the most important commercial details appear early, and Ops can confirm — and later filter on — whether the broker has been informed of a policy.

**Acceptance criteria:**
1. **Fields removed entirely:** Policy Number, Policy / Cover Reference, Insurance Type / Clause Type, Broker Reference Number, Broker Contact, Insurer Contact.
2. **Reorder:** Broker, Insurer / Club, Policy Start Date, and Policy End Date move to sit directly after Type of Cover; Leading Underwriter stays as its own field rather than travelling with Insurer/Club; Financials keeps its position; Workflow & Dates keeps only Date of Notification to Broker and Renewal Terms; General (Status, Created By, Remarks) stays last.
3. **Status values:** Foreseen, Active, Expired, Cancelled — "Closed" is removed everywhere (dropdown, listing filter, badge styling).
4. **New "Bi-annual Declaration to Broker" checkbox** — placed next to Policy End Date; added as a listing column and a listing filter.
5. **Type of Cover** replaced with the same 16-value list confirmed for Claims (§4 of this document); the 7 values with no home in the new list (Charterer's loss of profit, Charterer's loss of use, Kidnap ransom protection (K&R), Northern Sea Route buy back (NSR), Project insurance, Property insurance, TCL and FD&D) are removed.
6. **New "Intended Vessel" field** — a standalone dropdown in Cover Details, fully independent of Related to / Select Fixture / Select Vessel; added as a listing column and filter (search text box + checkbox list).

---

## Insurance - Add "Legal Entity" field in the Add Overlay

**COEMS ID:** COEMS-20734

**USER Story:**
As a user, I want to capture a Legal Entity on each Insurance record, in the Add/Edit overlay, the listing column, and the filter, so that I can identify and filter insurance records by the legal entity they relate to.

**Acceptance criteria:**
1. **Add overlay** — Legal Entity dropdown, last field, after Remarks, mandatory, defaults to the current user's Preferred Legal Entity, overridable. Drives the numbering format `[preferred legal entity office code]-INS-[YYYY]-[XXX]` (e.g. `UHL-INS-2026-001`).
2. **Edit overlay** — same position, shows the already-saved value (not re-defaulted), editable, saves correctly.
3. **Main listing page** — new LEGAL ENTITY column.
4. **Search & Filter** — Legal Entity added as a search keyword and to the Add Filter list (alphabetical, searchable, scrollable, checkbox list), combinable with other filters.
5. No other fields, sections, or behaviours change.

---

## Insurance - User Permission - Updates

**COEMS ID:** COEMS-20464

**USER Story:**
As a user, I want to allow all users to create and link Insurance records, while restricting the editing and deleting of an Insurance record to users with the "Legal" permission, so that anyone can record or attach insurance, but only the legal team can modify or remove insurance data — consistently across every area where insurance is accessed.

**Acceptance criteria:**
1. **Permission source** — the existing "Legal" checkbox in the User Add/Edit overlay (Settings), the same one used for Legal Review; no additional field is needed.
2. **Create** — available to all users, regardless of the Legal permission.
3. **Edit** — Legal-permission users only, wherever a record can be opened. Non-Legal users get a fully read-only overlay — no fields editable. Legal users get the normal editable overlay with the Update action.
4. **Delete** — Legal-permission users only; the option is hidden/disabled for everyone else. Restore, as Delete's counterpart, is likewise Legal-only.
5. **Applies everywhere insurance is linked:** the standalone Insurance module, the Insurance tab within Fixture, the Insurance tab within Vessel (Settings), the Insurance tab within Claims, and any future module where Insurance can be created, linked, edited, or deleted.
6. **View** — available to all users everywhere, regardless of the Legal permission.
7. **Enforcement** — restrictions are enforced at the action level across all entry points, not just hidden in the UI.

---

## Insurance - Create New Insurance Updates

**COEMS ID:** COEMS-20462

**USER Story:**
As a user, I want to create a new insurance record by entering relevant details, including exactly which Fixture or Vessel it relates to, so that insurance policies are recorded accurately, consistently, and linked to the correct fixture or vessel from the Insurance record itself.

**Acceptance criteria:** as detailed in §3–§10 of this document — the "New Insurance" overlay opens from the listing page's "New Insurance" button, organised into Cover Details, Financials, Parties, Workflow & Dates, and General; Related to (Fixture/Vessel) is optional and, if set, reveals exactly one follow-up field, with no "Crew" option and no Insurance Category concept; the Create Insurance button is enabled once Type of Cover, Insurer/Club, Policy Start Date, Policy End Date, and Insurance Status are filled (Related to and its follow-up are optional and don't block submission); on creation, a system-generated Insurance No is assigned, Created Date is set, the record appears at the top of the listing, and the overlay closes automatically; if related to a Fixture or Vessel, that record's own detail view reflects the linkage (view-only there, per §15); Cancel closes without saving, no confirmation required. This story also establishes that the Fixture and Vessel edit overlays' own Insurance tabs are view-only — Card view and Unassign only, with no Add New Insurance or Link Insurance action — and that Search, Add Filter, and Column Show/Hide & Reorder all support Related to, Related Fixture, and Related Vessel as searchable/filterable/configurable fields.

---

## Insurance - Main Listing Page

**COEMS ID:** COEMS-18825

**USER Story:**
As a user, I want to view the list of insurance records when I access the Insurance module from the sidebar, so that I can easily see and manage all insurance policies created in the system.

**Acceptance criteria:** as detailed in §16 of this document — accessed from the Management module's sidebar; the listing page is empty by default until records are created; the header includes Search, Add Filter, Status group filter tabs (All, Foreseen, Active, Expired, Cancelled), List/Trash toggle, Archived toggle (off by default), New Insurance button, and a kebab menu (Delete Selected Insurance, Archive Selected Insurance, Unarchive Selected Insurance); the full column set is per §16, with expandable Related to sub-rows for the linked Fixture or Vessel; records sort by created date and time, latest first; horizontal scrolling and column width adjustment are both available.

---

## Insurance - In Vessel

**COEMS ID:** COEMS-18824

**USER Story:**
As a user, I want to view Insurance records linked to a Vessel directly from the Vessel edit overlay, so that all insurance policies related to a Vessel are visible in one place.

**Acceptance criteria:**
1. An "Insurance" tab is available inside the Vessel edit overlay, alongside the existing tabs.
2. The tab is **view-only** — it displays every linked Insurance record as a card. There is no Add New Insurance or Link Insurance action here; the relationship is created only from the Insurance record's own "Related to" field.
3. Cards are grouped by Insurance Status, in order: Active, Expired, Cancelled, Foreseen.
4. Each card shows: Insurance No, Type of Cover, Insurance Status, Cover Period (Policy Start Date – Policy End Date), Broker, Insurer / Club, Leading Underwriter, Created By.
5. Each card's kebab menu (visible on hover) offers **Unassign** — a confirmation pop-up ("Are you sure you want to unassign this insurance record from the Vessel?") clears the record's Related to link on Yes, without deleting the Insurance record itself; No closes with no change.

---

## Insurance - In Fixture

**COEMS ID:** COEMS-18822

**USER Story:**
As a user, I want to view Insurance records linked to a Fixture directly from the Fixture edit overlay, so that all insurance policies related to a Fixture are visible in one place.

**Acceptance criteria:** identical to Insurance - In Vessel (above), applied to the Fixture edit overlay's own "Insurance" tab instead.

---

## Insurance - Edit Overlay - Legal Review

**COEMS ID:** COEMS-18818

**USER Story:**
As a user, I want to add and manage Legal Reviews directly from the Insurance edit overlay, so that all legal reviews related to Insurance are accessible and manageable in one place.

**Acceptance criteria:** as detailed in §12 of this document — the Legal Review tab displays every linked review; Add New Review pre-sets Related To to Insurance and this record's Insurance No; Link Review is a searchable multi-select by Review Number that preserves any other Inquiry/Fixture/Scope links already on the review; cards are grouped by status (To Be Reviewed, Under Review, Reviewed, Not Required) and show Review Number, Related To, Review Type, E Filing Number, Due Date, Review Raised By, Legal Review Status; clicking a card opens the review's edit overlay on top of the Insurance edit overlay; each card's kebab menu offers Unassign with a confirmation pop-up, which removes the card without deleting the review.

---

## Insurance - Edit Overlay

**COEMS ID:** COEMS-18810

**USER Story:**
As a user, I want to open an Insurance detail overlay from the listing page, so that I can view the Insurance details and edit them.

**Acceptance criteria:**
1. Clicking any Insurance record opens the edit overlay, with a kebab menu (Delete Insurance, View History) and a read-only header showing Insurance Number, Type of Cover, Cover Period (Start Date – End Date), Created By, and Insurance Status.
2. Insurance Status is the only header field that's editable — for Legal-permission users only (§22) — and its edited value reflects on the Overview tab's own Insurance Status field.
3. The overlay has three tabs: **Overview** (every field from the Add New Insurance overlay, editable for Legal-permission users, read-only for everyone else, with the same field validations as Create), **Legal Review** (§12), and **Claims** (§13).

---

## Insurance - Listing Search & Add Filter

**COEMS ID:** COEMS-18829

**USER Story:**
As a user, I want to apply filters and perform searches on the Insurance listing page, so that I can quickly find the specific insurance records I need.

**Acceptance criteria:** as detailed in §17 and §18 of this document — a text search field in the listing header matches Insurance No, Related to, Fixture, Vessel, Type of Cover, Broker, Insurer/Club, Leading Underwriter, Insurance Status, Created By, Remarks, and Legal Entity, displaying each match as a line item; an "Add Filter" option opens an alphabetically ordered, scrollable, searchable filter list per the table in §18, with multiple filters combinable simultaneously.

---

## Insurance - Show Hide/ Reorder

**COEMS ID:** COEMS-18828

**USER Story:**
As a user, I want to customize the header columns of the Insurance listing page, so that I can show, hide, and reorder relevant columns according to my preferences.

**Acceptance criteria:** as detailed in §19 of this document — a Show/Hide icon at the top-right of the column header row opens Show/Hide (search field, Select All, Update button, checkbox list) and Reorder (Reset button, Update button, drag-and-drop list) tabs; every listing column except ID and Insurance No is configurable in both; ID and Insurance No are always visible and fixed in position.

---

## Insurance - Archive & Unarchive

**COEMS ID:** COEMS-18827

**USER Story:**
As a user, I want to archive and unarchive selected insurance records from the Insurance module, so that I can view only the required items.

**Acceptance criteria:** as detailed in §20 of this document — an "Archived" toggle (off by default) switches between active and archived records, with archived records visually highlighted; "Archive Selected Insurance" and "Unarchive Selected Insurance" (kebab menu) are each enabled once a matching record is selected, each with a Yes/No confirmation and a success toast; with the Archived toggle on, both groups display together and a mixed selection enables both actions at once, each acting on the records it applies to; records reappear in their respective list sorted by created date and time, latest first.

---

## Insurance - Delete & Restore

**COEMS ID:** COEMS-18826

**USER Story:**
As a user with the Legal permission, I want to delete and restore insurance records within the Insurance listing page, so that I can manage relevant data effectively and recover deleted records when needed.

**Acceptance criteria:** as detailed in §21 of this document — "Delete Selected Insurance" (List tab kebab menu) is enabled once a record is selected and is available only to Legal-permission users; on confirmation, records move to the Trash tab with a success toast. The Trash tab carries the same Search, Filter, and Column Show/Hide & Reorder as the List tab, sorted by deletion date/time (latest first), and records there cannot be opened or edited. "Restore Selected Insurance" (Trash tab kebab menu), likewise Legal-permission only, returns records to the List tab on confirmation, sorted by created date and time, latest first.
