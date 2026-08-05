#### **USER Story:**

**As an administrator,**
**I want to** maintain the Loading Method and Engineering Type reference lists
**So that** the dropdown values used across Engineering Projects and Engineering Tasks stay accurate without needing a code change.

---

#### **acceptance criteria:**

1. The **Loading Method** sidebar item must open a simple reference-data list: a Search box, an **"Add Loading Method"** button, and a table of existing values (e.g. Lift-On/Lift-Off, Roll-On/Roll-Off, Float-On/Float-Off, None, Roll-On/Lift-Off, Lift-On/Roll-Off) each with edit (pencil) and delete (trash) actions.

2. The **Engineering Type** sidebar item must open the same style of reference-data list, holding the discipline/analysis types used in the Engineering Tasks tab (e.g. Other, DPM, Sea Fastening, Lifting Plan, Stowage Plan, Feasibility, Vessel Informations, Prices, Motion Analysis, FEM Analyses, and more — 26 values total at time of writing).

3. Both lists must support pagination with a configurable **Items per page** selector.

4. Adding a new value via **"Add Loading Method"** / **"Add Engineering Types"** must make it immediately available in the corresponding dropdown on the Engineering Project form and the Engineering Tasks tab.

5. Editing a value's label must update its display everywhere it is referenced, without breaking existing project/task records that use it.

6. Deleting a value that is still in use by one or more Engineering Projects or Tasks must be blocked, or must prompt for confirmation and explain the impact, rather than silently orphaning existing records.
