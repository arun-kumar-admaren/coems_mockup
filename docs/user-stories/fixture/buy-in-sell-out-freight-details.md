#### **USER Story:**

**As a Chartering user working on a Fixture where the cargo has been relet,**
**I want to** split the Fixture's Freight Details into a Sell Out leg (what I charge the cargo interest) and a Buy In leg (what I pay to charter in the tonnage that actually performs the carriage)
**So that** I can see my margin on the deal at a glance, and have that margin flow correctly into the Fixture's accounting as income (Sell Out) versus expense (Buy In).

> Verified directly against the live test environment (`coems.bctesting.admaren.org`), Fixture **UES-F-2026-1418**, Accounting tab — this documents confirmed, already-built behaviour, not a request for new functionality. Every figure below was cross-checked against the fixture's actual stored data (see acceptance criteria 6–8 for the exact arithmetic).

---

#### **acceptance criteria:**

1. **Trigger — Cargo Relet**

   The Accounting tab has a **Cargo Relet** field (Yes / No / Not Checked). Buy In can only be enabled when Cargo Relet = **Yes**. Hovering the info icon next to "Freight Details" when Buy In is not yet enabled shows the tooltip: *"Select 'Yes' in 'Cargo Relet' to enable Buy In."*

2. **The Freight Details toggle**

   * **Toggle off** — Freight Details shows a single flat field set: Freight Calc Type, Freight Currency, Freight Rate, Gross Amount, Transit Requirements, Comments, Payment Terms. This is the pre-existing, un-split behaviour and is what every Fixture without Buy In enabled still shows.
   * **Toggle on** (only reachable when Cargo Relet = Yes) — Freight Details splits into two named blocks, **Sell Out Details** and **Buy In Details**, described below.

3. **Sell Out Details = the original Freight Details, unchanged**

   Enabling Buy In does not create a new commercial record — it relabels the Fixture's existing freight terms as the Sell Out leg. On UES-F-2026-1418: Freight Calc Type = Units, Freight Currency = US Dollar, Freight Rate = $824,132, Gross Amount = **$16,482,640** — identical to what a non-Buy-In Fixture's plain Freight Details would show for the same terms.

4. **Buy In Details = the new, independently-priced leg**

   * **Freight Calc Type (Buy In)** is selected independently of Sell Out's — on this Fixture, Sell Out uses Units while Buy In uses Lumpsum, confirming the two legs can be priced on entirely different bases.
   * **Freight Rate (Buy In)** and **Gross Amount (Buy In)** are entered separately — $100,000 / $100,000 on this Fixture.
   * **Balance** is a read-only, live-calculated field: `Sell Out Gross Amount − Buy In Gross Amount`. Confirmed exactly: $16,482,640 − $100,000 = **$16,382,640**, matching the field's displayed value precisely.
   * **Comments (Buy In)** is a separate comments field from Sell Out's.

5. **Sell Out and Buy In both flow into the Accounting Details ledger, as income and expense respectively**

   The Accounting tab's "Accounting Details" section has a **Freight Charge** cost-category group. On this Fixture it contains four lines: Freight (Sell Out, $16,482,640), Freight (Buy-in, $100,000), Additional Freight ($25,000), and Detention / Demurrage ($15,000), with a subtotal of **$16,422,640**.

   That subtotal only reconciles if Buy-in is subtracted while every other line is added:
   `16,482,640 + 25,000 + 15,000 − 100,000 = 16,422,640` — exact match.

   This confirms, arithmetically, that **Sell Out freight posts as income** (adds to the subtotal) and **Buy In freight posts as an expense** (subtracts from the subtotal) in the Fixture's accounting — even though the Buy In line itself is displayed as a plain positive figure in the ledger row.

6. **Commissions are computed on Sell Out only, never on Buy In**

   Every commission rule on the Fixture (USG HQ Management Fee 5%, Broker "Aertssen Kranen" 8%, Customer "Acacia Steel" 10%, Broker "AD Swiss Shipbrokers" 6%, Office "UES India" 10%) generates two calculated lines each — one based on "Freight" (Sell Out) and one based on "Additional Freight" — and no line at all based on Buy In. Verified exactly for every rule, e.g. USG HQ: 5% × $16,482,640 = $824,132 (the "(Freight)" line) and 5% × $25,000 = $1,250 (the "(Additional Freight)" line); all ten lines sum to the shown Commission subtotal of **$-6,437,980**. This is consistent with normal commercial practice — a company doesn't pay its broker or office a cut of its own cost (Buy In), only of what it earns (Sell Out and any Additional Freight).

7. **"Total Income & Expense" is the Fixture's net P&L, and already includes Buy In as a deduction**

   The figure shown at the foot of Accounting Details (**$10,424,200.4** on this Fixture) is the sum of every subtotal in the section — Freight Charge (net, already including the Buy In deduction), Commission, and each port's Miscellaneous Income/Expense group:

   ```
   16,422,640 (Freight Charge, net of Buy In)
   - 6,437,980 (Commission)
   +   109,940 (Cargo)
   +    67,400 (Lisboa)
   +   132,500 (Syros Island)
   +    60,500 (Jeddah)
   +    69,200 (Mogadishu)
   = 10,424,200.4
   ```

   A second value, **$0**, is shown alongside it. Its source could not be confirmed from the UI in this pass — see Out of Scope.

8. **Per-port Miscellaneous entries are explicitly tagged Income or Expense**

   Separately from Freight Charge, each port group (Cargo, Lisboa, Syros Island, Jeddah, Mogadishu) contains manually-added "Miscellaneous Income (INCOME)" and "Miscellaneous Expense (EXPENSE)" line items, each explicitly tagged, that net into that port's subtotal and roll up into the overall Total Income & Expense figure in AC 7.

---

#### **Scope:**

| **Area** | **Behaviour confirmed** |
| --- | --- |
| Fixture → Accounting tab → Cargo Relet | Must be "Yes" to unlock the Buy In toggle on Freight Details |
| Fixture → Accounting tab → Freight Details | Toggle splits the section into Sell Out Details (existing freight terms, unchanged) and Buy In Details (new, independently priced leg) |
| Buy In Details → Balance | Read-only, = Sell Out Gross Amount − Buy In Gross Amount |
| Accounting Details → Freight Charge group | Auto-includes the Sell Out and Buy In freight amounts as, respectively, an addition and a deduction to the subtotal |
| Accounting Details → Commission group | Computed on Sell Out (and a separate "Additional Freight" line) only — never on Buy In |
| Accounting Details → Total Income & Expense | Net sum of every cost-category subtotal in the ledger, inclusive of the Buy In deduction |

---

#### **Out of Scope:**

* The exact source/origin of the "Additional Freight" ($25,000) and "Detention / Demurrage" ($15,000) lines — neither has a dedicated field on the Fixture, Chartering, or Overview tabs; they most likely are ad-hoc lines added directly into the Accounting Details ledger under the Freight Charge cost category (each carries a delete/"close" icon consistent with a manually-added row), but this wasn't confirmed by locating the actual entry point.
* The second value ("$0") shown alongside the Total Income & Expense figure — not identified in this pass.
* What happens to entered Buy In data if the toggle is switched back off, or Cargo Relet is changed away from "Yes" after Buy In data has been entered.
* Behaviour when Sell Out and Buy In use two different currencies (this Fixture had both legs in US Dollar, so the Balance calculation's cross-currency behaviour is untested).
