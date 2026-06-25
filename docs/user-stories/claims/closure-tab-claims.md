#### **USER Story:**

**As a user,**
**I want to** manage the closure workflow of a claim — including resolution path, security instruments, and settlement notes — through a dedicated Closure tab
**So that** the final resolution of each claim is formally documented and traceable.

---

#### **acceptance criteria:**

1. A **Closure** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Closure tab must display the following fields:

   **Resolution**

   | **Field** | **Type** | **Values** | **Notes** |
   | --- | --- | --- | --- |
   | Resolution Path | Dropdown | Under Negotiation / Settlement / Defense / Recovery / Litigation / Arbitration / Closed without Action | Mandatory for closure |
   | Resolution Notes | Textarea | — | Amber hint displayed when Resolution Path = Defense, Litigation, Arbitration, or Closed without Action |
   | Date Settled | Date picker | — | Recommended when Claim Status = Close |
   | Claim Duration | Read-only calculated field | — | Date Settled − Created Date, displayed as "X days" |

   **Security**

   | **Field** | **Type** | **Values** | **Notes** |
   | --- | --- | --- | --- |
   | Security Provided | Dropdown | Yes / No | Default: No |
   | Security Type | Dropdown | Letter of Undertaking (LOU) / Bank Guarantee / Club Letter / Cash Deposit / Other | Visible only when Security Provided = Yes |
   | Security Currency | Dropdown | USD / EUR / GBP / SGD / AED / Other | Visible only when Security Provided = Yes |
   | Security Amount | Numeric | — | Must be > 0; validation error shown otherwise |
   | Security Issued Date | Date picker | — | |
   | Security Released Date | Date picker | — | Must be on or after Issued Date; blank = security still active |

3. When **Security Provided = No**, all security sub-fields must be hidden. Switching from Yes to No must clear previously entered security values.

4. When **Claim Status = Close** and **Date Settled** is blank, an amber hint must be shown: *"Recommended when claim is closed."*

5. Resolution Path is **mandatory** before the claim can be set to Status = Close. An amber hint must appear on the Closure tab if Status = Close but Resolution Path is not set.

6. The Closure tab must be readable by all users who can view the claim, but editable only by users with **Claim Manager** or **Admin** permissions.
