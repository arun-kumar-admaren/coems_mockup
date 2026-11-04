# Business Requirements Document
## Smart Inbox Module — COEMS Platform

**Document Reference:** COEMS-SIB-BRD-001  
**Version:** 1.0  
**Date:** 2026-09-24  
**Project:** COEMS (Commercial Operations & Enterprise Management System)

---

## 1. Description

The Smart Inbox is an AI-assisted shared team mailbox embedded directly inside COEMS, giving chartering and commercial teams a single place to read broker and client correspondence and turn it into structured commercial records without switching applications. It behaves like a conventional email client — conversation threading, follow/archive, tagging, and an activity log — while adding an AI layer that reads each email and, where the message contains enough commercial detail, automatically drafts an Inquiry from it.

The module enables:

- Admin-provisioned mailbox access — a shared mailbox is connected centrally in Settings, not self-served by end users signing in
- Browsing Inbox, Archive, and Following views per connected account, with keyword search and quick filters
- Reading full email conversations with Outlook-style collapsible messages
- Automatic AI extraction of an Inquiry from an email's content, with a clear "not enough data" fallback to manual entry
- Multiple Inquiries per email — one AI-created plus any number of manually created — managed as tabs
- One-click conversion of a created Inquiry into a Fixture, carrying forward cargo, client, commission, and port data
- Multiple Fixtures per email — created via Inquiry conversion or created manually — managed as tabs, using the same field content as the standalone Fixture creation UI but presented as lightweight collapsible sections rather than a step-gated wizard
- Opening the real Inquiry or Fixture detail record from within the email, exactly as it opens from the Inquiry/Fixture module listing
- Voyage Estimates grouped under whichever Inquiry or Fixture produced them, so the commercial lineage from email → Inquiry/Fixture → Estimate is visible at a glance
- A per-email Activity log (created / edited / queued / sent / seen) with commenting
- Per-email tagging across Job / Category / Follower / Private facets
- A collapsible content-panel rail so the reading pane can be widened, or the open side panel hidden, in a single click

---

## 2. Key Components

### 2.1 Account Connection (Admin-Provisioned)

Smart Inbox does **not** have its own sign-in flow. Mailbox access is entirely admin-managed from **Settings → Integrations → Email** (see the Email integration, only visible under the v2.0 mockup toggle): an admin connects one or more shared mailboxes there and grants each one to a specific list of users. Smart Inbox simply reflects whatever the current user has been granted.

**On open, Smart Inbox:**

| Condition | What the user sees |
|---|---|
| Granted access to one or more mailboxes | The Inbox loads immediately, no connection step of any kind — the **Mailboxes** list in the sidebar shows every mailbox granted to them (friendly name derived from the email address, e.g. `chartering@admaren.com` → "Chartering"), with the first one active by default and a switcher to move between them |
| Granted access to none | An empty state: icon + **"No mailbox access yet"**. No explanatory copy or self-serve add-account action |

This mirrors how a real shared mailbox is provisioned in an organisation — IT/admin connects `chartering@company.com` once and grants specific team members access, rather than each person having (or self-entering) the shared mailbox's own credentials.

---

### 2.2 Inbox Listing & Navigation

**Sidebar:**

| Element | Details |
|---|---|
| Mailboxes (N) | Collapsible section; one row per connected account, with an account-switcher check mark on the active one |
| Inbox (N) | Full message list for the active account |
| Archive | Archived messages for the active account |
| Following (N) | Messages the user has explicitly followed |

**List column (resizable, 280–640px):**

| Element | Details |
|---|---|
| Avatar | Colored initials badge, or a generic mail icon for addresses with no known contact |
| Unread indicator | Blue dot next to the avatar |
| Sender | Bold sender name/company |
| Reply / Attachment icons | Small icon row under the sender when the message is a reply and/or has an attachment |
| Subject | Reply prefix (e.g. "RE:", "AW: AW: AW:") in muted text + subject in full text |
| Thread count pill | Shown next to the subject only when the email is part of a multi-message conversation (see §2.3) — total message count |
| Snippet | First line of the latest message body |
| Tags | Colored tag pills (max shown + "+N" overflow count), flag icon if flagged |

**Top bar:**

