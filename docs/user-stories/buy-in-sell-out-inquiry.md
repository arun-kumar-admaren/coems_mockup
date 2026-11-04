#### **USER Story:**

**As a** Chartering user working on an Inquiry where the cargo will be relet,
**I want to** set Cargo Relet and split Freight Details into a Sell Out leg and a Buy In leg the same way this already works on a Fixture — available from the moment I first create the Inquiry, with Cargo Relet duplicated across every tab that needs it, the Buy In amount clearly marked as a deduction wherever the ledger appears, and that same treatment consistent across every overlay the Inquiry can be opened from, including nested under Gross Freight, under the respective Inquiry, in Voyage Estimate's own "Particulars / Total" summary panel,
**So that** I can see my expected margin on the deal at the Inquiry stage — before it becomes a Fixture — have that margin flow correctly into the Inquiry's Accounting as income (Sell Out) versus expense (Buy In), and have Voyage Estimate users see the true, Buy-In-inclusive Gross Freight instead of a figure that silently omits the Buy In cost.

> Today, Inquiry has no Cargo Relet field and no Buy In toggle anywhere — the Cargo tab's Freight Details section only ever shows the plain, un-split fields (Freight Calc Type, Freight Currency, Freight Rate, Gross Amount, Transit Requirements, Payment Terms), and the Accounting tab only ever contains the ledger, with no Freight Details/Cargo Relet block of its own. This story implements the full feature, modelled on the confirmed, working behaviour on Fixture (`coems.bctesting.admaren.org`, Fixture UES-F-2026-1418) and on the corrected, duplicated-field design already specified in [duplicate-cargo-relet-to-overview-and-buy-in-display.md](../fixture/duplicate-cargo-relet-to-overview-and-buy-in-display.md).
>
> **Note:** unlike a Fixture, an Inquiry can never be assigned to a Voyage — only to a Voyage Estimate. Every requirement below that references "every overlay" is scoped to Inquiry's own entry points and Voyage Estimate; Voyage does not apply here.

---

#### **acceptance criteria:**

1. **Cargo Relet is available from New Inquiry creation onward, and duplicated onto both the Cargo tab and the Accounting tab once saved — same field, every location**

   * A new **Cargo Relet** field (Yes / No / Not Checked) is added to the **New Inquiry (Add) overlay's** own Freight Details section — confirmed live today this section only shows the plain, un-split fields (Freight Calc Type, Freight Currency, Freight Rate, Gross Amount) with no Cargo Relet field at all, the same gap as the saved Inquiry's Cargo tab. A user must be able to set Cargo Relet and enable Buy In **before the Inquiry is ever saved**, not only after opening it in Edit mode.
   * The same **Cargo Relet** field is also added to the Inquiry's **Cargo tab** (Edit mode), inside the existing **Freight Details** section — and to the Inquiry's **Accounting tab** — today the Accounting tab has no Freight Details/Cargo Relet block at all; this adds one, mirroring the corrected Fixture design where Cargo Relet and Freight Details appear on both Overview and Accounting.
   * All instances are the **same underlying field**, not independently-stored copies: whatever is set at creation (Add overlay) is what the saved Inquiry's Cargo tab and Accounting tab both show on first open, and changing the value on either tab afterward instantly reflects on the other. There is exactly one stored Cargo Relet value per Inquiry, regardless of whether it was first set during creation or added later in Edit mode.

2. **Freight Details toggle, available from creation onward and wherever Cargo Relet is set thereafter**

   * **Toggle off** (default) — Freight Details shows exactly what it shows today, in both the Add overlay and the Cargo tab: Freight Calc Type, Freight Currency, Freight Rate, Gross Amount, Transit Requirements, Payment Terms. No behaviour change for any Inquiry that doesn't use Buy In.
   * **Toggle on** (only selectable when Cargo Relet = Yes) — Freight Details splits into two named blocks, **Sell Out Details** and **Buy In Details**, exactly as on Fixture. This split is available the moment Cargo Relet = Yes is set in the **New Inquiry (Add) overlay** — a user does not have to save the Inquiry first and come back in Edit mode to use Buy In — and the same split is shown identically in the saved Inquiry's Cargo tab and the Accounting tab block, one toggle state, driven by the single shared Cargo Relet value.
   * Hovering the info icon next to "Freight Details" when Buy In is not yet enabled shows the same tooltip used on Fixture: *"Select 'Yes' in 'Cargo Relet' to enable Buy In."* — shown in the Add overlay too, not only in Edit mode.
   * Whatever Sell Out Details / Buy In Details values are entered at creation are saved as part of the new Inquiry record on first save — there is no separate "confirm Buy In" step after creation.

