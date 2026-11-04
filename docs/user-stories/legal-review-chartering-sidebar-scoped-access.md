#### **USER Story:**

**As a Chartering user,**
**I want to** access the Legal Review module from my own sidebar, but only see the reviews I raised myself or that were raised by someone from the office in which I have access to
**So that** I can track requests relevant to me without being able to browse every legal review in the company.

> From the 09.09.2026 client demo (action item #8 in the [09.09.2026 Minutes of Meeting](../meeting-notes/coems-legal-insurance-claims-uat-review-2026-09-09.md)). Sajith on the call: *"we can do it like everything that they have created, that user has created, or their office has created will be shown to them. The rest of the legal reviews, all of them won't be shown to them."* This access is intentionally still turned off today, pending Chartering's training on the module — this story defines the behaviour for whenever it's switched on.

---

#### **acceptance criteria:**

1. **Sidebar access**

   * A **"Legal Review"** entry must be added to the Chartering sidebar, positioned next to Fixtures (per the client's own suggestion on the call).
   * Clicking it opens the same Legal Review listing page used today from Management — same columns, same overlay, same behaviour — only the **row-level visibility** differs, per below.

2. **Scoping rule for non-Legal users**

   A user without the Legal permission (see [legal-role-based-category-pic-legal.md](legal-role-based-category-pic-legal.md) for the same permission concept) must only see a review on the listing if **either**:
   * **Review Raised By** on the review is the current user themself, **or**
   * **Review Raised By** on the review is a user who shares at least one office in common with the current user's own assigned office(s) (**"Offices With Data Access"**, per the user's Settings record).

   Every other review is excluded from the listing entirely for that user — not shown, not shown-disabled, not counted in "Found X records."

3. **Legal users are unaffected**

   A user with the Legal permission continues to see every review regardless of who raised it or which office they belong to — this scoping applies to non-Legal (Chartering) users only.

4. **Multiple offices per user**

   Since a user can have more than one office under "Offices With Data Access," the match is **any overlap** — if the current user and the review's raiser share even one office in common, the review is visible.

5. **No Review Raised By set**

   If a review has no Review Raised By value at all, it does not match either condition above for a non-Legal user, and stays hidden from them (Legal users still see it, per point 3).

6. **Scope of this rule**

   This scoping applies to the **Legal Review Hub's main listing page** reached from the Chartering sidebar. Whether the same rule should also filter which review cards a non-Legal user sees inside the embedded Legal Review tab (Inquiry/Fixture) is a related but separate question — not resolved by this story.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Chartering sidebar | Add "Legal Review" entry, next to Fixtures |
| Legal Review Hub → listing page | Row visibility for non-Legal users limited to reviews raised by themself or by someone sharing an office with them |

---

#### **Out of Scope:**

* Broader access-rights enforcement already tracked separately in the BRD (Legal edit-only, Chartering/Ops view-only) — this story only covers *which rows appear*, not edit permissions on them.
* Scoping the embedded Legal Review tab's cards inside Inquiry/Fixture/Insurance/Claims.
* The underlying user-permission and "current logged-in user" simulation itself — flagged as an open dependency, same as in [legal-role-based-category-pic-legal.md](legal-role-based-category-pic-legal.md).
