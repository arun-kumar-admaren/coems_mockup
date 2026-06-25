#### **USER Story:**

**As a user,**
**I want to** manage external parties appointed to a claim (surveyors, lawyers, adjusters, etc.) directly within the claim record
**So that** all parties involved in investigating or resolving a claim are tracked in one place alongside their appointment date and current status.

---

#### **acceptance criteria:**

1. An **External Parties** section must appear in the **Overview tab** of the Edit Claim overlay (not visible in Add mode).

2. The section must include an **"+ External Party"** button that adds a new empty party row inline.

3. Each external party row must contain the following fields:

   | **Field** | **Type** | **Values / Notes** |
   | --- | --- | --- |
   | Type | Dropdown | Surveyor / Lawyer / Correspondent / Adjuster / Engineer |
   | Name | Free text | Full name of the individual |
   | Parent Company | Free text | Company or firm they represent |
   | Date Appointed | Date picker | Date the party was formally appointed |
   | Status | Dropdown | Appointed / Active / Response Received / Closed |

4. Each party row must have a **kebab menu (⋮)** with a **Remove** option. Clicking Remove must immediately remove that row from the list (with confirmation dialog if data has been entered).

5. When no external parties have been added, the section must display an empty state message: *"No external parties added. Click '+ External Party' to add one."*

6. External parties are saved as part of the claim record on clicking **"Update Claim"**.

7. Multiple parties of the same type may be added to a single claim (e.g. two surveyors from different firms).

8. The External Parties section must be visible to all users who can view the claim, but only editable by users with **Claim Manager** or **Admin** permissions.
