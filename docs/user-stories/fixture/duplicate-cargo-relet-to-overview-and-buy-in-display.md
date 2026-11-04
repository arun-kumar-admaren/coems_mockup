#### **USER Story:**

**As a** Chartering user working on a Fixture,
**I want to** set Cargo Relet from either the Overview tab's Freight Details section or the Accounting tab (the same field, duplicated in both places, always in sync), see the Buy In amount clearly marked as a deduction in the Accounting Details ledger, and see that same Buy In expense line consistently wherever the Fixture is opened or rolled up — including nested under Gross Freight, under the respective Fixture, in Voyage and Voyage Estimate's own "Particulars / Total" summary panel,
**So that** the Cargo Relet decision is visible and settable wherever a user happens to be working on the Fixture (Overview or Accounting) without needing to jump tabs, the ledger visually confirms Buy In is being treated as an expense rather than just an amount, and Voyage/Voyage Estimate users see the Fixture's true, Buy-In-inclusive Gross Freight and Total Income instead of a figure that silently omits the Buy In cost.

> Raised against live Fixture UES-F-2026-1418 (`coems.bctesting.admaren.org`), where Cargo Relet and the Buy In toggle currently live only on the Accounting tab, and the "Freight (Buy-in)" ledger row is shown as a plain positive figure.

---

#### **acceptance criteria:**

1. **Cargo Relet is duplicated onto Overview, staying on Accounting too — same field, two tabs**

   * The **Cargo Relet** field (Yes / No / Not Checked) is added to the Fixture's **Overview tab**, inside the **Freight Details** section.
   * The **Cargo Relet** field is **not removed** from the **Accounting tab** — it continues to appear there exactly as it does today.
   * Both instances are the **same underlying field**, not two independently-stored copies: changing the value on Overview instantly reflects on Accounting, and changing it on Accounting instantly reflects on Overview. There is exactly one stored Cargo Relet value per Fixture.
   * Any Cargo Relet value already stored on existing Fixtures is preserved and shown correctly in both locations — no data loss.
   * This dual placement is consistent across every overlay in which the Fixture's Overview/Accounting data can be opened — not only when opened directly from the Fixtures listing, but also from the Voyage sidebar listing, the Voyage Estimate sidebar listing, and any other entry point (see AC 4).

2. **Buy In toggle continues to work identically, driven by the single shared Cargo Relet value**

   * The Buy In toggle (which splits Freight Details into Sell Out Details and Buy In Details) remains gated by Cargo Relet = **Yes**, exactly as today — this now holds regardless of which tab (Overview or Accounting) the value was last set from.
   * The info-icon tooltip ("Select 'Yes' in 'Cargo Relet' to enable Buy In") continues to apply on both tabs.
   * The Accounting tab's Freight Details / Sell Out Details / Buy In Details blocks continue to reflect the same underlying Cargo Relet and toggle state — there is one source of truth, not two independently-set copies.

3. **Buy In amount shown as a deduction in the Accounting Details ledger**

   * In **Accounting Details → Freight Charge**, the **"Freight (Buy-in)"** row's **Amount** is displayed with a leading minus sign (e.g. `-$100,000`) or in parentheses (e.g. `($100,000)`), instead of the current plain positive figure.
   * This is a **display-only** change. The underlying stored **Buy In Gross Amount** value remains positive.
   * The **Balance** field (Sell Out Gross Amount − Buy In Gross Amount) and the **Freight Charge Subtotal** formula continue to compute exactly as they do today — Buy In is already subtracted by the system based on the line's cost category, not by the sign of the stored value, so no calculation logic changes.
   * This deduction display is consistent across every overlay in which the Fixture's Accounting Details ledger can be opened — not only when opened directly from the Fixtures listing, but also from the Voyage sidebar listing, the Voyage Estimate sidebar listing, and any other entry point (see AC 4).

4. **Cargo Relet's dual placement, Buy In deduction display, and the Buy In line item are all consistent across every Fixture overlay entry point**

   * The **Cargo Relet** field's presence on both Overview and Accounting (AC 1), the **"Freight (Buy-in)"** row's deduction display (AC 3), and the **"Freight (Buy-in)"** line item itself are all shown identically no matter how the Fixture's Overview/Accounting data is reached — not only when opening the Fixture directly from the Fixtures listing, but also:
     * From the **Voyage** sidebar listing, opening a Fixture assigned to a Voyage.
     * From the **Voyage Estimate** sidebar listing, opening a Fixture assigned to a Voyage Estimate.
     * Any other overlay or side-panel entry point from which a Fixture's Accounting or Overview data can currently be opened.
   * There is one underlying Fixture record — every overlay reads and writes the same Cargo Relet value, the same Sell Out/Buy In toggle state, and the same Accounting Details ledger; none of these entry points may show a stale, cached, or out-of-sync value.

