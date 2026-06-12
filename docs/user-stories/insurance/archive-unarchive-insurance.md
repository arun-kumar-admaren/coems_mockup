#### **USER Story:**

**As a user,**
**I want to** archive and unarchive selected insurance records from the Insurance module
**So that** I can view only the required items.

---

#### **acceptance criteria:**

1. **Archive Toggle**

   * An **"Archived"** toggle must be available in the header section of the Insurance listing page.
   * By default, the toggle is **OFF**, showing the list of active (non-archived) insurance records.
   * When switched **ON**, the user should see the list of archived insurance records.
   * Archived records must be visually highlighted with a different colour to distinguish them from non-archived items.

2. **Archive Option in the Kebab Menu**

   * A **"Archive Selected Insurance"** option must be available in the kebab menu (available in both the active list and the archived list).
   * By default, this option is **disabled**.
   * The option becomes **enabled** only when the user selects at least one **non-archived** insurance record.
   * On clicking, a confirmation pop-up must appear: *"Are you sure you want to archive the selected insurance records?"* with **Yes** and **No** buttons.
     * If **Yes**: A toast message must appear — *"Insurance record archived successfully"*. The selected records are moved to the Archived list.
     * If **No**: The pop-up closes with no changes.
   * Archived records must appear in the Archived list sorted by their **created date and time** — latest first.

3. **Unarchive Option in the Kebab Menu**

   * A **"Unarchive Selected Insurance"** option must be available in the kebab menu of the Archived list.
   * By default, this option is **disabled**.
   * The option becomes **enabled** only when the user selects at least one **archived** insurance record.
   * On clicking, a confirmation pop-up must appear: *"Are you sure you want to unarchive the selected insurance records?"* with **Yes** and **No** buttons.
     * If **Yes**: A toast message must appear — *"Insurance record unarchived successfully"*. The selected records are moved back to the active list.
     * If **No**: The pop-up closes with no changes.
   * Unarchived records must reappear in the active list sorted by their **created date and time** — latest first.

4. **Archived Mode — Mixed View**

   * When the Archived toggle is **ON**, the listing must display **all** insurance records — both archived and non-archived.
   * Archived items must be visually highlighted so users can easily identify which records can be unarchived.
   * The user can select records from both groups simultaneously:
     * Selecting a **non-archived** record enables the **Archive** option.
     * Selecting an **archived** record enables the **Unarchive** option.
     * Selecting **both archived and non-archived** records enables both options simultaneously — the system must Archive or Unarchive each record based on its current state when the respective action is confirmed.
