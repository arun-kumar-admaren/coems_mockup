#### **USER Story:**

**As a user,**
**I want to** search and filter the Claims listing by multiple dimensions
**So that** I can quickly narrow down to the specific claims I need to act on without scrolling through the entire list.

---

#### **acceptance criteria:**

1. A **search bar** must be present in the action bar, searching across:
   - Claim No
   - Claim Title / Description
   - Vessel

2. Search must be **live** (results update as the user types) and **case-insensitive**.

3. A **Filters** button must open a filter popover with the following filter options:

   | **Filter** | **Type** | **Options** |
   | --- | --- | --- |
   | Claim Context | Dropdown | All Contexts / Standalone / Incident Related |
   | Claim Type | Dropdown | All Types + all Claim Type values |
   | Status | Dropdown | All Statuses / Open / Close |
   | Vessel | Dropdown | All Vessels + dynamic list from existing claims |

4. When one or more filters are active, the **Filters** button must change its visual style (blue background/border) to indicate active filters.

5. A **"Clear All"** link must appear inside the filter popover when any filter is active. Clicking it resets all filters and the search bar simultaneously.

6. The **quick filter tab bar** (All | Open | Close) and the **Status filter** in the popover must remain in sync — selecting one updates the other.

7. The listing must update in real time as filters are applied — no "Apply" button required.

8. The record count at the bottom of the table must reflect the filtered count vs total (e.g. "Found 3 records — 3 of 12 total").