5. **Buy In expense line item is shown correctly in Voyage and Voyage Estimate's "Particulars / Total" summary panel, nested under Gross Freight and the respective Fixture**

   * Confirmed live on Voyage Estimate `EST-2026-1096-5` (vessel ANNE-SOFIE, Fixture `UES-F-2026-1355`): the summary panel's **Particulars / Total** table breaks **Gross Freight** (`$844,754`) down into a sub-row per assigned Fixture — e.g. `UES-F-2026-1355` (`$844,754`) — which itself breaks down further into **Additional Freight** (`$48,250`) and **Freight** (`$796,504`). Today, Additional Freight + Freight sums exactly to Gross Freight, with no Buy In line anywhere in this breakdown — Buy In is completely invisible at this level.
   * A new **"Freight (Buy-in)"** row must be added under the same Fixture sub-row, alongside "Additional Freight" and "Freight" — shown as a deduction (leading "-" / parentheses, consistent with the display convention in AC 3).
   * Both the Fixture's own sub-row total and the overall **Gross Freight** total must be recalculated to subtract Buy In, matching the Fixture's own Freight Charge Subtotal formula (Sell Out + Additional Freight − Buy In). Today this rollup only sums Additional Freight + Freight and does not account for Buy In at all — a Fixture with an active Buy In leg currently makes Gross Freight (and everything that rolls up from it, including Total Income and Result) overstated by the omitted Buy In amount.
   * This applies identically wherever this summary panel appears: confirmed live on Voyage Estimate; the same panel structure is expected on Voyage as well (per AC 4), though that specific screen was not independently re-verified in this pass.
   * If a Voyage or Voyage Estimate has multiple assigned Fixtures, each Fixture's own sub-row (Additional Freight, Freight, and — once added — Freight (Buy-in)) is shown separately under that specific Fixture, not merged into a single combined figure.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Fixture → Overview tab → Freight Details | Cargo Relet (Yes/No/Not Checked) field added here — duplicated field, gates the Buy In toggle |
| Fixture → Accounting tab | Cargo Relet field kept here, unchanged in place — same underlying field as the Overview copy, always in sync |
| Fixture → Accounting tab → Accounting Details → Freight Charge | "Freight (Buy-in)" row's Amount displayed with a leading "-" / in parentheses |
| Buy In Gross Amount (stored value) | Unchanged — remains positive; only the ledger's display formatting changes |
| Balance / Freight Charge Subtotal formulas | Unchanged — continue to subtract Buy In exactly as today |
| Fixture overlay, opened from Voyage sidebar listing | Shows the same dual Cargo Relet placement, Buy In deduction display, and Buy In line item as opening the Fixture directly |
| Fixture overlay, opened from Voyage Estimate sidebar listing | Shows the same dual Cargo Relet placement, Buy In deduction display, and Buy In line item as opening the Fixture directly |
| Voyage → "Particulars / Total" summary panel | Under Gross Freight → [Fixture No], a new "Freight (Buy-in)" row added alongside Additional Freight and Freight, shown as a deduction; Fixture sub-row total and overall Gross Freight recalculated to subtract it |
| Voyage Estimate → "Particulars / Total" summary panel | Same change, confirmed live on `EST-2026-1096-5` — Gross Freight → `UES-F-2026-1355` → Additional Freight / Freight / new Freight (Buy-in) row |

---

#### **Out of Scope:**

* Any change to how Buy In is stored, calculated, or subtracted internally — only the field's location and the ledger's display formatting change.
* Extending Cargo Relet / Sell Out / Buy In functionality to other modules (e.g. Inquiry), which does not currently have this feature — tracked separately.
* Cross-currency Sell Out/Buy In Balance behaviour — untested, unaffected by this story.
* Adding a standalone "Total Income" / "Total Expense" breakdown alongside the existing net "Total Income & Expense" figure — a separate scope question, not addressed here.
* The Voyage screen's own "Particulars / Total" panel was not independently re-verified live in this pass — AC 5's requirement there is carried over from AC 4's general overlay-consistency rule, on the assumption it uses the same panel structure confirmed on Voyage Estimate.
* Any change to the separate "Port Income & Expense" table (shown under the Port/Cargo/Voyage/Emission tabs below the map) — that table is unaffected; this story only touches the "Particulars / Total" summary panel.
* Extending this Buy In visibility requirement to any other Voyage/Voyage Estimate report or export not covered by the on-screen "Particulars / Total" summary panel.
