# Business Requirements Document

## Personal Settings — COEMS

**Document Reference:** COEMS-PS-BRD-001
**Version:** 1.0
**Date:** 2026-09-21
**Status:** Draft — comprehensive specification of the Personal Settings page's current feature set, verified live.

---

## 1. Description

Personal Settings is a per-user preferences page inside COEMS Settings. It lets an individual logged-in user set their own display formatting, session/notification behaviour, and default Office/Person-In-Charge (PIC) selections for Chartering, Engineering, and Operations — separate from the system-wide, admin-managed configuration screens (Users, Offices, Account Heads, Customers, etc.) that sit alongside it in the same Settings area.

It enables:

- A single place to set display formatting (number format, day format, timezone, default currency) that applies to how the user sees data throughout COEMS
- Control over the user's own session timeout and email notification timing
- Personal defaults for Preferred Office and PIC (Person In Charge) across the Chartering, Engineering, and Operations & Entity contexts, so the user isn't repeatedly re-selecting the same Office/PIC when working across modules
- One combined save action across every preference on the page

Personal Settings is distinct from **Administration → Preferences**, a separate admin-level settings screen also visible in the same Settings sidebar; that screen is not covered by this document.

## 2. Key Components

1. Display Preferences panel
2. Session & Notifications panel
3. Chartering preferences panel
4. Engineering preferences panel
5. Operations & Entity preferences panel
6. Single "Save Preference" action for the whole page

## 3. Display Preferences

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| Number Format | Dropdown — UK/US Format / German Format | Optional | Defaults to UK/US Format. |
| Day Format | Dropdown — Days : Hour : Minute Format (e.g. `2d 2h 20m`) / Decimal Format (e.g. `2.25`) | Optional | Defaults to Decimal Format (2.25). |
| Timezone | Searchable dropdown | Optional | Defaults to the user's own timezone (confirmed: (UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi). |
| Default Currency | Searchable dropdown, clearable | Optional | Defaults to a system currency (confirmed: US Dollar). |

## 4. Session & Notifications

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| User Logout After | Number, Hrs | Mandatory | Defaults to 36. |
| Receive Email After | Number, Mins | Mandatory | Defaults to 15. |
| Idle Days Preference | Number, Days | Optional | Accepts fractional values; defaults to 0.5. |

## 5. Chartering, Engineering & Operations Preferences

A dedicated section per business context, each holding the user's default Office and/or PIC (Person In Charge) selections:

| Field | Section | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Preferred Office | Chartering | Searchable dropdown, clearable | Optional | — |
| PIC Chartering | Chartering | Searchable dropdown, clearable, tag-style value | Optional | "PIC" mirrors the "Person In Charge" field already used on the Chartering tab of Inquiry/Fixture records — this sets the user's personal default. |
| Preferred Legal Entity | Chartering | Searchable dropdown | Optional | — |
| Preferred Office | Engineering | Searchable dropdown, clearable | Optional | No Legal Entity field in this panel. |
| PIC Engineering | Engineering | Searchable dropdown, clearable, tag-style value | Optional | — |
| PIC Operations | Operations & Entity | Searchable dropdown, clearable, tag-style value | Optional | — |
| Port Delay Tolerance | Operations & Entity | Number, Days | Optional | Tooltip: "Enter Number Of Days." |

## 6. Accessing & Saving Personal Settings

Personal Settings is the first entry in the Settings sidebar, above every admin-managed section (Administration, General Settings, Fixture Settings, Project Settings, Engineering Settings, AIS & Route Settings), and opens directly to the form (route: `/settings/general-settings`). The page header reads "Personal Settings" with the subtitle "Manage your display, session and workflow preferences."

All five panels are submitted together via a single **Save Preference** button (bottom-right, primary action) — there is no independent save per panel or per field. Each dropdown field with a clear control (×) can be reset independently without affecting other fields.

## 7. Project Scope

**In Scope**

- Display Preferences: Number Format, Day Format, Timezone, Default Currency
- Session & Notifications: User Logout After and Receive Email After (both mandatory), Idle Days Preference (optional, fractional-capable)
- Chartering preferences: Preferred Office, PIC Chartering, Preferred Legal Entity
- Engineering preferences: Preferred Office, PIC Engineering
- Operations & Entity preferences: PIC Operations, Port Delay Tolerance
- Single combined save action across all panels

**Out of Scope**

- Where each preference is actually consumed elsewhere in the app (e.g. whether Default Currency or Preferred Office pre-fills the corresponding field when creating a new Inquiry, Fixture, or Engineering task) — not verified live in this pass
- Server-side validation limits (maximum/minimum values for User Logout After, Receive Email After, Idle Days Preference, Port Delay Tolerance) — only required/optional status and observed defaults were confirmed
- The full Timezone and Default Currency option lists — confirmed as searchable/typeahead dropdowns, not exhaustively enumerated
- Role/permission differences in which sections or fields a given user role sees
- Administration → Preferences, the separate admin-scoped settings screen

## 8. Business Drivers

- Give each user control over how data is displayed to them (number/date formatting, timezone, currency) without a global, one-size-fits-all setting
- Reduce repetitive manual selection of Office and PIC when creating records across Chartering, Engineering, and Operations
- Let each user manage their own session timeout and notification timing according to their own working pattern

## 9. Assumptions

- "PIC" stands for Person In Charge, consistent with the "Person In Charge" field label already used elsewhere in COEMS (e.g. the Chartering tab of Inquiry records)
- Preferred Office, PIC Chartering/Engineering/Operations, and Preferred Legal Entity set here act as personal defaults, pre-populating the corresponding field elsewhere in the app rather than restricting what the user can otherwise select
- Every COEMS user has access to their own Personal Settings page, independent of module-level role permissions (Legal, etc.)

## 10. Constraints

- User Logout After and Receive Email After are the only two fields on the page enforced as mandatory; the form's other nine fields (Number Format, Day Format, Timezone, Default Currency, Idle Days Preference, Preferred Office × 2, PIC × 3, Preferred Legal Entity, Port Delay Tolerance) are all optional
- The page holds exactly one record per user — there is no multi-profile or per-module override of these preferences beyond the single Chartering/Engineering/Operations grouping already on the form

---

# User Stories

## Personal Settings - Manage Display, Session and Workflow Preferences

**USER Story:**
As a COEMS user, I want to set my own display formatting, session/notification timing, and default Office/PIC selections for Chartering, Engineering, and Operations in one Personal Settings page, so that the app behaves the way I expect and I don't have to repeatedly re-select my usual Office and PIC when working across modules.

**Acceptance criteria:** as detailed in §3–§6 of this document — Personal Settings is reachable as its own top-level entry in the Settings sidebar, separate from the admin-managed sections listed below it; Number Format and Day Format each offer exactly two fixed options, Timezone and Default Currency are searchable dropdowns pre-populated with a system default; User Logout After and Receive Email After are validated as mandatory, Idle Days Preference is optional and fractional-capable; Preferred Office, PIC Chartering, Preferred Legal Entity, Preferred Office (Engineering), PIC Engineering, PIC Operations, and Port Delay Tolerance are all optional and independently clearable; a single "Save Preference" action commits every populated field across all five panels in one action.
