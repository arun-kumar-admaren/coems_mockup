# Business Requirements Document

## Claims Module — COEMS

**Document Reference:** COEMS-CL-BRD-001
**Version:** 3.0
**Date:** 2026-09-18
**Status:** Draft — comprehensive specification of the Claims module's complete feature set.

---

## 1. Description

The Claims module provides a centralised system for creating, managing, tracking, and resolving maritime claims across vessel operations within the COEMS platform.

The module replaces manual and fragmented processes (emails, Excel trackers, broker correspondence) with a unified digital claims workflow. It enables:

- Standardised claims recording across all vessel operations, using **one claim form** regardless of where the claim originates
- A **Voyage-driven cascade** — selecting a Voyage automatically populates and locks the Vessel, and scopes the Related Fixture picker to that voyage's own fixtures
- Centralised tracking of claim details, including broker, insurer, financial exposure, and resolution status
- Linkage of claims to HSEQ incidents, fixtures, voyages, and insurance records
- A complete financial view per claim covering cost allocation, settlement, recovery, and net exposure
- Integration with the Legal Review module for legal oversight and document tracking
- Integration with the Voyage module, allowing claims to be initiated directly from within a voyage context with full field parity to a claim created directly from the Claims module
- Multi-party management — surveyors, lawyers, adjusters, correspondents, and engineers can be tracked per claim

Claims can be created either directly from the Claims module or from within the Voyage module's combined Incident / Claim tab. Every claim uses the same form and the same listing regardless of how it was created — there is no "Standalone" vs. "Incident Related" classification anywhere in the module.

## 2. Key Components

1. Claim Creation and Management (unified form, single entry point layout)
2. Claims Listing & Management
3. Search & Filter
4. Claims Detailed Overlay
5. Legal Review tab
6. Incidents tab
7. Insurance tab
8. Financials tab
9. Closure tab (reduced field set)
10. Documents Checklist tab
11. History
12. PDF Export, Copy Template, Send as Email

## 3. Claim Record — Core Details

Every claim, whether created from the Claims module or from a Voyage, captures the same Core Details in the same order:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Voyage | Dropdown | Mandatory | Auto-populates and locks Vessel; scopes the Related Fixture picker to this voyage's own fixtures. |
| Vessel | Read-only | — | Derived from the selected Voyage. |
| Related Fixture | Multi-select | Mandatory | Scoped to the selected Voyage's fixtures only; selected fixtures show as removable chips. |
| Date of Incident | Date picker | Optional | — |
| Location | Free text | Optional | e.g. Port of Rotterdam, At Sea. |
| Claimant | Free text | Mandatory | — |
| Claimant Reference Number | Free text | Optional | e.g. CLM-REF-2024-001. |
| Representative of Claimant | Free text | Optional | — |
| Port Agent | Dropdown | Optional | Hovering the selected value shows a contact card — Name, Email, Phone Number, Address, City, Country, Zip Code — each with its own copy control; missing fields show "—" with no copy control. The card only appears once a Port Agent is selected. |
| Date of Notification to Broker | Date picker | Optional | — |
| Short Claim Description | Textarea, max 10,000 chars | Mandatory | Displayed in the Claims listing's Description column. |
| Steps taken so far | Textarea, max 10,000 chars | Optional | Actions already taken. |
| Required Assistance from Insurance | Dropdown — Yes / No | Optional | When Yes, a conditional Remarks textarea appears. |

## 4. Claim Record — Additional Information

A dedicated section holding the remaining, lower-priority fields:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Claim Status | Dropdown — Open / Close | Mandatory | Defaults to Open. |
| PIC Legal | Multi-select checkbox list | Optional | Positioned immediately after Claim Status. Legal team members assigned to this claim. |
| Type of Cover | Dropdown (§5) | Optional | Presented before Type of Claim. |
| Type of Claim | Dropdown (§5) | Optional | Disabled until Type of Cover is selected; options filtered to the covers-to-claims mapping in §5. |
| Broker | Dropdown | Optional | — |
| Broker Reference Number | Free text | Optional | e.g. MIB-2024-089. Included in the PDF export. |
| Insurer | Dropdown — insurer/club list | Optional | Renamed from "Leading Insurer" — same field, same values. Auto-fills and locks (read-only) whenever a matching Insurance record is found for the claim's Vessel and Type of Cover, active on the claim's Created Date (§5); reverts to a normal editable dropdown when no match exists. |
| Insurer Reference Number | Free text | Optional | Positioned next to Insurer. Plain input, not auto-populated. |
| Priority | Dropdown — None / Low / Medium / High / Overdue | Optional | — |
| Status Description | Textarea, max 10,000 chars | Optional | Current status notes. |
| Recovery Right Exists | Dropdown — Yes / No | Optional | — |
| Resolution Path | Dropdown — Under Negotiation / Settlement / Defense / Recovery / Litigation / Arbitration / Closed without Action | Optional | Edit mode only. |
| Legal Entity | Dropdown — user's Preferred Legal Entity | Mandatory | Defaults to the current user's Preferred Legal Entity. |

**Edit-mode-only sections**, shown in addition to the above once a claim has been saved:

**Date Settled & Claim Duration**
- Date Settled — date picker; recommended (amber hint) when Claim Status = Close.
- Claim Duration — read-only, calculated as Date Settled − Created Date, shown as "X days."

**External Parties**
- Inline list of appointed parties (Surveyor, Lawyer, Correspondent, Adjuster, Engineer), with a "+ External Party" button to add a row.
- Each row: Type, Name, Parent Company, Date Appointed, Status (Appointed / Active / Response Received / Closed).
- Each row has a kebab menu with Remove (confirmation shown if data has been entered).
- Multiple parties of the same type may be added to one claim.

## 5. Type of Cover & Type of Claim

**Type of Cover** is a single standardised 16-value list, shared with the Insurance module:

Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), Loss of Hire (LOH), Strike and Delay, Hull and Machinery (H&M), Increased Value (IV), FD&D (UHL as owner), Extra War Risk insurance (EWRI), War Risk, Extended Crew Cover (P&I extension), Comprehensive Carrier's Liability Cover (CCC), Comprehensive General Liability (CGL), Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC), Transport insurance, Professional indemnity.

