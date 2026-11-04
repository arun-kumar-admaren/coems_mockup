#### **USER Story:**

**As a** Smart Inbox user with mailbox access,
**I want to** switch between an Inbox view (all messages), a Following view (only messages I've chosen to follow), and an Archive view, scoped to whichever mailbox I currently have selected,
**So that** I can quickly narrow down to the messages that matter to me without losing track of my full inbox.

---

#### **acceptance criteria:**

1. **Location:** beneath the currently active mailbox in the left rail's "Mailboxes" section, three sub-items are shown: **Inbox ({N})**, **Archive**, **Following ({N})** — the Inbox count is the total message count for that mailbox's inbox content; the Following count is the live count of messages the current user has followed.

2. **Scoped to the active mailbox:** selecting a mailbox in the "Mailboxes" list expands its Inbox/Archive/Following sub-items directly beneath it; only the active mailbox's sub-items are shown at a time, and the previously active mailbox's sub-items collapse away.

3. **Tab selection carries across mailboxes:** the active tab (Inbox/Archive/Following) is a single selection shared across whichever mailbox is active — switching mailboxes does not reset which of the three is selected, it re-renders the same tab under the newly active mailbox.

4. **Inbox tab** is the module's default landing tab and lists every message in that mailbox, subject to whatever search, quick filters, and tag filter are active (see "Search & Filter" story).

5. **Following tab** lists only messages the user has explicitly followed via the **"Follow"** toggle in the reading pane toolbar (flag icon; the label switches "Follow" ↔ "Following," and the button highlights blue while active). Un-following a message removes it from this list immediately. When nothing is followed, the list shows a flag icon with **"You're not following any emails yet"** instead of the generic no-results message.

6. **Follow state persists for the session** — it's lifted to the top-level Smart Inbox state, so it survives things like the side panel remounting, but resets on a full page reload along with the rest of the module's mock state.

7. **Archive tab always shows an empty state** — **"No messages in Archive"** — because no message can currently be archived. The Archive icon button present in the reading pane toolbar exists visually but has no action wired to it.

8. **Filtering applies to Inbox and Following only:** search, the three quick filters (Unread / Flagged / Has attachment), and the Tag filter all apply within whichever of Inbox or Following is active; none of them have any effect on Archive, since it never has rows to filter in the first place.

9. **Reading-pane continuity across tabs:** if a message is open in the reading pane and the user switches between Inbox and Following, the open message stays open — even if it wouldn't itself appear in the newly selected tab's filtered list. The reading pane is only forcibly closed when switching to Archive.

10. **Opening a message** from either Inbox or Following opens it in the reading pane and always resets the side rail's active panel back to "Inquiry" (see "Read Email & Thread" story for reading-pane behaviour itself).

---

#### **Out of scope**

* Actually moving a message into or out of Archive — the Archive button in the toolbar is present but unwired; no message can be archived in this mockup, so the Archive tab can never show content.
* Per-mailbox inbox content — every mailbox currently shares the exact same static set of 18 demo messages; there is no per-mailbox content model yet (a known constraint already documented in the base Smart Inbox BRD).
* "Sent" and "All" views — the underlying tab type (`InboxTab`) already includes `"sent"` and `"all"` values, but neither is exposed anywhere in the current UI; only Inbox, Archive, and Following are reachable.
* Any change to a message's read/unread flag from the act of opening it — opening a message does not currently flip `isUnread`.

#### **Open items**

1. **Wire up the Archive action** — decide what "archiving" a message should actually do (e.g. move it out of Inbox into a persisted Archive list, per mailbox) and implement it; today it's a placeholder button with no behaviour.
2. **"Sent" and "All"** — decide whether these should be built out as real tabs (the type already anticipates them) or dropped from the type entirely since nothing in the UI reaches them today.
3. **Reading-pane carry-over between Inbox and Following** (AC 9) may be an accidental side effect of how tab-switching clears selection, rather than a deliberate UX choice — worth confirming whether the open message should also close when switching between Inbox and Following, not just when switching to Archive.
4. **Per-mailbox inbox content** — noted above as a known limitation; whether/when this becomes a real requirement (so switching mailboxes actually changes what's shown) is undecided.
