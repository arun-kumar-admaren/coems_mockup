#### **USER Story:**

**As a Legal team member,**
**I want** COEMS to send an e-mail to the general Legal mailbox whenever a new claim is created, whether by Operations or by Legal
**So that** every Legal user sees the new claim in their normal inbox, even if they have not opened COEMS or noticed the in-app notification, especially while the team is still getting used to working in COEMS.

> Client request from the 27.10.2026 call (Lena Pickenpack and Lukas Krag, UHL): Legal wants an in-app notification **and** an e-mail when Operations creates a claim, with the e-mail going to the general Legal mailbox so that all Legal users see it. Lena expects to need the e-mail for roughly the first 6 to 12 months and then to switch it off. The in-app part is covered by the story "Claims in-app notification when a claim is created".
>
> **COEMS has no e-mail notification capability today.** The Claims "Send as Email" action only opens the user's own mail client with a pre-filled draft. This story introduces a system-sent e-mail for the first time.
>
> **Status: deferred (29.10.2026).** COEMS is planning an internal restructuring of the Notifications functionality. The in-app and e-mail notifications for new Claims (and new Legal Reviews) will be implemented after that restructuring and are **not part of the November release**. The requirements below stay as agreed; they may need to be re-checked against the restructured notification service before build.

---

#### **acceptance criteria:**

1. **Trigger**

   * One e-mail is sent when a **new claim is created**, from either entry point:
     * the **New Claim** overlay in the Claims module, or
     * the **New Claim** option in a Voyage's Incident/Claim tab.
   * It is triggered when the claim is saved ("Create Claim"), not while the form is being filled in.
   * It applies whoever creates the claim: an Operations (non-Legal) user or a Legal user.
   * Later actions on the claim (editing, archiving, deleting, restoring) send no e-mail.

2. **Recipient**

   * The e-mail goes to a single shared address, the general Legal mailbox: **`legal@unitedheavylift.com`**.
   * It is not sent to individual users, and it does not depend on any individual user's settings or preferences.
   * No other address is added in CC or BCC.

3. **Sender**

   * The e-mail is sent by COEMS from a system sender address, not from the creating user's own mailbox or mail client.
   * Replies to the e-mail are not handled by COEMS.

4. **Subject**

   * The subject identifies the event and the claim, in the form: **"New Claim created in COEMS: UHL-CL-2026-014"** (with the actual claim number).

5. **Body**

   * A one-line introduction: "A new claim has been created in COEMS."
   * A short list of details, using only fields that every claim has at creation, whoever created it:

     | **Line** | **Value** |
     | --- | --- |
     | Claim Number | e.g. `UHL-CL-2026-014` |
     | Created By | Full name of the creating user |
     | Created On | Date and time of creation |
     | Voyage | The selected voyage |
     | Vessel | The vessel of that voyage |
     | Related Fixture | All selected fixtures |
     | Date of Incident | As entered |
     | Location | As entered |
     | Short Claim Description | As entered |

   * A field left empty on the claim is shown as "—".
   * A link **"Open claim in COEMS"** that takes the user to the Claims listing with that claim's Edit Claim overlay open, the same destination as the in-app notification link. The user signs in first if they are not already signed in.
   * No attachments are included.

6. **Timing**

   * The e-mail is sent as soon as the claim has been created, without waiting for any delay or schedule.

7. **Failure handling**

   * If the e-mail cannot be sent, the claim is still created normally. The user creating the claim is not shown an error and the claim is not rolled back.
   * The failure is recorded so that it can be investigated.
   * The in-app notification is not affected.

8. **Switching it off later**

   * An administrator can **turn the e-mail on or off**, and **change the recipient address**, without a code change, because Legal expects to stop using the e-mail after the first months.
   * Turning it off does not affect the in-app notification.
   * The e-mail is **on** by default.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Claims → New Claim (Claims module) | Creating a claim sends the e-mail to the Legal mailbox |
| Voyage → Incident/Claim tab → New Claim | Same trigger, same e-mail |
| E-mail sending | New: a system-sent e-mail from COEMS with the subject and body above |
| Administration | On/off switch and recipient address for this e-mail (location to be agreed, see Open Points) |
| In-app notification | Separate story, not changed here |
| Claims → Copy Template / Send as Email | Unchanged; these still open the user's own mail client |

---

#### **Out of Scope:**

* The **in-app notification** for new claims (separate story).
* E-mails to individual users, a daily or inactivity **digest e-mail**, and any link to a user's own notification or e-mail preferences.
* E-mails for any other claim event: edits, status or priority changes, PIC Legal assignment, new notes, deletion.
* E-mail notifications for other modules (Legal Review, Insurance, Incidents, Fixtures).
* E-mails for claims created before this story is released.
* Attachments, branded or designed e-mail templates beyond the content listed above, and handling of replies.
* A dashboard notification widget.

---

#### **Open Points:**

* **Sender address and delivery:** the system sender address, and how COEMS is allowed to deliver mail to `legal@unitedheavylift.com`, need to be agreed with UHL's IT team before this can be built. This is a dependency because COEMS has no e-mail sending today.
* **Where the on/off switch and the recipient address live:** for example under Settings → Administration → Preferences. Needs a decision.
* **Creator copy:** the e-mail goes only to the shared mailbox, so a Legal user who creates a claim also receives it through the mailbox. The in-app notification excludes the creator, the e-mail does not. Confirm this is acceptable.
