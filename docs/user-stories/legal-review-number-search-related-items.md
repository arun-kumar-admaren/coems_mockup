#### **USER Story:**

**As a user on the Legal Review main listing page,**
**I want to** find a review just by typing the number of a linked Fixture, Inquiry, Insurance record, Claim, or Scope into the main Search box
**So that** I can jump straight to the relevant review(s) without opening the Add Filter panel first.

> **COEMS-22854** "Legal Review - Add Number based search for Related Items" — from the 09.09.2026 client demo (action items #12–13 in the [09.09.2026 Minutes of Meeting](../meeting-notes/coems-legal-insurance-claims-uat-review-2026-09-09.md)): *"in this search you have right next to the filter... you will be able to type in like any fixer number, scope number, or like insurance number, anything if you type in over there, it will search and give you all the details. You don't have to go actually to the filter."*

---

#### **acceptance criteria:**

1. **Current state (for reference)**

   The main Search box on the Legal Review listing page ([legal.tsx](../../src/app/components/legal.tsx)) currently matches only against a review's own fields: Review Number, Review Type, Description, and Legal Review Status. It does **not** check the review's linked (Related To) items at all — finding a review by a Fixture/Inquiry/Insurance/Claim/Scope number today requires opening the **Add Filter** panel and using its separate item-number field.

2. **Search must also match linked item numbers**

   Typing a Fixture, Inquiry, Insurance, Claim, or Scope number into the main Search box must return every review that has a matching entry in its Related To list — in addition to the existing match against the review's own Review Number / Review Type / Description / Status.

3. **Partial match, not full number required**

   Matching is a substring match, consistent with the existing search behaviour — the user does not need to type the complete number. Entering as few as **3 characters** of a linked item's number is enough to surface every review linked to a matching record.

4. **Covers every linkable category, including ones the standalone module can't create**

   A review's Related To list can contain Insurance or Claims item numbers (added via the embedded Legal Review tab on those modules) even though the standalone Legal Review Hub's own Related To field only offers Inquiry / Fixture / Scope as selectable categories. The search enhancement must match against the **raw value of every entry** in Related To, regardless of category, so linked Insurance and Claims numbers are found too, not just Inquiry/Fixture/Scope.

5. **No change to the Add Filter panel**

   The existing item-number field inside **Add Filter** (Related To type + number search) stays exactly as it is — this story only extends the main Search box, it doesn't replace or remove the filter panel's own item search.

6. **Combines normally with the status filter**

   The main Search box continues to combine with the status quick-filter tabs (All / Open / Under review / etc.) exactly as it does today — a matched-by-related-item review must still respect the active status filter.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Legal Review → Listing page → main Search box | Also match against every Related To entry's raw value (Fixture/Inquiry/Insurance/Claim/Scope numbers), substring match, from 3 characters |

---

#### **Out of Scope:**

* The Add Filter panel's own item-number search — unchanged.
* Search behaviour inside the embedded Legal Review tab (Inquiry/Fixture/Insurance/Claims/Scope) — this story covers only the standalone Legal Review Hub's main listing page.
* Any change to which categories are selectable in the standalone module's own Related To field.
