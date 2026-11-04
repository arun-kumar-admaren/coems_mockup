#### **USER Story:**

**As an administrator,**
**I want to** select "Email" from Available Integrations in Settings → Integrations and connect a shared mailbox by entering its email address, password, and the list of users who should have access to it,
**So that** I can provision shared-mailbox access for Smart Inbox centrally, without each end user having to sign in to the mailbox themselves.

---

#### **acceptance criteria:**

1. **Catalog entry:** The "Available Integrations" picker (opened via "+ Add New" on the Integrations home page) lists **Email** alongside the existing Coach Solutions and Navis entries — same row layout (logo badge, then name), same search-box filtering behaviour. Its logo is a rose-coloured "EM" monogram badge.

2. **Selecting Email:** Clicking the "Email" row closes the picker and opens a dedicated **"Add Email"** modal — a different modal from the generic "Add {Service}" API-key modal used by Coach Solutions/Navis, not a re-skin of it.

3. **Add Email modal fields, top to bottom:**
   - **Email ID** — a text input (`type="email"`), placeholder `name@company.com`.
   - **Password** — masked by default (`type="password"`), with an eye/eye-off icon inside the field to toggle visibility, same convention as the API Key field elsewhere in Integrations.
   - Directly beneath the Password field, a **persistent blue info banner** (info icon + text): *"Mockup only. In production this should use OAuth or an app-specific token instead of storing the mailbox password directly."* This is always visible — not dismissible, not conditional on any user action.
   - **Users with Access** — a scrollable checklist of every user in the mock user directory (7 names, including the demo user "Tester Adminren"), each independently toggled via its own checkbox. Beneath the list, a running counter: **"{N} user(s) selected."**

4. **No connection test/verify step.** Unlike Coach Solutions/Navis's "Test API" gate, the Email flow has no "Test"/"Verify Connection" action of any kind — this is a deliberate product decision, not an oversight.

5. **Save gating:** The **"Add Email"** button is disabled until both Email ID and Password are non-empty. Selecting at least one user is **not** required to save — a mailbox can be added with nobody granted access yet.

6. **On save:** a new mailbox record is created (email, password, granted user list). Because this is the first Email connection, an **"Email" tile** is also created on the Integrations home page grid, alongside the Coach Solutions/Navis tiles. The modal closes and returns to the Integrations home page.

7. **Email tile appearance:** logo badge ("EM", rose background), name "Email", a status row with a green dot plus **"{N} mailbox(es) connected"** (not the generic "Active" text used by the API-key integrations), and a gear icon top-right.

8. **Cancel / ✕** closes the modal without saving anything, same as every other Integrations modal.

9. **Catalog exclusivity:** once at least one mailbox is connected, "Email" no longer appears in the Available Integrations picker (excluded the same way an already-connected Coach Solutions/Navis is) — from that point on, the Email tile itself is the only entry point for adding further mailboxes or changing access (see the companion story, "Edit Email Integration — Manage Multiple Mailboxes").

---

#### **Out of scope**

* What happens once a mailbox already exists (adding a second one, editing, removing, per-mailbox access changes) — covered entirely by the companion story, "Edit Email Integration — Manage Multiple Mailboxes."
* Real OAuth or app-specific-token authentication — explicitly deferred; the in-modal disclaimer calls this out rather than the mockup attempting to implement it.
* Any live connection test or mailbox validation (no "Test API"-equivalent exists for Email, by design — see AC 4).
* Role-based restriction on who can reach Settings → Integrations at all — this mockup has no user-role/permission system (single hardcoded demo user, no login), same caveat as the base Integrations story.
* Real mailbox connectivity of any kind — saving only stores a mock record consumed by Smart Inbox (`src/app/components/smart-inbox.tsx`), it does not talk to any mail server.

#### **Open items**

1. **Role enforcement is not implemented in the mockup** — same caveat as the base Integrations story; this documents intended behaviour for the real build, not something demonstrable today.
2. **Email ID format is not validated** — the field accepts any non-empty string, not specifically a well-formed email address. Whether client-side format validation should be added is undecided.
3. **Persistence across reload** — connected mailboxes reset on refresh along with all other Smart Inbox / Integrations mock state; whether this should survive a reload for demo purposes is undecided (same open item as the base Integrations story).
