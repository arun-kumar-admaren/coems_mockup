#### **USER Story:**

**As a user,**
**I want to** record and track all financial entries related to a claim — including cost allocations, settlement values, insurance thresholds, recovery amounts, and a summary snapshot — within the Financials tab of the claim overlay
**So that** the full financial picture of each claim is visible in one place, supporting recovery tracking and management reporting.

---

#### **acceptance criteria:**

1. A **Financials** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Financials tab must display the following five sections **in order**:

   ---

   ### Section 1 — Cost Allocation

3. The **Cost Allocation** section must appear first. There is no "Add Cost" button. Instead, the table must always show at least one empty row ready for input.

4. When the user enters an **Amount** value in a row, a new blank row must be automatically appended below it. This means there is always one empty row at the bottom for the next entry — there is no empty state and no manual add action required.

5. Each cost row must contain the following columns:

   | **Column** | **Type** | **Notes** |
   | --- | --- | --- |
   | Account Head | Dropdown | Options: Stevedoring, Port Expenses, Bunker Expenses, Crew Expenses, Repair & Maintenance, Survey Fees, Legal Fees, Agency Fees, Freight, Demurrage, Lashing / Securing, Cargo Handling, Insurance Premium, Other |
   | Particulars | Free text | Description of the cost item |
   | Recoverable By | Dropdown — Insurance / Client / Non-recoverable | Per-line recovery classification |
   | Invoices | Dropdown | Picks from existing invoice records in the system |
   | Amount | Numeric | Cost amount in USD; entering a value here triggers a new empty row to appear |
   | Delete | Trash icon button | Removes the cost row; the auto-appended empty row at the bottom cannot be deleted |

6. Below the last row the section must show a **"Total Costs"** subtotal in the format `USD {amount}`, right-aligned.

   ---

   ### Section 2 — Claim Values

7. The **Claim Values** section must display the following fields in a 2-column grid:

   | **Field** | **Type** | **Validation / Notes** |
   | --- | --- | --- |
   | Claim Estimate | Numeric (USD prefix) | Mandatory; changing this value must auto-derive the Claim Size unless manually overridden |
   | Claim Size | Dropdown — see options below | Mandatory; auto-derived from Claim Estimate vs Deductible; can be manually overridden; a blue note "Auto-derived from Claim Estimate" is shown when auto; an "Auto-derive" reset link appears when manually set |
   | Settlement Amount | Numeric (USD prefix) | Mandatory |
   | Settlement Currency | Dropdown — USD / EUR / GBP / SGD / AED / Other | When non-USD is selected an amber hint must appear: *"Non-USD currency — daily FX rate applied automatically by system"* |

   **Claim Size derivation rules** (applied automatically when Claim Estimate changes):

   | **Condition** | **Claim Size value** |
   | --- | --- |
   | Claim Estimate ≤ 0 | (blank) |
   | Deductible > 0 AND Estimate < Deductible | Claim notification (below deductible) |
   | Estimate < USD 75,000 | < USD 75k (small claim) |
   | USD 75,000 ≤ Estimate ≤ USD 250,000 | USD 75k – 250k (big claim) |
   | Estimate > USD 250,000 | > USD 250k (special claim) |

   ---

   ### Section 3 — Insurance Thresholds

8. The **Insurance Thresholds** section must display the following two read-only fields (lock icon shown on label):

   | **Field** | **Type** | **Notes** |
   | --- | --- | --- |
   | Deductible (from Insurance) | Read-only | Value seeded automatically from the linked insurance records in the Insurance tab; a hint reads *"Derived from linked insurance records. Edit in Insurance tab."* |
   | Deductible Exceeded Flag | Read-only, auto-calculated | Automatically set based on whether Claim Estimate or Settlement Amount exceeds the Deductible — see states below |

   **Deductible Exceeded Flag states:**

   | **Condition** | **Display** | **Style** |
   | --- | --- | --- |
   | No deductible set (deductible = 0) | "No deductible set" | Grey |
   | Estimate or Settlement ≤ Deductible | "No — Within deductible" | Green |
   | Estimate or Settlement > Deductible | "Yes — Deductible exceeded" | Red |

   A hint below reads: *"Auto-set when Claim Estimate or Settlement Amount exceeds the deductible."*

   ---

   ### Section 4 — Recovery

9. The **Recovery** section must display the following fields in a 2-column grid:

   | **Field** | **Type** | **Validation / Notes** |
   | --- | --- | --- |
   | Recovery Amount | Numeric (USD prefix) | Optional |
   | Recovery Date | Date picker | Disabled when Recovery Amount = 0; a hint reads *"Enabled once Recovery Amount is entered"* |
   | Outstanding Exposure | Read-only, auto-calculated | Formula: (Settlement Amount + Total Costs) − Recovery Amount; shown with amber highlight when > 0, green when = 0; hint shows the formula |

   ---

   ### Section 5 — Summary

10. The **Summary** section must display four KPI tiles in a row:

    | **Tile** | **Value** | **Sub-label** |
    | --- | --- | --- |
    | Total | Settlement Amount + Total Costs | "Settlement + Total Costs" |
    | Total Costs | Sum of all cost entries | "Sum of all cost entries" |
    | Net Exposure | Settlement Amount + Total Costs − Recovery Amount | "Settlement + Costs − Recovery" |
    | Recovery % | Recovery Amount ÷ Total × 100 | "Recovery ÷ Total" |

    **Tile colour rules:**
    - Net Exposure: amber when > 0; green when = 0
    - Recovery %: green when ≥ 80%; amber when > 0% and < 80%; grey when 0%

11. Below the KPI tiles a **currency note** banner must read:
    *"All values displayed and reported in USD — original currency and FX rate stored per entry for full audit trail. Daily exchange rates applied automatically by system."*

    ---

12. The **Claim Estimate** value entered in this tab must be reflected in the **Claim Estimate** column of the Claims listing page.

13. All changes in the Financials tab must be saved as part of the claim record when the user clicks **"Update Claim"**.
