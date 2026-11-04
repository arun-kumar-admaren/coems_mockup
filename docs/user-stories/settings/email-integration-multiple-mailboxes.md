#### **USER Story:**

**As an administrator,**
**I want to** open the connected "Email" integration tile and manage multiple mailboxes from one place — adding more, editing an existing mailbox's credentials or access list, or removing one entirely,
**So that** every shared mailbox feeding Smart Inbox, and exactly who can see each one, can be administered from a single screen instead of one integration per mailbox.

---

#### **acceptance criteria:**

1. **Entry point:** once at least one mailbox is connected, clicking anywhere on the "Email" tile on the Integrations home page — or specifically its gear icon — opens the **Email edit overlay**. This is a distinct overlay from the single-connection Add/Edit modal used for Coach Solutions/Navis (see "Add Email Integration" story).

2. **Overlay header:** Email logo badge + "Email" title, with a ✕ to close.

3. **Toolbar row:** a "Connected mailboxes" label on the left and a **"+ Add Email"** button on the right.

4. **Mailbox list:** every connected mailbox is shown as its own row, containing:
   - The email address (truncated if long).
   - A summary line: **"No users assigned"**, or **"{N} user(s) with access"**.
   - A pencil (edit) icon, right-aligned — this is the only per-row action; there is no separate remove control directly in the list (removal happens inside the edit modal, AC 8).
   If the list is ever empty, it shows "No mailboxes connected yet" (in practice this state is only reachable transiently, since the tile itself only exists while `emailAccounts.length > 0`).

5. **Adding another mailbox:** "+ Add Email" opens the same "Add Email" modal described in the companion story (blank Email ID / Password / Users with Access, same disclaimer, same save-gating), layered on top of the overlay. Saving adds the new mailbox to the list and returns to the overlay (the overlay itself stays open — it does not close back out to the Integrations home page).

6. **Editing a mailbox:** clicking a row's pencil icon opens the same "Add Email" modal, but in edit mode:
   - Title reads **"Edit Email"** instead of "Add Email."
   - Email ID and Password are pre-filled with that mailbox's stored values (password still masked by default, revealable via the eye icon).
   - The **Users with Access** checklist is pre-checked to exactly that mailbox's currently granted users — each mailbox's access list is independent; editing one mailbox's grants never changes any other mailbox's.
   - A **"Remove"** button (red, trash icon) appears next to Cancel/Save — not present when adding a brand-new mailbox.
   - The primary button reads **"Save"** (instead of "Add Email"), gated the same way as AC 5 of the companion story (Email ID + Password both non-empty).

7. **Saving an edit** updates only that one mailbox's record (email, password, and/or user grants) in place; the overlay's list reflects the change immediately without closing.

8. **Removing a mailbox:** clicking "Remove" in edit mode opens a confirmation dialog first — *"Remove {email}?"* / *"This disconnects the mailbox and removes it from the Smart Inbox for every user it was shared with. This can't be undone."* Confirming deletes just that mailbox and returns to the edit overlay's list, with every other mailbox unaffected.
   - **If the removed mailbox was the last one connected,** the entire edit overlay closes automatically (its visibility is gated on at least one mailbox existing) straight back to the Integrations home page, where the "Email" tile itself has now disappeared from the grid — and "Email" becomes selectable again from the Available Integrations picker, per the companion story's AC 9.

9. **Independent per-mailbox access is the core guarantee of this story:** two mailboxes connected under the same Email integration can have completely different, non-overlapping sets of users granted access. Access is scoped to the individual mailbox record, never to the integration as a whole.

10. **Closing the overlay** (✕ or clicking the backdrop) returns to the Integrations home page; the "Email" tile's subtitle ("{N} mailbox(es) connected") reflects the current total across every mailbox, added, edited, or removed during that session.

---

#### **Out of scope**

* Bulk actions — removing or editing multiple mailboxes in one action.
* Reordering mailboxes within the list.
* Any per-mailbox connection health/status indicator — the green-dot "Active" styling exists only at the parent Email tile level; the overlay's per-row content is limited to the email address and its user-access summary.
* Search or filtering within the mailbox list (not needed at the current mock scale of a handful of mailboxes).

#### **Open items**

1. **Role enforcement is not implemented in the mockup** — same caveat as the companion "Add Email Integration" story.
2. **Duplicate email addresses are not prevented** — two mailbox entries could currently be added (or edited into) the same Email ID with no warning or block; whether this should be validated against is undecided.
3. **Persistence across reload** — connected mailboxes and their access lists reset on refresh, same as the rest of this mockup's state; undecided whether this should change for demo purposes.
