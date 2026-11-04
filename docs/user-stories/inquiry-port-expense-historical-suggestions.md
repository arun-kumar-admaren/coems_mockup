#### **USER Story:**

**As a** Chartering user creating an Inquiry,
**I want** the three default port expense lines (Port Expenses, Stevedoring expenses, Lashing/welding gang) that appear when I pick a Port of Loading or Port of Discharge to come pre-filled with a suggested Terms, Rate, Qty and Amount taken from what those same expenses actually cost on our previous completed voyages at that port — with a clear indication of how many past calls the figure is based on and how far to trust it,
**So that** I start from a realistic, port-specific estimate instead of $0 placeholder lines I have to fill in from memory or look up elsewhere, and my Inquiry's expense picture is credible from the first save.

> Verified live on UAT (`coems.uat.admaren.org`, New Inquiry overlay, 07.10.2026): picking a Port of Loading (Singapore) or a Port of Discharge (Rotterdam) already makes a **Loading Days** / **Discharging Days** table and a port-level **Income/Expense** table appear, and that table is seeded with three default lines — **Port Expenses**, **Stevedoring expenses**, **Lashing/welding gang** — each with Terms = Lumpsum, Rate = 0, Qty = 1, Amount = $0, plus a blank fourth row for adding more. This story changes only what those three lines are pre-filled with; it does not change when the section appears or which three account heads are the defaults.
>
> The rules below come from an analysis of 292 completed voyages (30 vessels, 366 ports, 2024–2026), where each past port call was predicted from earlier voyages at the same port. Full evidence and rationale: [Inquiry_Port_Expense_Suggestions_BRD_v2.md](../../BRD/Inquiry_Port_Expense_Suggestions_BRD_v2.md) (COEMS-INQ-PES-BRD-001, ticket COEMS-23782).
>
> **Before build starts (check, not a story):** confirm with the data owners that completed-voyage expense data holds the final actual (FDA), its Terms/Rate/Qty, its currency and the voyage's conversion rate, and whether a line belongs to a loading/discharge port or an intermediate stop. Also confirm whether several lines for the same voyage, port and head are separate invoices (to be added) or repeated entries. The analysis export did not contain currency or the actual's Terms/Rate/Qty.

---

#### **acceptance criteria:**

1. **Suggestions appear when a port is selected, on both Port of Loading and Port of Discharge**

   * When the user selects a port in **Port of Loading** or **Port of Discharge**, the three default Income/Expense lines appear as today, but **Terms, Rate, Qty and Amount are pre-filled** from that port's history instead of Lumpsum / 0 / 1 / $0. Account Head and Particulars are unchanged.
   * This works in the **New Inquiry overlay** and when a port is selected or changed on a **saved Inquiry in Edit mode**.
   * Each port block is independent. On a multi-port Inquiry (the "+" beside Port of Loading / Port of Discharge) each added port gets its own suggestions from its own history.
   * Suggestions are matched **per account head**: Port Expenses from past Port Expenses, Stevedoring from past Stevedoring, Lashing/welding gang from past Lashing/welding gang. A line is never filled from another head's figures.

2. **What counts as history**

   * **Completed voyages only** (Sail Completed or Finalized). In-progress voyages are excluded even if expenses are already booked.
   * **Cargo calls only** — voyages where the selected port was a **Loading or Discharge port**. This applies to both blocks, so Loading history may inform a Discharge block and vice versa. **Intermediate port calls (stops such as bunkering or canal waypoints) are excluded**, because they cost far less at some ports (e.g. Singapore Port Expenses about $9.4k at cargo calls vs about $1.7k at stops).
   * The amount used is the **final actual (FDA)** — never the estimate or proforma, because estimates have run above the real cost.
   * Matching is on the **port alone**. No narrowing by cargo, vessel, size or any other Inquiry field.
   * **All** completed voyages at the port count — no recency cut-off.
   * Inquiries, Fixtures, Voyage Estimates and voyage-level costs with no port are **not** a source.

3. **How the suggested value is calculated**

   For each account head at the selected port:

   * **One data point per past voyage:** add together the final actual of all lines for that head at that port in that voyage (after removing exact duplicate lines). Ignore voyages with no recorded actual for that head.
   * **Convert** each data point to the Inquiry's **Base Currency** using **that voyage's own original conversion rate** (not today's rate, not the Inquiry's Conversion Rate As On date), **before** taking the median.
   * **Zero-cost rule:** calls with an actual of exactly 0 are not averaged, and if **half or more** of a port's past calls had zero cost for that head, **no suggestion** is made for that head (the line keeps the default).
   * **Amount = the median** of the remaining data points. (Median, not average, so one unusually high bill does not distort the figure.)
   * **Terms = the most frequent Terms** among those voyages, copied as-is and **never forced to Lumpsum**. If two Terms are equally frequent, the more recent voyage's Terms win.
   * **Qty and Rate:** if Terms = Lumpsum, Qty = 1 and Rate = Amount. For any other Terms, Qty = the median Qty and Rate = Amount ÷ Qty, so Rate × Qty always equals Amount.
   * Values are rounded to the precision the fields already display.

