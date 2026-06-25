#### **USER Story:**

**As a user,**
**I want to** open an existing claim in a detailed edit overlay that surfaces all claim information across tabs
**So that** I can update claim details, manage linked records, and track the claim from initial notification through to closure.

---

#### **acceptance criteria:**

1. Clicking any row in the Claims listing must open the **Edit Claim** overlay as a right-side sheet panel.

2. The overlay must display a **Summary Strip** at the top (read-only fields + quick-edit fields):

   | **Field** | **Type** | **Notes** |
   | --- | --- | --- |
   | Claim Number | Read-only | Auto-generated; not editable |
   | Type of Claim | Read-only | Set at creation |
   | Type of Cover | Read-only | Set at creation |
   | Created By | Read-only | User who created the record |
   | Claim Status | Inline dropdown — Open / Close | Editable directly from the strip |
   | Priority | Inline dropdown — None / Low / Medium / High / Critical | Editable directly from the strip |

3. The overlay must display the following **tabs** in order:

   | **Tab** | **Icon** | **Availability** |
   | --- | --- | --- |
   | Overview | Info | Always visible |
   | Legal Review | FileText | Edit mode only |
   | Incidents | Link | Edit mode only |
   | Insurance | ShieldCheck | Edit mode only |
   | Financials | Banknote | Edit mode only |
   | Closure | FileSpreadsheet | Edit mode only |
   | Docs | ClipboardList | Edit mode only |

4. The **Overview tab** in edit mode must include all fields from the Add overlay plus the following additional edit-only sections:

   **Date Settled & Claim Duration** (visible in Edit mode):
   - **Date Settled** — date picker; recommended (amber hint) when Claim Status = Close
   - **Claim Duration** — read-only calculated field: Date Settled − Created Date, displayed as "X days"

   **Resolution & Security** (visible in Edit mode only):
   - Resolution Path — dropdown: Under Negotiation / Settlement / Defense / Recovery / Litigation / Arbitration / Closed without Action
   - Security Provided — dropdown: Yes / No (default: No)
   - When Security Provided = Yes, the following sub-fields appear:
     - Security Type — Letter of Undertaking (LOU) / Bank Guarantee / Club Letter / Cash Deposit / Other
     - Security Currency — USD / EUR / GBP / SGD / AED / Other
     - Security Amount — numeric
     - Security Issued Date — date picker
     - Security Released Date — date picker (must not be before Issued Date; blank = still active)
   - Resolution Notes — textarea (amber hint shown for Defense / Litigation / Arbitration / Closed without Action)

   **External Parties** (visible in Edit mode only):
   - Inline list of appointed external parties (Surveyor, Lawyer, Correspondent, Adjuster, Engineer)
   - "+ External Party" button to add a new row
   - Each party row: Type, Name, Parent Company, Date Appointed, Status (Appointed / Active / Response Received / Closed)
   - Kebab menu per party row with "Remove" action

5. The overlay header must include a **kebab menu (⋮)** with the following actions:
   - Export as PDF
   - Copy Template
   - Send as Email

6. A sticky **footer** must always be visible with:
   - **Cancel** — closes the overlay without saving
   - **Update Claim** — saves all changes

7. Closing the overlay (Cancel or X) must not save any unsaved changes.
