#### **USER Story:**

**As a Legal user working on a review,**
**I want** the Legal Review Status options to depend on the Review Type, and the contract statuses Draft issued, Final issued and Signed to fill in the matching Charter Party dates on the linked Fixtures automatically
**So that** only statuses that make sense for the type of review can be chosen, and Chartering sees the Draft, Final and Signed dates on the Fixture without anyone entering them twice.

> Client request from Lena Pickenpack and Lukas Krag (UHL), 27.10.2026 call. Two changes in one story:
>
> * **Status list by review type:** To be reviewed (Open), Under review and Review completed apply to every review. Under negotiation, Draft issued, Final issued and Signed apply **only to contract reviews** (Review Type = Contract Review Chartering or Contract Review Projects).
> * **Status updates the Chartering dates:** Draft issued fills the Draft Charter Party Issuance Date, Final issued fills the Final Charter Party Issuance Date, Signed fills Charter Party Signed by Client. The date used is the date the status was changed.
>
> On the call, a review linked to several Fixtures was to open a checklist pop-up so the user could choose which Fixtures receive the update. This story replaces that pop-up with an automatic update of all linked Fixtures, because a Fixture can also be linked to several reviews and the dates become read-only. The proposal was sent to Lena and Lukas; their confirmation is pending (see Open Points).

---

#### **acceptance criteria:**

1. **Status options depend on the Review Type**

   * Wherever the Legal Review Status is chosen (Create Review overlay and Edit Review overlay), the dropdown offers:

     | **Status** | **Review Type: Contract Review Chartering or Contract Review Projects** | **Any other Review Type** |
     | --- | --- | --- |
     | To be reviewed (Open) | ✅ | ✅ |
     | Under review | ✅ | ✅ |
     | Review completed | ✅ | ✅ |
     | Under negotiation | ✅ | Not offered |
     | Draft issued | ✅ | Not offered |
     | Final issued | ✅ | Not offered |
     | Signed | ✅ | Not offered |
     | Not required | ✅ | ✅ |

   * The options keep their current order, with the contract-only ones simply left out for the other review types.
   * When the user changes the Review Type, the status options update straight away.
   * If a review already holds a status that is not offered for its Review Type (for example an existing review with Signed whose type is not a contract type), the saved value stays as it is and is shown. The user can change it, but cannot choose it again once changed.
   * A new review still defaults to **To be reviewed (Open)**, as today.
   * The Legal Review listing's status filter and quick tabs are unchanged and still list every status.

2. **Which status fills which date**

   | **Review status changed to** | **Field filled on the Fixture** | **Value** |
   | --- | --- | --- |
   | Draft issued | Draft Charter Party Issuance Date | The date the status was changed |
   | Final issued | Final Charter Party Issuance Date | The date the status was changed |
   | Signed | Charter Party Signed by Client | The date the status was changed (see criterion 5) |

   * Every other status (To be reviewed, Under review, Review completed, Under negotiation, Not required) fills no date.
   * "The date the status was changed" is the date on which the review is saved with the new status, in `dd/mm/yyyy`.

3. **When the update runs and which records receive it**

   * The update runs when a review is saved with Draft issued, Final issued or Signed as a **new** status, whether it was changed in the Edit overlay or set when the review was created.
   * It applies to **every Fixture** listed in the review's **Related To**, automatically. There is no pop-up and no selection step.
   * Inquiries, Scope, Insurance and Claims listed in Related To receive nothing. The Inquiry Chartering tab has no Charter Party date fields.
   * Only a change of status triggers it. Saving the review without changing the status, or changing any other field, updates no date.

4. **A Fixture linked to several reviews**

   * Each date field takes the value from the **most recent status change** among the Fixture's linked reviews that set that field.
   * Example: a Fixture is linked to Review A and Review B. Review A is set to Draft issued on 05/11/2026 and Review B on 12/11/2026. The Draft Charter Party Issuance Date on the Fixture shows 12/11/2026. A later change on Review A that only affects the Final date leaves the Draft date as it is.
   * The most recent change is decided per field, not per review.

