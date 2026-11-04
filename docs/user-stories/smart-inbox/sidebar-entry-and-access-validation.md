#### **USER Story:**

**As a** COEMS user,
**I want to** click the "AI Smart Inbox" sidebar item and land directly on my Inbox when I have mailbox access, or see a clear message telling me I don't have access when I don't,
**So that** I'm never dropped into an empty, confusing screen, and I always understand why I can or can't use the module.

---

#### **acceptance criteria:**

1. **Sidebar entry:** an **"AI Smart Inbox"** item appears in the sidebar (Administration section, positioned after "Offices" — the same slot "Smart Inbox" occupies today), shown with a mail icon and a small **"AI"** badge.

2. **Access check on click:** before navigating anywhere, clicking the item checks whether the current signed-in user has been granted access to **at least one** mailbox — i.e. appears in the granted-users list of at least one connected mailbox under Settings → Integrations → Email.

3. **Has access → navigate:** if the check passes, the app navigates to the Smart Inbox landing page with the **Inbox** view already selected as the active tab by default (not Archive, not Following).

4. **No access → validation message, no navigation:** if the check fails, clicking the sidebar item does **not** navigate away from the current screen at all. Instead, a validation message is shown telling the user they don't have mailbox access yet and to contact their admin (via Settings → Integrations → Email) to be granted access.

5. **Sidebar highlight state:** since no navigation occurs for a no-access user, the sidebar's active-item highlight must remain on whatever section the user was already viewing — "AI Smart Inbox" must never show as the selected/active item if the user was never actually taken there.

6. **Re-checked on every click:** the access check runs fresh each time the sidebar item is clicked (not cached once at app load), so a user who is granted access mid-session sees the corrected behaviour — landing in the Inbox — on their very next click, with no reload required.

7. **Distinct from the in-module empty state:** this sidebar-level check is a guard that runs *before* navigation; it does not replace Smart Inbox's own existing "No mailbox access yet" empty state, which remains in place as a fallback for any other path that could land a no-access user inside the module.

---

#### **Out of scope**

* Redesigning the in-module "No mailbox access yet" empty state — already covered by the base Smart Inbox BRD; this story only adds a check at the point of sidebar navigation, before the module is even reached.
* Any change to which mailboxes are shown once a user *with* access is inside Smart Inbox — that remains the existing admin-provisioned access model (see "Add Email Integration" and "Edit Email Integration — Manage Multiple Mailboxes").
* Role-based hiding of the sidebar item for users without a certain permission — this story is only about mailbox-access gating, not role-based navigation restrictions (no role system exists in this mockup regardless).
* Deep-linking or URL-based access to Smart Inbox bypassing the sidebar click — out of scope, as this mockup has no real client-side routing.

#### **Open items**

1. **Validation message wording, placement, and dismiss behaviour are not yet specified** — toast vs. inline banner vs. modal, exact copy, and whether it auto-dismisses all need a decision before implementation.
2. **Not yet implemented in the current mockup.** Today, clicking "Smart Inbox" in the sidebar always navigates into the module regardless of access, and the no-access state is only shown once already inside (Smart Inbox's own empty state) — see the `project_coems_smart_inbox` memory notes on the admin-provisioned access model. This story defines the target behaviour of gating at the sidebar click itself; a corresponding code change is needed to bring the mockup in line with it.
3. **Sidebar label vs. badge:** the item currently renders as the label "Smart Inbox" plus a separate "AI" badge next to it, not the single literal label "AI Smart Inbox." Whether the label text itself should change, or the existing label+badge combination already satisfies this story's naming intent, needs confirming.
