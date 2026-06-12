#### **USER Story:**

**As a user,**
**I want to** open an Insurance record from the listing page
**So that** I can view the Insurance details and edit them.

---

#### **acceptance criteria:**

1. When the user clicks on an Insurance record row from the listing page, an **Edit Insurance** overlay must open.

2. The overlay must provide the following options:

   **Kebab Menu (⋮)**
   * Export
   * Delete Insurance

3. **Header Section**

   The overlay must display the following Insurance details, auto-populated from the selected record:

   | **Field** | **Editable?** |
   | --- | --- |
   | Insurance No | Read-only |
   | Insurance Category | Read-only |
   | Type of Cover | Read-only |
   | Cover Period (Cover Start Date → Cover End Date) | Read-only |
   | Insurance Status | **Editable** |
   | Created By | Read-only |

   * All fields except **Insurance Status** must be displayed in read-only mode; the user must not be able to edit them from the header.
   * **Insurance Status** must be the only field editable directly from the header section.
   * Any change made to Insurance Status in the header must also be reflected in the **Insurance Status** field inside the **Overview** tab automatically.

4. **Tabs**

   The edit overlay must have the following tabs placed below the header section:

   ---

   **Overview**

   * This tab must display all the fields entered during "Add New Insurance".
   * The user must be able to edit and update all fields.
   * All field validations must be the same as those defined in the **Add New Insurance** user story.
   * Refer to the "Add New Insurance" requirements: *Insurance — Add New Insurance*
   * A **Update Insurance** button must be available at the bottom of the overlay.
     * Clicking **Update Insurance** saves all changes made in the Overview tab and closes the overlay.
     * The updated values must immediately reflect in the Insurance listing.
   * A **Cancel** button must also be available.
     * Clicking **Cancel** closes the overlay without saving any changes. No confirmation is required.

   ---

   **Legal Review**

   * This tab must display all Legal Reviews linked to this Insurance record.
   * The Legal Review tab must provide two options:
     * **Add New Review**
     * **Link Review**
   * **Add New Review**
     * Clicking **Add New Review** must open the Create New Review overlay.
     * The **Related To** field in the Create New Review overlay must be pre-set to **Insurance** and the current Insurance No must be pre-selected.
     * On successful creation, the new review must appear as a card inside the Legal Review tab of the Insurance record.
   * **Link Review**
     * A searchable dropdown must allow the user to search and select existing reviews from the Legal Review module.
     * The user can search by Review Number, Review Type, or Legal Review Status.
     * On selecting a review, it must appear as a card inside the Legal Review tab.
     * Already linked reviews must not appear in the search results.
   * **Review Cards**
     * Each linked or created review must be displayed as a card inside the Legal Review tab.
     * Each card must display the following details:
       * Review Number
       * Related To
       * Review Type
       * E Filing Number
       * Due Date
       * Review Raised By
       * Legal Review Status
     * Clicking on a review card must open the **Review Edit overlay** on top of the Insurance edit overlay.
     * Each card must have a **kebab menu (⋮)** visible on hover, containing the following option:
       * **Unassign** — Unassigns the review from this Insurance record.
         * On clicking Unassign, a confirmation pop-up must appear: *"Are you sure you want to unassign this review from the Insurance?"* with **Yes** and **No** buttons.
         * If **Yes**: The card is removed from the tab. The review record itself is not deleted.
         * If **No**: The pop-up closes with no changes.
   * The **Update Insurance** and **Cancel** footer buttons must be hidden when the Legal Review tab is active.
