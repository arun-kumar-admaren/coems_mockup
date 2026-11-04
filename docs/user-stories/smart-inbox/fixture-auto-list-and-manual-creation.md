#### **USER Story:**

**As a** chartering user working an email in Smart Inbox,
**I want to** see Fixtures that were converted from an Inquiry on this email automatically listed, and be able to create further Fixtures manually alongside them, all through a lighter, non-wizard form,
**So that** I can go from Inquiry to a fixed deal — or capture a Fixture that didn't need an Inquiry at all — without leaving the email.

---

#### **acceptance criteria:**

1. **Entry point:** the "Fixture" icon on the reading pane's side rail opens the Fixture panel for whichever email is currently open.

2. **Starting state:** if no Fixture exists yet for this email (none converted from an Inquiry, none created manually), the panel auto-opens with one blank draft tab ready to fill in — header reads "Add New Fixture," progress shows 0% Completed. If at least one Fixture already exists for the email, the panel opens on that tab instead and does **not** add an extra blank draft automatically.

3. **Three kinds of tabs in the tab bar:**
   - **Converted from Inquiry** — sparkles icon, "Converted from Inquiry" badge; created automatically the moment "Convert to Fixture" is used on an Inquiry tab elsewhere in this panel (see "Inquiry – Automatic & Manual Creation"). These can never be removed from the tab bar.
   - **Created manually** — checkmark icon once saved; a Fixture the user built and saved themselves via "Create Fixture" in this panel (AC 6).
   - **Draft (not yet created)** — labelled "New Fixture," no icon; an in-progress, unsaved Fixture.
   Clicking "+" always adds a new blank draft tab and switches to it.

4. **Form layout:** fixture fields are organised into five collapsible accordion sections — **Cargo, Chartering, Client, Voyage, Accounting** — stacked in a single scrollable panel rather than a step wizard. Cargo is expanded by default; any combination of sections can be open at once, and each toggles independently by clicking its header.

5. **Draft progress indicators:** while the active tab is still a draft, a live completion percentage ("{N}% Completed") and progress bar appear next to the title, based on how many of the form's required fields (across all five sections) are currently filled. Any section containing at least one unfilled required field shows a red alert icon in place of its step number, so the user can see at a glance which sections still need attention. Both indicators disappear once the Fixture is created.

6. **Creating a manual Fixture:** a draft tab shows **Cancel** / **"Create Fixture"** actions at the bottom. Cancel discards just that draft. "Create Fixture" generates a Fixture Number in the format `FX-[YYYY]-[NNN]` (deterministic per email + tab) if one isn't already set, and promotes the tab from a local draft into the email's saved Fixture list — the header switches from "Add New Fixture" to a clickable Fixture Number link, and the AC 5 progress indicators disappear.

7. **Opening a created Fixture record:** clicking the Fixture Number link — whether the tab was converted from an Inquiry or created manually — opens the real Fixture Detail overlay for that record.

8. **Fixtures persist once created; drafts don't:** once created or converted, a Fixture is added to the email's saved Fixture list and survives the side panel being closed and reopened for that email. A not-yet-created draft tab, by contrast, is local to the panel and lost if it remounts (same limitation already documented for manual Inquiry tabs).

9. **Multiple Fixtures per email:** there's no limit on how many Fixtures — converted, manually created, or still in draft — can exist side by side on one email; each is fully independent, with its own field data and its own Fixture Number once created.

---

#### **Out of scope**

* The field-level content of each accordion section (Cargo/Chartering/Client/Voyage/Accounting) — same field set as the standalone Fixture module's "Add New Fixture" form, not re-specified here.
* How a Fixture gets converted from an Inquiry in the first place — covered by "Inquiry – Automatic & Manual Creation."
* Marketing and Rating sections present in the standalone Fixture module's wizard — deliberately dropped from this embedded form (design rationale documented in the base Smart Inbox BRD).
* Real Fixture Number uniqueness checks, invoice issuance, or any backend-side validation beyond the required-field completion check in AC 5.

#### **Open items**

1. **Removing an already-created manual Fixture tab doesn't actually work.** The hover "✕" is shown on every non-converted tab regardless of whether it's still a draft or already created, but the remove action only ever touches the local, not-yet-created draft list. Clicking "✕" on an already-created manual tab does not remove it from the email's Fixture list — if that tab happened to be the active one, the click just silently switches the active tab to whichever one is now last, with no removal and no warning. Needs a fix: either hide "✕" once a tab is created, or wire it to properly delete a created Fixture with a confirmation step.
2. **Fixture Number uniqueness isn't guaranteed across the app** — same caveat as Cargo Number in the Inquiry story (it's a deterministic hash of the email subject plus the tab's internal id).
3. **Draft tabs are lost on side-panel remount** — same limitation already flagged for manual Inquiry tabs, re-noted here since it applies equally to in-progress Fixture drafts.
