#### **USER Story:**

**As an administrator,**
**I want to** view all COEMS user accounts in a searchable listing table
**So that** I can find and manage any user's access, role, and organisational details from one place.

---

#### **acceptance criteria:**

1. The **Users** listing must be accessible from **Settings → Administration → Users** in the left-hand sidebar (Settings is reached via the gear/settings icon at the bottom of the main app sidebar).

2. The page must show a **"Users"** heading, a **Search** box, an **"Add User"** button (primary/red), and a kebab menu (⋮) next to the Add User button.

3. The listing table must display the following columns, in order:

   | **Column** | **Content** | **Notes** |
   | --- | --- | --- |
   | Name | User's full name | Rendered as a link/blue text |
   | Email/Username | Login email or username | |
   | Phone Number | Phone with country code | Blank when not set |
   | Designation | e.g. Engineer, SuperCargo | |
   | Department | e.g. Engineering | |
   | Roles | e.g. Engineer, Account Manager, Supercargo | |
   | Is Active | Yes / No | |
   | PIC/Project Manager | Yes / No | |

4. The footer must display a **record count** (e.g. "Found 89 records"), a **Page X of Y** indicator, Previous/Next pagination controls, and an **Items per page** selector.

5. Typing in the Search box must filter the listing by **Name only**.

6. Clicking **"Add User"** must open the Add New User form — see "Settings - Add New User".

7. Clicking a user row (or the Name link) must open that user's record in a right-side **Edit User** panel — see "Settings - Edit User".

8. The kebab menu (⋮) next to "Add User" must contain a single **"Delete User"** action (trash icon), shown disabled/greyed out by default. [Not directly observed: the exact row-selection mechanism that enables it (row checkboxes were not visible in the screenshots reviewed), whether a confirmation dialog appears, and whether delete is soft or permanent.]
