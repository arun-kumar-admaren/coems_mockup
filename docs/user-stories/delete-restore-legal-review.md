#### **USER Story:**

**As a user,**
**I want to** delete and restore reviews within the Legal Review listing page
**So that** I can manage relevant data effectively and recover deleted reviews when needed.

#### **acceptance criteria:**

1. **Delete Option**
   * A **"Delete Selected Review"** option must be available in the kebab menu of the List tab in the Legal Review listing page.
   * By default, this option should be disabled.
   * The option becomes enabled only when the user selects at least one review line item.
   * On clicking, a confirmation pop-up should appear: *"Are you sure you want to delete the selected reviews?"* with **Yes** and **No** buttons.
   * If the user clicks **Yes**, a toast message should appear: *"Review deleted successfully"*. If **No**: The pop-up closes with no changes.
   * Deleted reviews must be moved to the **Trash tab** of the Legal Review listing page.

2. **Trash Tab**
   * The **Trash tab** should display all deleted review line items.
   * The Trash tab must include the same header functionalities as the List tab:
     * Search and Add Filter
     * Column Show/Hide and Reorder
   * The deleted items should appear in order based on their publishing date and time.
   * The user should not be able to open the line items from the Trash tab.

3. **Restore Option**
   * A **"Restore Selected Review"** option must be available in the kebab menu of the Trash tab.
   * By default, this option should be disabled.
   * The option becomes enabled only when the user selects at least one review line item.
   * On clicking, a confirmation pop-up should appear: *"Are you sure you want to restore the selected reviews?"* with **Yes** and **No** buttons.
   * If the user clicks **Yes**, a toast message should appear: *"Review restored successfully"*. If **No**: The pop-up closes with no changes.
   * Restored reviews must be moved back to the **List tab**, displayed in order based on their publishing date and time.