3. **Sell Out Details = the Inquiry's existing Freight Details, relabelled**

   * Enabling Buy In does not create a new commercial record — it relabels the Inquiry's existing freight terms (Freight Calc Type, Freight Currency, Freight Rate, Gross Amount, Transit Requirements, Payment Terms) as the Sell Out leg. Any values already entered are preserved.

4. **Buy In Details = a new, independently-priced leg**

   * Buy In gets its own **Freight Calc Type**, **Freight Currency**, **Freight Rate**, **Gross Amount**, **Transit Requirements**, **Comments**, and **Payment Terms** — priced completely independently of Sell Out (e.g. Sell Out can be Units-based while Buy In is Lumpsum-based, as on Fixture).
   * A read-only **Balance** field is shown: `Sell Out Gross Amount − Buy In Gross Amount`, recalculated live as either amount changes.

5. **Sell Out and Buy In flow into the Accounting tab's ledger as income and expense respectively, with Buy In shown as a deduction**

   * The Accounting tab's **Accounting Details → Freight Charge** group gains a second system-generated line, **"Freight (Buy-in)"**, alongside the existing "Freight" line — both auto-populated from, and always mirroring, the Sell Out and Buy In Gross Amounts.
   * The Freight Charge **Subtotal** adds Sell Out and any Additional Freight / Detention-Demurrage lines, and **subtracts** Buy In — matching the Fixture formula exactly.
   * The **"Freight (Buy-in)"** row's Amount is displayed with a leading minus sign (e.g. `-$100,000`) or in parentheses, per the same display convention specified for Fixture — the underlying stored value remains positive; only the display differs.

6. **Commissions are computed on Sell Out only, never on Buy In**

   * Every commission rule already configurable on an Inquiry (Broker, Customer, Office, HQ, etc.) continues to generate its calculated line(s) against Sell Out (and any Additional Freight) exactly as today — no commission rule is ever calculated against the Buy In amount, matching Fixture behaviour.

7. **Cargo Relet's dual placement, Buy In deduction display, and the Buy In line item are all consistent across every Inquiry overlay entry point**

   * The **Cargo Relet** field's presence on both Cargo and Accounting (AC 1), the **"Freight (Buy-in)"** row's deduction display (AC 5), and the **"Freight (Buy-in)"** line item itself are all shown identically no matter how the Inquiry's Cargo/Accounting data is reached — not only when opening the Inquiry directly from the Inquiry listing, but also:
     * From the **Voyage Estimate** sidebar listing, opening an Inquiry linked/assigned to a Voyage Estimate.
     * Any other overlay or side-panel entry point from which an Inquiry's Cargo or Accounting data can currently be opened.
   * There is one underlying Inquiry record — every overlay reads and writes the same Cargo Relet value, the same Sell Out/Buy In toggle state, and the same Accounting Details ledger; none of these entry points may show a stale, cached, or out-of-sync value.
   * This requirement does **not** extend to Voyage, since an Inquiry can never be assigned to a Voyage.

8. **Buy In expense line item is shown correctly in Voyage Estimate's "Particulars / Total" summary panel, nested under Gross Freight and the respective Inquiry**

   * Confirmed live on a Voyage Estimate carrying a Fixture (`EST-2026-1096-5`, Fixture `UES-F-2026-1355`): the summary panel's **Particulars / Total** table breaks **Gross Freight** down into a sub-row per assigned record (e.g. `UES-F-2026-1355`), which itself breaks down further into **Additional Freight** and **Freight**. Today, Additional Freight + Freight sums exactly to Gross Freight, with no Buy In line anywhere in this breakdown. The same panel structure is expected to apply per linked Inquiry once an Inquiry can be assigned to a Voyage Estimate with Buy In enabled.
   * A new **"Freight (Buy-in)"** row must be added under the relevant Inquiry's sub-row, alongside "Additional Freight" and "Freight" — shown as a deduction (leading "-" / parentheses, consistent with the display convention in AC 5).
   * Both the Inquiry's own sub-row total and the overall **Gross Freight** total must be recalculated to subtract Buy In, matching the Inquiry's own Freight Charge Subtotal formula (Sell Out + Additional Freight − Buy In). Without this, an Inquiry with an active Buy In leg would make Gross Freight — and everything that rolls up from it — overstated by the omitted Buy In amount, exactly as would happen on Fixture (see [duplicate-cargo-relet-to-overview-and-buy-in-display.md](../fixture/duplicate-cargo-relet-to-overview-and-buy-in-display.md), AC 5).
   * This applies **only** to Voyage Estimate — an Inquiry can never be assigned to a Voyage, so there is no equivalent requirement on the Voyage screen's own "Particulars / Total" panel.
   * If a Voyage Estimate has multiple linked Inquiries and/or Fixtures, each one's own sub-row (Additional Freight, Freight, and — once added — Freight (Buy-in)) is shown separately under that specific record, not merged into a single combined figure.