4. **Fallback when there is no usable history — silent, no error**

   The line keeps today's default (**Lumpsum / 0 / 1 / $0**), with no error, warning or empty-state message, when:

   * the port has no completed voyage with a recorded actual for that head;
   * the port has history **only as an intermediate stop**, never as a loading/discharge port;
   * half or more of the port's past calls had zero cost for that head.

   Partial history is handled head by head — e.g. a port with Port Expenses history but no Lashing history fills the first line and leaves the others on the default. Expect roughly one port call in three to have no earlier history and stay on the default.

5. **Each suggestion shows its basis and how far to trust it**

   Every suggested line carries a cue (tooltip or badge) that disappears as soon as the user edits that line. It shows:

   * **What it is:** "Suggested from previous voyages".
   * **Basis:** the number of past calls used, e.g. "Median of 5 past calls at Rotterdam".
   * **Past range:** the **lowest and highest** past value, as plain facts (e.g. "lowest–highest $11,000–$48,000"). It is **not** presented as a predicted range.
   * **Coverage:** where some past calls had zero cost, how often the cost occurred (e.g. "cost recorded on 9 of 10 past calls").
   * **Confidence label:** 1–2 past calls = *Low*; 3–4 = *Medium*; 5 or more = *Good*.
   * **Stevedoring expenses** and **Lashing/welding gang** additionally carry **"Indicative, depends on cargo"** regardless of the number of calls, because the port alone predicts these two only roughly.

6. **Suggestions are editable, and the user's own entries are never overwritten**

   * Every pre-filled value is an ordinary editable field. The user can change Terms, Rate, Qty or Amount, or remove the line with the existing ✕.
   * Amount continues to follow Rate × Qty when the user edits Rate or Qty.
   * **Changing the port** in a block re-derives suggestions for the new port **only for lines the user has not edited**. Edited lines keep their values.
   * **Clearing the port** behaves as today; suggested values are not kept for a port that is no longer selected.
   * A line the user has **deleted** is **not** re-added by a later port change.
   * Selecting the same port again changes nothing.

7. **Saving and carry-over**

   * On save, the three lines are stored like any other Income/Expense entry and become the Inquiry's own data. Later changes to the port's history never change a saved Inquiry.
   * The values carry over through **Make a Fixture** and to linked **Voyage Estimates** exactly as manually entered port expense lines do today — no new carry-over logic.
   * The cue is a creation-time aid only and need not persist after save.

8. **Accuracy tracking *(recommended)***

   * For each suggested line that is saved, record the suggested Amount, the Amount finally saved, the port, the head and the number of past calls used, so suggestions can later be compared with the final actual once the voyage completes. This is internal data with no screen in this story.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Inquiry → New Inquiry overlay → Port of Loading → Income/Expense (3 default lines) | Terms, Rate, Qty, Amount pre-filled from the selected port's history |
| Inquiry → New Inquiry overlay → Port of Discharge → Income/Expense (3 default lines) | Same, for the selected Discharge port |
| Inquiry → saved Inquiry (Edit mode) → Port of Loading / Port of Discharge | Same behaviour when a port is selected or changed, for lines the user has not edited |
| Historical voyage expense data | Read-only lookup per port and per account head (completed voyages, cargo calls, final actuals) |
| Suggestion cue on each pre-filled line | Basis, call count, lowest–highest, coverage, confidence label, "indicative" note on Stevedoring and Lashing |
| Suggestion tracking | Suggested vs saved value recorded for later accuracy checks |

---

#### **Out of Scope:**

* **Cargo Income/Expense** (the separate section under Cargo Measurement Summary) — unchanged.
* **Loading Days / Discharging Days** (the Port working days row) — not suggested from history.
* Changing which three account heads are the defaults, or the logic that makes the days and Income/Expense sections appear on port selection.
* Suggestions for any other account head, or for rows the user adds manually.
* Cargo-type / cargo-quantity based refinement of Stevedoring and Lashing — a recommended later phase once cargo data is available in the history.
* Vessel-size adjustment — no effect was found in the current fleet.
* A recency window or time-weighting — reviewed after launch using the tracking in AC 8.
* Tariff-based estimates for ports with no company history.
* Any change to how expenses are recorded against a voyage — this story only reads existing data.
* Forecasting or machine-learning price prediction.
