#### **USER Story:**

**As a user,**
**I want to** view, link, and manage the coverage details of every insurance policy associated with a claim from within the claim's Insurance tab
**So that** the policy-to-claim relationship is fully documented — including coverage decisions, insurer communication, deductible status, and follow-up actions — without leaving the claim overlay.

---

#### **acceptance criteria:**

1. An **Insurance** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Insurance tab must display a header bar with a **"Link Insurance"** button (right-aligned) and a section title "Coverage Details" (left-aligned).

3. For each linked insurance record the tab must display a **collapsed line item row** showing:

   | **Element** | **Behaviour** |
   | --- | --- |
   | Expand / Collapse toggle (▶ / ▼) | Clicking toggles the coverage details panel below the row |
   | Insurance ID (e.g. INS-2024-001) | Styled as a blue clickable link; clicking opens the **Edit Insurance overlay** |
   | Policy Number | Display only |
   | Type of Cover | Display only |
   | Coverage Confirmed badge | Coloured badge — **Yes** (green) / **No** (red) / **Partial** (amber) / **Pending** (grey) |
   | Insurance Status badge | Coloured badge — **Active** (green) / **Pending** (amber) / **Expired** (grey) / **Cancelled** (red) |
   | Kebab menu (⋮) | Opens a dropdown with the **Unassign** action |

4. Clicking the expand toggle (or anywhere on the row except the Insurance ID link and the kebab) must open an inline **Coverage Details panel** directly below the row. The panel must contain the following five sections laid out in a 2-column grid:

   **Section 1 — Coverage Decision**

   | **Field** | **Type** | **Validation / Notes** |
   | --- | --- | --- |
   | Coverage Confirmed | Dropdown — Yes / No / Partial / Pending | Mandatory |
   | Coverage Decision Date | Date picker | Required when Coverage Confirmed ≠ Pending; disabled when Pending |
   | Coverage Decision Remarks | Textarea (full width) | Required when Coverage Confirmed = No or Partial; optional when Yes; hidden when Pending |
   | Covered Portion / Scope | Dropdown (preset options) + free text override | Required when the claim has more than one linked insurance record; amber hint shown explaining which part of the claim this policy covers |
   | Coverage Percentage (%) | Number 0–100 | Enabled only when Coverage Confirmed = Partial; disabled otherwise |
   | Coverage Limit Applied | Number | Optional |

   **Section 2 — Deductible**

   | **Field** | **Type** | **Validation / Notes** |
   | --- | --- | --- |
   | Deductible Applies | Dropdown — Yes / No | |
   | Deductible Exceeded | Dropdown — Yes / No | |

   **Section 3 — Insurer Communication**

   | **Field** | **Type** | **Validation / Notes** |
   | --- | --- | --- |
   | Insurer Response Status | Dropdown — Not Sent / Sent / Awaiting Response / Reviewed / Accepted / Rejected / Partial Acceptance | |
   | Date Sent to Insurer | Date picker | |
   | Insurer Contact Person | Free text | Name or contact details |
   | Broker Contact Person | Free text | Name or contact details |

   **Section 4 — Follow-up**

   | **Field** | **Type** | **Validation / Notes** |
   | --- | --- | --- |
   | Requires Follow-up | Dropdown — Yes / No | |
   | Next Follow-up Date | Date picker | Required when Requires Follow-up = Yes; disabled otherwise |
   | Follow-up Note | Textarea (full width) | Visible only when Requires Follow-up = Yes; mandatory in that state |

   **Section 5 — Metadata & Document**

   | **Field** | **Type** | **Validation / Notes** |
   | --- | --- | --- |
   | Primary Insurance for Claim | Dropdown — Yes / No | Only one linked insurance per claim can be set to Yes; setting any record to Yes must automatically set all other linked records to No. A green hint confirms when this record is primary; a grey hint notes if another record is already primary |
   | Active Link | Dropdown — Yes / No | |
   | Decision Attachment Available | Dropdown — Yes / No | |
   | Decision Document Reference | Free text | Reference number or document ID (e.g. M-Files ref) |
   | Internal Notes | Textarea (full width) | Internal-only; not visible to insurer or broker |

5. At the bottom of the expanded panel a **"Save & Collapse"** button must save the coverage detail values for that insurance record and collapse the panel.

6. Clicking the **Insurance ID** link in the collapsed row must open a right-side **Edit Insurance overlay** panel with the following editable fields for the underlying insurance record:

   | **Field** | **Type** |
   | --- | --- |
   | Insurance Number | Read-only |
   | Type of Cover | Dropdown |
   | Policy Number | Free text |
   | Leading Insurer | Dropdown |
   | Broker | Dropdown |
   | Broker Reference | Free text |
   | Cover From / Cover To | Date pickers |
   | Currency | Dropdown |
   | Insurance Status | Dropdown |
   | Deductible | Number |
   | Limit of Liability | Number |
   | Sum Insured | Number |
   | Remarks | Textarea |

   The overlay must have **Cancel** and **Update Insurance** actions. Saving must update the insurance record in the Insurance module (not only within the claim).

7. The **"Link Insurance"** button must open a search dropdown allowing the user to find and associate an existing insurance record with the claim. The search must match on Insurance ID, Type of Cover, Leading Insurer, Broker, and Policy Number. Already-linked records must not appear in the search results.

8. Selecting **Unassign** from the kebab menu of a linked insurance row must display a confirmation dialog before removing the link. The dialog must state: *"Are you sure you want to unassign this insurance policy from the claim? The policy record itself will not be deleted."* — with **No** (cancel) and **Yes** (confirm, red) buttons. Confirming must remove the link and collapse the row; the insurance record in the Insurance module must remain unchanged.

9. If no insurance is linked, the tab must show an empty state with a search icon and the message **"No insurance linked"** and a prompt to use the Link Insurance button.

10. The **Addl. Ins.** column in the Claims listing must reflect whether the claim has been flagged as requiring additional insurance coverage.
