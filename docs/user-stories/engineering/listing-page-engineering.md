#### **USER Story:**

**As a user,**
**I want to** view all engineering projects in a paginated, searchable listing table
**So that** I can quickly locate, review, and act on any engineering request without opening each one individually.

---

#### **acceptance criteria:**

1. The Engineering listing page must be accessible from the main navigation under **"Engineering"** — a separate top-level module alongside Chartering, Operations, Management, and SecureLoad, with its own left sidebar (Dashboard, Engineering, Engineering Task, Group WorkLogs, Loading Method, Engineering Type, Document Search).

2. The listing table must support the following columns. All columns below were observed visible by default in this pass; a column-settings icon lets the user show/hide and reorder them per "Engineering - Show/Hide & Reorder Columns", so exact default visibility per column was not separately confirmed.

   | **Column** | **Content** | **Notes** |
   | --- | --- | --- |
   | (checkbox) | Row-selection checkbox | Always visible; feeds the grid kebab menu's Delete/Duplicate actions |
   | ID | Internal numeric ID | |
   | Name | Project name | Clickable — opens the record's detail panel; styled in blue |
   | Eng Project Number | e.g. `UHL-P-2026-047` or a bare numeric reference (e.g. `1126156`) | |
   | Description | Free-text project description | Truncated with ellipsis if too long; dash/blank if not set |
   | Deadline | Date | "None" if not set |
   | Loading Method | e.g. Lift-On/Roll-Off | "None" if not set; sourced from the Loading Method reference list |
   | Stowage Instruction | Free text | Blank if not set |
   | Priority | Badge — Low / Medium / High | Medium shown in yellow |
   | Scope/Fixture | "Scope" or "Fixture" | "None" if the project isn't yet linked to either |
   | Scope/Fixture No | Linked Scope or Fixture reference number | "None" if not linked |
   | Vessel Type | Vessel type | Red "Unassigned" badge if not set |
   | Intended Vessel | Vessel name | Red "Unassigned" badge if not set |
   | Head Account | Client/account name | "None" if not set |
   | Progress | Percentage complete | Badge, e.g. "0 %" |
   | Created By | User name | |
   | Modified By | User name | |
   | Eng Tags | Free-text tags | Sourced from the Engineering Tags reference list; blank if none assigned |
   | Project Client | Client entity code | Sourced from the Project Client reference list; "None" if not set |
   | BC Sync Failed | true / false | Business Central sync outcome flag |
   | Version | Record version number | |
   | Project Phase | Project phase value | |
   | Project Status | Project status value | |
   | Final Performer | Assigned performer | |

3. A **status tab bar** must appear above the table with the following tabs: **All | New Inquires | Under Discussion | Request Finalized | Submitted | Revision Request | Completed | Cancelled | On Hold**. The active tab must be highlighted and filters the listing by Project Status.

4. Clicking a row's **Name** (or elsewhere in the row) must open the project's detail panel as a right-side overlay without leaving the listing page.

5. A **Search** box and an **"Add Filter"** button must appear in the top-left of the action bar — see "Engineering - Search & Filter".

6. An **"Add Engineering Project"** button must appear in the top-right of the action bar — see "Engineering - Add New Project".

7. A **"List" / "Trash"** toggle must appear next to "Add Engineering Project" to switch between active records and soft-deleted records — see "Engineering - Delete, Duplicate & Trash".

8. A grid-level kebab menu (⋮) must provide: **Delete Engineering Request**, **Duplicate Engineering Request**, **Document Manager**, **Hide Sum Row**, **Request Task Template List**.

9. A column-settings icon must appear next to the kebab menu — see "Engineering - Show/Hide & Reorder Columns".

10. The table must be horizontally scrollable when the viewport is too narrow to show all columns.

11. The listing must show a **record count** at the bottom of the table (e.g. "Found 997 records"), a **Page X of Y** indicator, Previous/Next pagination controls, and an **Items per page** selector (e.g. 100).
