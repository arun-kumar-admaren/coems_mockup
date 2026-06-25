#### **USER Story:**

**As a user,**
**I want to** record and track all financial entries related to a claim — including estimates, actual amounts, and cost allocations — within the Financials tab of the claim overlay
**So that** the full financial picture of each claim is visible in one place, supporting recovery tracking and management reporting.

---

#### **acceptance criteria:**

1. A **Financials** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Financials tab must display the following sections:

   **Claim Amounts**

   | **Field** | **Type** | **Notes** |
   | --- | --- | --- |
   | Currency | Dropdown — USD / EUR / GBP | Applies to all financial fields |
   | Claim Estimate | Numeric | Initial estimate of the total claim value |
   | Claim Amount | Numeric | Actual claimed amount |
   | Deductible | Numeric | Applicable deductible |
   | Recoverable By | Dropdown — Insurance / Client / Non-recoverable | Overall recoverability classification for the claim |

   **Cost Allocation Table**

   | **Column** | **Type** | **Notes** |
   | --- | --- | --- |
   | Account Head | Dropdown | Cost category |
   | Particulars | Free text | Description of the cost item |
   | Recoverable By | Dropdown — Insurance / Client / Non-recoverable | Per-line recovery classification |
   | Invoice No | Free text | Reference invoice number |
   | Amount | Numeric | Cost amount |
   | Delete | Button | Remove the cost line |

3. An **"Add Cost"** button must allow adding new rows to the Cost Allocation table.

4. The Cost Allocation table must show a **running total** of all line amounts.

5. Changes to the Cost Allocation table must be saved as part of the claim record on clicking **"Update Claim"**.

6. The **Claim Estimate** shown in the listing column must reflect the value entered in this tab.