| Element | Details |
|---|---|
| Search | Real-time keyword search across sender, subject, snippet, and tag labels |
| Show Filter | Toggles the quick-filters row; badge shows the active filter count |

**Quick filters (toggle row):** Unread, Flagged, Has attachment (combinable, applied on top of search and the active tab), plus a **Tag** dropdown (see §2.10) that filters the list to emails carrying a specific tag — any facet (Job, Category, Follower, Private) counts, and "All tags" clears it. The active-filter badge on **Show Filter** includes the tag filter when set.

---

### 2.3 Reading Pane & Conversation Threading

Selecting a row opens the reading pane. The module supports true multi-message conversations, not just a single email body.

**Current (latest) message:**
- Renders at the top, expanded by default
- Header row (avatar, sender, date) is a single click target across its full width — clicking it collapses the message to a one-line summary (avatar, sender, date, snippet) exactly like the older messages below; clicking again re-expands it
- Expanded view shows To / Cc chips, full body, and attachments (download / open / attach actions per file)
- A message-count pill (e.g. "4 messages") appears next to the subject whenever the email has earlier messages in the same conversation

**Earlier messages:**
- Listed below the current message, newest-first, each as its own bordered, independently collapsible card (collapsed by default: avatar, sender, date, one-line snippet)
- Expanding a card reveals its own To / Cc, full body, and attachments

**Demo content:** 4 of the 18 sample inbox emails carry a real multi-message conversation history (2–4 messages each), matching their existing "RE:" / "AW: AW: AW:" reply-prefixed subjects; the remainder are single-message emails.

---

### 2.4 Reading Pane Toolbar

| Element | Details |
|---|---|
| Follow / Following | Toggles whether the current email is in the "Following" list; label and styling change when active |
| Archive | Archives the current email |

---

### 2.5 Side Rail & Side Panel

A narrow icon rail sits between the reading pane and an optional wide content panel.

**Rail items (top to bottom):** Inquiry, Voyage Estimate, Fixture, Voyage, Activity, Tags. Clicking a **different** item switches to that content type and reveals the panel (un-collapsing it if hidden). Clicking the **currently active** item again collapses the panel in place; clicking it once more re-expands it — so every rail icon doubles as a one-click show/hide toggle for its own content, not just a selector.

**Show/hide toggle:** a single horizontal chevron button at the bottom of the rail also hides or reveals the currently-selected panel in one click (`»` to hide, `«` to reveal), independent of which content type is selected — re-clicking always restores the same panel that was showing. This mirrors the same collapse state as clicking the active rail icon.

**Panel width:** resizable, 480–800px.

**Row-switch behaviour:** selecting a different email always resets the side panel to **Inquiry**, expanded.

---

### 2.6 Inquiry (AI-Created & Manual, Multi-Tab)

Every email can carry **one** AI-created Inquiry plus any number of manually created ones, managed as tabs.

**Tab bar:**
- If the AI extracted enough data, the AI-created tab (Sparkles icon) is shown first and is always present
- If the AI could not, a single blank manual tab is shown by default — no blocking dialog
- **+** adds another manual tab. If the email had enough data for the AI tab, the new manual tab starts **pre-filled with the same extracted data** (Cargo Details, Client, Commissions, Ports, Freight Details, Chartering) as a starting point — only the Cargo Number is left blank, since numbering is still gated to the moment of creation. If the email had no extractable data, the new manual tab starts blank, same as the default tab.
- Manual tabs (not the AI tab) can be removed via a hover ✕ on the tab; removing the last tab closes the Inquiry panel for that email

**Sub-header (per active tab):**

| State | Display |
|---|---|
| AI-created tab | Green "AI-created" badge |
| No data yet, not created | Amber "Not Enough data to Create Inquiry, Create Manually" badge |
| Created (AI or manual) | Cargo Number rendered as a link — clicking it opens the real Inquiry Detail overlay (`InquiryDetail`, the same component used from the Inquiry module listing) |
| Not yet created, non-AI tab | "New Inquiry" placeholder label |
| Created | **Convert to Fixture** button (becomes a disabled "Converted to Fixture" state once used) |

The Cargo Number is only generated and shown once the Inquiry is actually created — never before, and never for an in-progress manual tab.

