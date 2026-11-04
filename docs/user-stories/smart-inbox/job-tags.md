#### **USER Story:**

**As a** Smart Inbox user tagging an email,
**I want** Job tags to automatically reflect the Inquiry/Fixture records already linked to this email, and be able to add further Job tags by picking from an existing list,
**So that** every email carries a reliable record-identity tag without me having to type numbers by hand, while still being able to flag it against other known job references.

---

#### **acceptance criteria:**

1. **Location:** the "Job" section is the first facet shown in the Tags side-panel (opened via the side rail's "Tags" icon) for the currently open email.

2. **Auto-linked tags:** the email's Cargo Number (if an Inquiry has been created on it) and the Fixture Number of every Fixture already created on it are shown automatically as emerald-coloured pills at the top of the Job section — no manual action required, and they update live the moment an Inquiry or Fixture is created elsewhere on this same email. These auto-linked pills have no remove control (hovering shows the tooltip "Auto-linked from this email's Inquiry/Fixture") — they can't be removed directly.

3. **Manually added tags:** beneath the auto-linked pills, any Job tags the user has manually applied are shown the same way, but with a remove ("✕") control on each.

4. **Pick-only, no free text:** Job tags can only be added by picking from a fixed suggestion pool — there is no free-text input for this facet, unlike Category and Private. Clicking "Suggestions" expands or collapses a list of dashed "+ {tag}" chips for every pool tag not already shown (whether auto-linked or manually applied); clicking one applies it immediately. If every pool tag is already shown, expanding reads "No more suggestions."

5. **Suggestion pool source:** the Job pool is the fixed set of tag labels already used as static demo tags across the inbox's seed emails (e.g. labels like "CP-DRAFT"). It is a different list from the auto-linked Cargo/Fixture numbers (AC 2), and it does not grow from newly created Inquiries/Fixtures or from tags applied on other emails.

6. **Filterable:** every Job tag — auto-linked or manually applied — is included in the mailbox-wide Tag filter dropdown (in the Quick Filters row), so selecting one narrows the inbox list to only emails carrying that tag, from any email.

7. **Per-email, session-scoped state:** manually applied Job tags are tracked per email and persist for the session (lifted to the top-level Smart Inbox state), surviving the side panel being closed and reopened for that same email, but reset on a full page reload along with the rest of the module's mock state.

---

#### **Out of scope**

* Category, Follower, and Private tag facets — each documented in its own separate story.
* Expanding the Job suggestion pool dynamically as new Inquiries/Fixtures are created — see Open Items.
* Any server-side tag taxonomy or validation — the suggestion pool is a fixed, hardcoded list derived once from the seed inbox data.

#### **Open items**

1. **The Job suggestion pool doesn't grow with real activity.** A newly generated Cargo/Fixture Number from today's session never appears as a pickable suggestion, since the pool is computed once from static seed data and the auto-linked pills (AC 2) are a separate, non-overlapping mechanism. Worth deciding whether these two sources should eventually merge into one dynamic, ever-growing pool, the way Category and Private tags already work.
2. **No way to remove an auto-linked tag directly**, even if the user wants to stop surfacing a particular Inquiry/Fixture association on this email without deleting the underlying record — confirm whether that's the intended behaviour or a gap.