**Type of Claim** is dependent on Type of Cover — the dropdown is disabled until a Type of Cover is chosen, and then shows only the values mapped to it below. Changing Type of Cover to a value whose list no longer includes the currently selected Type of Claim clears that field, requiring re-selection.

| Type of Cover | Allowed Type of Claim values |
| --- | --- |
| Protection & Indemnity (P&I) | Cargo, Crew, Property Damage, Personal Injury, Pollution, Pre-Loading Survey, Wreck Removal, Other |
| Charterer's Liability (CL) | Cargo, Damage To Hull, Personal Injury, Pre-Loading Survey, Property Damage, Other |
| FD&D (UHL as charterer) | FD&D |
| Loss of Hire (LOH) | Loss of Hire |
| Strike and Delay | Strike and Delay, Cyber |
| Hull and Machinery (H&M) | Particular Average, FFO, Third Party Liability (other than FFO), Machinery, General Average, Total Loss |
| Increased Value (IV) | Total Loss, Equipment |
| FD&D (UHL as owner) | FD&D |
| Extra War Risk insurance (EWRI) | H&M, IV, Loss of Hire, P&I, Other |
| War Risk | H&M, IV, Loss of Hire, P&I, Other |
| Extended Crew Cover (P&I extension) | Other |
| Comprehensive Carrier's Liability Cover (CCC) | Cargo, Property Damage, Personal Injury, Pollution, Indemnities, Waiver of General Average Contribution and/or Possessory Lien, Irrecoverable General Average Contribution, Other |
| Comprehensive General Liability (CGL) | Other |
| Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC) | Cargo, Property Damage, Personal Injury, Pollution, Indemnities, Waiver of General Average Contribution and/or Possessory Lien, Irrecoverable General Average Contribution, Other |
| Transport insurance | Equipment |
| Professional indemnity | Third Party Liability |

