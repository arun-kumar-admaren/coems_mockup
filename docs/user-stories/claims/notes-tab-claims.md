#### **USER Story:**

**As a user working on a claim,**
**I want to** add and read notes in a dedicated "Notes" tab of the claim's Edit overlay, in the same simple style as the Legal Review Notes and the Voyage module's Voyage Remarks
**So that** context on a claim can be recorded in one place, in order, without being tied to any one field, tab or free-text box on the claim.

> Client request from Lena Pickenpack (Legal), following the 27.10.2026 call: "Add tab for Notes (like the chat function in the legal review)". Modelled on **Legal Review - Notes Section (COEMS-21219)** and its follow-up that moved the section into its own tab in the Edit overlay.

---

#### **acceptance criteria:**

1. **New "Notes" tab**

   * A new **"Notes"** tab is added to the Claim **Edit overlay**, as the last tab, after Documents. The tab order becomes: Overview, Legal Review, Incidents, Insurance, Financials, Closure, Documents, Notes.
   * The Overview tab and every other existing tab are unchanged.
   * Available in **Edit mode only**, consistent with the other tabs: not shown in the New Claim (Add) overlay, whether the claim is created from the Claims module or from a Voyage. It appears once the claim has been saved and reopened.
   * The same Notes tab appears in the Edit overlay of a claim opened from the Claims listing and from the Voyage module's Incident/Claim tab.

2. **Layout**

   * Top to bottom: a list of previously added notes, **newest first**, each entry showing:
     * An **avatar-initials circle** (matching the existing style used elsewhere in the app, e.g. the task Activity tab's "TA" circle)
     * The **author's full name**
     * The **date the note was added** (`dd/mm/yyyy`)
     * The **note's text** itself
   * Below (or above) the list, a **single-line text input** where the current user types a new note, with a **submit control**.
   * When the claim has no notes yet, the list area is empty and only the input is shown.

3. **Adding a note**

   * Submitting adds the note to the top of the list, attributed to the current user and dated today.
   * The input is cleared after submit.
   * An empty or whitespace-only note cannot be submitted.

4. **Editing a note**

   * Clicking a note turns its text into an editable textarea in place, with a **checkmark icon** to save the change and an **X icon** to cancel and revert to the original text, the same confirm/cancel pattern as the Voyage Remarks and the Legal Review Notes.
   * **A user cannot edit another user's notes.** Clicking a note written by someone else does not open the editor.

5. **Deleting a note**

   * Hovering over a note reveals a **delete icon**.
   * **A user cannot delete another user's notes.** The delete icon does not appear on notes written by someone else.
   * Notes therefore support both edit and delete; they are not append-only.

6. **History**

   * Every note action is recorded in the claim's **History** (header kebab menu, "View History"), using the same pop-up and entry types as the rest of the Claims module:
     * **Adding** a note creates an **Addition** entry: field "Note", with the note's text as the new value.
     * **Updating** a note (saving an edit) creates an **Update** entry: field "Note", with the previous text and the updated text. Cancelling an edit, or saving without changing the text, creates no entry.
     * **Deleting** a note creates a **Removal** entry: field "Note", with the deleted note's text as the previous value, marked as deleted.
   * Each entry shows the user who performed the action, the date and time, the action, and the field details, exactly like the existing History entries.
   * History entries stay in the History after a note is deleted. Deleting a note removes it from the Notes tab only, not from the History.
   * Anyone who can open View History on a claim sees these entries, including users who cannot edit the claim.

7. **Notes belong to the claim**

   * Notes are stored at the claim level. Each claim has its own list of notes, and a note never appears on another claim.
   * Notes remain on the claim when it is archived and restored, or deleted and restored.

8. **Read-only access**

   * Users who can open the claim but do not have edit permission (for example the Viewer role) can **read** the notes but cannot see the input, the editor or the delete icon. This follows the existing rule that read-only users see the Edit overlay with every field read-only.

9. **Existing note-type fields stay as they are**

   * The **Internal Notes** field (Insurance tab, Metadata & Document) and **Resolution Notes** (Overview tab) are separate fields and are not changed, merged or migrated into the new Notes tab.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Claims → Edit overlay | New "Notes" tab (last tab) with a notes list, an add-note input, and edit/delete on the user's own notes |
| Claims → History pop-up | Adding, updating and deleting a note are recorded as Addition, Update and Removal entries |
| Claims → Add overlay (Claims module and Voyage) | None. The Notes tab appears only after the claim is saved |
| Claims → Insurance tab "Internal Notes", Overview "Resolution Notes" | Unchanged |
| Legal Review → Notes | Unchanged. The Claims Notes tab follows the same behaviour |

---

#### **Out of Scope:**

* Attachments or documents on a note, @mentions, and notifications when a note is added.
* Including notes in the PDF Export, Copy Template or Send as Email output.
* Searching or filtering notes.
* Any change to the History pop-up itself (layout, entry types, filters); notes only add new entries to it.
* Showing a claim's notes on the linked Legal Review, Incident or Insurance records.
* The Legal Review floating chat icon.
* The other Claims layout changes requested on the same day (field order in the Edit overlay, Claimant and Priority / Claim Status / PIC Legal moves), which are covered by separate stories.

---

#### **Open Points:**

* **Tab position:** the story places Notes last so the existing tabs do not shift. If Lena prefers it right after Overview, as in the Legal Review overlay, only the tab order changes.
* **Operations users:** her request was made for the Legal view. Confirm whether Operations users who open a claim from a Voyage should see the Notes tab, and whether they can add notes.
