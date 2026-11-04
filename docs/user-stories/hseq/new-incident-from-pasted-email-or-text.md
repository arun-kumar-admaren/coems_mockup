#### **USER Story:**

**As a user creating a new Incident from the Incidents page,**
**I want** to paste the content of an email, or any text, describing the incident and have the Incident form filled in from it
**So that** I do not have to re-type details that are already in the report I received, and can create the Incident record faster and with fewer mistakes.

> This brings to the **New Incident** overlay on the **Incidents page** the same way of working the Inquiry module already has in **New Inquiry from Email**: a free-text area on the left, the form on the right, and an **Extract Details** button that fills the form from the pasted text. The user always reviews and corrects the values before saving.
>
> It applies **only** to the New Incident overlay opened from the **Incidents page** (Management → Incidents → New Incident). It does **not** apply to the New Incident form on a voyage's Incident/Claim tab.

---

#### **Current behaviour (checked on the staging environment):**

* **Management → Incidents → New Incident** opens the **Create New Incident** overlay. If an unsaved draft exists, the overlay first asks **"You have unsaved changes" with Resume / Create New**.
* **The form.** Fields marked * are mandatory, and **Create Incident** stays disabled until they are all filled.

  | **Field** | **Notes** |
  | --- | --- |
  | **Related** * | Vessel, Office or Event. It decides which of the next fields appear. |
  | **If Related = Vessel** | |
  | **Vessel** * | |
  | Voyage | Not mandatory. Lists the vessel's voyages. |
  | **Location** * | Port, Anchorage or At Sea |
  | Port Call | Appears for Port and for Anchorage. **Not mandatory.** |
  | Latitude, Longitude | Appear for At Sea. Not mandatory. |
  | Related Fixtures | Not mandatory |
  | **If Related = Office or Event** | |
  | **Locations** * | A free-text field. Vessel, Voyage, Location, Port Call and Related Fixtures are not shown. |
  | **For every Related value** | |
  | **Date & Time of Incident** * | Starts as the current date and time |
  | **Incident Category** * | Accident, Near-Miss, Non-Conformity, Innocent Incident |
  | **Fields that depend on the Category** * | See the next table |
  | **Short Description** * | Up to 1,000 characters |
  | Detailed Description | Up to 10,000 characters |
  | Initial Severity | Starts as Low. Low, Medium, High or Critical |
  | Status | Starts as Open. Open, Pending, Closed or Cancelled |

* **What the Category adds** (all mandatory):

  | **Category** | **Fields and options** |
  | --- | --- |
  | **Accident** | **Incident Class**: Personnel Accident, Vessel Damage and/or Loss, Cargo Damage and/or Loss, Environmental Accident, Security Accident. **Incident Type**: its options depend on the Class (Personnel Accident has 13, for example Fall From Elevation, Struck By, Contact with Electricity, Act of Violence). **Event Severity Classification**, only for Personnel Accident: Fatality (FAT), Permanent Total Disability, Permanent Partial Disability, Lost/Restricted Work Case, Medical Treatment Case, First Aid Case. |
  | **Near-Miss** | **Near-Miss Type**: Unsafe Condition, Unsafe Act |
  | **Non-Conformity** | **Non-Conformity Type**: Failure to fulfil Flag State regulation, Failure to fulfil Port State regulation, Failure to fulfil customer requirements and expectations, Failure to follow company procedures, Personnel Complaint, Others |
  | **Innocent Incident** | **Innocent Incidents Type**: Illness / Medical Treatment |

  These were checked under Related = Vessel. Under Related = Event, Accident (Class and Type) and Innocent Incident were checked and behave the same.
* Every value has to be typed or selected by hand.

---

#### **acceptance criteria:**

