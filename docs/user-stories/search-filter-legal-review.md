#### **USER Story:**

**As a user,**
**I want to** apply filters and perform searches on the Legal Review listing page
**So that** I can quickly find the specific reviews I need.

#### **acceptance criteria:**

1. **Search listing**
   * **"Search"** should be a Text field in the header section of the Legal Review listing page.
   * The User should be able to search reviews by entering the following items as Keywords:
     * Review Number
     * Review Type
     * Description
     * Legal Review Status
     * E Filing Number
     * Review Raised By
     * To Be Reviewed By
   * The system should accept keywords and display the relevant results.
   * The search results must display the corresponding **Review** as a line item.

2. **Filter the Listing**
   * An **'Add Filter'** option must be available in the header section of the Legal Review listing page.
   * When clicked, a list of available filters must be displayed in **alphabetical order**.
   * A **search box** must be provided to search within the filter list.
   * The filter list must be **scrollable**.
   * Filter Values and their behaviour are given below:
   * | **Filter Name** | **Filter Type / Condition** | **Comments** |
     | --- | --- | --- |
     | ID | Not Applicable (N/A) | |
     | Review No | This should be a search text box with the Checkbox list | |
     | Related To | This should be a search text box with the Checkbox list (Inquiry, Fixture, Scope) | |
     | Items | This should be a search text box with the Checkbox list | Grouped by category (Inquiry / Fixture / Scope) |
     | Review Type | This should be a search text box with the Checkbox list (Documents, NDA) | |
     | Description | This should be a search text box | Free-text keyword match |
     | Legal Review Status | This should be a search text box with the Checkbox list (To be reviewed by Legal, Under Review, Reviewed, Not Required) | |
     | E Filing Number | This should be a search text box with the Checkbox list | |
     | Due Date | This should be a Date range selector (From & To Dates) | |
     | Review Raised By | This should be a search text box with the Checkbox list | |
     | To Be Reviewed By | This should be a search text box with the Checkbox list | |
     | Created Date | This should be a Date range selector (From & To Dates) | |
   * The User should be able to select a combination of multiple filters and filter the listing.
