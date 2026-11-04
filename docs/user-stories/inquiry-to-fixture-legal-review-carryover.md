#### **USER Story:**

**As a user,**
**I want to** have any Legal Review(s) already linked to an Inquiry automatically carried forward to the Fixture record created when that Inquiry is converted
**So that** Legal doesn't lose visibility of reviews that were raised pre-fixture, and doesn't have to manually re-link the same review to the new Fixture.

---

#### **acceptance criteria:**

1. **Trigger condition**

   * Applies whenever an Inquiry that has one or more Legal Reviews linked via its **Related To** field is converted into a Fixture.
   * If the Inquiry has no linked Legal Reviews, conversion proceeds exactly as it does today — no change in behaviour.

2. **Carry-forward behaviour**

   * On conversion, every Legal Review currently linked to that Inquiry must have the newly created Fixture **added** to its **Related To** field.
   * The original Inquiry link on each of those reviews must **remain** — the Fixture is added alongside it, not swapped in place of it. A review's Related To field can and should show both the source Inquiry and the resulting Fixture.
   * This must happen automatically as part of the conversion — no manual "Link Review" action required from the user.
   * If more than one Legal Review is linked to the Inquiry, **all** of them are carried forward, not just the first/primary one.

3. **Visibility after conversion**

   * Opening any of the carried-forward reviews' **Edit overlay** — whether from the Legal Review Hub, from the original Inquiry's Legal Review tab, or from the new Fixture's Legal Review tab — must show both the Inquiry and the Fixture listed under **Related To**.
   * The new Fixture's own **Legal Review tab** must display each carried-forward review as a card, exactly as if it had been linked there manually via "Link Review."
   * The original Inquiry's Legal Review tab must continue to show the same review card as before — conversion does not remove or alter its view there.

4. **No duplication**

   * Carrying a review forward extends its existing Related To array — it must never create a duplicate copy of the review record itself.
   * If a review somehow already lists the new Fixture under Related To before conversion completes, it must not be added twice.

5. **Scope of change**

   * Only the **Related To** field is affected by this carry-forward. No other Legal Review field (Review Type, PIC Legal, Legal Review Status, Charter Party details, etc.) is modified, reset, or copied as part of this behaviour.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Inquiry → Fixture conversion | On conversion, append the new Fixture to Related To on every Legal Review linked to the source Inquiry |
| Legal Review → Edit overlay | Related To reflects both the original Inquiry and the carried-forward Fixture |
| Fixture → Legal Review tab | Carried-forward reviews appear as cards, same as a manually linked review |
| Inquiry → Legal Review tab | Unchanged — continues showing the same linked review cards as before conversion |

---

#### **Out of Scope:**

* The Inquiry-to-Fixture conversion mechanism itself (assumed to already exist / be defined elsewhere in the Chartering/Inquiry module — this story only covers what happens to linked Legal Reviews when that conversion occurs).
* Carrying forward any Legal Review field other than Related To.
* Unlinking the review from the Inquiry after conversion — the Inquiry link is retained, not removed.
