#### **USER Story:**

**As a user,**
**I want to** add and manage Legal Reviews directly from the Inquiry edit overlay
**So that** all legal reviews related to an Inquiry are accessible and manageable in one place.

#### **acceptance criteria:**

1. A **"Legal Review"** tab must be available inside the Inquiry edit overlay.

2. The Legal Review tab must provide two options:
   * **Add New Review**
   * **Link Review**

3. **Add New Review**
   * Clicking **"Add New Review"** must open the same Create New Review overlay.
   * The **Related To** field in the Create New Review overlay must be pre-set to **"Inquiry"** and the current Inquiry must be pre-selected in the **Items** field.
   * On successful creation, the new review must appear as a card inside the Legal Review tab of the Inquiry.

4. **Link Review**
   * A searchable dropdown must be available allowing the user to search and select existing reviews from the Legal Review module.
   * The user can search by Review Number, Review Type, or Legal Review Status.
   * On selecting a review, it must appear as a card inside the Legal Review tab of the Inquiry.
   * Already linked reviews must not appear in the search results.

5. **Review Cards**
   * Each linked or created review must be displayed as a card inside the Legal Review tab.
   * Each card must display the following details:
     * Review Number
     * Related To
     * Review Type
     * E Filing Number
     * Due Date
     * Review Raised By
     * Legal Review Status
   * Clicking on a review card must open the **Review Edit overlay** on top of the Inquiry edit overlay.
   * Each card must have a **kebab menu (⋮)** visible on hover, containing the following option:
     * **Unassign** — Unassigns the review from this Inquiry.
       * On clicking Unassign, a confirmation pop-up must appear: *"Are you sure you want to unassign this review from the Inquiry?"* with **Yes** and **No** buttons.
       * If **Yes**: The card is removed from the tab. The review record itself is not deleted.
       * If **No**: The pop-up closes with no changes.
