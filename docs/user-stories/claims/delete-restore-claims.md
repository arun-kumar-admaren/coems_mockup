#### **USER Story:**

**As a user,**
**I want to** delete a claim record that was created in error and restore it if deleted accidentally
**So that** the Claims listing only contains valid records and mistakes can be undone within a recovery window.

---

#### **acceptance criteria:**

1. A **Delete** option must be accessible from:
   - The kebab menu (⋮) in the Actions column of the Claims listing
   - Within the Edit Claim overlay header kebab menu

2. Clicking Delete must show a **confirmation dialog**: *"Are you sure you want to delete this claim? This action cannot be undone."*

3. On confirmation, the claim must be:
   - Removed from the default listing
   - Marked as `deleted = true` (soft delete — record retained in the database for audit purposes)

4. A **"Show Deleted"** filter or dedicated Recycle Bin view must allow authorised users to view soft-deleted claims.

5. A **Restore** option must be available for deleted claims, returning them to the active listing with all data intact.

6. Permanent deletion (hard delete) must only be available to users with **Admin** role.

7. Deleting a claim must not delete linked incidents, insurance records, financials, or legal review records — those remain in their respective modules with the claim reference retained.

8. Only users with **Claim Manager** or **Admin** permissions may delete claims. Standard users must not see the Delete option.