**Insurer auto-fill matching logic**: when both Vessel and Type of Cover are set on a claim, the system looks for an Insurance record where Related to = Vessel (matching this claim's Vessel — Fixture-linked Insurance records are never candidates), Type of Cover matches, and the claim's Created Date falls within that record's Policy Start Date → Policy End Date range. If more than one record matches, the one with the latest Policy Start Date wins. Re-triggers whenever Vessel or Type of Cover changes.

## 6. Creating a Claim

**From the Claims module**: a "New Claim" button on the listing page opens a right-side "New Claim" overlay showing the Overview tab (Core Details + Additional Information, §3–§4). Legal Entity, Related Fixture, Claimant, and Claim Status must all be filled before the Create Claim button enables; an alert is shown if any is missing. On save: a system-generated Claim Number is assigned in the format `UHL-CL-[YYYY]-[XXX]` (e.g. `UHL-CL-2026-004`), the claim appears at the top of the listing, and the overlay closes. Tabs beyond Overview (Legal Review, Incidents, Insurance, Financials, Closure, Docs) are not shown until the claim is saved and reopened in Edit mode. Cancel discards all entered data without confirmation.

**From the Voyage module**: a "New Claim" option sits in the Incident/Claim tab's "Add New" dropdown, alongside "Incident." Voyage and Vessel are pre-filled and read-only from the voyage context. The same Overview form is used, with full field parity to a claim created from the Claims module. On "Create Claim," the claim is saved, appears immediately in the Incident/Claim tab's own Claims listing (Claim No, Type of Claim, Location, Priority, Claim Status columns), and is equally available and fully editable from the main Claims module listing, with the complete tab set once opened in Edit mode.

## 7. Claim Edit Overlay — Header & Tabs

Clicking any row in the Claims listing opens the Edit Claim overlay as a right-side sheet.

**Summary strip** (top of the overlay):

| Field | Type | Notes |
| --- | --- | --- |
| Claim Number | Read-only | Format `UHL-CL-[YYYY]-[XXX]`. |
| Type of Claim | Read-only | Reflects Additional Information; may be blank. |
| Type of Cover | Read-only | Reflects Additional Information. |
| Created By | Read-only | — |
| Created On | Read-only | Date the claim was created. |
| Claim Status | Inline dropdown — Open / Close | Quick-edit shortcut; syncs with the Overview tab's own field. |
| Priority | Inline dropdown — None / Low / Medium / High / Overdue | Quick-edit shortcut. |

**Tabs**, in order: Overview (always visible) · Legal Review, Incidents, Insurance, Financials, Closure, Docs (Edit mode only).

**Header kebab menu**: Export as PDF, Copy Template, Send as Email, View History.

## 8. Legal Review Tab

Displays every Legal Review linked to this claim.

- **Add New Review** opens the Create New Review overlay with Related To pre-set to Claims and this claim's number pre-selected. On creation, the review appears here and in the Legal Review module.
- **Link Review** — a searchable, multi-select dropdown by Review Number. If a review is already linked to other Inquiry/Fixture/Scope records, those stay set on its Related To field alongside this claim. Already-linked reviews are excluded from search results.
- Cards are grouped by status (To Be Reviewed, Under Review, Reviewed, Not Required), showing Review Number, Related To, Review Type, E Filing Number, Due Date, Review Raised By, Legal Review Status.
- Clicking a card opens the review's edit overlay on top of the claim's overlay.
- Each card's kebab menu offers Unassign (with a Yes/No confirmation) — removes the card without deleting the review.

## 9. Incidents Tab

Displays every HSEQ incident linked to this claim; empty by default until incidents are linked.

- **Link Incident** opens a dropdown of available incident records, generated from an exact match on this claim's own Voyage and Vessel. Multiple incidents may be linked to one claim; duplicates are not allowed.
- Each linked incident shows: Incident No, Vessel, Voyage, Related Fixture, Location, Date of Incident, Category, Class, Type, Severity, Status.
- If no incidents are linked, an amber hint reads: "No incidents linked. Use 'Link Incident' to associate one."
- Clicking an incident row opens the incident's detail view.
- Each card's kebab menu offers Unassign, with a confirmation dialog: "Are you sure you want to unassign this incident from the claim?" — Yes removes the link (the incident itself is untouched); No cancels.
- The reverse direction also exists: an Incident's own edit overlay has a Claims tab (Linked Claims header with a count and a "Link Claim" button) where a user can search by Claim No and link a claim from that side. Linked claim cards there show Claim No, Claim Status, Description, Type of Claim, Claimant, Claim Estimate, Vessel, Date of Incident, Type of Cover; clicking a card opens the claim's edit overlay; unlinking only removes the association.

## 10. Insurance Tab

Header bar: "Coverage Details" title (left) and a "Link Insurance" button (right). A claim may link only one insurance record.

**Collapsed row** for the linked record: expand/collapse toggle, Insurance ID (blue link, opens the Edit Insurance overlay), Policy Number, Type of Cover, Coverage Confirmed badge (Yes/No/Partial/Pending), Insurance Status badge (Active/Pending/Expired/Cancelled), and a kebab menu with Unassign.

Expanding the row reveals a **Coverage Details panel**, in five sections:

**Coverage Decision** — Coverage Confirmed (Yes/No/Partial/Pending, mandatory, defaults Pending), Coverage Decision Date (required unless Pending), Coverage Decision Remarks (required when No/Partial, hidden when Pending), Covered Portion/Scope (optional dropdown), Coverage Percentage % (enabled only when Partial), Coverage Limit Applied (optional).

**Deductible** — Deductible Applies (Yes/No), Deductible Exceeded (Yes/No).

**Insurer Communication** — Insurer Response Status (Not Sent/Sent/Awaiting Response/Reviewed/Accepted/Rejected/Partial Acceptance), Date Sent to Insurer (no future dates), Insurer Contact Person, Broker Contact Person.

**Follow-up** — Requires Follow-up (Yes/No), Next Follow-up Date (required when Yes, no past dates), Follow-up Note (visible and mandatory only when Yes).

**Metadata & Document** — Active Link (Yes/No), Decision Attachment Available (Yes/No), Decision Document Reference (free text), Internal Notes (textarea).

Unassigning shows a confirmation ("Are you sure you want to unassign this insurance policy from the claim? The policy record itself will not be deleted.") before removing the link and collapsing the row. With nothing linked, the tab shows an empty state: "No insurance linked," prompting use of Link Insurance.

## 11. Financials Tab

Five sections, in order.

**1 — Cost Allocation.** No "Add Cost" button — the table always keeps one empty row ready for input; entering an Amount on a row appends a new blank row below it automatically. Columns: Account Head (dropdown — Stevedoring, Port Expenses, Bunker Expenses, Crew Expenses, Repair & Maintenance, Survey Fees, Legal Fees, Agency Fees, Freight, Demurrage, Lashing/Securing, Cargo Handling, Insurance Premium, Other; mandatory), Particulars (free text), Recoverable By (dropdown — Insurance/Client/Non-recoverable, mandatory, defaults Insurance), Invoices (dropdown of existing invoice records), **BC** (currency, read-only, USD-formatted, positive-only — the sum of the selected invoice(s)' Additional Currency Amount, blank when no invoice is selected, always reflecting the latest Business Central amount rather than a snapshot), Amount (numeric, mandatory; auto-populated from the selected invoice), and a delete ("X") icon. Below the rows: a "Total Costs" subtotal and a "Total BC" subtotal (sum of the BC column), both right-aligned. BC is display-only — Total Costs, Outstanding Exposure, Net Exposure, and Recovery % are all derived from Amount, never from BC.

**2 — Claim Values.** Claim Estimate (mandatory; changing it auto-derives Claim Size unless manually overridden) and Claim Size (auto-derived, overridable, with an "Auto-derive" reset link when manually set): Estimate ≤ 0 → blank; Deductible > 0 and Estimate < Deductible → "Claim notification (below deductible)"; Estimate < USD 75,000 → "< USD 75k (small claim)"; USD 75,000–250,000 → "USD 75k – 250k (big claim)"; Estimate > USD 250,000 → "> USD 250k (special claim)." Settlement Amount (mandatory).

**3 — Insurance Thresholds** (both read-only). Deductible (from Insurance) — seeded from the linked Insurance record ("Derived from linked insurance records. Edit in the Insurance tab."). Deductible Exceeded Flag — auto-calculated: no deductible set → "No deductible set" (grey); Estimate or Settlement ≤ Deductible → "No — Within deductible" (green); Estimate or Settlement > Deductible → "Yes — Deductible exceeded" (red).

**4 — Recovery.** Recovery Amount (optional). Recovery Date (disabled when Recovery Amount = 0; no past dates). Outstanding Exposure (read-only: (Settlement Amount + Total Costs) − Recovery Amount; amber when > 0, green when = 0).

**5 — Summary.** Three KPI tiles: Total (Settlement Amount + Total Costs), Total Costs (sum of all cost entries), Net Exposure (Settlement Amount + Total Costs − Recovery Amount).

The Claim Estimate entered here is reflected in the Claims listing's own Claim Estimate column.

## 12. Closure Tab

Two sections. **Closure Outcome** — Closure Reason (dropdown: Settled / Defended / Withdrawn / Time-barred / Unrecoverable / Other; optional). **Lessons Learned** — a textarea (max 10,000 chars) with a confirmation checkbox next to the label to mark that lessons learned have been captured; optional.

## 13. Documents Tab

A Documents Checklist with six fixed items: Claim Notice Available, Damage Report Available, Supporting Picture Evidence Available, Bill of Lading Available, Survey Report Available, Invoice/Cost Documents Available. Each row has a Yes/No toggle pair (Yes = green, No = red, unselected = grey) and a notes field (placeholder "Reason / explanation..." when No is selected, "Add note..." otherwise). Toggling between Yes and No does not clear the note. The checklist state saves as part of the claim record.

## 14. History

From the header kebab menu's "View History," a pop-up matching the Fixture module's History implementation: Creation (record creation event, user, timestamp), Additions (field + old/new values), Updates (field + previous/updated values), Removals (field + previous value, marked deleted). Every entry shows user name, date/time, action performed, and field detail.

## 15. PDF Export

"Export as PDF" (header kebab menu, available for every claim) immediately shows a toast ("User Name – Started exporting Claim PDF report for - Claim Number – (Ref: Claim Export ID)") while the user continues working; a completion toast follows ("User Name – Exported Claim PDF report for - Claim Number – (Ref: Claim Export ID)"). The PDF is auto-saved to the claim's Document Manager, named `UHL-CL-[YYYY]-[XXX].pdf`, and remains accessible there at any time.

**Header**: company/platform name and logo, Claim Number, Date of Export, Claim Status and Priority.

**Claim Summary**: Claim Number, Type of Claim, Type of Cover, Vessel, Voyage, Related Fixtures, Claimant, Date of Incident, Date of Notification, Broker, Insurer, Status, Priority, Created By, Created Date.

**Overview Details**: every completed field from the Overview tab (empty/not-applicable fields shown as "—" or omitted), with Resolution and External Parties as clearly labelled subsections when populated.

**Financials Summary**: Claim Estimate (total), Cost Allocation table (Account Head, Particulars, Recoverable By, Amount), Recovery Total, Net Exposure.

The layout is clean and print-ready with consistent fonts, clear headings, and proper tables; internal system fields (database IDs, non-user-facing timestamps) are never included.

## 16. Copy Template & Send as Email

Both actions live in the header kebab menu (all claim records), and as two icon buttons per row in the Voyage Incident/Claim tab's Claims listing (copy icon — "Copy Template"; mail icon — "Send as Email"; tooltips on hover) — same behaviour, same content, from either entry point.

**Copy Template** generates the pre-filled incident notification text and shows it in a modal for the user to copy manually. **Send as Email** opens the user's default email client via `mailto:` with the same content pre-filled; the user reviews and sends it themselves — the system never sends anything directly.

**Subject line**: `Incident Report of Fixture [Fixture No] - MV "[Vessel Name]" @ [port] – incident date [dd.mm.yyyy]` — Fixture No from Related Fixtures (all values, separated by `/` if multiple), Vessel Name from the claim, `[port]` left for the user to fill in, incident date from Date of Incident.

**To**: left blank, for the user to fill in. **CC**: always pre-filled with `legal@unitedheavylift.com; hse@unitedheavylift.com` — fixed, cannot be removed by the system.

**Body** — the standard UHL incident notification table, mapped from the claim: Internal reference (Voyage + Related Fixtures), Vessel Name, IMO No. (from vessel master data), Date of incident (`dd/mm/yyyy xx:xx hrs`), Short description of incident and damage as far as known (from Short Claim Description), Steps taken so far, Required Assistance (Yes/No + the fixed note: *"Please review and confirm, whether provided damage report / picture evidence is sufficient or external surveyor required to attend."*), Vessel Position/Arrival time (always blank — not captured on the claim), Claimant, Representative of Claimant Present, Loading/Discharging terms (always a placeholder — not captured), Port Agent (full contact details), Other documents made available (placeholder, listed as applicable).

Below the table, a fixed **Enclosed Documents Checklist**, always included verbatim and never modified:

```
Please find enclosed a copy of:
a.    Charter Party
b.    Bill of Lading
c.    T/C Agreement
d.    Damage Report (incl. supporting picture evidence)
e.    Other (e.g., logbook, stowage plan marking damaged cargo, mate's receipt, receipt delivery note)
```

Followed by a fixed underwriter reference note: `contact details underwriter: N:\00 Templates\02 Operations\12 Incident Reporting`.

## 17. Claims Listing Page

Accessible from the sidebar under "Claims," available from the Operations and Management modules.

**Columns**, in order: Claim No, Type of Claim, Type of Cover, Vessel, Voyage, Related Fixtures, Broker, Broker Reference No, Insurer, Insurer Reference Number, Date of Incident, Date of Notification to Broker, Location, Claimant, Claimant Reference No, PIC Legal, Representative of Claimant, Port Agent, Description, Steps Taken So Far, Required Assistance, Priority, Status Description, Recovery Right Exists, Claim Estimate, Claim Size, Settlement Amount, Created By, Created Date, Claim Status, Linked Review, Linked Incidents, Linked Insurance, Closure Reason, Legal Entity.

**Quick filter tabs**: All / Open / Closed — All selected by default; selecting a tab filters by Claim Status.

A "New Claim" button opens the New Claim overlay. The footer shows a record count (e.g. "Found 7 records — 7 of 12 total"). An empty state ("No claims found," search icon) shows when nothing matches the current search/filter. Records sort by created date and time, latest first.

## 18. Search

A text field in the listing header matches: Claim No, Type of Claim, Type of Cover, Vessel, Broker, Claimant, Linked Incidents. Matches display as line items.

## 19. Add Filter

An alphabetically ordered, scrollable filter list with its own search box; filters combine.

| Filter | Type |
| --- | --- |
| Claim No | Search text + checkbox list |
| Type of Claim | Search text + checkbox list |
| Type of Cover | Search text + checkbox list |
| Vessel | Search text + checkbox list |
| Voyage | Search text + checkbox list |
| Related Fixtures | Search text + checkbox list |
| Broker | Search text + checkbox list |
| Broker Reference No | Search text |
| Insurer | Search text + checkbox list |
| Date of Incident | Date range |
| Date of Notification to Broker | Date range |
| Location | Search text |
| Claimant | Search text |
| Claimant Reference No | Search text |
| PIC Legal | Search text + checkbox list |
| Representative of Claimant | Search text |
| Port Agent | Search text + checkbox list |
| Required Assistance | Search text + checkbox list |
| Priority | Search text + checkbox list |
| Recovery Right Exists | Search text + checkbox list |
| Claim Estimate | Currency range |
| Created By | Search text + checkbox list |
| Created Date | Date range |
| Claim Status | Search text + checkbox list |
| Linked Review | Search text + checkbox list |
| Linked Incidents | Search text + checkbox list |
| Linked Insurance | Search text + checkbox list |
| Claim Size | Search text + checkbox list |
| Settlement Amount | Currency range |
| Closure Reason | Search text + checkbox list |
| Legal Entity | Search text + checkbox list |

## 20. Column Show/Hide & Reorder

A Show/Hide icon at the top-right of the column header row opens **Show/Hide** (search field, Select All, Update button, checkbox list) and **Reorder** (Reset button, Update button, drag-and-drop list) tabs. Every listing column in §17 except ID and Claim No is configurable in both; ID and Claim No are always visible and fixed in position.

## 21. Archive & Unarchive

An "Archived" toggle in the header (off by default) switches between active and archived claims; archived records are visually highlighted. "Archive Selected Claims" and "Unarchive Selected Claims" (kebab menu) are each enabled once a matching record is selected, each with a Yes/No confirmation and a success toast. With the Archived toggle on, both groups display together and a mixed selection enables both actions at once. Records reappear in their respective list sorted by created date and time, latest first.

## 22. Delete & Restore

"Delete Selected Claims" (List tab kebab menu) is enabled once a record is selected and is available only to Legal-permission users. On confirmation, records move to the Trash tab with a success toast. The Trash tab carries the same Search, Filter, and Column Show/Hide & Reorder as the List tab; records there cannot be opened or edited. "Restore Selected Claims" (Trash tab kebab menu), likewise Legal-permission only, returns records to the List tab on confirmation, sorted by created date and time, latest first.

## 23. User Permissions

Access is governed by the "Legal" checkbox on a user's record (Settings → User Add/Edit) — the same permission used by Legal Review and Insurance.

- **When enabled**: the user can create, edit, and delete Claim records.
- **When not enabled**: the user can create Claim records, but cannot edit, delete, or restore them. They can still use Copy Template, Export as PDF, Send as Email, and View History on any claim.
- Removing the Legal permission from an active user shows a validation message.
- These restrictions are enforced across every entry point where Claim editing is possible.

## 24. Project Scope

### In Scope

- Claim record creation from the Claims module and from the Voyage module, using one unified form with full field parity between both entry points
- Voyage-driven Vessel (locked) and Related Fixture (scoped) cascade
- Auto-generated Claim No. (`UHL-CL-[YYYY]-[XXX]`)
- Type of Cover / Type of Claim dependent dropdowns, sharing the 16-value Type of Cover list with Insurance
- Insurer auto-fill from a matching Insurance record, with fallback to manual entry
- Claims listing with the full column set (§17), search, and Add Filter
- Claim Edit overlay: header summary with quick-edit Claim Status/Priority, and the full tab set (Overview, Legal Review, Incidents, Insurance, Financials, Closure, Docs)
- Financials tab: Cost Allocation (with BC/Business-Central invoice linkage), Claim Values, Insurance Thresholds, Recovery, and a 3-tile Summary
- Closure tab, reduced to Closure Reason and Lessons Learned
- Documents checklist tab
- History, PDF Export, Copy Template, and Send as Email (including from the Voyage listing)
- Role-based access: Create open to all, Edit/Delete/Restore restricted to Legal-permission users

### Out of Scope

- Full document attachment and file management per claim
- Automated notifications and escalation alerts (e.g. overdue claims)
- Reporting and analytics dashboards beyond the Financials tab summary tiles
- Integration with external broker or P&I Club portals
- Premium calculation and invoice generation (beyond reading Business Central invoice amounts into the BC column)

## 25. Business Drivers

- Eliminate manual claim tracking across emails, spreadsheets, and fragmented correspondence files
- Provide a single source of truth for all active and historical maritime claims, using one form regardless of how a claim was raised
- Improve visibility of financial exposure across the claims portfolio through the Financials tab
- Enable faster response to incidents via immediate claim notification from within the Voyage module
- Reduce the risk of under-reported claims through direct, two-way linkage with HSEQ incident records
- Ensure complete audit trails — broker correspondence, insurer appointments, cost allocations, resolution steps, and a full History log
- Improve recovery tracking and outstanding exposure visibility
- Support legal oversight through integration with the Legal Review module per claim
- Enable management to monitor the claim lifecycle from notification to closure with priority and status visibility
- Reduce onboarding time and training overhead through a single, standardised claims workflow

## 26. Assumptions

- Claims are associated with a Vessel, a Voyage, and at least one Related Fixture
- Claims initiated from the Voyage module carry the same fields as claims created directly from the Claims module — the only distinction is that Voyage and Vessel remain locked to the originating voyage
- The Claims team and Operations team are jointly responsible for maintaining accurate claim data
- Broker is entered via a shared dropdown; Insurer is a shared dropdown aligned with the Insurance module's Insurer/Club master list
- PIC Legal values are shared with the Legal Review module's PIC Legal list
- Type of Claim, Type of Cover, and Priority master lists are maintained as code-level reference data
- The Deductible shown in the Financials tab is sourced from the claim's own Insurance tab, never manually entered there
- Legal Review, Incidents, Insurance, Closure, and Docs submodule specifications are governed by their respective BRDs
- The Voyage combined "Incident / Claim" tab is available only in Voyage v2; Voyage v1 retains the original separate Incidents tab

## 27. Constraints

- Vessel is always system-derived from the selected Voyage and cannot be independently selected, for claims created from either entry point
- Related Fixture selection is limited to fixtures belonging to the selected Voyage
- The Claim No. is system-generated and cannot be manually entered or edited
- Tabs beyond Overview are visible only in Edit Mode — not shown during initial claim creation
- Recovery Against, Recovery Route, Liability Position, Liability Assessment Notes, Security Provided (and its subfields), and Resolution Notes are not collectible on a claim
- Closure data beyond Closure Reason and Lessons Learned is not collectible

---

# User Stories

## Claims - Update the CC email address in the Email

**COEMS ID:** COEMS-22831

**USER Story:**
As a user sending a claim notification email, I want to CC the correct department address, `hse@unitedheavylift.com` instead of the outdated `hseq@unitedheavylift.com`, so that the incident notification actually reaches the right inbox.

**Acceptance criteria:**
1. Wherever the Claims email template's CC field is defined, the address is `hse@unitedheavylift.com`, not `hseq@unitedheavylift.com`.
2. The other fixed CC address, `legal@unitedheavylift.com`, is unaffected.
3. Applies identically to both delivery paths: Copy Template and Send as Email, from both the Claim Edit overlay and the Voyage Claims listing.

---

## Claims - Financials Tab - Add Invoice Selection Feature

**COEMS ID:** COEMS-22209

**USER Story:**
As a user working in the Claims module, I want to view the total amount of the selected invoice(s) in a new "BC" column for each Cost Allocation line item in the Financials tab, so that I can quickly compare the Business Central invoice amount against the cost line item's value.

**Acceptance criteria:** as detailed in §11 of this document — a read-only, system-populated BC column sits between Invoices and Amount; shows the invoice's Additional Currency Amount, always positive, always in USD regardless of the claim's own currency; sums when multiple invoices are selected on one row; blank (not $0) when none is selected; auto-updates when invoices are added/removed and always reflects the latest Business Central amount rather than a snapshot; a "Total BC" subtotal sums the column; none of the existing Total Costs / Outstanding Exposure / Net Exposure / Recovery % calculations change — they stay derived from Amount only.

---

## Claims - Move "PIC Legal" field into Additional Information Section

**COEMS ID:** COEMS-22152

**USER Story:**
As a User, I should be able to see the "PIC Legal" field within the Additional Information section, so that I can find the related details in the correct section.

**Acceptance criteria:**
1. In the Claims Add and Edit overlay, "PIC Legal" moves from Core Details to Additional Information, and is removed from Core Details entirely.
2. Within Additional Information, "PIC Legal" is positioned immediately after "Claim Status."
3. The field's existing functionality is otherwise unchanged.

---

## Claims - Type of Cover / Type of Claim - Relational Values

**COEMS ID:** COEMS-21182

**USER Story:**
As a user filling in a claim, I want to select Type of Cover first, then have Type of Claim limited to only the values that actually apply to that cover, so that I can't accidentally pick a claim type that doesn't make sense for the cover selected, and the list I see is short and relevant.

**Acceptance criteria:** as detailed in §5 of this document — Type of Cover is presented before Type of Claim everywhere the two appear together; Type of Claim is disabled until a Type of Cover is chosen and then shows only the values from the confirmed mapping table; changing Type of Cover to a value whose mapping no longer includes the current Type of Claim clears it, requiring re-selection; applies consistently on both the Claims module's own Add/Edit overlay and the Voyage-created claim overlay. The old 21-value Type of Cover list and the old compound Claim Type list are both fully replaced — Type of Cover becomes exactly the 16 mapped values, and Type of Claim becomes the 27-value deduplicated generic list drawn from the mapping table (including two distinct "Third Party Liability" and "Third Party Liability (other than FFO)" values).

---

## Claims - Port Agency Updates

**COEMS ID:** COEMS-21179

**USER Story:**
As a user working on a claim, I want to hover over the selected Port Agent to see their full contact details in a card, with each detail individually copyable, so that I have everything needed to reach the port agent without the form itself growing extra address/phone fields.

**Acceptance criteria:**
1. The Port Agent dropdown itself is unchanged — same list, same single-select, in every form it appears in.
2. Hovering the selected value shows a card, in order: Name, Email, Phone Number, Address, City, Country, Zip Code. A missing field shows "—" with no copy control for that row.
3. Each field has its own copy control, with the standard "Copied to clipboard" toast confirmation.
4. No card is shown before a Port Agent is selected.

---

## Claims - Insurer Autofill

**COEMS ID:** COEMS-21160

**USER Story:**
As a user working on a claim, I want the Insurer field to auto-fill based on the claim's Vessel and Type of Cover, so that I don't have to manually look up which insurer currently covers that vessel for that type of cover.

**Acceptance criteria:** as detailed in §5 of this document — triggers once Vessel and Type of Cover are both set; matches an Insurance record where Related to = Vessel (matching this claim's Vessel; Fixture-linked Insurance is never a candidate), Type of Cover matches, and the claim's Created Date falls within that record's Policy Start/End Date range; the most recently started policy wins on multiple matches; the Insurer field auto-fills and becomes read-only when a match exists, and stays a normal editable dropdown when it doesn't; re-triggers on any change to Vessel or Type of Cover; the Insurance module's own Insurer/Club field is unaffected and remains manually selected there.

---

## Claims - Copy template & Send as Email from Voyage - Claims listing

**COEMS ID:** COEMS-21146

**USER Story:**
As Ops working in the Voyage module, I want to copy the incident notification template or send it as an email directly from each claim row in the Incident/Claim tab's Claims listing, so that I can send the first notification without opening the full claim overlay.

**Acceptance criteria:** as detailed in §16 of this document — a copy icon ("Copy Template") and a mail icon ("Send as Email") appear on every claim row in the Voyage listing, with hover tooltips, behaving identically to the same two actions in the Claim Edit overlay's kebab menu; available regardless of Claim Status or Type; no new template content or wording is introduced — only the access point is added.

---

## Claims - Fields Updates

**COEMS ID:** COEMS-21137

**USER Story:**
As a user creating a claim, from either the Claims module or a Voyage record, I want to see the same field-level corrections on both "Add New Claim" overlays, so that the two creation forms stay in lockstep.

**Acceptance criteria:**
1. **Date of Notification to Broker** moves out of Additional Information into the main Core Details part of the form, in both overlays. Only its position changes — type and optional validation stay the same.
2. **"Leading Insurer" is relabelled to "Insurer"** in both overlays — same dropdown, same options, same underlying field.
3. A new **"Insurer Reference Number"** field is added next to Insurer in Additional Information — free text, optional, not auto-populated.
4. **"Broker Reference Number"** (already present in the Claims module) is added to the PDF Export as well.
5. No other fields, validation rules, or numbering are affected.

---

## Claims - Add New Claim

**COEMS ID:** COEMS-20043

**USER Story:**
As a user, I want to create a new claim from the Claims module, so that the claim is captured with all relevant vessel, voyage, party, and cover details from the moment it is raised.

**Acceptance criteria:** as detailed in §3, §4, and §6 of this document — a "New Claim" button on the listing opens a right-side "New Claim" overlay on the Overview tab; Voyage, Related Fixture, Claimant, and Claim Status are validated as mandatory before save, alongside Legal Entity; on save, a system-generated Claim Number (`UHL-CL-[YYYY]-[XXX]`) is assigned and the claim appears at the top of the listing; tabs beyond Overview are not shown until the claim is saved and reopened in Edit mode; Cancel discards all data without confirmation.

---

## Claims - Add New Claim from Voyage

**COEMS ID:** COEMS-20056

**USER Story:**
As a user, I want to raise a new claim directly from a voyage record, so that claims arising during a voyage are captured in context — with the voyage and vessel automatically pre-filled and the related fixture scoped to that voyage.

**Acceptance criteria:** as detailed in §6 of this document — a "New Claim" option sits in the Voyage's Incident/Claim tab "Add New" dropdown; Voyage and Vessel are pre-filled and read-only; the same Overview form is used as in the Claims module, with the same validation (Related Fixture, Claimant, Claim Status, Legal Entity); the Claim Number uses the same numbering sequence as claims created in the Claims module; on "Create Claim," the claim is saved and immediately visible in the Voyage's own Claims listing (Claim No, Type of Claim, Location, Priority, Claim Status columns) as well as the main Claims module listing; the claim is fully editable from the Claims module afterward, with the complete tab set in Edit mode.

---

## Claims - Edit Overlay - Overview tab

**COEMS ID:** COEMS-20091

**USER Story:**
As a user, I want to open an existing claim in a detailed edit overlay that surfaces all claim information across tabs, so that I can update claim details, manage linked records, and track the claim from initial notification through to closure.

**Acceptance criteria:** as detailed in §7 (summary strip and tab list), §3–§4 (the Overview tab's full field set, used identically for both creating and editing), and the Date Settled & Claim Duration / External Parties edit-mode-only sections described in §4. The header kebab menu offers Export as PDF, Copy Template, and Send as Email.

---

## Claims - Implement History

**COEMS ID:** COEMS-20438

**USER Story:**
As a User, I want to view a history of changes made within the Claims module via a History pop-up, so that I can track the timeline of updates and identify what was changed and by whom.

**Acceptance criteria:** as detailed in §14 of this document — "View History" in the header kebab menu opens a pop-up matching the Fixture module's implementation, distinguishing Creation, Additions, Updates, and Removals, each entry showing user name, date/time, action performed, and field details with old and new values.

---

## Claims - Export as PDF

**COEMS ID:** COEMS-20167

**USER Story:**
As a user, I want to export a claim record as a PDF from the Claim Edit overlay, so that I can share, file, and communicate claim information in a clean, print-ready format.

**Acceptance criteria:** as detailed in §15 of this document — available from the header kebab menu for all claims; a start toast appears immediately and generation runs in the background; a completion toast follows; the PDF auto-saves to the claim's Document Manager as `UHL-CL-[YYYY]-[XXX].pdf`; content covers the header, Claim Summary, Overview Details (with Resolution and External Parties as labelled subsections when present), and a Financials Summary; formatting is clean and print-ready, with no internal system fields included.

---

## Claims - Send as Email

**COEMS ID:** COEMS-20169

**USER Story:**
As a user, I want to send the pre-filled incident notification email directly from the Claim Edit overlay, so that I can notify the underwriter with all relevant claim details without switching applications or manually composing the email.

**Acceptance criteria:** as detailed in §16 of this document — available from the header kebab menu for all claims; opens the default email client via `mailto:` with To blank, CC fixed to `legal@unitedheavylift.com; hse@unitedheavylift.com`, and Subject/Body pre-filled per the mapping in §16; the user reviews and sends it themselves — the system never sends directly.

---

## Claims - Copy Template

**COEMS ID:** COEMS-20168

**USER Story:**
As a user, I want to copy a pre-filled incident notification email template from the Claim Edit overlay, so that I can quickly compose and send a standardised claim notification to the underwriter.

**Acceptance criteria:** as detailed in §16 of this document — available from the header kebab menu for all claims; generates the template text in a modal for manual copying; follows the standard UHL incident notification table structure and field mapping, the fixed Enclosed Documents Checklist, and the fixed underwriter reference note, exactly as specified in §16.

---

## Claims - User Permissions

**COEMS ID:** COEMS-20166

**USER Story:**
As a user, I want to assign a "Legal" permission to users, so that only authorized users can edit Claim records, while others can only create them.

**Acceptance criteria:** as detailed in §23 of this document — Legal-permission users can create, edit, and delete claims; non-Legal users can create claims but cannot edit, delete, or restore them, though they retain Copy Template, Export PDF, Send as Email, and View History; removing Legal permission from an active user shows a validation message; the restriction is enforced across every entry point where Claim editing is possible.

---

## Claims - Search & Add Filter

**COEMS ID:** COEMS-20170

**USER Story:**
As a user, I want to apply filters and perform searches on the Claims listing page, so that I can quickly find the specific claim records I need.

**Acceptance criteria:** as detailed in §18 and §19 of this document — a text search field matches Claim No, Type of Claim, Type of Cover, Vessel, Broker, Claimant, and Linked Incidents; an "Add Filter" option opens an alphabetically ordered, scrollable, searchable filter list per the table in §19, with multiple filters combinable simultaneously.

---

## Claims - Show/ Hide & Reorder

**COEMS ID:** COEMS-20165

**USER Story:**
As a user, I want to customize the header columns of the Claims listing page, so that I can show, hide, and reorder relevant columns according to my preferences.

**Acceptance criteria:** as detailed in §20 of this document — a Show/Hide icon opens Show/Hide (search, Select All, checkbox list) and Reorder (drag-and-drop list) tabs; every listing column except ID and Claim No is configurable in both; ID and Claim No are always visible and fixed in position.

---

## Claims - Archive & Unarchive

**COEMS ID:** COEMS-20164

**USER Story:**
As a user, I want to archive and unarchive selected claim records from the Claims module, so that I can view only the required items.

**Acceptance criteria:** as detailed in §21 of this document — an "Archived" toggle (off by default) switches views, with archived records visually highlighted; "Archive Selected Claims" / "Unarchive Selected Claims" (kebab menu) each enable on a matching selection, each with a Yes/No confirmation and success toast; a mixed selection under the Archived toggle enables both actions at once, each acting on the record's current state; records reappear sorted by created date and time, latest first.

---

## Claims - Delete & Restore

**COEMS ID:** COEMS-20163

**USER Story:**
As a user, I want to delete and restore claim records within the Claims listing page, so that I can manage relevant data effectively and recover deleted records when needed.

**Acceptance criteria:** as detailed in §22 of this document — "Delete Selected Claims" (List tab kebab menu), Legal-permission only, moves records to the Trash tab with a success toast; the Trash tab carries the same Search, Filter, and Column Show/Hide & Reorder as the List tab, and records there cannot be opened or edited; "Restore Selected Claims" (Trash tab kebab menu), likewise Legal-permission only, returns records to the List tab, sorted by created date and time, latest first.

---

## Claims - Link Claims from Incidents (Claims Tab)

**COEMS ID:** COEMS-20153

**USER Story:**
As a user, I want to view and link claims to an incident from within the incident's edit overlay, so that I can see every claim raised against an incident in one place and maintain a clear record of its financial impact.

**Acceptance criteria:**
1. A Claims tab appears in the Edit Incident overlay (not available in Create mode), with a "Linked Claims" header bar showing a count and a "Link Claim" button.
2. Clicking "Link Claim" opens a search dropdown (auto-focused, searching by Claim No) that excludes claims already linked to this incident and deleted claims. Clicking the backdrop closes it without linking anything; selecting a claim immediately links it and closes the dropdown, with no further confirmation.
3. Each linked claim shows as a card: Claim No, Claim Status, Description (truncated to two lines, shown only when present), Type of Claim, Claimant, Claim Estimate ("USD {amount}", "—" when unset), Vessel, Date of Incident, Type of Cover. Clicking the card opens the claim's edit overlay.
4. With nothing linked, the tab shows a centred empty state: "No claims linked" / "Use 'Link Claim' to associate claims with this incident."
5. Each card's kebab menu offers Unlink, with a confirmation ("Are you sure you want to unlink this claim from the incident?") — Yes removes only the association, without deleting or modifying the claim record; No cancels.

---

## Claims - Edit Overlay - Documents Tab

**COEMS ID:** COEMS-20119

**USER Story:**
As a user, I want to track which supporting documents have been collected or are outstanding for a claim through a Documents checklist tab, so that I can ensure all required paperwork is in order before a claim is closed or submitted to the insurer.

**Acceptance criteria:** as detailed in §13 of this document — a Documents tab (Edit mode only) shows the six fixed checklist items, each with a Yes/No toggle pair and a notes field whose placeholder changes based on the selection; switching between Yes and No never clears the note; the checklist state saves as part of the claim record.

---

## Claims - Edit Overlay - Closure Tab

**COEMS ID:** COEMS-20113

**USER Story:**
As a user, I want to formally document the closure of a claim — including the reason and lessons learned — through a dedicated Closure tab, so that every closed claim has a complete, auditable record of how it was resolved and what was learned.

**Acceptance criteria:** as detailed in §12 of this document — a Closure tab (Edit mode only) with two sections: Closure Reason (optional dropdown) and Lessons Learned (optional textarea, max 10,000 characters, with a confirmation checkbox next to the label).

---

## Claims - Edit Overlay - Financials tab

**COEMS ID:** COEMS-20107

**USER Story:**
As a user, I want to record and track all financial entries related to a claim — including cost allocations, settlement values, insurance thresholds, recovery amounts, and a summary snapshot — within the Financials tab of the claim overlay, so that the full financial picture of each claim is visible in one place.

**Acceptance criteria:** as detailed in §11 of this document — five sections in order (Cost Allocation, Claim Values, Insurance Thresholds, Recovery, Summary), with the Cost Allocation table's always-present blank row, the Claim Size auto-derivation rules, the Deductible Exceeded Flag states, the Outstanding Exposure formula, and a 3-tile Summary (Total, Total Costs, Net Exposure). The Claim Estimate entered here reflects in the Claims listing page.

---

## Claims - Edit Overlay - Insurance tab

**COEMS ID:** COEMS-20101

**USER Story:**
As a user, I want to view, link, and manage the coverage details of the insurance policy associated with a claim from within the claim's Insurance tab, so that the policy-to-claim relationship is fully documented without leaving the claim overlay.

**Acceptance criteria:** as detailed in §10 of this document — a header bar with "Link Insurance" (a claim may link only one insurance record); a collapsed row per linked record showing Insurance ID (clickable), Policy Number, Type of Cover, Coverage Confirmed and Insurance Status badges, and a kebab menu; expanding the row reveals the five-section Coverage Details panel (Coverage Decision, Deductible, Insurer Communication, Follow-up, Metadata & Document) exactly as specified; Unassign shows a confirmation before removing the link without deleting the insurance record; an empty state prompts Link Insurance when nothing is linked.

---

## Claims - Edit Overlay - Incidents tab

**COEMS ID:** COEMS-20100

**USER Story:**
As a user, I want to view and link incidents to a claim from within the claim's edit overlay, so that the relationship between the claim and the incident(s) that caused it is clearly established and navigable.

**Acceptance criteria:** as detailed in §9 of this document — an Incidents tab (Edit mode only), empty by default; "Link Incident" opens a dropdown of incidents matching this claim's own Voyage and Vessel exactly; multiple incidents may be linked, no duplicates; each linked incident displays Incident No, Vessel, Voyage, Related Fixture, Location, Date of Incident, Category, Class, Type, Severity, Status; an amber hint shows when nothing is linked; each card's kebab menu offers Unassign with a confirmation ("Are you sure you want to unassign this incident from the claim?"), removing only the association; clicking a row opens the incident's detail view; the Claims listing's Linked Incidents column reflects the linked incident numbers.

---

## Claims - Edit Overlay - Legal Review tab

**COEMS ID:** COEMS-20092

**USER Story:**
As a user, I want to create and manage legal reviews directly from within a claim record, so that all legal work tied to a specific claim is accessible in context without having to navigate to the separate Legal Review module.

**Acceptance criteria:** as detailed in §8 of this document — Add New Review pre-sets Related To to Claims and this claim's number; Link Review is a searchable multi-select by Review Number that preserves any other Inquiry/Fixture/Scope links already on the review; cards are grouped by status (To Be Reviewed, Under Review, Reviewed, Not Required) and show Review Number, Related To, Review Type, E Filing Number, Due Date, Review Raised By, Legal Review Status; clicking a card opens the review's edit overlay on top of the claim's overlay; each card's kebab menu offers Unassign with a confirmation, removing the card without deleting the review.

---

## Claims - Main Listing Page

**COEMS ID:** COEMS-20072

**USER Story:**
As a user, I want to view all claims in a paginated, searchable listing table, so that I can quickly locate, review, and act on any claim record without navigating individual overlays.

**Acceptance criteria:** as detailed in §17 of this document — accessible from the sidebar under "Claims," available from the Operations and Management modules; the full column set is per §17 (Claim No formatted `UHL-CL-[YYYY]-[XXX]`, Insurer rather than "Leading Insurer"); a quick filter tab bar (All / Open / Closed, All by default) filters by Claim Status; a "New Claim" button opens the New Claim overlay; the footer shows a record count; an empty state ("No claims found") shows when nothing matches.
