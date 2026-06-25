#### **USER Story:**

**As a user,**
**I want to** archive a claim that is no longer actively managed without permanently deleting it
**So that** the Claims listing stays focused on active records while historical claims remain accessible for reference and reporting.

---

#### **acceptance criteria:**

1. An **Archive** option must be accessible from the kebab menu (⋮) in the Actions column of the Claims listing for each record.

2. Archiving a claim must:
   - Remove the claim from the default listing view
   - Mark the record with `archived = true` in the system
   - Not delete any linked incidents, insurance records, or financial entries associated with the claim

3. A **"Show Archived"** toggle or filter option must be available in the listing to reveal archived claims.

4. When viewing archived claims, each archived row must be visually distinguished (e.g. muted row styling or an "Archived" badge).

5. An **Unarchive** option must be available for archived claims via the kebab menu or within the edit overlay.

6. Unarchiving a claim must:
   - Restore the claim to the default active listing
   - Set `archived = false`

7. Only users with the appropriate permissions (e.g. Claim Manager or Admin) may archive or unarchive claims.

8. Archiving must not be available for claims with **Status = Open** — the user must close the claim before archiving. An appropriate message must be shown if attempted.
