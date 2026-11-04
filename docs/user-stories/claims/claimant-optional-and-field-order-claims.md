#### **USER Story:**

**As a Legal user working on claims,**
**I want** the Claimant to be optional when a claim is created or edited, and the fields of the Edit Claim overlay arranged in the order Legal works through them, with Priority, Claim Status and PIC Legal in the Core Details section and the claimant details grouped in Additional Information
**So that** a claim can be registered before the claimant is known, the status of a claim sits with its general details, the incident story reads from top to bottom, and all claimant details are in one place.

> Client request from Lena Pickenpack (Legal), 27.10.2026 call and her Teams message of the same day. Two changes in one story:
>
> * The **Claimant** field has been mandatory since the beginning. She asked to **remove the mandatory validation**, in the New Claim overlay and in the Edit overlay.
> * "Order of fields in an existing claim (for Legal view)". In the call it was confirmed that this concerns the **Edit overlay of an existing claim**, not the New Claim overlay and not the listing columns. **This reverses COEMS-22152**, which moved PIC Legal out of the Core Details section into Additional Information.
>
> The Overview tab of the Edit overlay has two sections: **Core Details** and **Additional Information**, below it. The "Notes" tab requested in the same message is a separate story.

---

#### **acceptance criteria:**

1. **Where each change applies**

   * **Claimant optional:** the New Claim overlay (opened from the Claims module or from a Voyage's Incident/Claim tab) and the Edit Claim overlay.
   * **New field order:** the Overview tab of the Edit Claim overlay only, for every claim, whether it is opened from the Claims listing or from a Voyage's Incident/Claim tab.
   * Not changed: the order of the New Claim overlay, the Claims listing columns, filters and search, the header of the overlay, the other tabs, the History pop-up, PDF Export, Copy Template and Send as Email.

2. **Claimant is optional: New Claim overlay**

   * The required marker (asterisk) is removed from the Claimant label.
   * A claim can be created with Claimant empty. The inline message "Claimant is required." no longer appears, and no "required field" alert is shown for Claimant.
   * Claimant stays where it is in the New Claim overlay.

3. **Claimant is optional: Edit Claim overlay**

   * A claim can be saved with Claimant empty.
   * A user who can edit the claim can clear a Claimant that was entered earlier and save the claim with it empty.

4. **Edit overlay, Core Details section: new field order**

   * Top to bottom:

     | **#** | **Field** | **Change versus today** |
     | --- | --- | --- |
     | 1 | Voyage | No change in order |
     | 2 | Vessel | No change in order |
     | 3 | Related Fixture | No change in order |
     | 4 | Date of Incident | No change in order |
     | 5 | Location | No change in order |
     | 6 | Port Agent | No change in order |
     | 7 | Short Claim Description | No change in order |
     | 8 | Steps Taken So Far | No change in order |
     | 9 | Claim Status | Moves in from Additional Information, directly before Status Description |
     | 10 | Status Description | Moves in from Additional Information, directly after Claim Status |
     | 11 | Date of Notification to Broker | Moves up; today it is the last field of the section |
     | 12 | Required Assistance from Insurance | Now follows Date of Notification to Broker |
     | 13 | Legal Entity | No change in order among the original fields |
     | 14 | Priority | Moves in from Additional Information |
     | 15 | PIC Legal | Moves in from Additional Information (reverses COEMS-22152) |

   * Claimant, Claimant Reference Number and Representative of Claimant no longer appear in the Core Details section (see criterion 5).

5. **Edit overlay, Additional Information: claimant details first**

   * **Claimant** and **Claimant Reference Number** move from the Core Details section into Additional Information and sit **next to each other** in one row, Claimant first.
   * **Representative of Claimant** moves with them and sits **directly below Claimant**.
   * These three fields come first in the section.

6. **Edit overlay, Additional Information: remaining fields**

   * Top to bottom, after the claimant details:
     Type of Cover, Type of Claim, Broker, Broker Reference Number, Insurer, Insurer Reference Number, Recovery Right Exists, Resolution Path.
   * Priority, Claim Status, PIC Legal and Status Description are no longer in this section (they moved to the Core Details section in criterion 4).
   * **Date Settled & Claim Duration** and **External Parties** stay below Additional Information, as today.

7. **Only the Claimant validation and the positions change**

   * Apart from Claimant becoming optional, every field keeps its type, label, default, required or optional status, validation and saved value. For example Claim Status stays mandatory and defaults to Open, and the messages for the other mandatory fields are unchanged.
   * Behaviour tied to a field stays as it is: Remarks appears under Required Assistance from Insurance when it is Yes; Type of Claim stays disabled until Type of Cover is chosen; Insurer still auto-fills and locks when a matching Insurance record exists; the amber Date Settled hint when Claim Status is Close still appears.
   * Claimant stays a free-text field.
   * Which users see or can edit a field does not change. A field hidden from a user today stays hidden; a field shown read-only stays read-only.

8. **Where an empty Claimant is shown**

   * When a claim has no Claimant, every place that shows it handles the empty value in the same way as the other optional fields on that screen, without an error and without the text "null" or "undefined":
     * the **Claimant** and **Claimant Reference No** columns in the Claims listing,
     * the linked-claim cards in an Incident's Claims tab,
     * the Claim Summary in the **PDF Export**,
     * the **Copy Template** and **Send as Email** text.
   * The listing's text search and the Claimant filter keep working. A claim without a Claimant does not match a Claimant search.

9. **Existing claims**

   * Every existing claim opens in the new order with its existing values, including its Claimant. Nothing is migrated or re-entered.
   * Users who open a claim without edit permission see the same order, with every field read-only.

10. **History and exports**

    * History entries for the moved fields use the same field names as before. Clearing a Claimant is recorded like any other update.
    * The listing, PDF Export, Copy Template and Send as Email are not affected by the new order.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Claims → New Claim overlay (Claims module and Voyage → Incident/Claim tab) | Claimant is no longer mandatory; asterisk removed; position unchanged |
| Claims → Edit Claim overlay | Claimant can be saved empty |
| Claims → Edit Claim overlay → Overview → Core Details | New order; Claim Status and Status Description added next to each other after Steps Taken So Far; Date of Notification to Broker moved up; Priority and PIC Legal added after Legal Entity; Claimant, Claimant Reference Number and Representative removed from this section |
| Claims → Edit Claim overlay → Overview → Additional Information | Claimant, Claimant Reference Number and Representative of Claimant added at the top; Priority, Claim Status, PIC Legal and Status Description removed |
| Claims listing, Incident Claims tab, PDF Export, Copy Template, Send as Email | Empty Claimant is shown like any other empty optional field; no other change |

---

#### **Out of Scope:**

* The order of the **New Claim overlay**. After this story the Add and Edit overlays differ.
* Listing columns and their order (including Show/Hide and reorder), search and filters, beyond handling an empty Claimant.
* The new **Notes** tab (separate story).
* Changing the required or optional status of any field other than Claimant.
* Turning Claimant into a dropdown or a master list.
* Renaming any field, adding fields, or changing which users see a field.
* Layout of the Legal Review, Incidents, Insurance, Financials, Closure and Documents tabs.

---

#### **Open Points:**

* **Position of Priority, Claim Status and PIC Legal inside the Core Details section:** Lena's message says "to the top (Core Details)" and gives the order of the other fields starting at Voyage, without a position for these three. The story keeps her order for the other fields, puts Claim Status directly before Status Description so the two sit next to each other, and adds Priority and PIC Legal at the end of the section, directly above Additional Information. If she prefers another position, only criterion 4 changes.
* **Position inside Additional Information:** Lena did not say where the claimant details go in the section. The story puts them first. Confirm.
* **Operations users:** her list is "for Legal view". Operations users cannot edit a claim, and they do not see Additional Information when creating one. If they also do not see it when they open a claim, Claimant, Claimant Reference Number and Representative will no longer be visible to them. Confirm this is intended, or whether Operations should see the claimant details. At creation, Operations can now save a claim without a Claimant, and Legal fills it in later.
* **Add and Edit differ:** the New Claim overlay still shows Claimant in the Core Details section and keeps the old order, because the request covered the Edit overlay only. Confirm that is acceptable, or that a follow-up story should align the New Claim overlay.
