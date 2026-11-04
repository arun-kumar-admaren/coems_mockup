#### **USER Story:**

**As a** Smart Inbox user,
**I want to** see a chronological activity trail for the open email — who drafted, queued, sent, and viewed it — and add my own comment alongside it,
**So that** I have context on what's happened with this email and can leave notes for my team without leaving the reading pane.

---

#### **acceptance criteria:**

1. **Entry point:** the "Activity" icon on the side rail opens this panel for the currently open email.

2. **Activity feed:** lists every activity event recorded for this email, each shown with a type-specific icon and a line describing who did what:
   - **Created** (pencil icon) — "**{Actor}** created this {detail}" (e.g. "created this reply to message 892104223").
   - **Edited** (pencil icon) — "Edited by **{Actor}**."
   - **Queued** (double-chevron icon) — "**{Actor}** set message to send."
   - **Sent** (play icon) — "**{Actor}** sent this."
   - **Seen** (eye icon) — "Seen by **{Actor}**."
   Every entry also shows a right-aligned timestamp, and all entries are grouped under a single **"Today"** heading.

3. **"Open message" shortcut:** an activity entry representing the creation of a reply (e.g. "created this reply to message {id}") additionally shows an **"Open message"** link beneath it.

4. **Comment box:** a text field at the bottom of the panel, labelled "Type a comment," with a send button (up-arrow icon) beside it, for leaving a note on this email.

---

#### **Out of scope**

* Any activity type beyond the five already modeled (created / edited / queued / sent / seen) — there's no activity entry for in-app actions like creating an Inquiry/Fixture, adding a tag, or following the email.
* Real date-based grouping of activity entries — every entry is shown under a single static "Today" heading regardless of its own recorded time.
* Live email-server events — the activity trail is pre-authored per demo email, not generated from a real send/receive pipeline.

#### **Open items**

1. **Posting a comment doesn't actually do anything.** Clicking the send button only clears the comment input — it doesn't add the typed text to the activity feed, store it anywhere, or associate it with the email in any way, and there's no Enter-to-submit on the field either. This needs to be wired up: a submitted comment should likely append a new entry to the activity list (current user as actor, current time), consistent with how the feed already displays every other actor/time event.
2. **"Open message" is not wired to anything** — the link renders but has no click handler, so it can't actually jump to or open the referenced message.
3. **No affordances beyond plain text on the comment box** — no character limit, @mention support, or attachment option; deferred until the box is made functional per Open Item 1.
