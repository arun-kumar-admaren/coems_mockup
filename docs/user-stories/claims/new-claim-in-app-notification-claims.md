#### **USER Story:**

**As a Legal user,**
**I want to** receive an in-app notification whenever a new claim is created, whether by Operations or by another Legal user
**So that** I am alerted to every new claim straight away and can open it from the notification, without having to check the Claims listing.

> Client request from Lena Pickenpack (Legal), following the 27.10.2026 call: Legal wants to be notified when Operations creates a claim, as an in-app notification (bell) and as an e-mail. This story covers the **in-app notification only**; the e-mail to the general Legal mailbox is a separate story. The notification uses the in-app notification service that already exists in COEMS for other modules (for example "created a new Fixture" and "assigned you as PIC in a Fixture"). No Claims notification of this kind exists today; the only Claims notifications are the Claim PDF export ones.
>
> **Status: deferred (29.10.2026).** COEMS is planning an internal restructuring of the Notifications functionality. The in-app and e-mail notifications for new Claims (and new Legal Reviews) will be implemented after that restructuring and are **not part of the November release**. The requirements below stay as agreed; they may need to be re-checked against the restructured notification service before build.

---

#### **acceptance criteria:**

1. **Trigger**

   * A notification is created when a **new claim is created**, from either entry point:
     * the **New Claim** overlay in the Claims module, or
     * the **New Claim** option in a Voyage's Incident/Claim tab.
   * It is triggered when the claim is saved ("Create Claim"), not while the form is being filled in.
   * It applies whoever creates the claim: an Operations (non-Legal) user or a Legal user.
   * Later actions on the claim (editing, archiving, deleting, restoring) do not create a notification.

2. **Recipients**

   * The notification is sent to every **active user with the "Legal" permission**, that is, the "Legal" checkbox on the user record (Settings → Users). This is the same permission the Claims, Legal Review and Insurance modules already use.
   * Each Legal user receives their own copy of the notification.
   * If the user who created the claim is a Legal user, they do **not** receive a notification for their own claim.
   * Users without the Legal permission receive nothing.
   * Recipients are decided at the moment the claim is created. A user who is given the Legal permission later does not receive notifications for claims created before that.

3. **Where it appears**

   * In the bell icon → **Notifications** panel, on the **Direct** tab only.
   * Nothing is added to the **Watching** or **Watch List** tabs.

4. **Content of the notification**

   * An **avatar-initials circle** of the user who created the claim, in the same style as the other notifications.
   * The text: **"[Creator's full name] created a new Claim"**, following the same pattern as "[name] created a new Fixture".
   * The **claim number** (for example `UHL-CL-2026-014`) shown as a link below the text.
   * The date and time the claim was created, in the same format as the other notifications (`dd/mm/yyyy, hh:mm AM/PM`).
   * Newest notifications are listed first, mixed with the other Direct notifications in the existing order.

5. **Opening the claim**

   * Clicking the claim number opens the **Claims listing** with that claim's **Edit Claim** overlay open, in the same way the Fixture notification opens the Fixture overlay on the Fixtures listing.

6. **Existing notification behaviour is unchanged**

   * The new notification behaves like every other notification: it shows the blue unread dot, is counted in the bell icon's alert, and is cleared by "Mark all as read".
   * Existing notifications, including the Claim PDF export ones, are not changed.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Claims → New Claim (Claims module) | Creating a claim triggers the in-app notification to Legal users |
| Voyage → Incident/Claim tab → New Claim | Same trigger, same notification |
| Notifications panel → Direct tab | New notification type: "[user] created a new Claim" with the claim number as a link |
| Notifications panel → Watching / Watch List | No change |
| Existing notification service (read/unread, Mark all as read, Load More, bell alert) | Reused as is; no change |

---

#### **Out of Scope:**

* The **e-mail** to the general Legal mailbox (legal@unitedheavylift.com) when a claim is created. This is covered by a separate story.
* Notifications for anything other than claim creation: claim edits, status or priority changes, PIC Legal assignment, new notes, claim deletion.
* The **Watching** and **Watch List** tabs.
* The planned dashboard notification widget and the digest e-mail for inactive users.
* Per-user settings to switch this notification on or off.
* Notifications for claims that already exist before this story is released.
* Notifications for Incident or Insurance creation.

---

#### **Open Points:**

* **Creator of the claim:** the story excludes a Legal user from being notified of their own claim. If Lena wants every Legal user, including the creator, to be notified, remove that bullet from criterion 2.
* **Claim that is later deleted:** the notification stays in the list. What the link should do for a claim that has been moved to Trash follows the existing notification behaviour and is not changed here.