5. **Read-only dates, and the Signed date**

   * While **at least one review is linked** to the Fixture, the **Draft Charter Party Issuance Date** and the **Final Charter Party Issuance Date** are read-only on the Fixture Chartering tab. They are filled only from the review; no manual entry.
   * **Charter Party Signed by Client stays editable** for anyone who can edit the Fixture, because Chartering signs the final CP and must be able to enter the date.
   * The status **Signed** fills this date **only if it is still empty**, whether the earlier value was entered by hand or came from another review. A date that is already there is never overwritten by a later status change.
   * When **no review is linked**, all three dates are editable, as today.

6. **Traceability on the Fixture**

   * Under each of the three date fields, a short line shows where the value came from:
     * filled from a review: **"Set by UHL-L-2026-012 on 12/11/2026"** (review number and the date of the change),
     * entered by hand: **"Entered by [full name] on 12/11/2026"**.
   * This applies to **Charter Party Signed by Client** whichever way it got its value: filled by the Signed status, or typed by a user. The Draft and Final dates can also be entered by hand when no review is linked, and then show "Entered by" in the same way.
   * If a user changes or replaces a date that a review had filled, the line changes to "Entered by [full name] on [date]".
   * The date in the line is the day the value was set or entered. It can differ from the date shown in the field, for example when Chartering types the actual signing date a few days later.
   * No line is shown for a date that has no value, or for a value that was entered before this story was released.

7. **Nothing is cleared automatically**

   * If the status moves back to a value that fills no date, or to an earlier contract status, no date is cleared or changed. The dates already on the Fixture stay.

8. **Linking and unlinking a review**

   * Linking a review to a Fixture does not by itself fill any date. The Fixture receives a date the next time that review's status is changed to Draft issued, Final issued or Signed. This also applies to a review carried over when an Inquiry is converted to a Fixture.
   * Unlinking a review changes no date. If it was the last linked review, the Draft and Final dates become editable again and keep their values.

9. **History**

   * Each automatic update is recorded in the Fixture's History as an Update to that field, with the previous and the new value, attributed to the user who changed the review's status.

10. **Existing data**

    * Nothing is changed at release. Existing reviews keep their statuses, and existing Fixtures keep their dates, including dates entered by hand.
    * A Fixture that already has a linked review has its Draft and Final dates read-only from release, with the saved values unchanged.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Legal Review → Create and Edit overlay → Legal Review Status | Options depend on the Review Type |
| Legal Review → status change | Draft issued, Final issued and Signed fill the matching date on every linked Fixture |
| Fixture → Chartering tab → Legal section | Draft and Final dates read-only while a review is linked; Charter Party Signed by Client stays editable; "Set by" / "Entered by" line under each date |
| Fixture → History | Automatic date updates are recorded |
| Inquiry, Scope, Insurance, Claims | No date update |

---

#### **Out of Scope:**

* The **Red Flag** field and its update of Fixtures and Inquiries (separate story).
* Renaming and reordering the Fixture date fields (Draft Charter Party Issuance Date, Final Charter Party Issuance Date, Charter Party Signed by Client) and removing the Legal Review Status field from the Fixture Chartering tab (separate story). This story uses the new field names.
* The Inquiry Chartering tab, including its Legal Review Status field.
* Restricting which user role can set which status. The BRD notes this rule is not enforced today, and it stays that way.
* The work log, the work-log overview and the automatic task per review.
* Notifications when a date is filled in, and the merge of the Legal Review tab into the Chartering tab (feasibility study).
* Status badge colours, listing columns and filters.

---

#### **Open Points:**

* **Confirmation pending from Lena and Lukas:** the automatic update of all linked Fixtures instead of the checklist pop-up, "most recent change wins", and the "Set by" line. Lena has confirmed only that the dates become read-only and that Chartering must still be able to enter the Signed date.
* **"Not required":** today's status list has 8 values, and Not required was not discussed on the call. The story keeps it for every review type. Confirm.
* **Contract status on a non-contract review:** the story keeps an already saved value and does not let it be chosen again. If Legal prefers that a change of Review Type forces a new status, criterion 1 changes.
* **Linking after the status was set:** a review that reached Draft issued before it was linked fills no date until its status changes again. The alternative is to apply the dates at the moment of linking, using the date the status was changed.
* **Correcting a wrong date:** the Draft and Final dates cannot be edited while a review is linked. A wrong date is corrected by changing the review's status again, and a status moved back does not clear anything (criterion 7). Confirm this is acceptable.
* **Existing "Charter Party Issuance Date" values:** this field is renamed to Charter Party Signed by Client in the separate story. Decide whether values already saved there carry over as Signed dates.