**Fields (identical structure to the standalone Inquiry module's create form):**

**Cargo Details:**

| Field | Type |
|---|---|
| Indication Type | Dropdown |
| Cargo Category | Dropdown |
| Cargo Subcategory | Dropdown |
| Cargo Name | Text |
| Base Currency | Dropdown |
| Conversion Rate As On | Date Picker |

**Client:**

| Field | Type |
|---|---|
| Related Scope | Dropdown / Search |
| Account | Dropdown / Search |
| Broker | Dropdown / Search |

**Commissions:** (multiple lines via **Add New Commission**)

| Field | Type |
|---|---|
| Choose Type | Dropdown |
| Choose Name | Text |
| Add Rate | Numeric (%) |
| Apply To | Multi-select tags |

**Port of Loading / Port of Discharge:** (multiple entries per side via **+**)

| Field | Type |
|---|---|
| Search Ports | Dropdown / Search |
| Term (Loading Terms / Discharge Term) | Dropdown |
| LAY/CAN (loading only) | Date Range |
| Unit/Number | Numeric |
| Total Volume | Numeric (cbm) |
| Total Weight | Numeric (mts) |
| Freight Ton | Numeric |
| Transit Requirements (discharge only) | Dropdown |
| Remarks | Free text |

**Cargo Measurement Summary:** auto-calculated Unit/Number, Total Volume, Total Weight, Freight Ton across all ports.

**Cargo Income/Expense:** Account Head, Particulars, Terms, Rate, Qty, Amount (auto-calculated).

**Freight Details:**

| Field | Type |
|---|---|
| Freight Calc Type | Radio (Lumpsum / Units / Volume / Weight / Freight Ton) |
| Freight Currency | Dropdown |
| Freight Rate | Numeric |
| Gross Amount | Auto-calculated, read-only |

**Chartering:**

| Field | Type |
|---|---|
| Fixed By (Offices) | Multi-select |
| Person in Charge | Multi-select (user) |
| Legal Entity | Dropdown |

**Footer:** **Cancel** / **Create Inquiry** — shown only while the active tab is not yet created. Once created (AI or manual), no Update button is shown; the record is considered final from within Smart Inbox and is edited via the real Inquiry Detail overlay instead.

---

### 2.7 Fixture (Multi-Tab, Collapsible Sections)

Fixtures are created either by **converting** a created Inquiry, or **manually** from the Fixture rail icon. Every email can carry multiple Fixtures, managed as tabs.

This creation form is deliberately **not** a copy of the standalone Fixture module's 7-step "Add New Fixture" wizard overlay — product direction was to take the same field content but present it in a lighter, embedded-in-email form, since a full multi-step wizard is more ceremony than a quick in-context capture needs. The same fields are covered, organised as collapsible sections in one scrollable panel instead of a step-gated wizard with its own left-hand navigation rail.

**Tab bar:**
- One tab per Fixture already created for this email — Sparkles icon + "Converted from Inquiry" badge for conversions, plain Check icon for manually created ones; tab label shows the Fixture Number once created, "New Fixture" while still a draft
- If no Fixture exists yet, one blank manual draft tab is shown by default
- **+** adds another manual draft tab; drafts can be removed via a hover ✕

**Title row:**
- Draft: "Add New Fixture" heading + a live **"X% Completed"** progress bar (based on 8 mandatory fields, see below)
- Created: Fixture Number rendered as a link, opening the real Fixture Detail overlay (`FixtureDetail`, the same component used from the Fixtures module listing) — no progress bar

**Sections (collapsible, one scrollable panel):** Cargo, Chartering, Client, Voyage, Accounting — five sections, each independently expandable/collapsible via its header. **Cargo is expanded by default**; the rest start collapsed. Any number of sections can be open at once — there is no forced step order.

| Section header icon | Meaning |
|---|---|
| Numbered circle (1–5) | No validation error in this section |
| Red warning circle | Contains a validation error (draft only) |

**Mandatory fields (drive validation/progress):** Cargo Name, Cargo Category, Total Volume > 0, Total Weight > 0, Freight Rate > 0, Account, Port of Loading, Port of Discharge.

**Section field content:**

**Cargo:** Fixture Type, Cargo Name, Cargo Description, Cargo Category, Cargo Subcategory, Unit/Number, Total Volume, Total Weight, Freight Ton, Cargo Relet, Freight Calc Type, Freight Currency, Freight Rate, Comments, Payment Terms, plus repeatable **Cargo Dimensions** (Cargo Name, Stowage, Stackable, Length, Breadth, Height, Volume [auto L×B×H], Weight, No of Units).

**Chartering:** Project Name, Related Scope, Fixed By (Offices), Persons In Charge, Legal Entity, Booking Date, Timezone, Fixture Status (Not Loaded / Loaded / Fixed / Completed / Cancelled), Intended Vessel Type, Intended Vessel, Final Performer, Demurrage PDPR, Demurrage Unit, Demurrage Duration, Bunker Adjustment Factor (toggle), BAF Comments.

**Client:** Head Account, Account, Shipper, Broker, Contact Emails (free-text tag input), repeatable Commission Structure (Type, Name, Rate, Apply To), Charter Party Signed / PDF / Hard Copy (checkboxes).

**Voyage:** Voyage Number, repeatable Port of Loading / Port of Discharge (Port, Unit/Number, Total Volume, Total Weight, Freight Ton, LAY/CAN or Transit Requirements), Agreement Type.

**Accounting:** Base Currency, Conversion Rate, repeatable Invoice Details table (Type, Raised By, Invoice No, Due Date, Status), and an auto-calculated Accounting Details table (Freight + Commissions → Balance Amount).

Marketing and Rating (present as steps in the standalone module's wizard) are dropped entirely from this embedded form — they were stub placeholders here and are not part of this MVP.

**Footer:** **Cancel** / **Create Fixture** — shown only for draft tabs.

**Convert-to-Fixture field mapping (from a created Inquiry):** Cargo Name/Category/Subcategory, first Port of Loading's Unit/Volume/Weight/Freight Ton, Freight Calc Type/Currency/Rate, Related Scope, Fixed By Offices, Persons in Charge, Legal Entity, Account, Broker, Commissions, both Ports (loading LAY/CAN combined from date range; discharge Transit Requirements carried over), Base Currency all carry forward automatically; Booking Date and Conversion Rate default to the moment of conversion. The resulting Fixture opens immediately in the Fixture panel.

---

### 2.8 Voyage Estimate (Grouped by Inquiry / Fixture)

Voyage Estimates are not a flat list — each is shown under the Inquiry or Fixture it was produced from, reflecting the real commercial chain (Inquiry/Fixture → Estimate).

**Group header:** Inquiry/Fixture icon, Cargo/Fixture Number, cargo name, an "INQUIRY" or "FIXTURE" type badge, and the estimate count for that group.

**Per-group table:**

| Column | Details |
|---|---|
| Estimate Number | Reference (format: EST-YYYY-NNN-N) — rendered as a link, with a small expand icon beside it; both open the same detail popup |
| Estimate Name | Route name (uses the group's actual load/discharge ports when known) |
| Vessel Name | Vessel associated with the estimate |
| Created On | Creation date |
| Created By | User who created the estimate |

**Grouping source:** one group for the email's AI-created Inquiry (if any) and one group per Fixture already created for that email (via conversion or manually) — 2–4 estimate rows per group.

**Empty state:** "No voyage estimates yet — create an Inquiry or Fixture from this email first" when the email has neither.

**Voyage Estimate detail popup:** clicking an Estimate Number (or its expand icon) opens the real Voyage Estimate workspace as a full-size pop-up (`VoyageEstimateDetail`, `src/app/components/voyage-estimate-detail.tsx`), matching the standalone Voyage Estimate module's screen:

| Area | Contents |
|---|---|
| Top tab bar | "All Estimates" + a row of other open estimate tabs (decorative), with the clicked estimate's tab active |
| Header fields | Estimate Name, Vessel, Start Date, Status, Previous Voyage, EU ETS, Running Cost, VLSFO/MGO bunker prices, EU ETS/FUEL EU toggles, Target TCE & P/L / Result / Review Checklist actions |
| Map pane | Stylised route map with numbered port pins connected by the voyage route, plus floating cards for linked fixtures (number, ports, cargo tag, amounts) |
| Particulars panel | Full P&L breakdown (Gross Freight → Profit/Loss), Bunker table (VLSFO/MGO rate/cons/cost), EU ETS Emissions summary |
| Port Calls table | Expandable per-port rows (distance/speed/draft/fuel/extra + amount) with Assign Port Calls toolbar, Suez/Kiel/Panama canal toggles, and Expand All / Collapse All |
| Port/Cargo/Voyage/Emission tabs | **Port** tab shows the full Port Income & Expense subtotal table; Cargo/Voyage/Emission are stub placeholders — *not part of this MVP* |

Only the Estimate Name and Vessel identifying the clicked row are threaded through from the grouped table; the rest of the popup's figures are illustrative static content, consistent with how `InquiryDetail`/`FixtureDetail` behave elsewhere in Smart Inbox.

---

### 2.9 Activity Panel

| Entry type | Displayed as |
|---|---|
| created | "[Actor] created this reply to message [id]" — with an "Open message" link when applicable |
| edited | "Edited by [Actor]" |
| queued | "[Actor] set message to send" |
| sent | "[Actor] sent this" |
| seen | "Seen by [Actor]" |

Each entry shows a timestamp and a type icon (pencil / chevrons / play / eye). A comment box at the bottom lets the user add a free-text note.

---

### 2.10 Tags Panel

Four independently editable tag facets. Applied tags render as removable colored chips; each facet also has a "Suggestions" toggle that expands a picklist of not-yet-applied values to add with one click.

| Facet | Source of values | How a tag is added | Auto-populated? |
|---|---|---|---|
| **Job** | Pool of job/reference tags in use across the mailbox (e.g. cargo/fixture numbers, existing job codes) | Auto, plus pick from Suggestions (no free text) | Yes — the email's linked Inquiry Cargo Number and any linked Fixture Number(s) are added automatically as read-only chips; the user can additionally attach more tags manually from the pool |
| **Category** | A growing, session-wide pool of category tags | Type free text and press Enter/Add, or pick from Suggestions | No |
| **Follower** | Fixed roster of users on the shared mailbox (the chartering team with access to this inbox) | Pick from Suggestions only (no free text — followers must be real team members) | No |
| **Private** | A growing, session-wide pool of tags personal to the current user | Type free text and press Enter/Add, or pick from Suggestions | No |

**Auto-populated Job tags:** whenever an email has an AI-created or manually created Inquiry, its Cargo Number appears as a Job tag automatically; whenever it has one or more created Fixtures (converted or manual), each Fixture Number appears too. These auto tags are read-only (not individually removable) since they reflect real linked records; manually added Job tags sit alongside them and can be removed.

**Suggestion pools grow as you use them:** adding a new Category or Private tag on any email adds it to that pool, so it appears as a Suggestion on every other email going forward — the tag vocabulary is shared across the whole mailbox, not per-email.

**Filterable:** every tag applied anywhere (Job, Category, Follower, or Private, auto or manual) is selectable from the **Tag** filter in the Quick Filters row (§2.2), narrowing the inbox list to emails carrying that tag.

---

## 3. Project Scope

### 3.1 In Scope

- Admin-provisioned mailbox access, read live from the Email integration set up in Settings → Integrations (see §2.1) — the current user automatically sees every mailbox they've been granted, with no in-Smart-Inbox connection step
- Inbox / Archive / Following views per account, with keyword search and Unread / Flagged / Has attachment quick filters
- Resizable list column and side panel
- Multi-message conversation threading with independently collapsible messages, including the currently open (latest) message
- AI-created Inquiry drafting from email content, with an explicit "not enough data" fallback state
- Multi-tab Inquiry creation per email (one AI tab + unlimited manual tabs), with add/remove
- Inquiry Cargo Number generation gated to the moment of creation
- Linking out from a created Inquiry number to the real `InquiryDetail` overlay, from a created Fixture number to the real `FixtureDetail` overlay, and from a Voyage Estimate number (or its expand icon) to the `VoyageEstimateDetail` pop-up
- Convert-Inquiry-to-Fixture with full field carry-forward
- Multi-tab Fixture creation per email (converted + manual), with add/remove
- Fixture creation form with 5 collapsible sections (Cargo, Chartering, Client, Voyage, Accounting) — Cargo expanded by default, per-section validation state, and a live completion percentage
- Voyage Estimate listing grouped under the originating Inquiry/Fixture, with an empty state when neither exists, and a full-size Voyage Estimate detail pop-up opened from any estimate row
- Per-email Activity log and commenting
- Per-email Job / Category / Follower / Private tagging, with auto-populated Job tags from linked Inquiry/Fixture records, growing suggestion pools for Category/Private, a fixed team roster for Follower, and a mailbox-wide Tag filter
- Follow and Archive actions from the reading pane toolbar
- Side-rail panel switcher with a single-click show/hide toggle that preserves the last-selected panel

### 3.2 Out of Scope

- Real mailbox/IMAP/OAuth integration — the Email integration in Settings stores a plaintext mock password (see its own notes) and Smart Inbox's inbox contents are static demo data (18 sample emails) regardless of which mailbox is "active"
- A live AI/LLM extraction backend — Inquiry auto-fill is pre-authored per demo email, not generated at runtime
- Persistence of any kind across a page reload — all state (accounts, follows, created Inquiries/Fixtures, tab state) is in-memory only
- Sending, replying to, or composing new email
- Real-time multi-user sync of inbox or created records
- The "Voyage" rail panel (placeholder, not yet built)
- Marketing and Rating fields (present in the standalone Fixture module's wizard, intentionally dropped from this embedded form)
- Full Inquiry/Fixture module CRUD (create/read only from within Smart Inbox; editing happens via the real modules)
- Manual Inquiry tab state and Fixture draft state surviving a side-panel remount (see §6 Constraints)

---

## 4. Business Drivers

- Realise the "every email should be able to automatically create an Inquiry" objective driving this module's build
- Remove manual re-keying of cargo/client/commission/port details between inbox correspondence and the Inquiry module
- Shorten the path from "broker email received" to "Inquiry created" to "Fixture fixed" to a handful of clicks inside one screen
- Give ops and management visibility into which emails have already produced commercial records, and which still need manual attention
- Demonstrate both the AI-success and AI-failure paths side by side for stakeholder review and sign-off
- Preserve full continuity with the existing Inquiry and Fixture modules by reusing their real detail-record component rather than a divergent read-only preview

---

## 5. Assumptions

- This is a front-end mockup; all inbox content, AI extraction results, and generated reference numbers are pre-authored or deterministically generated for demo purposes, not sourced from a live mail server or AI model
- Cargo Number and Fixture Number formats (`CR-[YYYY]-[NNN]`, `FX-[YYYY]-[NNN]`) and generation logic mirror the real Inquiry/Fixture modules
- The real `InquiryDetail` (`src/app/components/inquiry-detail.tsx`) and `FixtureDetail` (`src/app/components/fixture-detail.tsx`) components are reused unmodified to render Inquiry and Fixture records respectively when opened from Smart Inbox; `VoyageEstimateDetail` (`src/app/components/voyage-estimate-detail.tsx`) is a new component purpose-built for Smart Inbox that reproduces the standalone Voyage Estimate workspace's layout, since no equivalent reusable component existed in the codebase
- "AI-created" reflects that a given demo email was authored with enough commercial detail for the mock extraction to succeed — in production this would be produced by a live extraction model
- Convert-to-Fixture field mapping approximates, but is not guaranteed to be identical to, the eventual production mapping rules
- Voyage Estimate figures shown are illustrative mock line items, not calculated from real freight/cost data; in the detail pop-up only the Estimate Name and Vessel are threaded through from the clicked row, everything else (P&L, bunkers, map, port calls) is static demo content
- The Follower roster is a static list of chartering-team names standing in for "users with access to this shared mailbox" — in production this would be sourced from the COEMS user/mailbox-permission directory
- Category and Private tag suggestion pools start from a small seeded list and grow only from tags added during the current session — in production these would likely be seeded from and persisted to a shared tag vocabulary

---

## 6. Constraints

- All Smart Inbox state (follows, tags, created Inquiries/Fixtures, thread collapse state) lives only in React component state and resets on page reload; the same is true of the Email integration's connected mailboxes/grants in Settings — the two are wired together live within a session (lifted to the root `App` component) but neither persists across a reload
- The current user is a fixed constant (`"Tester Adminren"`) matching the name shown in the app's own sidebar — Smart Inbox filters granted mailboxes by exact string match against this, not a real authenticated session
- **Demo seed:** the mockup starts with one pre-connected mailbox (`chartering@uhl.com`, every user in the directory granted access) so Smart Inbox opens directly after each reload without first adding a mailbox under Settings → Integrations → Email; admins can still add, edit, or remove mailboxes there during a session, and all changes reset on reload
- Inbox content (the 18 sample emails) is the same static list regardless of which granted mailbox is active — switching mailboxes in the sidebar does not change what's shown, since there's no per-mailbox content model yet
- Manually created Inquiry tabs and Fixture draft tabs are local to their panel component; they are lost if the side panel remounts (e.g. switching to a different email and back), whereas AI-created Inquiries, converted/created Fixtures, and follow status persist for the session because that state is lifted to the top-level component — this is a known, accepted trade-off
- Because manual Inquiry tabs are not lifted, Voyage Estimate grouping only reflects the email's single AI-created Inquiry and any Fixtures already created for it — a manually created (not-yet-converted) Inquiry does not yet get its own Voyage Estimate group
- The "Voyage" side-panel entry is explicitly out of scope for this MVP and renders as a placeholder; Marketing/Rating fields are omitted from the Fixture form entirely rather than shown as placeholders
- Within the Voyage Estimate detail pop-up, only the Port tab of the Port Income & Expense panel is fully built — Cargo, Voyage, and Emission tabs render an explicit MVP-stub message rather than data
- Dropdown option lists (ports, accounts, offices, users, etc.) are static demo values, not backed by the COEMS master data services
- Category/Private tag pools and any manually added Job/Follower tags live only in React state; they reset on reload along with every other piece of Smart Inbox state

---

## 7. User Stories Reference

| Story | Description |
|---|---|
| See Granted Mailboxes | Open Smart Inbox and see every mailbox an admin has granted, with no connection step |
| Handle No Access | See the "No mailbox access yet" state when granted nothing |
| Browse Inbox / Archive / Following | Switch between mailbox views per granted mailbox |
| Search & Quick Filter | Search by keyword and filter by Unread / Flagged / Has attachment |
| Read Email Thread | Open an email and view/collapse each message in its conversation |
| Follow / Archive Email | Toggle Follow status or archive an email from the reading pane |
| View AI-Created Inquiry | See the Inquiry the AI drafted from an email's content |
| Handle Insufficient Data | See the "Not enough data" fallback and create an Inquiry manually |
| Manage Multiple Inquiries per Email | Add, switch between, and remove manual Inquiry tabs alongside the AI tab |
| Open Inquiry Record | Click a created Cargo Number to open the real Inquiry Detail overlay |
| Convert Inquiry to Fixture | Convert a created Inquiry into a Fixture with fields carried forward |
| Manage Multiple Fixtures per Email | Add, switch between, and remove Fixture tabs (converted or manual) |
| Complete Fixture Form | Expand/collapse Cargo, Chartering, Client, Voyage, and Accounting sections and fill them in with validation feedback |
| Open Fixture Record | Click a created Fixture Number to open its real detail overlay |
| View Grouped Voyage Estimates | See voyage estimates grouped under their originating Inquiry or Fixture |
| Open Voyage Estimate Detail | Click an Estimate Number or its expand icon to open the full Voyage Estimate workspace in a pop-up |
| Log Activity & Comment | View the per-email activity trail and add a comment |
| Tag an Email | Apply Job / Category / Follower / Private tags to an email, from auto-population, suggestions, or free text |
| Filter by Tag | Narrow the inbox list to emails carrying a specific tag |
| Toggle Side Panel | Show or hide the active side panel in one click from the rail |

---

## 8. Mockup Reference

The UI design and interaction flows for this module were built directly as a working React mockup embedded in the COEMS prototype (no separate Figma source).

Key source files (prototype):

1. **Smart Inbox (all listing, reading pane, and side-panel logic)** — `src/app/components/smart-inbox.tsx`
2. **Reused Inquiry Detail Overlay** — `src/app/components/inquiry-detail.tsx`
3. **Reused Fixture Detail Overlay** — `src/app/components/fixture-detail.tsx`
4. **Voyage Estimate Detail pop-up (purpose-built for Smart Inbox)** — `src/app/components/voyage-estimate-detail.tsx`
5. **Email mailbox provisioning (admin-side, Settings → Integrations)** — `src/app/components/settings-integrations.tsx`
6. **Shared `emailAccounts` state lifted for both Settings and Smart Inbox to read/write** — `src/app/App.tsx`
