#### **USER Story:**

**As a user,**
**I want to** formally document the closure of a claim — including the reason, outcome, learnings, and approval — through a dedicated Closure tab
**So that** every closed claim has a complete, auditable record of how it was resolved and what was learned.

---

#### **acceptance criteria:**

1. A **Closure** tab must appear in the Edit Claim overlay (not available in Add mode).

2. When **Claim Status ≠ Close**, a blue information banner must be shown at the top of the tab with the message: *"Closure fields will become mandatory once the Claim Status is set to Closed. You can pre-fill this tab at any time."* This banner must not block editing — all fields must be accessible before the claim is closed.

3. The Closure tab must display the following three sections in order:

   ---

   ### Section 1 — Closure Outcome

4. The **Closure Outcome** section must display the following fields in a 2-column grid (Closure Summary spans full width):

   | **Field** | **Type** | **Mandatory when Status = Close** | **Notes** |
   | --- | --- | --- | --- |
   | Closure Reason | Dropdown — Settled / Defended / Withdrawn / Time-barred / Unrecoverable / Other | Yes | |
   | Closure Date | Date picker | Yes | Cannot be earlier than the claim's created date; a hint shows the created date as the minimum |
   | Final Outcome Category | Dropdown — Commercial Resolution / Insurance Settlement / Legal Defense Success / Partial Recovery / Full Recovery / No Recovery / Other | No | |
   | Closed By | Dropdown — system users | No | Hint: *"Auto-populated when claim status is set to Closed"* |
   | Closure Summary | Textarea (full width) | Yes | Final explanation of how the claim was resolved or closed |

5. Below Closure Summary a **Closure Status Check** read-only field must be displayed with the following auto-calculated states:

   | **Condition** | **Display** | **Icon** | **Style** |
   | --- | --- | --- | --- |
   | Claim Status ≠ Close | N/A | Lock icon | Grey |
   | All mandatory fields filled | Complete | Check circle icon | Green |
   | One or more mandatory fields missing | Incomplete — lists which fields are missing | Alert circle icon | Amber |

   A hint below reads: *"Automatically assessed — Complete only when all mandatory closure fields are filled."*

   ---

   ### Section 2 — Learning & Risk

6. The **Learning & Risk** section must display the following fields:

   | **Field** | **Type** | **Mandatory** | **Notes** |
   | --- | --- | --- | --- |
   | Lessons Learned | Textarea | No | Business, operational, or legal learning from this claim |
   | Repeat Risk Flag | Dropdown — Yes / No | No | |
   | Repeat Risk Remarks | Textarea | Required when Repeat Risk Flag = Yes | Visible only when Repeat Risk Flag = Yes; hint: *"Required when Repeat Risk Flag is Yes"* |
   | Recommended Preventive Action | Textarea | No | Suggested steps to prevent recurrence |

   ---

   ### Section 3 — Governance

7. The **Governance** section must display the following fields:

   | **Field** | **Type** | **Mandatory** | **Notes** |
   | --- | --- | --- | --- |
   | Closure Approval Required | Dropdown — Yes / No | No | Default: No |
   | Closure Approved By | Dropdown — system users | Required when Closure Approval Required = Yes | Visible only when Closure Approval Required = Yes |
   | Closure Approved Date | Date picker | Required when Closure Approval Required = Yes | Visible only when Closure Approval Required = Yes; cannot be earlier than claim created date |
   | Internal Closure Notes | Textarea | No | Hint: *"Internal-only; not shared externally"* |

8. When **Closure Approval Required = Yes**, the Closure Approved By and Closure Approved Date fields must appear indented below it (visually grouped). Switching Closure Approval Required back to No must clear both fields.
