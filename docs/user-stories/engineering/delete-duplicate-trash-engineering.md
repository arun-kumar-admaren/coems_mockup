#### **USER Story:**

**As a user,**
**I want to** delete, duplicate, or restore an Engineering Project
**So that** I can correct mistakes, reuse a similar request as a starting point, and recover records that were removed in error.

---

#### **acceptance criteria:**

1. Selecting one or more rows (via the row checkboxes) and opening the grid kebab menu (⋮) must offer **"Delete Engineering Request"** and **"Duplicate Engineering Request"**.

2. **Delete Engineering Request** must soft-delete the selected project(s) — they disappear from the **"List"** view and appear under the **"Trash"** view.

3. **Duplicate Engineering Request** must create a copy of the selected project's details (Engineering Details, Port Details, Stowage Instructions) as a new draft project, requiring the user to confirm/adjust the Engineering Project Number before saving.

4. A **"List" / "Trash"** toggle must appear in the Engineering listing action bar. Selecting **Trash** must show only soft-deleted projects.

5. From the Trash view, the user must be able to **Restore** a project back to the List view, or **permanently delete** it.

6. Soft-deleted projects must not appear in any status tab (All / New Inquires / Under Discussion / etc.) count or listing while in Trash.
