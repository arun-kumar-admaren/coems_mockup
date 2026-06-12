#### **USER Story:**

**As a user,**
**I want to** archive and unarchive selected reviews from the Legal Review module
**So that** I can view only the required items.

#### **acceptance criteria:**

* **Archive Toggle**
  * An **"Archived"** toggle must be available in the header section of the Legal Review listing page.
  * By default, the toggle is **OFF**, showing the list of active reviews.
  * When switched **ON**, the user should see the list of archived reviews.
    * The Archived reviews should be highlighted with a different color to distinguish between archived and non-archived items.

* **Archive Option in the Kebab menu**
  * A new option, **"Archive Selected Reviews"**, must be available in the kebab menu (both the Main list and the Archived list).
  * By default, this option is disabled.
  * The option becomes enabled only when the user selects at least one review (Non-Archived).
  * On clicking, a confirmation pop-up should appear: *"Are you sure you want to archive the selected reviews?"* with **Yes** and **No** buttons.
  * If the user clicks **Yes**, a toast message should appear: *"Review archived successfully"*. If **No**: The pop-up closes with no changes.
  * Archived reviews must be moved to the Archived list of the Legal Review listing page.
  * The Archived items should appear in order based on their publishing date and time.

* **Unarchive Option in the Kebab menu**
  * A new option, **"Unarchive Selected Reviews"**, must be available in the kebab menu of the Archived list.
  * By default, this option is disabled.
  * The option becomes enabled only when the user selects at least one Archived review.
  * On clicking, a confirmation pop-up should appear: *"Are you sure you want to unarchive the selected reviews?"* with **Yes** and **No** buttons.
  * If the user clicks **Yes**, a toast message should appear: *"Review unarchived successfully"*. If **No**: The pop-up closes with no changes.
  * Unarchived reviews must be moved back to the List tab of the Legal Review listing page.
  * The Unarchived items must be displayed in order based on their publishing date and time.
  * When the screen is in Archived mode, the listing must display all review line items (both archived and unarchived).
  * Archived items must be visually highlighted, allowing users to easily identify which reviews can be unarchived.

* **Selecting both Archived and Unarchived Reviews**
  * When the Archived toggle is on, the user can view both archived and non-archived reviews:
    * When the user selects a non-archived review, the **"Archive"** option should be enabled. (Normal flow)
    * When the user selects an archived review, the **"Unarchive"** option should be enabled.
    * When the user selects both archived and non-archived reviews, both options should be enabled, and the system should Archive / Unarchive based on the user's selection.
