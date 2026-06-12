#### **USER Story:**

**As a user,**
**I want to** apply filters and perform searches on the Insurance listing page
**So that** I can quickly find the specific insurance records I need.

---

#### **acceptance criteria:**

1. **Search Listing**

   * **Search** must be a text field in the header section of the Insurance listing page.
   * The user must be able to search insurance records by entering the following items as keywords:
     * Insurance No
     * Category
     * Type of Cover
     * Insurance Type / Clause Type
     * Policy Number
     * Policy / Cover Reference
     * Broker
     * Broker Reference Number
     * Broker Contact
     * Insurer / Club
     * Leading Underwriter
     * Insurer Contact
     * Insurance Status
     * Created By
     * Remarks
   * The system must accept keywords and display the relevant results.
   * The search results must display the corresponding insurance record as a line item.

2. **Filter the Listing**

   * An **"Add Filter"** option must be available in the header section of the Insurance listing page.
   * When clicked, a list of available filters must be displayed in alphabetical order.
   * A search box must be provided to search within the filter list.
   * The filter list must be scrollable.
   * Filter values and their behaviour are given below:

   | **Filter Name** | **Filter Type / Condition** | **Comments** |
   | --- | --- | --- |
   | ID | Not Applicable (N/A) | |
   | Insurance No | Search text box with checkbox list | |
   | Category | Search text box with checkbox list (Fixture, Vessel, Crew) | |
   | Linked Entity | Search text box with checkbox list | |
   | Type of Cover | Search text box with checkbox list | Options shown depend on selected Category |
   | Insurance Type / Clause Type | Search text box with checkbox list | |
   | Policy Number | Search text box with checkbox list | |
   | Policy / Cover Reference | Search text box with checkbox list | |
   | Currency | Search text box with checkbox list (USD, EUR, GBP) | |
   | Deductible | Numeric range selector (Min & Max) | |
   | Sum Insured | Numeric range selector (Min & Max) | |
   | Total Sum Insured (TSI) | Numeric range selector (Min & Max) | |
   | Annual Premium | Numeric range selector (Min & Max) | |
   | Premium Rate (%) | Numeric range selector (Min & Max) | |
   | Broker | Search text box with checkbox list | |
   | Broker Reference Number | Search text box with checkbox list | |
   | Broker Contact | Search text box with checkbox list | |
   | Insurer / Club | Search text box with checkbox list | |
   | Leading Underwriter | Search text box with checkbox list | |
   | Insurer Contact | Search text box with checkbox list | |
   | Date of Notification to Broker | Date range selector (From & To dates) | |
   | Policy Start Date | Date range selector (From & To dates) | |
   | Policy End Date | Date range selector (From & To dates) | |
   | Insurance Status | Search text box with checkbox list (Active, Expired, Cancelled, Closed) | |
   | Created By | Search text box with checkbox list | |
   | Created Date | Date range selector (From & To dates) | |

   * The user must be able to select a combination of multiple filters to filter the listing simultaneously.
