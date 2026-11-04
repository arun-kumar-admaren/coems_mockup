#### **USER Story:**

**As a user working in the Claims module,**
**I want to** view the total amount of the selected invoice(s) in a new **"BC"** column for each Cost Allocation line item in the Financials tab
**So that** I can quickly compare the Business Central invoice amount against the cost line item's value.

---

#### **acceptance criteria:**

1. A new column named **"BC"** must be added immediately after the **Invoices** column (and before the **Amount** column) in the **Cost Allocation** table of the Financials tab (Edit Claim overlay).

2. The **BC** column must be a **currency field** and must be **read-only / system-populated** — the user cannot type into it directly.

3. The **BC** column must display the amount of the invoice(s) selected in the **Invoices** column for that same row.
   - The value shown must be the invoice's **Additional Currency Amount**.
   - The amount must always be shown as a **positive** value, regardless of how the underlying invoice amount is signed.
   - Irrespective of the claim's or row's currency, BC must always display in **USD**, with the currency symbol shown.

4. If a **single invoice** is selected on a row, the BC value must equal the amount of that selected invoice.

5. If **multiple invoices** are selected on the same row, the BC value must be the **sum** of the amounts of all selected invoices.

6. The **BC** column must auto-populate based on the invoice(s) selected in that row's **Invoices** column — no manual entry or trigger required.

7. When an invoice is **added to or removed from** a row, the BC value must update automatically to reflect the new selection.

8. If **no invoice** is selected for a row, the BC column must display a **blank state** (no value, not `$0`).

9. The invoice amount shown in BC must always reflect the **latest amount received from Business Central** for the selected invoice(s) — it is not a static snapshot taken at the time of selection.

10. The **"Total Costs"** subtotal row at the bottom of the Cost Allocation table must also show a **"Total BC"** value — the sum of the BC column across all rows — in the same currency format, right-aligned.

11. The addition of the BC column must **not** impact any existing calculation in the Financials tab — Total Costs, Outstanding Exposure, Net Exposure, and Recovery % continue to be derived from the **Amount** column only, not from BC.

---

**Application areas In Scope**

| Application area | Details |
| --- | --- |
| Claims module — Financials tab — Cost Allocation table | New "BC" column, currency, read-only, positioned after Invoices and before Amount |

**Historical Data Behaviour:**
Not applicable — BC is derived live from invoice data at display time, not stored/backfilled independently.

**Attachments / Supporting documents:**
Reference: analogous "BC" column behaviour implemented in the Voyage module (Income/Expense tables — Port, Fixture, Voyage tabs), COEMS-15116.

**technical details:**
(To be updated by Techleads)

**NON-Functional Requirements:**

| Particulars | Name | Date | Comments |
| --- | --- | --- | --- |
| Document Owner | | | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
