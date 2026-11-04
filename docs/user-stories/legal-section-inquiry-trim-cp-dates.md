#### **USER Story:**

**As a user in the Legal department,**
**I want to** remove the Contract/Recap Date, Charter Party Issuance Date, Draft Charter Party Issuance Date, and Final Charter Party Issuance Date fields from the Inquiry Chartering tab's "Legal" section
**So that** the section only asks Chartering for information that's actually meaningful pre-fixture, instead of dates that don't apply until a recap exists.

> Corrects the field list defined in [legal-section-chartering-tab-inquiry.md](legal-section-chartering-tab-inquiry.md) (mirroring COEMS-21105) — client comment from the 09.09.2026 demo (also action item #7 in the [09.09.2026 Minutes of Meeting](../meeting-notes/coems-legal-insurance-claims-uat-review-2026-09-09.md)): *"we only need charter party type and legal review status and red flag you can also keep, but the other four fields are not necessary in the inquiry."* Lukas's reasoning on the call: at Inquiry stage there's no recap yet, and once there is one, it's already a Fixture — Chartering won't backfill these dates on an Inquiry just to make the record look complete.

---

#### **acceptance criteria:**

1. **Fields removed from the Inquiry Chartering tab's "Legal" section:**
   * Contract / Recap Date
   * Charter Party Issuance Date
   * Draft Charter Party Issuance Date
   * Final Charter Party Issuance Date

   These four are removed entirely from the Inquiry tab — not hidden, not disabled, not moved elsewhere on this tab.

2. **Fields that remain in the Inquiry Chartering tab's "Legal" section, unchanged:**
   * Charter Party Type
   * Legal Review Status (same live, editable, role-based behaviour as originally specified)
   * Red Flag

3. **Category is not affected by this story.** It stays exactly where it currently sits in this section — its own visibility (Legal-only) is covered separately in [legal-role-based-category-pic-legal.md](legal-role-based-category-pic-legal.md), not by this change.

4. **The Fixture Chartering tab's "Legal" section is unaffected.** COEMS-21105 (Fixture) keeps all of its original fields, including the four CP dates — this trim applies to Inquiry only. The two tabs are intentionally no longer field-identical after this change.

5. **No data-migration concern.** Since the Inquiry-side "Legal" section (and COEMS-21105/the Fixture mirror it's based on) hasn't shipped yet, there's no existing saved data on these four fields to worry about losing.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Inquiry → Chartering tab → "Legal" section | Remove Contract/Recap Date, Charter Party Issuance Date, Draft CP Issuance Date, Final CP Issuance Date |
| Inquiry → Chartering tab → "Legal" section | Keep Charter Party Type, Legal Review Status, Red Flag (and Category, gated separately) |

---

#### **Out of Scope:**

* The Fixture Chartering tab's "Legal" section (COEMS-21105) — no change.
* Category field visibility — tracked in [legal-role-based-category-pic-legal.md](legal-role-based-category-pic-legal.md).
* The Additional Insurance Details section on the Inquiry Chartering tab — unaffected, client confirmed keeping it as-is on the same call.
