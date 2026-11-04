# Business Requirements Document

## Legal Review Module — COEMS

**Document Reference:** COEMS-LR-BRD-001
**Version:** 3.0
**Date:** 2026-09-18
**Status:** Draft — comprehensive specification of the Legal Review module's complete feature set.

**Cross-module notice:** Several requirements below reach into the Chartering and Ops modules. These are marked 🔗 Chartering or 🔗 Ops. They are described here because they are part of the Legal Review workflow, but their implementation must be coordinated with those modules.

**Open dependencies:** items marked ⚠ need a decision or external integration before build (e.g. M-Files integration, automatic vessel arrival/departure capture).

**Implementation status legend:** ✅ **Built** — implemented and verified in the mockup · 🟡 **Partial** — implemented with a gap noted · ❌ **Not built** — spec only, not yet implemented (mostly cross-module 🔗 items, or items the client said are "not needed as of now").

---

## 1. Description

The Legal Review module provides a centralised system for creating, managing, tracking, and reviewing legal documents and agreements across the vessel and commercial operations within the COEMS platform.

The module replaces manual and fragmented processes (emails, Excel sheets, shared drives) with a unified digital workflow. It is embedded in the Inquiry, Fixture, Insurance, and Claims modules, with a dedicated entry point in Chartering as well; integration with Ops and with a future Scope module is not yet built.

Legal Reviews can be created directly in the Legal Review module (standalone), from the Inquiry / Fixture / Insurance / Claims edit overlays, or from Chartering's own sidebar entry. A review does not require any linked record at creation — it can be raised unconnected (for example, an NDA before any Inquiry or Fixture exists) and linked to a record later.

Each review is a single task — there are no sub-tasks within a review. A Task created from a Legal Review cannot itself be given subtasks, wherever that task is opened from.

## 2. Key Components

1. Legal Review Creation & Management (standalone, embedded tabs, and the Chartering sidebar entry)
2. General Details (Review Number, Link Review, Description, PIC Legal, Legal Entity)
3. Charter Party section 🔗 Chartering (separate field sets for Fixture and Inquiry)
4. Legal Review Status & Workflow (8 statuses, role-based, auto-defaults to "Open" on creation)
5. Task model (single task; Review Type; Standard / Project / Special category; Red Flag; no subtasks on Legal-Review-originated tasks)
6. Notes section (own tab in the Edit overlay)
7. Insurance / Additional Cover section 🔗 Chartering 🔗 Ops
8. Compliance (KYC) 🔗 Chartering
9. External tonnage handling 🔗 Ops
10. Document handling via M-Files ⚠
11. Legal Review Listing / Overview (columns, filters, number-based search, related-item overlay navigation, access rights)
12. Search & Filter, Column Show/Hide & Reorder, Archive & Unarchive, Delete & Restore
13. Chartering-side scoped access (own sidebar entry, row-level visibility by raiser/office)
14. Integration with Core Modules (Inquiry, Fixture, Scope, Insurance, Claims, Chartering, Ops)

## 3. General Details

Every Legal Review record captures:

