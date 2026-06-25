#### **USER Story:**

**As a user,**
**I want to** track which supporting documents have been collected or are outstanding for a claim through a Documents checklist tab
**So that** I can ensure all required paperwork is in order before a claim is closed or submitted to the insurer.

---

#### **acceptance criteria:**

1. A **Docs** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Docs tab must display a **Documents Checklist** — a list of standard claim documents with a checkbox against each.

3. The following documents must appear in the checklist as a minimum:

   | **Document** | **Notes** |
   | --- | --- |
   | Notice of Claim | |
   | Survey Report | |
   | Bill of Lading | |
   | Commercial Invoice | |
   | Packing List | |
   | Letter of Protest | |
   | Port Entry / Clearance | |
   | Master's Report | |
   | Crew Statement | |
   | Photos / Evidence | |
   | Repair Invoices / Estimates | |
   | Correspondence with Claimant | |
   | Insurance Policy Copy | |
   | Legal Opinion | If applicable |

4. Each checklist item must have a **checkbox** that users can tick to mark it as received/complete.

5. When **Claim Status = Close**, all unchecked items must be visually highlighted with an amber indicator to prompt completion before closure.

6. The checklist state (which items are checked) must be saved as part of the claim record on clicking **"Update Claim"**.

7. A summary indicator (e.g. "9 / 14 documents complete") must be shown at the top or bottom of the checklist.

8. Users must be able to add **custom document items** to the checklist for a specific claim using an **"+ Add Document"** action.
