#### **USER Story:**

**As a user in the Legal department,**
**I want to** enter Charter Party issuance details, category, and red flag directly on the Inquiry's existing Chartering tab, in a new "Legal" section at the bottom
**So that** this information isn't duplicated or ambiguous when a review links to multiple Inquiries, or an Inquiry has multiple reviews — without needing a whole new tab.

> Mirrors **COEMS-21105** ("Legal Review – Add a New section named 'Legal' in the Fixture Chartering Tab"), applied to the Inquiry module's Chartering tab instead of the Fixture's. **Every field in this story is new** — unlike the Fixture version, where "Type Of CP" and "Booking Date" were reused from fields that already existed on that tab, Inquiry's Chartering tab currently has no equivalent fields at all, so there is nothing to reuse. All fields below — the 8 in the "Legal" section, plus the 4 in "Additional Insurance Details" — are added fresh, specifically for Inquiry.

---

#### **acceptance criteria:**

### 1. Current state of the Inquiry Chartering tab (for reference)

The Inquiry Chartering tab currently has these sections, top to bottom:

| Section | Fields |
| --- | --- |
| Scope Details | Related Scope |
| Chartering Details | Fixed By (Offices), Person In Charge, Intended Vessel Type, Intended Vessel, Legal Entity |
| Demurrage | Demurrage Rate, Demurrage Unit, Demurrage Duration, Demurrage Remarks |
| — | "Add Bunker Details" button |

Unlike the Fixture Chartering tab, there is **no Client Details section, no Charter Party Status section, no Additional Insurance Details section, no "Type Of CP" field, and no "Booking Date" field** anywhere on this tab today.

### 2. New "Additional Insurance Details" section

Inquiry's Chartering tab has no Additional Insurance Details section today (section 1), so this is built fresh, directly in the target end-state that COEMS-21105 defined for Fixture — there's no pre-existing dropdown to migrate away from here, since nothing existed before. Placed after Demurrage, before the new "Legal" section (section 3), matching the Fixture tab's section order (Additional Insurance Details, then Legal, at the bottom).

| Field | Type | Notes |
| --- | --- | --- |
| Additional insurance required | Checkbox | New field. Ticked by Chartering |
| Insurance details | Free text | New field. **Legal-only editable** — Chartering cannot fill this in; only Legal can, once "Additional insurance required" is ticked |
| Special NDA Terms | Free text | New field |
| Due Diligence Completed | Checkbox | New field. Ticked by Chartering, per the KYC requirement |

### 3. New "Legal" section

A new **"Legal"** section must be added at the bottom of the Inquiry Chartering tab, after the new Additional Insurance Details section (section 2), containing:

| Field | Type | Notes |
| --- | --- | --- |
| Charter Party Type | Dropdown | **New field**, independent of any field on the Fixture Chartering tab. Same value list as the Fixture's "Type Of CP" dropdown (including its extended values from COEMS-21105: Frame Agreement, COA, BIMCO Supplytime, BIMCO UHL Supplytime), but a separate field with its own stored value — selecting it here does not read from or write to Fixture's field |
| Contract / Recap Date | Date picker | **New field**. Serves the same purpose as the Fixture's "Booking Date" (reused there as "Contract / Recap Date"), but since Inquiry has no existing Booking Date field, this is built as its own dedicated field |
| Charter Party Issuance Date | Date picker | New field. Used to track the duration internally from the Inquiry date until the contract is issued |
| Draft Charter Party Issuance Date | Date picker | New field |
| Final Charter Party Issuance Date | Date picker | New field |
| Legal Review Status | Live, editable dropdown | New field. Same 8 values and role-based selection rules as on the linked review itself (section 4) — a genuine second entry point for Chartering to set the status, not a read-only mirror |
| Category | Dropdown — Standard / Project / Special | New field |
| Red Flag | Free text | New field. Optional; filled by Legal when a red flag applies (e.g. "BOD"). Not applicable at the point a review is first raised — only becomes relevant once Legal is actively reviewing the charter party |

### 4. Legal Review Status: live and editable, not a read-only mirror

Same 8 values, same role-based selection rules as the field on the linked review itself:

| Legal Review Status | Who can select |
| --- | --- |
| To be reviewed | Legal or Chartering |
| Under review | Legal only |
| Review completed | Legal only |
| Under negotiation | Legal only |
| Draft issued | Legal only |
| Final issued | Legal or Chartering |
| Signed | Legal or Chartering |
| Not required | Legal or Chartering |

Changing it here updates the linked review's status directly (and vice versa — the two are the same underlying value, shown in two places, not separately tracked copies).

### 5. Not editable from the Review overlay

None of the "Legal" section's fields are editable from the Review overlay — a user must open the Inquiry directly, on the Chartering tab, to enter or change them.

### 6. Multiple Inquiries per review, multiple reviews per Inquiry

Since a review can be related to more than one Inquiry, and a single Inquiry can have more than one linked review, the "Legal" section's fields (section 3) are scoped to **this specific Inquiry only** — never shared or aggregated across multiple linked records.

### 7. Out of scope

COEMS-21105's "remove the Charter Party Status section" acceptance criterion does not apply here — there is no Charter Party Status section on the Inquiry Chartering tab to remove (section 1).

---

#### **technical details:**

(To be updated by Techleads)

#### **NON-Functional Requirements:**

| Particulars | Name | Date | Comments |
| --- | --- | --- | --- |
| Document Owner | | | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