9. **Carry-over into Fixture**

   * When an Inquiry with Buy In enabled is converted into a Fixture ("Make a Fixture"), the Cargo Relet value, the toggle state, and both the Sell Out Details and Buy In Details (including their independently-set Freight Calc Types, rates, and amounts) carry over unchanged onto the new Fixture's Overview and Accounting tabs (per the dual placement already specified there).

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Inquiry → New Inquiry (Add) overlay → Freight Details | Cargo Relet (Yes/No/Not Checked) field added; gates a new Enable Buy In toggle — available before the Inquiry is first saved |
| Inquiry → Cargo tab → Freight Details | Cargo Relet (Yes/No/Not Checked) field added; gates a new Enable Buy In toggle |
| Inquiry → Accounting tab | New Cargo Relet field and Freight Details (Sell Out Details / Buy In Details) block added — today this tab has no such block; same underlying field/values as the Cargo tab copy, always in sync |
| Inquiry → Cargo & Accounting tabs → Freight Details | Toggle splits the section into Sell Out Details (existing fields, relabelled) and Buy In Details (new, independently priced), shown identically on both tabs |
| Buy In Details → Balance | New read-only field, = Sell Out Gross Amount − Buy In Gross Amount |
| Inquiry → Accounting tab → Accounting Details → Freight Charge | New system-generated "Freight (Buy-in)" line added, mirroring Buy In Gross Amount, displayed with a leading "-" / in parentheses; Subtotal formula updated to subtract it |
| Inquiry → Accounting tab → Commission | Unchanged — continues to compute on Sell Out (and Additional Freight) only |
| Inquiry overlay, opened from Voyage Estimate sidebar listing | Shows the same dual Cargo Relet placement, Buy In deduction display, and Buy In line item as opening the Inquiry directly |
| Voyage Estimate → "Particulars / Total" summary panel | Under Gross Freight → [Inquiry/Fixture reference], a new "Freight (Buy-in)" row added alongside Additional Freight and Freight, shown as a deduction; sub-row total and overall Gross Freight recalculated to subtract it |
| Inquiry → Fixture conversion ("Make a Fixture") | Cargo Relet, toggle state, Sell Out Details, and Buy In Details all carry over to the new Fixture's Overview and Accounting tabs |

---

#### **Out of Scope:**

* Any change to Fixture's own Buy In/Sell Out behaviour — that is already built and confirmed working; this story only brings the same capability, including the duplicated-field design, to Inquiry.
* Any Voyage-side requirement — an Inquiry can never be assigned to a Voyage, so no Voyage overlay or Voyage "Particulars / Total" summary panel is affected by this story; only Voyage Estimate is in scope for AC 8.
* A standalone "Total Income" / "Total Expense" breakdown on the Inquiry Accounting tab — not addressed here.
* Cross-currency Sell Out/Buy In Balance behaviour — untested on Fixture and not addressed here either.
* Behaviour when Buy In is enabled, data entered, and then Cargo Relet is changed back away from "Yes" — not specified.
* The exact per-Inquiry sub-row behaviour of the "Particulars / Total" panel — confirmed live for a Fixture (`UES-F-2026-1355` under `EST-2026-1096-5`); an Inquiry-specific sub-row was not independently re-verified since Inquiry cannot yet carry Buy In data to test with.
* Any change to the separate "Port Income & Expense" table on Voyage Estimate — that table is unaffected; this story only touches the "Particulars / Total" summary panel.
* Applying Buy In/Sell Out to any other pre-Fixture record type not covered by this story.
* Whether the Accounting tab (and its own Cargo Relet/Freight Details block, AC 1) is actually reachable during New Inquiry creation, before the first save — not confirmed live; the New Inquiry overlay's Cargo-tab-equivalent Freight Details section is confirmed (per the attached screenshot), but if Accounting only unlocks after save (matching the pattern used elsewhere in COEMS, e.g. Claims' tabs beyond Overview), then the Accounting-tab copy of Cargo Relet only needs to exist once the Inquiry has been saved at least once.
