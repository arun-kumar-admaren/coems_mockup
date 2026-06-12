#### **USER Story:**

**As a user,**
**I want to** delete and restore insurance records within the Insurance listing page
**So that** I can manage relevant data effectively and recover deleted records when needed.

---

#### **acceptance criteria:**

1. **Delete Option**

   * A **"Delete Selected Insurance"** option must be available in the kebab menu of the **List** tab in the Insurance listing page.
   * By default, this option must be **disabled**.
   * The option becomes **enabled** only when the user selects at least one insurance record.
   * Only users with the **Admin** or **Super Admin** role can delete insurance records. For all other roles, this option must remain hidden from the kebab menu.
   * On clicking, a confirmation pop-up must appear: *"Are you sure you want to delete the selected insurance records?"* with **Yes** and **No** buttons.
     * If **Yes**: A toast message must appear — *"Insurance record deleted successfully"*. The selected records are moved to the Trash tab.
     * If **No**: The pop-up closes with no changes.
   * Deleted records must be moved to the **Trash** tab of the Insurance listing page.

2. **Trash Tab**

   * The Trash tab must display all deleted insurance records.
   * The Trash tab must include the same header functionalities as the List tab:
     * Search and Filter
     * Column Show/Hide and Reorder
   * Deleted records must appear sorted by their **deleted date and time** — latest deleted first.
   * The user must **not** be able to open or edit a record from the Trash tab.

3. **Restore Option**

   * A **"Restore Selected Insurance"** option must be available in the kebab menu of the **Trash** tab.
   * By default, this option must be **disabled**.
   * The option becomes **enabled** only when the user selects at least one record from the Trash tab.
   * On clicking, a confirmation pop-up must appear: *"Are you sure you want to restore the selected insurance records?"* with **Yes** and **No** buttons.
     * If **Yes**: A toast message must appear — *"Insurance record restored successfully"*. The selected records are moved back to the List tab.
     * If **No**: The pop-up closes with no changes.
   * Restored records must reappear in the **List** tab, sorted by their **created date and time** — latest created first.
