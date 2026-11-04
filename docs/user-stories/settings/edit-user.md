#### **USER Story:**

**As an administrator,**
**I want to** open an existing user's record and view/edit their organisational details, permissions, and office access
**So that** I can keep access and role assignments accurate as people join, move teams, or leave.

---

#### **acceptance criteria:**

1. Clicking a row on the Users listing must open a right-side **Edit User** panel, non-modal (the listing remains visible dimmed behind it).

2. The panel header must show: an avatar circle with the user's initials, the user's full name, a **key icon** (presumed Reset/Change Password action — not directly confirmed by clicking), a **delete (trash) icon**, and a close (✕) control.

3. The panel must show the same field groups as the Add New User form (see "Settings - Add New User"), pre-filled with the user's current values:
   - **User Information:** First Name, Last Name
   - **Contact Information:** Email, Phone Number (shows "None" when not set)
   - **Organization Information:** Designation, Department, Role, Organization

4. The panel must show the same checkbox groups as the Add New User form, reflecting current state: **Active**, **Send Email Notification**, **Port Captain**, **Board of Director**, **HSE**, **Person In Charge/Project Manager**, **Person In Charge Operation**, **Port Agency Add & Edit**, **Estimate Admin**.

5. The panel must show a **Module Access** checkbox group reflecting current state. Confirmed items seen so far: **Fixture/Projects/Tasks**, **Operations**, **Voyage Estimate**, **Engineering/Engineering Tasks**, **Charts**. [Open item: the Add New User form showed **"Map"** in the same grid position where this Edit panel shows **"Charts"** — it is not yet confirmed whether Map and Charts are two distinct checkboxes both present in a longer list, or whether one screenshot was incomplete. Needs a follow-up look at the full, unclipped Module Access section on both forms.]

6. The panel must show an **"Offices With Data Access"** section with a **"+"** button to add an office, and each currently-assigned office listed with a **remove (✕)** control. Example observed: a user with `United Engineering Solutions` and `UES India` both assigned.

7. Editing any field and saving must update the corresponding row in the Users listing (Designation, Department, Roles, Is Active, PIC/Project Manager columns) without requiring a page reload. [Not directly observed: exact Save/Discard control placement and behaviour in Edit mode — the Add form's Save/Discard buttons were at the bottom; this was not confirmed for Edit mode in the screenshot reviewed.]

8. Clicking the delete (trash) icon in the panel header is presumed to delete the user record — see "Settings - Delete User" for confirmation dialog and soft/permanent-delete behaviour once verified.
