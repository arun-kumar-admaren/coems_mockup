#### **USER Story:**

**As a user,**
**I want to** show, hide, and reorder columns on the Engineering listing
**So that** I can tailor the grid to the fields I care about, consistent with other COEMS modules.

---

#### **acceptance criteria:**

1. A column-settings icon must appear in the Engineering listing's action bar, next to the grid kebab menu (⋮).

2. Clicking the column-settings icon must open a panel listing every available column (ID, Eng Project Number, Name, Deadline, Loading Method, Stowage Instruction, Priority, Scope/Fixture, Scope/Fixture No, Vessel Type, Intended Vessel, Head Account, Progress, Created By, Modified By, Eng Tags, Project Client, BC Sync Failed, Version, Project Phase, Project Status, Final Performer) with a checkbox to toggle visibility for each.

3. Unchecking a column must immediately hide it from the grid; re-checking must restore it in its prior position.

4. Columns must be reorderable (drag-and-drop) within the same panel, and the grid must reflect the new column order immediately.

5. Column visibility and order preferences must persist for the user across sessions, consistent with the show/hide/reorder behaviour already implemented for the Claims and Insurance listings.

6. The **ID** checkbox column (row-selection checkbox) must always remain visible and cannot be hidden.
