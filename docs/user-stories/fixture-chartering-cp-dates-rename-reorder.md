#### **USER Story:**

**As a user working on the Legal section of a Fixture's Chartering tab,**
**I want** the three Charter Party dates arranged in the order the contract moves through, and the last one named "Charter Party Signed by Client"
**So that** the dates read in sequence (draft, final, signed) and each label says what the date records.

> Client request from Lena Pickenpack and Lukas Krag (UHL), 27.10.2026 call. The order and names of the date fields in the Fixture Chartering tab's Legal section become: **Draft Charter Party Issuance Date | Final Charter Party Issuance Date | Charter Party Signed by Client**. The existing "Charter Party Issuance Date" is renamed to "Charter Party Signed by Client", and the other two move.
>
> These are the three dates that the Legal Review status fills in. That behaviour is covered by a separate story ([legal-review-status-by-type-and-chartering-dates.md](legal-review-status-by-type-and-chartering-dates.md)). This story only changes names and positions.

---

#### **acceptance criteria:**

1. **New order**

   * In the **Legal** section of the **Fixture Chartering tab**, the three Charter Party dates form one row, left to right:

     | **Left** | **Middle** | **Right** |
     | --- | --- | --- |
     | Draft Charter Party Issuance Date | Final Charter Party Issuance Date | Charter Party Signed by Client |

   * The row sits in the place the date fields occupy in the section today. The other fields of the section keep their current order.

2. **Rename**

   * The existing field **Charter Party Issuance Date** is renamed **Charter Party Signed by Client**.
   * It is the same field, not a new one. Dates already saved in it stay and appear under the new name.

3. **Draft and Final dates**

   * **Draft Charter Party Issuance Date** and **Final Charter Party Issuance Date** are the same fields as today. Only their positions change, and their saved values are unchanged.

4. **Behaviour of the fields**

   * All three stay date pickers with the date format used elsewhere on the tab.
   * This story adds no new validation between the three dates, and removes none that exists today.
   * Whether a date is editable or read-only, and the "Set by / Entered by" line, are covered by the separate status-and-dates story, not here.

5. **The old name is gone**

   * The label "Charter Party Issuance Date" no longer appears for a Fixture. Wherever this field is shown for a Fixture, it uses the new name.

6. **Inquiry**

   * The Inquiry Chartering tab has no Charter Party date fields and is not affected.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Fixture → Chartering tab → Legal section | The three dates in one row: Draft CP Issuance Date, Final CP Issuance Date, Charter Party Signed by Client |
| Fixture → "Charter Party Issuance Date" | Renamed "Charter Party Signed by Client", same field and values |
| Inquiry → Chartering tab | No change |

---

#### **Out of Scope:**

* Filling these dates from the Legal Review status, making them read-only, and the "Set by / Entered by" line (separate story).
* Removing the Legal Review Status field from the Chartering tab (separate story).
* Contract / Recap Date, Charter Party Type, Category and Red Flag.
* Any validation of the order of the three dates.

---

#### **Open Points:**

* **Meaning of the existing values:** the field "Charter Party Issuance Date" was specified as tracking the time from the Fixture date until the contract is issued. After the rename, the same saved dates are read as signing dates. Confirm that existing values should simply carry over, or whether they should be cleared or reviewed.
* **Other places showing the field:** check whether the old name also appears elsewhere for a Fixture, such as a listing column, filter, report or export. Each place changes with the rename.
