#### **USER Story:**

**As a** Smart Inbox user tagging an email,
**I want to** tag an email with one or more team members as Followers, picked from a fixed roster, and with free-text Private tags of my own that get suggested back to me,
**So that** I can flag who on the team should be paying attention to this email, and keep personal reminders on it that are separate from the shared Category tags.

---

#### **acceptance criteria — Follower:**

1. **Location:** "Follower" is the third facet in the Tags side-panel, below Category.

2. **Pick-only, from a fixed roster:** Follower tags can only be added by picking from a fixed list of six chartering-team names (a separate list from the Email integration's user directory in Settings) — there is no free-text input for this facet.

3. **No auto-linked tags:** like Category and Private, Follower has no system-populated pills; every Follower tag is applied manually.

4. **Suggestion UI:** clicking "Suggestions" expands or collapses dashed "+ {name}" chips for every roster name not already applied to this email; clicking one applies it. Applied Follower tags show as removable purple pills.

5. **Static roster, not shared or growing:** unlike Category/Private, the Follower roster never grows — it's always the same fixed six names, regardless of what's applied on any email.

6. **Distinct from the "Follow" toggle:** a Follower *tag* here is unrelated to the "Follow"/"Following" toggle in the reading pane toolbar (which adds the whole email to the current user's own Following tab) — tagging a teammate as a Follower doesn't add the email to their Following tab or notify them in any way; it's purely a label.

7. **Filterable:** Follower tags are included in the mailbox-wide Tag filter dropdown, same as every other facet.

---

#### **acceptance criteria — Private:**

8. **Location:** "Private" is the fourth and final facet in the Tags side-panel.

9. **Free-text add, with its own growing suggestion pool:** works exactly like Category (free-text input + "Add" button, Enter-to-submit, suggestion chips for pool values not yet applied to this email) but keeps its own separate pool, starting from two seeded values — **"Review Later," "Needs My Approval"** — and growing independently of the Category pool as new Private tags are typed anywhere in the mailbox.

10. **Removable:** applied Private tags show as amber pills with their own "✕."

11. **Filterable:** Private tags are included in the same mailbox-wide Tag filter dropdown as every other facet.

---

#### **Out of scope**

* Job and Category tag facets — each documented in its own separate story.
* Any actual user-scoping or visibility restriction on Private tags — see Open Items.
* Any notification, access change, or inbox-membership effect from adding a Follower tag.

#### **Open items**

1. **"Private" tags aren't actually private.** There's no per-user scoping anywhere in this facet — Private tags live in the same shared, per-email state as every other facet, visible to anyone who opens this email's Tags panel, and they appear in the same mailbox-wide Tag filter dropdown as Job/Category/Follower tags. The label implies personal/user-scoped visibility that isn't implemented. Needs a decision: should "Private" actually be scoped to the user who added it (hidden from others, excluded from the shared Tag filter), or should the facet be renamed to reflect what it actually does today?
2. **"Follower" tag vs. the "Follow" toggle are two unrelated features with confusingly similar names.** A Follower *tag* (this facet — roster-pick, purely a label) and the *Follow* button in the reading pane toolbar (adds the email to the current user's own Following tab) share no code, state, or behaviour. Worth considering a rename for one of the two to avoid confusion during implementation and QA.
3. **The Follower roster is a third, independent user list** in this mockup, distinct from both the Email integration's `USER_DIRECTORY` (Settings → Integrations → Email) and the module's single hardcoded `CURRENT_USER`. None of these three lists are kept in sync; whether they should eventually be a single shared user directory is undecided.
