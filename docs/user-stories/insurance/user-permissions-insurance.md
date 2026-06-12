#### **USER Story:**

**As a user,**
**I want to** have role-based access control on Insurance records
**So that** only authorized users can delete Insurance records, while all users can create and edit them.

---

#### **acceptance criteria:**

1. **Create Insurance**
   * Any logged-in user, regardless of role, must be able to create a new Insurance record.

2. **Edit Insurance**
   * Any logged-in user, regardless of role, must be able to open and edit an existing Insurance record.

3. **Delete Insurance**
   * Only users with the **Admin** or **Super Admin** role must be able to delete an Insurance record.
   * For all other roles, the **Delete Insurance** option must not be visible or accessible — it must be hidden from the kebab menu (⋮) in the edit overlay.

4. The system must enforce this restriction across all entry points where deletion of an Insurance record is possible.

5. No additional checkbox or permission field is required in the User Add / Edit overlay for Insurance access — access is determined entirely by the user's existing role assignment (Admin / Super Admin).
