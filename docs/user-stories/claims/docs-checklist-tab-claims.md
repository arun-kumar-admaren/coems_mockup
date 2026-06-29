#### **USER Story:**

**As a user,**
**I want to** confirm which supporting documents are available for a claim through a Documents checklist tab
**So that** I can verify the file is sufficiently complete before the claim is closed.

---

#### **acceptance criteria:**

1. A **Docs** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Docs tab must display a **Documents Checklist** section with the following fixed document items:

   | **Document** |
   | --- |
   | Claim Notice Available |
   | Damage Report Available |
   | Supporting Picture Evidence Available |
   | Bill of Lading Available |
   | Survey Report Available |
   | Invoice / Cost Documents Available |

3. Each document row must contain three elements displayed in a row:

   | **Element** | **Notes** |
   | --- | --- |
   | Document label | Left-aligned; display only |
   | Yes / No toggle | Two buttons — **Yes** and **No**; selecting Yes highlights the button green, selecting No highlights it red; unselected state is neutral grey |
   | Notes field | Free-text input; placeholder changes to *"Reason / explanation..."* when No is selected, *"Add note..."* otherwise |

4. Each row must be colour-coded based on its toggle selection:
   - **Yes** selected → green background tint with green border
   - **No** selected → red background tint with red border
   - Unanswered → neutral grey background

5. A status badge must appear in the top-right of the section header once all six rows have been answered:
   - When all are **Yes**: badge reads *"All documents available"* in green
   - When one or more are **No**: badge reads *"{n} missing · {x}/6 confirmed"* in amber

6. Below the checklist a **Required Documents Confirmed** control must appear, separated by a divider line. It must include:
   - A label: **"Required Documents Confirmed"**
   - A sub-label: *"Manual confirmation that the file is sufficiently complete for closure"*
   - A **Yes / No toggle** (same style as the checklist rows)
   - When **No** is selected: an amber hint must appear — *"Closure is not hard-blocked, but confirmation is recommended before proceeding."*

7. The checklist state (Yes/No selections, notes, and the Required Documents Confirmed toggle) must be saved as part of the claim record on clicking **"Update Claim"**.