| Field | Type | Status | Notes |
| --- | --- | --- | --- |
| Review Number | Auto-generated, read-only | ✅ Built | Format `[Legal Entity code]-L-[YYYY]-[XXX]` (e.g. `UHL-L-2026-001`, 3-digit sequential). The prefix is driven by the review's Legal Entity. |
| Link Review | Searchable select | ✅ Built | Link another existing review when one already exists. |
| Description | Free text | ✅ Built | Max 10,000 characters, with a character counter. |
| PIC Legal | Dropdown, multi-selection | ✅ Built | Values: the actual system users list. Visible and editable to Legal-permission users only — fully hidden (not disabled, not shown) for any user without the Legal permission, in every overlay it appears in (Create, Edit, and the embedded tab across Inquiry/Fixture/Insurance/Claims/Scope). Existing saved values are unaffected for non-Legal viewers; the field simply doesn't render for them. |
| Review Type | Dropdown (mandatory) | ✅ Built | Values: Contract Review Chartering, Contract Review Projects, NDA Review, Insurance Request, KYC Assistance, Others. |
| Related To | Searchable multi-select | ✅ Built | Inquiry / Fixture / Scope records directly; Insurance / Claims records addable via their own embedded Legal Review tabs. Not mandatory — a review may be created with an empty Related To list and connected to a record at any point afterward. Review Type and Legal Review Status are the only mandatory fields at creation. |
| Account | Read-only, derived | ✅ Built | Auto-populated from the Fixture(s)/Inquiry(s) in Related To (Scope, Insurance, and Claims links don't contribute an account). Not manually editable. Shows every linked account as comma-separated text when more than one Fixture/Inquiry with different accounts is linked; blank if only Scope/Insurance/Claims is linked, or if Related To is empty. Re-derives automatically whenever Related To changes. |
| Category | Dropdown — Standard / Project / Special | ✅ Built | Visible and editable to Legal-permission users only — same full-hide treatment as PIC Legal for non-Legal users. |
| Legal Entity | Dropdown (mandatory) | ✅ Built | Single-select, positioned as the last field in the Add/Edit overlay, after Review Raised By. Defaults to the current user's "Preferred Legal Entity" (Personal Settings) on creation; shows the already-saved value on Edit, not re-defaulted. Drives the Review Number prefix. Also present as a listing column, a search keyword, and an Add Filter entry. |

## 4. Charter Party section 🔗 Chartering

The Fixture and Inquiry Chartering tabs each carry their own "Legal" section, with different field sets reflecting what's actually meaningful at each stage of the commercial lifecycle.

### 4a. Fixture Chartering tab — "Legal" section

| Field | Status | Behaviour |
| --- | --- | --- |
| Charter Party Type | ✅ Built | Reuses/extends the existing "Type Of CP" field — 8 values (Gencon 94, Heavycon 2007, NYPE 2015, BIMCO, Frame Agreement, COA, BIMCO Supplytime, BIMCO UHL Supplytime). Same field referenced elsewhere as "Charter Party Type" — one shared value. |
| Contract / Recap Date | ✅ Built | Reuses the existing "Booking Date" field as-is. |
| Charter Party Issuance Date | ✅ Built | Tracks duration internally from the Fixture date until the contract is issued. |
| Draft Charter Party Issuance Date | ✅ Built | Date picker. Entering this date has no side effect on Legal Review Status. |
| Final Charter Party Issuance Date | ✅ Built | Date picker. Entering this date has no side effect on Legal Review Status. |
| Legal Review Status | ✅ Built | Live, editable dropdown — same 8 values and role-based selection rules as on the linked review itself (§5). A genuine second entry point for Chartering to set the status, not a read-only mirror. Changing it here updates the linked review directly, and vice versa. |
| Category | ✅ Built | Lives here, at the Fixture level — not at the task level. |
| Red Flag | ✅ Built | Free text; filled by Legal when a red flag applies (e.g. "BOD"). |
| Additional Insurance Details | ✅ Built | Chartering ticks an "Additional insurance required" checkbox (tick-box only, no details field on Chartering's side); "Insurance details" is Legal-only editable; "Special NDA Terms" is a shared free-text field; "Due Diligence Completed" is a checkbox ticked by Chartering. |

None of this section's fields are editable from the Review overlay — a user must open the Fixture directly, on the Chartering tab, to enter or change them. Since a review can relate to more than one Fixture, and a Fixture can have more than one linked review, this section's fields are scoped to that specific Fixture only — never shared or aggregated across multiple linked records.

### 4b. Inquiry Chartering tab — "Legal" section

| Field | Status | Behaviour |
| --- | --- | --- |
| Charter Party Type | ✅ Built | A separate field from the Fixture's, with its own stored value — selecting it here does not read from or write to the Fixture's field. Same 8-value list. |
| Legal Review Status | ✅ Built | Live, editable dropdown — same 8 values and role-based selection rules as §5, and as the Fixture-side mirror. |
| Red Flag | ✅ Built | Free text, same behaviour as on the Fixture tab. |
| Additional Insurance Details | ✅ Built | Same fields as the Fixture tab: Additional insurance required (checkbox, Chartering), Insurance details (Legal-only), Special NDA Terms, Due Diligence Completed (checkbox, Chartering). |

Contract/Recap Date and the three Charter Party Issuance Date fields are not part of the Inquiry Legal section — at Inquiry stage there is no recap yet, and once one exists the record has already become a Fixture. Category is not part of this section either; it lives only in the main Add/Edit overlay (§3), where it is Legal-only visible.

None of this section's fields are editable from the Review overlay — a user must open the Inquiry directly. Scoped to the specific Inquiry only, the same way as the Fixture section.

## 5. Legal Review Status & Workflow

The Legal Review Status dropdown drives the review's lifecycle. Values and who may set them:

| Status | Who can select |
| --- | --- |
| Open | Legal or Chartering |
| Under review | Legal only |
| Review completed | Legal only |
| Under negotiation | Legal only |
| Draft issued | Legal only |
| Final issued | Legal or Chartering |
| Signed | Legal or Chartering |
| Not required | Legal or Chartering |

✅ Built: the 8-value dropdown, and a new review auto-defaults to "Open" on creation — never an empty or unset value.

✅ Built: status is reflected on the listing (colour-coded badge) and on the filter/quick tabs.

❌ Not built: role-based *restriction* of which statuses a user may actually select. The "who can select" column above is the intended rule; enforcing it requires a user-role/session mechanism that doesn't exist yet.

## 6. Task model

✅ Built: a new task is a new review — there are no sub-tasks within a review. There is no task/subtask hierarchy at the review level (no add-subtask button, no expand/collapse, no Sub Tasks panel in the review's own detail).

✅ Built: Category (Standard / Project / Special) — Legal-only visible, per §3.

✅ Built: Red Flag — free-text field, filled by Legal when a red flag applies. No permission enforcement on who can fill it.

✅ Built: a Task whose "Related to" is Legal Review cannot be given subtasks. The entire "Sub Tasks" section (heading, "+" button, "No subtask found!" placeholder) is removed from that task's Detail Overlay, and the row-level "+" add-subtask button is hidden on the Task list view for the same task — identically, wherever the task is opened from (the Legal Review's own Task Management list, or the Chartering module's central Tasks listing page). Tasks not created from a Legal Review are unaffected and keep full subtask functionality.

❌ Not built — "not needed as of now" per client: 🔗 New Task from the Chartering tab (short description, due date, Review Type), and the deferred CR/F number linkage for requests not yet connected to one.

## 7. Notes section

✅ Built: a Notes section on the review record, independent of Tasks, in the same simple style as the Voyage module's Voyage Remarks. It lives in its own "Notes" tab in the Edit overlay, alongside an "Overview" tab that carries every other field and section.

- List of notes, newest first: avatar-initials circle, author's full name, date added (`dd/mm/yyyy`), note text.
- A single-line input with a submit control to add a new note.
- Hovering a note reveals a delete icon; a user can only delete their own notes.
- Clicking a note turns it into an editable textarea with a checkmark (save) and an X (cancel); a user can only edit their own notes.
- Available in Edit mode only — not shown during creation.

## 8. Insurance / Additional Cover section 🔗 Chartering 🔗 Ops

✅ Built: Additional Insurance Required checkbox on the Legal Review overlay, with a conditional Insurance Details text area shown when checked — filled by Legal on the Legal Review side. The same checkbox-only-for-Chartering / details-for-Legal split is also built into the Fixture and Inquiry Legal sections (§4).

❌ Not built — pending decision: the exception rule that PIC Chartering fills the additional insurance details only if Legal does not review the CP (requires knowing, and reacting to, who is reviewing the CP).

❌ Not built — deferred: 🔗 auto-capture of vessel port arrival/departure dates ⚠ to derive sign-on/sign-off dates, and 🔗 surfacing Additional Insurance information in the Ops Handover tab.

❌ Not built — "not needed as of now" per client: the Additional Cover List (Excel → COEMS) and its separate overview with its own filters/data.

## 9. Compliance (KYC) 🔗 Chartering

✅ Built: a "Due Diligence Completed" checkbox, on the Legal Review overlay and on both the Fixture and Inquiry Legal sections, ticked by Chartering.

❌ Not built: general integration making the Chartering-tab checkbox the single source of truth with a read-only copy surfaced elsewhere.

## 10. External tonnage 🔗 Ops

❌ Not built — "not needed as of now" per client: external tonnage items auto-populating the Legal Review list; 🔗 the "Have you informed legal?" prompt to Chartering when an inquiry becomes a fixture, carried into the Ops Handover.

## 11. Document handling — M-Files ⚠

✅ Built: manual E-filing number and the Legal Filing section are removed from both the main Legal Review overlay and the embedded tab.

❌ Not built — "not needed as of now" per client: the M-Files integration itself (auto-tick fields when a document exists in M-Files; document preview in COEMS). ⚠ Requires M-Files API/connection details.

## 12. Legal Review Listing / Overview

✅ Built — **Columns:** PIC Legal, Due Date, Review Type, Review Number, Account, Legal Entity, plus supporting columns ID, Description, Legal Review Status, Created Date, Review Raised By.

✅ Built — **Search:** real-time search across a review's own fields (Review Number, Review Type, Description, Legal Review Status), plus a substring match against every entry in Related To — Fixture, Inquiry, Insurance, or Claim/Scope numbers — from as few as 3 characters, regardless of category, so it finds Insurance/Claims numbers too even though the standalone module's own Related To field can't directly select those categories. Combines normally with the active status filter.

🟡 Partial — **Filters:** the Add Filter panel includes a Legal Entity filter (searchable checkbox list, alphabetical, combinable with other filters). A related-item type filter (Inquiry / Fixture / Scope / Insurance / Claim) is being added to the same panel, letting the user filter the listing to reviews linked to at least one record of a selected category, combinable with the other filters and the main Search box.

✅ Built — **Related-item overlay navigation**, two entry points:
- **From the listing page:** each review's expandable related-items list (Fixture / Scope / Inquiry / Insurance / Claim) lets the user open a linked record's own edit overlay as a right-side panel, directly from the listing. If that opened record is itself linked to further records, the user can drill further into those overlays within the same panel; a back arrow at the top steps back up one level at a time.
- **From within the review's own Edit overlay:** clicking any related item there opens that item's edit overlay layered on top of the current Legal Review overlay, with its own back icon to return. This applies consistently across all modules.

🟡 Partial — **Access rights:** Category and PIC Legal are Legal-only visible everywhere (§3). Chartering's own sidebar access is row-scoped to reviews it raised or that its office raised (§13). Broader access-rights enforcement — Legal edit-only with Chartering/Ops view-only, and role-based restriction of which statuses a user may select — is not yet built; both require a user-role/session mechanism the module doesn't yet have.

✅ Built — retained behaviours: Column Show/Hide & Reorder, Archive / Unarchive, Soft-delete & Restore (Trash), expandable linked records, horizontal scroll, pagination.

## 13. Chartering-side scoped access

✅ Built: a "Legal Review" entry in the Chartering sidebar, positioned next to Fixtures, opening the same Legal Review listing page used from Management — same columns, same overlay — with one difference: row-level visibility. A user without the Legal permission sees a review only if Review Raised By is themself, or shares at least one office in common with their own assigned office(s) ("Offices With Data Access") — any overlap counts as a match. A review with no Review Raised By value stays hidden from non-Legal users. Legal-permission users are unaffected and see every review regardless of raiser or office.

This scoping applies to the Legal Review Hub's main listing page. Whether the same rule should also filter which review cards a non-Legal user sees inside the embedded Legal Review tab is a related, separate question.

## 14. Project Scope

### In Scope

- Legal Review creation from the Hub, from the Inquiry / Fixture / Insurance / Claims embedded tabs, and from Chartering's own sidebar entry (row-scoped)
- Review Number numbering driven by the selected Legal Entity; Review Type classification; 8-value status dropdown, auto-defaulting to "Open" on creation
- Related To is optional at creation — a review can be raised unlinked and connected to a record later
- Single-task model (no sub-tasks); Tasks raised from a Legal Review cannot themselves have subtasks
- Standard/Project/Special Category and Red Flag; Category and PIC Legal restricted to Legal-permission users only
- Account — auto-derived, read-only, from linked Fixture(s)/Inquiry(s)
- Legal Entity field — mandatory, drives numbering
- Charter Party Type, Contract/Recap Date, Charter Party Issuance Date, and Draft/Final Charter Party Issuance Date on the Fixture Legal section; Charter Party Type, Legal Review Status, and Red Flag on the Inquiry Legal section
- Additional Insurance Required checkbox + conditional details; Due Diligence Completed checkbox, on the Legal Review overlay and on both the Fixture and Inquiry Legal sections
- E-filing number and Legal Filing section removed
- Notes section, in its own Edit-overlay tab
- Related-item overlay navigation from the listing page (drill-down + back arrow) and from within the Edit overlay (stacked + back icon)
- Listing/overview columns including Legal Entity
- Main-search matching on linked item numbers (Fixture/Inquiry/Insurance/Claim/Scope), substring, from 3 characters
- Column Show/Hide & Reorder, Archive/Unarchive, Delete/Restore

### Deferred to a later user story

- 🔗 Coordinated Chartering changes: role-based status-selection restriction, and general Legal-edit / Chartering-Ops-view access enforcement
- 🔗 Coordinated Ops changes: Additional Insurance info and external-tonnage handling in the Ops Handover tab
- The related-item type filter's full rollout across the Add Filter panel
- Whether Chartering's row-level scoping should also apply inside the embedded Legal Review tab

### Not needed as of now — per client decision

- New Task from the Chartering tab; deferred CR/F number linkage
- Additional Cover List (Excel → COEMS) and its second overview
- External tonnage auto-population; "Have you informed legal?" prompt
- M-Files integration

### Out of Scope

- Full claims processing and settlement workflows
- Financial accounting and invoicing logic
- Advanced analytics dashboards beyond basic review status reporting
- Automated legal notifications beyond those described

### Deferred / needs definition

- M-Files integration (external system connection)
- Automatic vessel arrival/departure capture (data feed)
- Columns/filters for the second Additional Cover overview
- A live user-role/session mechanism, needed to enforce role-based rules across the module

## 15. Business Drivers

- Single source of truth for legal reviews across charter parties, NDAs, KYC, and insurance
- Faster contract lifecycle via clear role ownership and a status workflow that reflects how the team actually works
- Reduced uninsured exposure through Legal-managed additional insurance with sign-on/off tracking
- Better handovers to Ops (insurance info, external tonnage, "informed legal?")
- Compliance and auditability through structured data, a persistent Notes trail, and M-Files document linkage
- Faster navigation across related commercial records without leaving the Legal Review screen

## 16. Assumptions

- The "Legal" permission identifies Legal-team users; Legal edits, Chartering/Ops view.
- Charter Party Type is entered independently on each module (Fixture and Inquiry each keep their own stored value); Booking Date is reused as-is on the Fixture tab only.
- Review numbering follows `[Legal Entity code]-L-[Current Year]-[Sequential Number]`, system-generated.
- Related-To items, when present, are pulled from active Inquiry/Fixture/Scope records; a review may also have none.
- Account is never entered manually — it is always derived from Related To.
- M-Files is the system of record for legal documents.
- Data persistence in the current phase relies on localStorage; API integration is planned for a future phase.

## 17. Constraints

- Cross-module items (Charter Party, Insurance, KYC, external tonnage) depend on coordinated changes in the Chartering and Ops modules.
- Data quality depends on manual input for free-text fields (Description, Red Flag, Notes).
- Horizontal scrolling is required due to the column count; column visibility/reorder preferences persist per user.
- M-Files and automatic vessel arrival/departure capture are external integrations, each needing its own technical scope.
- Enforcing role-based rules across the module (status-selection restriction, Legal-edit/Chartering-view, Category/PIC Legal visibility, Chartering's row scoping) depends on a real user-session/permission mechanism.

## 18. Mock-Up Screens

Interactive mockup (Version 2.0 toggle) — select Version 2.0 from the dropdown next to "COEMS" in the sidebar to see, live: updated Review Type values, PIC Legal and Account, the Charter Party section, Category, Red Flag, Additional Insurance Required, and Due Diligence Completed — across both the Legal Review Hub and the embedded tab (Fixture / Inquiry / Insurance / Claims). Version 1.0 remains as originally built.

Still not represented in the interactive mockup: the Legal Entity field, the Notes tab, related-item overlay navigation, Chartering's own sidebar entry and row scoping, and general Chartering-side access-rights enforcement, the Ops Handover touchpoints, the Additional Cover second overview, external tonnage, and M-Files.

---

# User Stories

## Legal Review - User Role-Based Listing View & Access

**COEMS ID:** COEMS-22853

**USER Story:**
As a Chartering user, I want to access the Legal Review module from my own sidebar but only see the reviews I raised myself or that were raised by someone from the office to which I have access, so that I can track requests relevant to me without being able to browse every legal review in the company.

**Acceptance criteria:**
1. **Sidebar access** — A "Legal Review" entry must be added to the Chartering sidebar, positioned next to Fixtures. Clicking it opens the same Legal Review listing page used today from Management — same columns, same overlay, same behaviour — only the row-level visibility differs.
2. **Scoping rule for non-Legal users** — A user without the Legal permission must only see a review if Review Raised By is the current user themself, or Review Raised By shares at least one office in common with the current user's own assigned office(s) ("Offices With Data Access"). Every other review is excluded entirely — not shown, not shown-disabled, not counted in "Found X records."
3. **Legal users are unaffected** — continue to see every review regardless of who raised it.
4. **Multiple offices per user** — the match is any overlap.
5. **No Review Raised By set** — stays hidden from non-Legal users.
6. **Scope of this rule** — applies to the Legal Review Hub's main listing page. Whether it should also filter the embedded Legal Review tab's cards is a separate, unresolved question.

---

## Legal Review - Add Number based search for Related Items

**COEMS ID:** COEMS-22854

**USER Story:**
As a user on the Legal Review main listing page, I want to find a review just by typing the number of a linked Fixture, Inquiry, Insurance record, Claim, or Scope into the main Search box, so that I can jump straight to the relevant review(s) without opening the Add Filter panel first.

**Acceptance criteria:**
1. Typing a Fixture, Inquiry, Insurance, Claim, or Scope number into the main Search box must return every review with a matching entry in its Related To list.
2. Matching is a substring match — as few as 3 characters of a linked item's number is enough.
3. The search matches the raw value of every Related To entry regardless of category, so it finds linked Insurance and Claims numbers too, even though the standalone Legal Review Hub's own Related To field only offers Inquiry/Fixture/Scope as selectable categories.
4. The main Search box continues to combine with the status quick-filter tabs exactly as today.

---

## Legal Review - Remove Validation for "Related to" field

**COEMS ID:** COEMS-22719

**USER Story:**
As a user, I want to be able to create a Legal Review without selecting anything in the Related To field, so that I can raise a review — for example an NDA — before any Inquiry, Fixture, or Scope record exists to link it to, and connect it later once one does.

**Acceptance criteria:**
1. The Related To field is not mandatory in the Create Review overlay. The Create Review button's enable logic depends only on Review Type and Legal Review Status being filled.
2. A review created with no Related To item shows as blank/empty in the listing and overlay — not as an error state.
3. Existing Link Review / Add New Review flows launched from within Inquiry, Fixture, Insurance, or Claims continue to pre-set Related To exactly as before; this only removes the requirement when creating a review with none.
4. A review created with no Related To can be connected to one or more records at any later point via the existing Related To field or Link Review flow.
5. Account remains blank for a review with no Fixture/Inquiry link, consistent with existing Account behaviour for Scope/Insurance-only links.

**Scope:** Legal Review → Create overlay → Related To field validation removed.

---

## Legal Review - Add related-item type filters (Inquiry, Fixture, Scope, Insurance, Claim) to listing

**COEMS ID:** COEMS-22560

**USER Story:**
As a user on the Legal Review listing page, I want the Add Filter panel to let me filter reviews by which type of related item they're linked to, so that I can narrow the list to, for example, only reviews linked to a Fixture, without scanning the whole list.

**Acceptance criteria:**
1. The Add Filter panel includes a "Related To" filter — a checkbox list of the linkable categories: Inquiry, Fixture, Scope, Insurance, Claim.
2. Selecting one or more categories filters the listing to reviews whose Related To list contains at least one item of a selected category.
3. This filter combines with the Legal Review Status, Account, Category, and Legal Entity filters, and with the main Search box, using AND logic across filter types.
4. Clearing the filter returns to the unfiltered list, consistent with existing Add Filter behaviour.
5. This filters by category regardless of number; finding a review by a specific item's number is handled by the main Search box instead.

**Scope:** Legal Review → Listing page → Add Filter panel → new Related To type filter.

---

## Legal Review - Field Updates in Inquiry - Chartering - Legal Section

**COEMS ID:** COEMS-22852

**USER Story:**
As a user in the Legal department, I want the Inquiry Chartering tab's "Legal" section to only ask for information that's actually meaningful pre-fixture, so that Chartering isn't asked for dates that don't apply until a recap exists.

**Acceptance criteria:**
1. The Inquiry Chartering tab's "Legal" section contains only: Charter Party Type, Legal Review Status, and Red Flag.
2. Contract/Recap Date, Charter Party Issuance Date, Draft Charter Party Issuance Date, and Final Charter Party Issuance Date are not part of this section.
3. The Fixture Chartering tab's "Legal" section keeps its full field set, including all four date fields — this section applies to Inquiry only.

---

## Legal Review - Category & PIC Legal fields should be available only for Legal Users

**COEMS ID:** COEMS-22830

**USER Story:**
As a user in the Legal department, I want to be the only one who can see and set the Category and PIC Legal fields on a Legal Review, so that Chartering doesn't have to make a Legal-owned classification decision they have no context for, and Legal retains ownership of that data.

**Acceptance criteria:**
1. **Category** must not render at all for a user without the Legal permission, in the Create overlay, Edit overlay, and every embedded Legal Review tab (Inquiry/Fixture/Insurance/Claims/Scope). Legal-permission users see it unchanged. Existing saved values aren't cleared for non-Legal viewers — they just don't see the field.
2. **PIC Legal** receives the same treatment.
3. The PIC Legal column and the Category filter on the listing page are unaffected.

---

## Legal Review - Auto-link Legal Review from Inquiry to Fixture upon conversion

**COEMS ID:** COEMS-22559

**USER Story:**
As a user, I want any Legal Review(s) already linked to an Inquiry automatically carried forward to the Fixture record created when that Inquiry is converted, so that Legal doesn't lose visibility of reviews raised pre-fixture and doesn't have to manually re-link the same review.

**Acceptance criteria:**
1. **Trigger** — applies whenever an Inquiry with one or more linked Legal Reviews is converted into a Fixture. No linked reviews means no change in behaviour.
2. **Carry-forward** — every linked review gets the new Fixture added to its Related To field, alongside the original Inquiry link, automatically, with no manual "Link Review" action. If more than one review is linked, all are carried forward.
3. **Visibility after conversion** — the Edit overlay, opened from anywhere, shows both the Inquiry and the Fixture under Related To; the new Fixture's own Legal Review tab shows each carried-forward review as a card; the original Inquiry's tab is unchanged.
4. **Scope of change** — only Related To is affected; no other field is modified, reset, or copied.

---

## Legal Review - Open Overlay of Related items

**COEMS ID:** COEMS-22355

**USER Story:**
As a User, I want to view an expandable list of linked/related items directly on the Legal Review listing page and open their edit overlays from the listing page itself, so that I can review related records without leaving the listing screen.

**Acceptance criteria:**
1. On the listing page, a Legal Review linked to any related module(s) shows those items via an expandable section.
2. The expanded view lists related items across Fixture, Scope, Inquiry, Insurance, and Claim.
3. Clicking a related item row opens that item's edit overlay.
4. The overlay opens as a right-side panel, consistent with existing overlay behaviour.
5. If the opened item is itself linked to further records, the user can drill further into those overlays within the same panel, without closing the current view.
6. A back arrow at the top of the overlay lets the user navigate back to the previous level whenever a nested/linked item overlay is open.
7. All existing functionality within each opened overlay continues to work exactly as it does today.

---

## Legal Review - Open Related Items from within the Edit Overlay

**COEMS ID:** COEMS-22153

**USER Story:**
As a User, I want to open a related item's edit overlay from within the Legal Review edit overlay, so that I can see and review all the details within that section.

**Acceptance criteria:**
1. In the Legal Review edit overlay, clicking any related item opens that item's own edit overlay.
2. That overlay opens on top of (layered over) the existing Legal Review edit overlay.
3. A back icon in the header of the related item's overlay returns the user to the Legal Review edit overlay.
4. This behaviour applies consistently across all modules.

---

## Legal Review - Move Notes to a Separate tab inside Edit overlay

**COEMS ID:** COEMS-22151

**USER Story:**
As a User, I want to view a separate "Notes" tab within the Legal Review edit overlay, so that I can review notes independently from the rest of the review details.

**Acceptance criteria:**
1. The Edit overlay has two tabs: "Overview" and "Notes."
2. "Overview" contains all existing fields and sections except Notes.
3. "Notes" contains the full Notes section as a standalone tab.
4. The "Add a note" input and its functionality work exactly as specified within the Notes tab.

---

## Legal Review - Remove Option to Add Subtask in the Task modal

**COEMS ID:** COEMS-21791

**USER Story:**
As a user viewing a Task created from a Legal Review, I want to no longer see any option to add a subtask to it, so that Legal Review tasks can't be given subtasks at all — while every other task keeps full subtask functionality unchanged.

**Acceptance criteria:**
1. For any Task whose Related to is Legal Review, the entire "Sub Tasks" section (heading, "+" button, and the "No subtask found!" placeholder) is removed from the Task Detail Overlay — not shown at all, not shown-but-disabled.
2. The row-level "+" add-subtask button on the Task list view is also hidden for these tasks.
3. This is a property of the task record itself, hidden identically whether the task is opened from inside the Legal Review's own Task Management list, or from the Chartering module's central Tasks listing page.
4. Tasks not created from a Legal Review show the Sub Tasks section and both "+" buttons exactly as normal — this behaviour is exclusive to Legal Review–originated tasks.

---

## Legal Review - Add a New section named "Legal" in the Inquiry Chartering Tab

**COEMS ID:** COEMS-21707

**USER Story:**
As a user in the Legal department, I want to enter Charter Party type, status, and red flag directly on the Inquiry's existing Chartering tab, in a new "Legal" section at the bottom, so that this information isn't duplicated or ambiguous when a review links to multiple Inquiries, or an Inquiry has multiple reviews.

**Acceptance criteria:**
1. A new "Additional Insurance Details" section is added to the Inquiry Chartering tab, containing: Additional insurance required (checkbox, ticked by Chartering), Insurance details (free text, Legal-only editable), Special NDA Terms (free text), Due Diligence Completed (checkbox, ticked by Chartering).
2. A new "Legal" section is added at the bottom of the tab, containing: Charter Party Type (its own field, independent of the Fixture tab's), Legal Review Status (live, editable, role-based), and Red Flag.
3. Legal Review Status here uses the same 8 values and role-based rules as the field on the linked review itself; changing it here updates the linked review directly, and vice versa.
4. None of this section's fields are editable from the Review overlay — a user must open the Inquiry directly.
5. Since a review can relate to more than one Inquiry, and an Inquiry can have more than one linked review, this section's fields are scoped to the specific Inquiry only.

---

## Legal Review - Auto Populate Account field Value & Legal Review Status Updates

**COEMS ID:** COEMS-21224

**USER Story:**
As a user creating or viewing a Legal Review, I want the Legal Review Status to default sensibly on creation, and the Account field to auto-populate from whichever Fixture(s)/Inquiry(s) the review is linked to, so that a new review never sits blank/undefined, and Account always reflects reality.

**Acceptance criteria:**
1. On creation, Legal Review Status auto-defaults to "Open," before any user interaction with the field.
2. A new Account field sits directly below Legal Review Status in both the Add and Edit overlay. It derives its value automatically from the review's linked Fixture(s)/Inquiry(s) and cannot be typed or selected directly.
3. If the review is linked to more than one Fixture/Inquiry with different accounts, all of them show as comma-separated text. If linked only to a Scope or Insurance record, Account shows blank.
4. Changing which Fixture(s)/Inquiry(s) a review is linked to re-derives the Account field automatically — it is not a one-time snapshot taken at creation.
5. The Account field is available on the Main Listing Page, in Show/Hide & Reorder, as an Add Filter entry (search text box with a checkbox list), and in History.

---

## Legal Review - Notes Section

**COEMS ID:** COEMS-21219

**USER Story:**
As a user working on a Legal Review, I want to add and read notes directly on the review record itself, in the same simple style as the Voyage module's Voyage Remarks, so that Legal and Chartering can leave context on a review without it being tied to any one task.

**Acceptance criteria:**
1. A Notes section is available on the review, at the review level, independent of Tasks.
2. Layout, top to bottom: a list of previously added notes, newest first, each showing an avatar-initials circle, the author's full name, the date the note was added (`dd/mm/yyyy`), and the note's text. A single-line input with a submit control sits alongside the list for adding a new note.
3. Hovering over a note reveals a delete icon; a user cannot delete another user's notes.
4. Clicking a note turns its text into an editable textarea with a checkmark icon to save and an X icon to cancel; a user cannot edit another user's notes.
5. Available in Edit mode only, consistent with the Tasks section.

---

## Legal Review - Add a New section named "Legal" in the Fixture Chartering Tab

**COEMS ID:** COEMS-21105

**USER Story:**
As a user in the Legal department, I want to enter Charter Party issuance details, category, and red flag directly on the Fixture's existing Chartering tab, in a new "Legal" section at the bottom, so that this information isn't duplicated or ambiguous when a review links to multiple fixtures, or a fixture has multiple reviews.

**Acceptance criteria:**
1. A new "Legal" section is added at the bottom of the Chartering tab, after "Additional Insurance Details," containing: Charter Party Issuance Date, Draft Charter Party Issuance Date, Final Charter Party Issuance Date (date pickers), Legal Review Status (live, editable dropdown, role-based), Category (Standard/Project/Special — confirmed to live here, not at the task level), and Red Flag (free text).
2. "Type Of CP" (existing field) has its dropdown values extended, not replaced: Frame Agreement, COA, BIMCO Supplytime, and BIMCO UHL Supplytime are added — this is the same field referenced elsewhere as "Charter Party Type."
3. "Booking Date" (existing field) is reused as-is as the "Contract / Recap Date" referenced elsewhere.
4. Legal Review Status uses the same 8 values and role-based selection rules as the field on the review itself.
5. The old "Charter Party Status" section (Charter Party Signed / PDF / Hard Copy checkboxes) is removed from this tab.
6. The "Additional Insurance Details" section changes so Chartering's side is tick-box only ("Additional insurance required"); "Insurance details" becomes Legal-only editable; "Special NDA Terms" is unaffected; a "Due Diligence Completed" checkbox is added, ticked by Chartering.
7. None of the new Legal-section fields are editable from the Review overlay — a user must open the Fixture directly.
8. Since a review can relate to more than one Fixture, and a Fixture can have more than one linked review, this section's fields are scoped to the specific Fixture only.

---

## Legal Review - Add New Review Updates

**COEMS ID:** COEMS-20887

**USER Story:**
As a user, I want to create a new legal review through a minimal Chartering-facing overlay, with the fuller Legal-only fields available once the review is opened, and with Charter Party, Insurance, and Compliance information kept out of the review entirely, so that Chartering can raise a review in seconds while Legal still has everything it needs once the review is opened.

**Acceptance criteria:**
1. **Review Type** offers: Contract Review Chartering, Contract Review Projects, NDA Review, Insurance Request, KYC Assistance, Others — selected by Chartering at creation.
2. **Short Description, Due Date, Review Raised By** — a free-text description, an optional date picker, and a dropdown auto-populating the current user, respectively.
3. **PIC Legal** — a dropdown listing Legal team members, Legal-only visible.
4. **Category** — Standard/Project/Special, Standard by default, Legal-only visible.
5. **Legal Review Status** — 8 values, role-based selection, auto-defaults to "Open" on creation.
6. There is no E Filing Number field and no "To Be Reviewed By" field anywhere in the module.
7. **Create Review** stays disabled until Review Type and Legal Review Status are filled; **Cancel** closes the overlay without saving, with no confirmation.
8. The Task Management section is available only in Edit mode, not during creation.

---

## Legal Review - Add "Legal Entity" field in the Add Overlay

**COEMS ID:** COEMS-20704

**USER Story:**
As a user, I want to capture a Legal Entity on each Legal Review, in the Add/Edit overlay, the listing column, and the filter, so that I can identify and filter reviews by the legal entity they relate to.

**Acceptance criteria:**
1. **Add overlay** — a Legal Entity dropdown (single-select) is the last field, directly after Review Raised By. It defaults to the current user's "Preferred Legal Entity" (Personal Settings), is mandatory, and drives the Review Number format: `[preferred legal entity office code]-L-[YYYY]-[XXX]` (e.g. `UHL-L-2026-001`).
2. **Edit overlay** — the field appears in the same position, showing the value already saved on that review (not re-defaulted); it is editable and saves correctly on update.
3. **Main listing page** — a LEGAL ENTITY column shows the value selected on each review.
4. **Search & Filter** — Legal Entity is a keyword for the main Search box, and an entry in the Add Filter list (alphabetical, searchable, scrollable, checkbox list), combinable with other filters.
5. All other fields, sections, and behaviours in the Add/Edit overlays, listing page, and Search & Filter remain as defined elsewhere in this document.
