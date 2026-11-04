# COEMS - Legal/Insurance/Claims UAT Review 09.09.2026

## Minutes of Meeting

**Project:** COEMS – Legal / Insurance / Claims
**Meeting Date:** 9 September 2026
**Meeting Type:** Legal Review / Insurance / Claims UAT Demo & Review
**Participants:** Lena Pickenpack (UHL), Lukas Krag (UHL), Sajith Salim (Admaren), Arun Kumar (Admaren), Deepak Anthraper (Admaren)
**Planned Go-Live:** Chartering (Ports): end of Week 39, pending return of MK from leave. Legal Review can go live independently of M-Files, since charter parties and other legal documents are not stored in M-Files (only NDAs are).

## Meeting Objective

This session followed up on the 14 August 2026 walkthrough, with Arun demonstrating current UAT progress across **Legal Review, Insurance and Claims**. Most previously agreed changes are built or in progress. UHL raised a further set of role-based visibility, field-trimming, and workflow requests, and the team live-tested UAT access together on the call. Lena will complete detailed testing and share further feedback before the next review.

## 1. Legal Review Module

- **PIC Legal** and **Account** fields added to the Add overlay; Account auto-populates from the linked Inquiry/Fixture (non-editable).
- E-Filing Number and **To Be Reviewed By** removed from the Add overlay, as previously agreed.
- **Review Type** expanded to ~8 values; **Legal Review Status** expanded from 4 to 8, defaulting to "Open" on creation.
- New **Category** field (Standard / Project / Special) added — **to be made visible to Legal users only**, hidden from Chartering's create-review view.
- **PIC Legal** field requested to receive the same treatment — hidden from Chartering.
- Requirement to support creating a Legal Review with **no Related To link at all** (e.g. an NDA raised before any Inquiry/Fixture exists), connectable to a Fixture/Scope later. Already in development.
- New **"Legal" section** added to the Fixture and Inquiry Chartering tabs (Charter Party dates, Additional Insurance, Red Flag). Inquiry's version to be **trimmed** to only Charter Party Type, Legal Review Status and Red Flag — Contract/Recap Date and the three CP Issuance dates only make sense once fixed.
- Legal Review sidebar access stays **Management-only for now**; Chartering access is deferred pending training, and once enabled, the list must be **scoped to reviews created by that user/office only**.
- **Time Tracking**, **Task** and **Document Search** to be removed from the Chartering sidebar (not currently used); a shared cross-department task hub was floated as a future idea, not for now.
- **Notes** moved into its own separate tab (completed, pending UAT deploy).
- Clicking a linked Inquiry/Fixture/Scope from within a review now opens that record directly (completed, pending UAT deploy).
- Opening a related record directly from the **listing page** is in development.
- Auto-carrying linked Legal Reviews from **Inquiry to Fixture** upon conversion is in development.
- New filter and main-search support for **exact Fixture/Insurance/Claim number** lookup is in development.
- Confirmed: linking multiple Fixtures with different Accounts to one review correctly surfaces all linked Accounts.

## 2. Insurance

- Confirmed: **Intended Vessel** field hidden when Related To = Vessel (shown only for Fixture).
- Confirmed: **dynamic fields per Type of Cover**, most auto-calculated from UHL's insurance reference Excel.
- Confirmed: **Leading Underwriter** converted from free text to a dropdown (completed, pending UAT deploy).
- Confirmed: **Biannual Declaration to Broker** filterable (Yes/No) in the overview; multiple filters combinable.
- Requirement to **bulk-load UHL's real vessel insurance data** from the reference Excel into UAT/production, once Lena has reviewed the fields.
- Clarified: **"Is Insurance Broker"** (Customers) and **Insurer/Club** are distinct concepts and must not be conflated — relevant to the Claims auto-population item below.

## 3. Claims

