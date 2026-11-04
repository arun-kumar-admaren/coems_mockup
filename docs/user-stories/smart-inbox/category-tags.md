#### **USER Story:**

**As a** Smart Inbox user tagging an email,
**I want to** add free-text Category tags to an email, with previously-used categories offered back to me as suggestions,
**So that** I can label emails with the operational category that matters to my team (e.g. "Urgent," "Awaiting Client Response") without being limited to a fixed list, and reuse the same wording consistently across emails.

---

#### **acceptance criteria:**

1. **Location:** "Category" is the second facet in the Tags side-panel, directly below Job.

2. **Free-text add:** a text input ("Add category tag") plus an "Add" button let the user type any value and apply it to the open email — pressing Enter in the field submits the same way as clicking "Add." A value is only applied if it's non-empty after trimming and not already applied to this email.

3. **No auto-linked tags:** unlike Job, Category has no system-populated pills — every tag shown here was added by a user, either on this email directly or picked as a suggestion carried over from another email.

4. **Applied tags are removable:** every Category tag on the email is shown as a blue pill with its own "✕" to remove it.

5. **Growing, shared suggestion pool:** the first time any Category tag is added — on this email or any other — it's added to a single suggestion pool shared across the whole mailbox. From then on, every other email's Category section offers that same tag as a one-click suggestion chip (dashed "+ {tag}"), under the collapsible "Suggestions" toggle, so a category wording only ever needs to be typed once.

6. **Starter suggestions:** before any user has typed anything, the pool already contains four starter values — **"Urgent," "Follow-up Required," "Awaiting Client Response," "Internal Review"** — available as suggestions on every email from the start.

7. **Suggestions exclude already-applied tags:** expanding "Suggestions" on a given email only shows pool tags not already applied to that email; if none remain, it reads "No more suggestions."

8. **Filterable:** every Category tag is included in the mailbox-wide Tag filter dropdown, same as Job tags, so selecting one narrows the inbox list to emails carrying it.

9. **Session-scoped:** both the per-email applied tags and the shared suggestion pool live only in React state for the session — new categories, and their adoption across emails, all reset on a full page reload.

---

#### **Out of scope**

* Job, Follower, and Private tag facets — each documented in its own separate story.
* Any case-insensitive matching, deduplication, or normalisation of typed category text — two differently-capitalised or worded entries meaning the same thing (e.g. "urgent" vs. "Urgent") are treated as two separate pool entries.
* Deleting a category from the shared suggestion pool entirely (e.g. an admin cleanup action) — once added, a category stays in the pool for the rest of the session even if later removed from every email that had it.

#### **Open items**

1. **No case-insensitive or whitespace-normalised de-duplication** — a user who types "urgent" when "Urgent" already exists in the pool gets two separate suggestion entries that mean the same thing. Worth deciding whether to normalise before adding to the pool.
2. **No way to remove a tag from the shared suggestion pool once added**, even if it was a typo or is no longer relevant — the pool only ever grows for the life of the session.
