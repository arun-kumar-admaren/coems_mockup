#### **USER Story:**

**As a Legal user working on a review,**
**I want** the Red Flag I enter on a review to appear automatically in the Red Flag field on the Chartering tab of every Fixture and Inquiry the review is linked to
**So that** Chartering sees the red flag where they work without anyone entering it twice, and without a selection step when a review is linked to several records.

> Client request from Lena Pickenpack and Lukas Krag (UHL), 27.10.2026 call. Every review has a free-text **Red Flag** field. The text is copied to the Red Flag field on the Chartering tab, where Chartering sees it read-only.
>
> On the call, a review linked to several Fixtures was to open the same selection pop-up as for the status-based dates. This story drops the pop-up and uses the same automatic rule as the Charter Party dates ([legal-review-status-by-type-and-chartering-dates.md](legal-review-status-by-type-and-chartering-dates.md)), because a Fixture or Inquiry can also be linked to several reviews. The proposal was sent to Lena and Lukas; Lena has confirmed that the Red Flag field becomes read-only (see Open Points for the rest).
>
> Unlike the dates, the Red Flag applies to the **Fixture and the Inquiry**: both Chartering tabs have a Red Flag field in their Legal section. The field already exists on the review (Legal Review BRD v3, section 6). This story keeps it and defines what it drives.
>
> **Legal-only editing:** the call's development item says "only Legal can edit it". Today the BRD records no permission rule on the Red Flag, so any user can fill it. This story makes the Red Flag **editable only by users with the Legal permission**, on the review and on the Chartering tabs. Everyone else still sees it.

---

#### **acceptance criteria:**

1. **Red Flag on the review**

   * Every review has a **Red Flag** field in both the **Create Review overlay** and the **Edit Review overlay**, for every Review Type. It has the same label and behaviour in both, and it sits in the same position relative to the other fields.
   * It is free text, optional, and can stay empty.
   * **Only users with the Legal permission can edit it**, the same permission that governs PIC Legal and Category. Every other user who can open the review sees the Red Flag **read-only**, not hidden, so Chartering can read it on the reviews it raised.
   * The review keeps its own Red Flag text. What reaches a Fixture or Inquiry is a copy. Another review, or the Fixture or Inquiry itself, never changes the text on the review.

2. **When the update runs**

   * The update runs when a review is saved with a Red Flag text that **differs from the text it had before**: new text, changed text, or text cleared.
   * A review created with a Red Flag runs it at creation, for the records chosen in Related To. A review whose Red Flag is empty and stays empty changes nothing on the linked records, whatever else is saved.
   * Saving a review without changing the Red Flag, or changing any other field, updates nothing.

3. **Which records receive it, and what is copied**

   * The update applies to **every Fixture and every Inquiry** listed in the review's **Related To**, automatically. There is no pop-up and no selection step.
   * Scope, Insurance and Claims listed in Related To receive nothing.
   * The text is copied exactly as typed and **replaces** whatever the Red Flag field held. It is never appended, and no review number or other wording is added to the text.
   * If the review's Red Flag is cleared, the Red Flag field on the linked Fixtures and Inquiries is cleared.
   * The Red Flag field on the review and the one on the Chartering tab accept the same length, so the text is never cut.
   * The update is made by the system when the review is saved. It works whatever the user's rights on the Fixture or Inquiry are.

4. **A Fixture or Inquiry linked to several reviews**

   * The Red Flag field shows the text from the **most recent Red Flag change** among the linked reviews.
   * Example: a Fixture is linked to Review A and Review B. Review A is set to "BOD" on 05/11/2026 and Review B to "Sanctions clause" on 12/11/2026. The Fixture shows "Sanctions clause". If Review A is then changed to "BOD, arbitration" on 14/11/2026, the Fixture shows "BOD, arbitration". Review B still holds "Sanctions clause".
   * Texts from different reviews are never joined. Each stays on its own review, in the Legal Review tab of the Fixture or Inquiry.
   * Clearing a Red Flag counts as a change. If the most recent change is a cleared Red Flag, the field on the Fixture or Inquiry is empty, even when another linked review still holds a text.

5. **Read-only on the Chartering tab**

   * While **at least one review is linked** to the Fixture or Inquiry, the **Red Flag** field on its Chartering tab is **read-only for every user**. It is filled only from the reviews. The full text is visible.
   * The text is changed only by a Legal user editing the Red Flag on a review.
   * When **no review is linked**, the field can be edited only by users with the **Legal permission**. Every other user sees it read-only.
   * The read-only field looks like the other read-only fields on the tab, so a user can tell it is locked.