1. **Two-panel overlay, laid out like New Inquiry from Email**

   * The New Incident overlay opened from the Incidents page must open in two panels, laid out as the Inquiry overlay is:
     * **Left panel:** a large free-text area with a dashed border that fills the height of the panel, showing the placeholder **"Paste your email or text below"**. (Inquiry's reads "Paste your email below".)
     * **Right panel:** the existing Incident form, unchanged.
   * The overlay heading reads **"New Incident from Email"**, as Inquiry's reads "New Inquiry from Email". [Not specified. This is a proposed default.]
   * A bar at the bottom of the left panel holds the **Extract Details** button (see AC 3). The existing **Cancel** and **Create Incident** buttons stay as they are today. Inquiry's **Create Estimate** option has no equivalent here.
   * The user can still ignore the left panel and fill in the form by hand, exactly as today.

2. **What can be pasted**

   * The text area must accept the content of an email (subject, body, signature, forwarded or replied chains) and plain text from any other source.
   * Only the pasted text is read. Email attachments and images are not.

3. **Extract Details**

   * An **Extract Details** button must be available, and it must be enabled only when the text area is not empty. While the text area is empty, the button is greyed out, as it is in Inquiry.
   * Clicking it must read the pasted text and fill the matching fields in the right panel.

4. **Related comes first**

   * From the text, the extraction must decide what the incident relates to (**Vessel, Office or Event**) and then fill the fields that go with it, as listed in the form tables above.
   * If it cannot decide, Related stays empty and highlighted, as a mandatory field.

5. **Fields that can be filled: as many as the text allows**

   * The extraction must fill **every field it can find a matching value for in the text**, not only the mandatory ones. The aim is to put the maximum available data into the form.

   | **Field** | **Filled from the text** |
   | --- | --- |
   | Related | Vessel, Office or Event |
   | Vessel, Voyage | Vessel and voyage named in the text (Related = Vessel) |
   | Location | Port, Anchorage or At Sea (Related = Vessel) |
   | Port Call | The port, when Location is Port or Anchorage |
   | Latitude / Longitude | The position, when Location is At Sea |
   | Related Fixtures | Fixture numbers named in the text (Related = Vessel) |
   | Locations | The place named in the text (Related = Office or Event) |
   | Date & Time of Incident | When the incident happened |
   | Incident Category | Accident, Near-Miss, Non-Conformity or Innocent Incident |
   | Class, Type, Event Severity Classification, Near-Miss Type, Non-Conformity Type, Innocent Incidents Type | Whichever the Category and Class call for |
   | Short Description | A summary of the incident |
   | Detailed Description | The full account: what happened, who and what was involved, injuries or damage, actions taken, and any other relevant detail in the text that no other field captures |
   | Initial Severity | Low, Medium, High or Critical |

   * **Status** is filled only if the text clearly states one that matches an option (Open, Pending, Closed or Cancelled). Otherwise it stays at Open.
   * **Incident Number** is never taken from the text. It is generated when the Incident is saved.

6. **Values must match what the system already knows**

   * A value for a drop-down or search field is filled only if it matches an existing option.
   * A value that cannot be matched is **left blank** and never invented.
   * The existing dependencies still apply: the fields shown depend on Related, Port Call shows only for Port or Anchorage, Latitude / Longitude only for At Sea, the Category decides which type field appears, Type depends on Class, and Event Severity Classification shows only for Personnel Accident.

7. **Field limits are respected**

   * Short Description must not exceed **1,000 characters**, and Detailed Description must not exceed **10,000 characters**.

8. **Date and time**

   * **Date & Time of Incident** is set from the date and time found in the text.
   * If the text has no date or no time, the missing part is taken from the current date and time: no date gives today's date, and no time gives the current time. If the text has neither, the field shows the current date and time, which is also its default.

9. **The user reviews, then creates the record manually**

   * Every filled value must stay editable.
   * **Extract Details only fills the form.** It never saves anything and never creates the Incident, even when every mandatory field ends up filled.
   * The record is created **only when the user clicks Create Incident**. There is no automatic creation and no automatic save.
   * Mandatory fields that the text did not provide must stay highlighted in red, and **Create Incident** stays disabled until every mandatory field is filled, exactly as today.
   * If the user closes the overlay without clicking **Create Incident**, no Incident is created.

10. **Not enough information**

    * If the text does not contain enough incident detail to fill anything useful, the system must show a clear message saying so and leave the form for manual entry.
    * It must not fill the form with guesses.

11. **Extracting again**

    * The user can change the pasted text and click **Extract Details** again.
    * A second extraction must fill only fields that are still empty. It must never overwrite a value the user typed, selected or changed. [Not specified. This is a proposed default.]

12. **Draft and Resume**

    * The existing **"You have unsaved changes" with Resume / Create New** behaviour stays.
    * The draft must keep **both the pasted text and the values in the form**. **Resume** brings both back, and **Create New** clears both.

13. **The pasted text is not kept**

    * The pasted email or text is **not stored on the Incident record**. It exists only in the overlay and its draft, and is discarded once the Incident is created or the draft is cleared with **Create New**.

14. **Saving**

    * **Create Incident** must work exactly as today, and the Incident appears in the Incident list like any other.

15. **Only when creating**

    * The paste panel applies to **New Incident**. Editing an existing Incident stays as it is today. [Not specified. This is a proposed default.]

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Management → Incidents → New Incident overlay | New left panel with a paste area and an **Extract Details** button; the form stays on the right |
| New Incident form | Fields filled from the pasted text and left editable |
| New Incident draft | The draft also holds the pasted text and filled values |

---

#### **Out of Scope:**

* The **New Incident** form on a voyage's Incident/Claim tab. It stays as it is today, without a paste panel.
* Reading email attachments or images.
* Connecting a mailbox or creating Incidents automatically from incoming email.
* The existing **Import Near Miss** button on the Incidents page.
* Editing an existing Incident, and any change to the form's fields, options or validation.
* Storing the pasted text on the Incident record.
* Any visual marking of fields filled by Extract Details. They look the same as typed values.

---

#### **To be confirmed:**

* **Overlay width and wording.** Inquiry's overlay has a drag handle on its left edge to resize it. Confirm the Incident overlay should do the same, since two panels need room. Also confirm the heading and placeholder wording proposed in AC 1.
* **Language and length.** Which languages the text may be in, and whether there is a maximum length for the pasted text.
* **Data handling.** Where the pasted text is processed and whether it is retained by the extraction service, because incident reports may contain personal or injury details.
