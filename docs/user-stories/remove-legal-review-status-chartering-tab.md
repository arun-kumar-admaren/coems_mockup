#### **USER Story:**

**As a Chartering user working on a Fixture or an Inquiry,**
**I want** the "Legal Review Status" field removed from the Legal section of the Chartering tab
**So that** I am not shown one status that cannot be right when the record has several reviews, and so that each review's own status is the only reference.

> Client decision from the 27.10.2026 call (Lena Pickenpack and Lukas Krag, UHL). Lena asked whether the field should be deleted or connected to the review status. Lukas first favoured connecting it, but a Fixture can have several reviews with different statuses, so one status on the Fixture cannot represent them. The team agreed to **remove the field from the Chartering tab**; each review's status is already visible on its card in the Legal Review tab.
>
> The call discussed the Fixture. The same reasoning applies to an Inquiry, which can also be linked to several reviews, so this story applies to both (see Open Points).
>
> Refines the earlier specification of this field as a live, editable second entry point for the status ([legal-section-chartering-tab-inquiry.md](legal-section-chartering-tab-inquiry.md), and COEMS-21105 for the Fixture).

---

#### **acceptance criteria:**

1. **Field removed from both tabs**

   * **Legal Review Status** is removed from the **Legal** section of the **Fixture Chartering tab** and of the **Inquiry Chartering tab**.
   * It is removed entirely: not hidden, not disabled, not read-only, not moved elsewhere on the tab.
   * This is the same for every user, whatever their role or permissions.

2. **Remaining fields**

   * Every other field in the Legal section stays as it is, with its current behaviour.
   * The remaining fields keep their order and move up to close the gap, with no empty space where the field was.
   * On the Inquiry tab the section then contains Charter Party Type and Red Flag.

3. **Reviews are not affected**

   * No review's status changes, and no review data is deleted or migrated.
   * Each review's status stays visible on its card in the **Legal Review** tab of the Fixture or Inquiry, and in the Legal Review listing.
   * The status is changed from the review itself, in its Edit Review overlay. The Chartering tab no longer offers a second place to set it.

4. **No effect on linking**

   * Reviews linked to a Fixture or Inquiry stay linked. Converting an Inquiry to a Fixture still carries the linked reviews across, as in [inquiry-to-fixture-legal-review-carryover.md](inquiry-to-fixture-legal-review-carryover.md). Nothing about a status needs to be carried across.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Fixture → Chartering tab → Legal section | Legal Review Status field removed; remaining fields move up |
| Inquiry → Chartering tab → Legal section | Legal Review Status field removed; Charter Party Type and Red Flag remain |
| Legal Review → status on the review, cards, listing | No change |

---

#### **Out of Scope:**

* The **Draft, Final and Signed dates** on the Fixture: their rename and reorder, and the update from the review status (separate stories).
* The **Red Flag** field.
* The status options per Review Type.
* The embedded Legal Review tab on the Insurance, Claims and Scope records, which has no such field.
* Merging the Legal Review tab into the Chartering tab (feasibility study).

---

#### **Open Points:**

* **Inquiry:** the call decided this for the Fixture. The story applies it to the Inquiry for the same reason (several reviews per Inquiry). Confirm with Lena that the Inquiry follows the Fixture.
* **Other places showing the field:** check whether the field also appears elsewhere for a Fixture or an Inquiry, such as a listing column, filter or export. If it does, it is removed there as well.
