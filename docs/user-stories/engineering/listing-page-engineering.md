#### **USER Story:**

**As a user,**
**I want to** view all engineering projects in a searchable, filterable listing table
**So that** I can quickly locate, review, and act on any engineering request without opening each one individually.

---

#### **acceptance criteria:**

1. The Engineering listing page must be accessible from the main navigation under **"Engineering"** (a separate top-level module alongside Chartering, Operations, Management, and SecureLoad).

2. A **status tab bar** must appear above the table with the following tabs: **All | New Inquires | Under Discussion | Request Finalized | Submitted | Revision Request | Completed | Cancelled | On Hold**. The active tab must be highlighted and filters the listing by Project Status.

3. The listing table must display the following columns, in order:

   | **Column** | **Content** | **Notes** |
   | --- | --- | --- |
   | ID | Internal numeric ID | |
   | Eng Project Number | e.g. `UHL-P-2026-047` | Clickable — opens the record's detail panel |
   | Name | Project name | |
   | Deadline | Date; "None" if not set | |
   | Loading Method | e.g. Lift-On/Roll-Off; "None" if not set | |
   | Stowage Instruction | Free text; blank if not set | |
   | Priority | Badge — Low / Medium / High | |
   | Scope/Fixture | "Scope" or "Fixture" | Indicates which record type the project is linked to |
   | Scope/Fixture No | Linked Scope or Fixture reference number | |
   | Vessel Type | Vessel type; "Unassigned" badge if not set | |
   | Intended Vessel | Vessel name; "Unassigned" badge if not set | |
   | Head Account | Client/account name; "None" if not set | |
   | Progress | Percentage complete | |
   | Created By | User name | |
   | Modified By | User name | |
   | Eng Tags | Free-text tags | |
   | Project Client | Client name | |
   | BC Sync Failed | true/false flag | |
   | Version | Record version number | |
   | Project Phase | Project phase value | |
   | Project Status | Project status value | |
   | Final Performer | Assigned performer | |

3. Clicking on a row's **Eng Project Number** (or elsewhere in the row) must open the project's detail panel as a right-side overlay without leaving the listing page.

4. A **"List"** and **"Trash"** toggle must appear in the action bar to switch between active records and soft-deleted (Trash) records — see "Engineering - Delete, Duplicate & Trash".

5. A grid-level kebab menu (⋮) must provide: **Delete Engineering Request**, **Duplicate Engineering Request**, **Document Manager**, **Hide Sum Row**, **Request Task Template List** — see "Engineering - Delete, Duplicate & Trash" and "Engineering - Reference Lists".

6. A column show/hide icon must appear next to the kebab menu — see "Engineering - Show/Hide & Reorder Columns".

7. The table must be horizontally scrollable when the viewport is too narrow to show all columns.

8. The listing must show a **record count** at the bottom of the table (e.g. "Found 949 records") and support pagination with a configurable **Items per page** selector and Previous/Next controls.

9. An **"Add Engineering Project"** button must appear in the top-right of the action bar — see "Engineering - Add New Project".
