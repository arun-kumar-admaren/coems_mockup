#### **USER Story:**

**As an administrator,**
**I want to** maintain the Loading Method, Engineering Type, Engineering Tags, and Project Client reference lists
**So that** the dropdown values used across Engineering Projects and Engineering Tasks stay accurate without needing a code change.

---

#### **acceptance criteria:**

1. The **Loading Method** sidebar item must open a simple reference-data list: a Search box, an **"Add Loading Method"** button, and a table of existing values (e.g. Lift-On/Lift-Off, Roll-On/Roll-Off, Float-On/Float-Off, None, Roll-On/Lift-Off, Lift-On/Roll-Off) each with edit (pencil) and delete (trash) actions.

2. The **Engineering Type** sidebar item must open the same style of reference-data list, holding the discipline/analysis types used in the Engineering Tasks tab (e.g. Other, DPM, Sea Fastening, Lifting Plan, Stowage Plan, Feasibility, Vessel Informations, Prices, Motion Analysis, FEM Analyses, and more — 26 values total at time of writing).

3. All four lists must additionally be reachable from the platform-wide **Settings → General Settings** area, under an "Engineering" section, as cards: **Loading Method**, **Engineering Type**, **Engineering Tags**, **Engineering Project Client**.

4. **Engineering Tags** must follow the same list pattern: Search, an **"Add Engineering Tags"** button opening a panel with a single required **Engineering Tag Name** field (Save/Discard), and a table of existing tags with edit/delete actions. Empty (no tags created) at time of writing.

5. **Project Client** (the Settings card reads "Engineering Project Client"; the list page itself is titled "Project Client") must follow the same pattern: Search, an **"Add Project Client"** button opening a panel with a single required **Project Client Name** field (Save/Discard), and a table of existing values with edit/delete actions. Values at time of writing: UHL-Chartering, UHL-Wind, UHL-Projects, UML, UWL, UHT, Nauticore, UES.

6. All four lists must support pagination with a configurable **Items per page** selector.

7. Adding a new value to any list must make it immediately available in the corresponding dropdown/field elsewhere in the module — Loading Method and Engineering Type on the Engineering Project form and Engineering Tasks tab; Engineering Tags and Project Client on the Details tab and as listing columns.

8. Editing a value's label must update its display everywhere it is referenced, without breaking existing project/task records that use it.

9. Deleting a value that is still in use by one or more Engineering Projects or Tasks must be blocked, or must prompt for confirmation and explain the impact, rather than silently orphaning existing records.