- Confirmed: **PIC Legal** field relocated to the **Additional Information** section, restricted to Legal users and hidden from Operations, including claims created directly from a Voyage.
- Confirmed: **Copy Template / Send by E-mail** — Send by E-mail opens Outlook pre-filled. UHL asked about **Sedna** integration instead (they don't use Outlook) — possible, needs checking Sedna's API; **no action for now**, kept as-is.
- Insurer auto-population on Claims was queried mid-call as possibly pulling Broker instead of Insurer/Club; **re-verified live in UAT and confirmed working correctly**.
- CC e-mail addresses in the Claims e-mail template need updating — Lena to send the correct (HSE) addresses after the meeting.

## 4. UAT Access & Environment

- UAT uses the same login/OTP mechanism as production; data entered in UAT does not reflect into production.
- Live permission test as **Chartering** role: no Legal tab visible on Fixture, cannot edit Insurance details — confirmed working as designed.
- Live permission test as **Management** role: Legal Review, Insurance and Claims tabs all visible — confirmed working as designed.

## 5. Key Decisions

- Category and PIC Legal fields will be made role-based (Legal-only), not shown to Chartering.
- Creating a Legal Review with no Related To link is agreed and already in development.
- Inquiry's "Legal" section will be trimmed to 3 fields; Fixture's stays as-is.
- Chartering's Legal Review sidebar access remains deferred pending training; the scoped-list requirement is agreed for when it is enabled.
- Time Tracking, Task and Document Search will be removed from the Chartering sidebar for now; a future shared task-hub idea was noted but not scoped.
- Sedna integration for Claims e-mails is deferred to a future discussion — API needs checking first.
- Production releases go out on the last week of each month; urgent items can be hotfixed sooner.
- Lena will complete UAT testing across all three modules and share further comments before the next review meeting.

## Action Items

| No. | Action | Owner | Module | Status / Notes |
| --- | --- | --- | --- | --- |
| 1 | Convert "Leading Underwriter" field (Insurance) from free text to a dropdown list | COEMS | Insurance | Done – pending UAT deploy |
| 2 | Hide "Intended Vessel" field when Related to = Vessel (retain for Fixture) | COEMS | Insurance | Done |
| 3 | Bulk-load UHL's real vessel insurance data from the reference Excel into UAT/production | COEMS | Insurance | To Do – pending Lena's field review |
| 4 | Make "Category" field visible to Legal users only, hidden from Chartering | COEMS | Legal Review | To Do |
| 5 | Make "PIC Legal" field visible to Legal users only, hidden from Chartering | COEMS | Legal Review | To Do |
| 6 | Support creating a Legal Review with no Related To link (e.g. NDA pre-fixture), connectable later | COEMS | Legal Review | In Progress |
| 7 | Trim Inquiry's "Legal" section to Charter Party Type, Legal Review Status and Red Flag only (remove Contract/Recap Date, CP Issuance, Draft & Final CP Issuance Dates) | COEMS | Legal Review | To Do |
| 8 | Add Legal Review sidebar access for Chartering, scoped to reviews created by that user/office only | COEMS | Legal Review | To Do – deferred pending Chartering training |
| 9 | Remove Time Tracking and Task from the Chartering sidebar | COEMS | Legal Review / Chartering | To Do |
| 10 | Remove Document Search from the Chartering sidebar | COEMS | Legal Review / Chartering | To Do |
| 11 | Move Notes into a separate tab | COEMS | Legal Review | Done – pending UAT deploy |
| 12 | Enable opening a linked Inquiry/Fixture/Scope directly from within a review | COEMS | Legal Review | Done – pending UAT deploy |
| 13 | Enable opening a related record directly from the listing page | COEMS | Legal Review | In Progress |
| 14 | Auto-carry linked Legal Reviews from Inquiry to Fixture upon conversion | COEMS | Legal Review | In Progress |
| 15 | Add filter to search by exact Fixture/Insurance/Claim number | COEMS | Legal Review | In Progress |
| 16 | Add number search to the main Search bar for linked Fixture/Scope/Insurance records | COEMS | Legal Review | In Progress |
| 17 | Update CC e-mail address in the Claims e-mail template with the correct HSE address | COEMS | Claims | To Do – pending address from Lena |
| 18 | Re-verify Insurer auto-population on Claims correctly pulls Insurer/Club, not Broker | COEMS | Claims | Done – re-verified live in UAT |
| 19 | Share the updated UAT status/environment link with Lena once the above items are completed | COEMS (Sajith) | General | To Do |
| 20 | Complete detailed UAT testing of Legal Review, Insurance and Claims and share feedback/comments | UHL (Lena) | General | To Do – after Lena's availability |