6. **Traceability on the Fixture and Inquiry**

   * Under the Red Flag field, a short line shows where the value came from:
     * filled from a review: **"Set by UHL-L-2026-012 on 12/11/2026"** (review number and the date of the change),
     * entered by hand: **"Entered by [full name] on 12/11/2026"**.
   * If a user changes or replaces a text that a review had filled (possible only once no review is linked), the line changes to "Entered by [full name] on [date]".
   * No line is shown when the field is empty, including after a review cleared it, or for a text that was entered before this story was released.

7. **Nothing else is changed automatically**

   * **Unlinking:** removing a review from a Fixture or Inquiry changes no text. If it was the last linked review, the field becomes editable again and keeps its text.
   * **Linking:** linking a review does not by itself copy its Red Flag. The Fixture or Inquiry receives it the next time that review's Red Flag changes. This also applies to a review carried over when an Inquiry is converted to a Fixture.

8. **History**

   * Each automatic update is recorded in the History of the Fixture, and in View History of the Inquiry, as an Update to Red Flag with the previous and the new text, attributed to the user who saved the review.

9. **Existing data**

   * Nothing is changed at release. Existing reviews keep their Red Flag, and existing Fixtures and Inquiries keep their Red Flag text, including text entered by hand.
   * A Fixture or Inquiry that already has a linked review has its Red Flag read-only from release, with the saved text unchanged.
   * From release, users without the Legal permission can no longer edit a Red Flag, on a review or on a Fixture or Inquiry with no linked review. The saved texts stay and remain visible to them.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Legal Review → Create and Edit overlay → Red Flag | Free text on every review; editable by Legal-permission users only, read-only for others |
| Legal Review → save with a changed Red Flag | The text replaces the Red Flag on every linked Fixture and Inquiry |
| Fixture → Chartering tab → Legal section | Red Flag read-only while a review is linked; with no review linked, editable by Legal-permission users only; "Set by" / "Entered by" line under it |
| Inquiry → Chartering tab → Legal section | Same as the Fixture |
| Fixture → History, Inquiry → View History | Automatic updates are recorded |
| Scope, Insurance, Claims | No Red Flag update |

---

#### **Out of Scope:**

* The status-based Charter Party dates on the Fixture (separate story, same rule).
* Removing the Legal Review Status field from the Chartering tab (separate story).
* Restricting any other field to Legal, and the broader access-rights model (Legal edit-only with Chartering and Ops view-only) that the BRD lists as not built.
* Showing the Red Flag in listings, filters, cards or badges, or colouring it.
* Notifications when a Red Flag is filled in or changed.
* The work log, the work-log overview and the automatic task per review.
* The merge of the Legal Review tab into the Chartering tab (feasibility study).

---

#### **Open Points:**

* **Confirmation pending from Lena and Lukas:** the automatic copy to all linked Fixtures and Inquiries instead of the pop-up, "the newest text replaces the older one" (not appended), and the "Set by" line. Lena has confirmed only that the Red Flag field becomes read-only on the Fixture and the Inquiry.
* **A cleared Red Flag removes another review's text:** under "most recent change wins", clearing the Red Flag on Review B empties the field even though Review A still holds a text (criterion 4). The alternative is that a cleared Red Flag falls back to the newest text that remains.
* **Legal-only editing is new:** the BRD records no permission rule on the Red Flag today. The story uses the same Legal permission as PIC Legal and Category, and shows the field read-only, not hidden, to everyone else. Confirm with Lena that Chartering should see the Red Flag but not edit it, including on a Fixture or Inquiry with no linked review.
* **Create overlay for Chartering users:** Chartering raises most reviews, and a user without the Legal permission cannot fill the Red Flag. For them the field in the Create overlay is always empty and read-only. Confirm that is acceptable, or whether the field should be hidden from them in the Create overlay only.
* **Linking after the Red Flag was set:** a review that already has a Red Flag when it is linked copies nothing until its text changes again, and the field is read-only meanwhile, so Chartering cannot type it either. The alternative is to copy at the moment of linking, from the review with the latest change.
* **Inquiry converted to a Fixture:** as written, the new Fixture gets no Red Flag until a carried-over review's text changes. Decide whether the Fixture should take over the Inquiry's Red Flag text when it is created.
* **Correcting text typed earlier:** on a Fixture or Inquiry that already has a linked review, a Red Flag typed by hand before the release can only be changed through a review's Red Flag. If a review's Red Flag is empty, Legal has to enter a text and clear it again to empty the Fixture. Confirm this is acceptable.
