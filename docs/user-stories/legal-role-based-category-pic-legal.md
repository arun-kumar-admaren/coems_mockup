#### **USER Story:**

**As a user in the Legal department,**
**I want to** be the only one who can see and set the Category and PIC Legal fields on a Legal Review
**So that** Chartering — who typically raises the review in the first place — doesn't have to make a Legal-owned classification decision they have no context for, and Legal retains ownership of that data.

> From the 09.09.2026 client demo: both fields currently render in the same Create/Edit Review overlay that Chartering uses to raise a request. The client confirmed **Category** should be fully hidden (not shown, not shown-disabled) from anyone without the Legal permission — see [legal-section-chartering-tab-inquiry.md](legal-section-chartering-tab-inquiry.md) and the wider Legal Review BRD for the existing "Legal" permission concept. **PIC Legal** was asked to receive the same treatment, though the client's exact wording was ambiguous on the call — confirm this reading (hide entirely from Chartering, editable by Legal only) before implementing if there's any doubt.

---

#### **acceptance criteria:**

1. **Current state (for reference)**

   Both fields are currently visible and editable to any user, in both the standalone Legal Review module's Create/Edit overlay ([legal.tsx](../../src/app/components/legal.tsx)) and the embedded Legal Review tab's overlay ([legal-review-embedded.tsx](../../src/app/components/legal-review-embedded.tsx)):
   * **Category** — dropdown (Standard / Project / Special), gated only by `isV2`, no role restriction.
   * **PIC Legal** — multi-select dropdown of Legal team members, gated only by `isV2`, no role restriction.

2. **Category — Legal-only visibility**

   * The **Category** field must not render at all — not visible, not visible-but-disabled — for a user without the Legal permission, in the Create overlay, the Edit overlay, and the embedded Legal Review tab's overlay (Inquiry / Fixture / Insurance / Claims / Scope).
   * A user with the Legal permission continues to see and edit it exactly as today.
   * Existing records retain their saved Category value regardless of who views them — a non-Legal user just doesn't see the field on the form; the value isn't cleared.

3. **PIC Legal — Legal-only visibility**

   * Same treatment as Category: fully hidden from non-Legal users, in every overlay it currently appears in, visible and editable only for Legal-permission users.
   * Existing records retain their saved PIC Legal value(s) regardless of viewer.

4. **No change to listing columns or filters**

   * The **PIC Legal** column on the Legal Review listing page, and the **Category** filter in the Add Filter panel, are unaffected by this story — broader access-rights enforcement on the listing itself (per the BRD's ❌ *"Legal overview edit-only for Legal, Chartering/Ops view-only"* item) is separate, already-deferred scope, not part of this change.

5. **Form validation unaffected**

   * Neither field is mandatory today, and this story doesn't make them mandatory. Hiding them for non-Legal users must not block Create/Save for those users — if a Legal-only field carries no value because a non-Legal user created the record, that's expected, not a validation error.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Legal Review → Create overlay | Category and PIC Legal fields visible/editable to Legal-permission users only |
| Legal Review → Edit overlay | Same |
| Embedded Legal Review tab (Inquiry/Fixture/Insurance/Claims/Scope) → Create/Edit overlay | Same |

---

#### **Out of Scope:**

* Role-based restriction of any other Legal Review field (e.g. Legal Review Status selection rules — already tracked separately in the BRD as not built).
* Hiding the PIC Legal listing column or the Category filter from non-Legal users.
* The underlying user-permission simulation mechanism itself. The current mockup has no live role/login simulation (confirmed in the Legal Review BRD: *"no user-role simulation in the mockup, so all 8 statuses are currently selectable by anyone"*) — implementing this story will need either a lightweight "view as" role toggle (similar in spirit to the existing Version 1.0/2.0 sidebar toggle) or deferral until real auth/permissions are wired in. Flagged as an open technical dependency, not resolved by this story.
