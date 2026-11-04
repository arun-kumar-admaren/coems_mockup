#### **USER Story:**

**As a** Smart Inbox user,
**I want to** open a message from the list and read its full conversation thread, expanding or collapsing individual messages and their attachments as needed,
**So that** I can review an email's entire history in context without leaving the inbox or hunting through a separate thread view.

---

#### **acceptance criteria:**

1. **Opening a message:** clicking any row in the Inbox or Following list opens it in a reading pane to the right, narrowing the message list to a fixed-width column beside it. The side rail (Inquiry / Voyage Estimate / Fixture / Voyage / Activity / Tags) appears further to the right and always defaults back to the **"Inquiry"** panel whenever a (possibly different) row is newly selected, regardless of which panel was showing for the previously open message.

2. **Reading pane header:** the subject line — with its reply prefix (e.g. "Re:") preserved — is shown as the page title. If the message has any earlier messages in its thread, a pill badge next to the subject shows the total message count, **"{N} messages."**

3. **Current message always expanded:** the message that was clicked is always rendered fully expanded at the top of the reading pane — sender, avatar, date, To/Cc recipients, full body text, and attachments — with no collapse control needed to see it.

4. **Earlier messages, collapsed by default:** if the thread has prior messages, they appear below a divider labelled **"{N} earlier message(s) in this conversation,"** each shown collapsed as just sender, date, and a one-line snippet. They're ordered newest-to-oldest beneath the current message (the most recent earlier message appears first).

5. **Independent expand/collapse per message:** clicking any message's header row (current or earlier) toggles that message alone between collapsed (snippet only) and expanded (To/Cc, full body, attachments) — expanding one message never affects the state of any other message in the thread.

6. **Attachments:** an expanded message with attachments shows its count (**"{N} attachment(s)"**), a "Download all" link, and one row per file — file-type icon, name, size, and Download / Open / Attach icon actions.

7. **List-row cues before opening:** in the message list itself, a row shows a small blue dot for unread messages, a light-blue tint on the row background for unread or selected rows, small reply and paperclip icons when the message has a reply or an attachment, and — if the message is part of a thread — a count pill next to the subject showing the total number of messages in that thread.

8. **List adapts when a message is open:** with a message open, the list column switches to a narrower, stacked (compact) row layout so sender, subject, and snippet still fit without overlapping the reading pane.

9. **No dedicated close control:** there's no explicit "✕"/back button on the reading pane itself. The message list stays visible (narrowed) the whole time a message is open, so the user returns to full width only by switching to a tab that clears the selection (see "Inbox / Archive / Following" story), and can jump directly between messages by clicking a different row without needing to close the current one first.

---

#### **Out of scope**

* Reply / Forward / Compose actions — no send, reply, or forward controls exist anywhere in the reading pane; this module is read-only.
* Real file downloads — the Download / Open / Attach icons and the "Download all" link on attachments are visual only; no file is actually served by this mockup.
* Follow and Archive actions in the reading pane toolbar — covered separately by the "Inbox / Archive / Following" story.
* The side rail's own panels (Inquiry, Fixture, Voyage Estimate, Activity, Tags) — each is documented as its own separate user story.
* Marking a message read/unread from opening it — a message's unread state is static seed data and does not change when the message is opened.

#### **Open items**

1. **Read/unread state doesn't update on open** — worth deciding whether opening a message should clear its unread indicator, since real mailbox behaviour typically does.
2. **No close control on the reading pane** — confirm whether an explicit close/back affordance (e.g. an "✕" next to the subject) is actually wanted, rather than relying on tab-switching to dismiss it.
3. **Attachment actions are fully decorative** — flagged here since a reviewer skimming the reading pane could reasonably expect "Download" to do something.
