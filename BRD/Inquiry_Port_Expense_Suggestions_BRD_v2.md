# Business Requirements Document
## Inquiry — Historical Port Expense Suggestions — COEMS Platform

**Document Reference:** COEMS-INQ-PES-BRD-001  
**Ticket:** COEMS-23782  
**Version:** 2.0  
**Date:** 2026-10-23  
**Project:** COEMS (Commercial Operations & Enterprise Management System)  
**Parent Module:** Inquiry (see COEMS-INQ-BRD-001, `BRD/Inquiry_Module_BRD.md`)  
**Related User Story:** [inquiry-port-expense-historical-suggestions.md](../docs/user-stories/inquiry-port-expense-historical-suggestions.md)  
**Supporting Analysis:** `Port_Expense_History_Analysis.xlsx` (port-wise, vessel-wise, trend and estimate-vs-actual tables)

---

## 1. Description

When a chartering user selects a Port of Loading or a Port of Discharge on an Inquiry, COEMS already reveals a **Loading Days / Discharging Days** table and a port-level **Income/Expense** table, and seeds that table with three default expense lines. Today those three lines are empty placeholders (Terms = Lumpsum, Rate = 0, Qty = 1, Amount = $0), so the user has to look up or recall what each cost has historically been at that port and type it in.

This enhancement replaces the placeholder values with **suggestions derived from the company's own completed voyages**. For each of the three default expense heads, COEMS looks at what that expense **actually cost** (the final actual, FDA) on previous completed voyages where the selected port was a **loading or discharge port**, and pre-fills **Terms, Rate, Qty and Amount** with the **median** of those historical values. Each suggestion shows how many past calls it is based on and how reliable it is likely to be. The user can accept, edit or delete any suggestion exactly as they can today.

The enhancement enables:

- A realistic, port-specific starting estimate for port costs from the moment a port is chosen, instead of $0 placeholders
- Consistent costing across the chartering team, because everyone starts from the same historical baseline rather than individual memory
- An Inquiry-stage estimate that, for Port Expenses, is measurably closer to the real cost than the estimates users currently type in
- Faster Inquiry creation, with less manual lookup and re-keying of port costs
- Better-quality Inquiry-stage economics, which flow onward into Fixtures and Voyage Estimates

This BRD covers **only** the pre-fill of the three default expense lines. It does not change when the Days and Income/Expense sections appear, which three account heads are the defaults, or how voyage expenses are recorded.

---

## 2. Evidence from the Historical Data Analysis

The design in this document is based on an analysis of the company's own voyage expense history, including a backtest in which each past port call was predicted from earlier voyages at the same port and compared with what it actually cost.

### 2.1 Data analysed

| Item | Value |
|---|---|
| Voyages | 292 (Finalized and Sail Completed), 2024 to 2026 (3 from 2023) |
| Vessels | 30 (22 from the UHL/UML fleet, which account for 284 of the 292 voyages) |
| Ports | 366 |
| Expense heads | Port Expenses, Stevedoring expenses, Lashing/welding gang expenses |
| Raw lines / after removing exact duplicates | 3,580 / 3,496 |
| Data points used (one per voyage × port × head, with a recorded actual) | 2,684, of which about 2,380 had a cost above zero |

### 2.2 How well a history-based suggestion predicts the real cost

Each past port call was predicted from earlier voyages at the same port and compared with what it actually cost. The suggestion column is the method specified in this BRD. The estimate column is the figure users entered themselves, measured on the same calls.

| Head | Share of port calls with earlier history at the same port | Typical error of the suggestion | Actual within ±25% of the suggestion | Actual within ±25% of the user's own estimate |
|---|---|---|---|---|
| Port Expenses | 66% | 21% | 55% | 43% |
| Stevedoring expenses | 69% | 40% | 33% | 36% |
| Lashing/welding gang | 66% | 45% | 32% | 23% |

**Reading the table:**
- **Port Expenses:** the suggestion is clearly better than the estimates users type in today.
- **Stevedoring:** roughly equal to current estimates, so the benefit is speed and consistency, not accuracy.
- **Lashing/welding:** better than current estimates, but still loose.
- About one port call in three has no earlier history at that port, so those lines stay on the current default.

### 2.3 What drives port cost, and what does not

| Finding | Detail | Consequence for the design |
|---|---|---|
| **The port matters** | The port explains about half of the variation in Port Expenses. | Port-only matching is justified for Port Expenses. |
| **Stevedoring and Lashing depend on something else** | The port explains almost none of their variation. Cargo type and quantity are the likely drivers, and the export did not contain them. | These two heads are marked "indicative". Cargo-based refinement is a later phase. |
| **The vessel does not matter here** | Adding the vessel does not improve accuracy, because 284 of 292 voyages are by sister vessels. | No vessel matching in this release. Revisit if dissimilar vessels become common. |
| **Role matters at a few ports** | Ports used as both a cargo port and a passing stop (Singapore, Hong Kong, Busan) show costs 2 to 6 times higher at cargo calls. Singapore Port Expenses are about $9.4k at cargo calls and about $1.7k at stops, and 115 of its 134 data points are stops. | Only cargo-call history is used. Intermediate stops are excluded. |
| **Median is safer than average, not dramatically more accurate** | The average of all values runs 1.3× the median on Port Expenses and Lashing and 2× on Stevedoring, because of one-off high bills. On cargo calls only, typical error is 21% (median) vs 22% (average) for Port Expenses, 40% vs 43% for Stevedoring and 45% vs 43% for Lashing. The worst 1-in-10 misses are smaller with the median on all three heads (for example Stevedoring 264% vs 288%). | Median is the statistic, chosen for robustness against one-off high bills. |
| **Estimates run above actuals** | Actual costs came in about 9–11% below the estimates on Port Expenses and Stevedoring and about 27% below on Lashing. | Suggestions use the final actual (FDA), never the estimate. |
| **More history helps, especially for Stevedoring and Lashing** | For these two heads the typical error is about 50–59% with 1–2 earlier calls and about 35–41% with 5 or more. For Port Expenses it stays between about 16% and 26% throughout. | Show the number of past calls and a confidence label. |
| **Costs are drifting** | Like-for-like against 2024: Port Expenses fell about 12% in 2025 and were flat in 2026. Stevedoring rose about 19% then 9%. Lashing rose about 26% then 18%. | Risk noted. The recency question is reviewed after launch. |
| **A recency window brings little** | Using the median of only the last 3, 5 or 8 calls instead of all calls gave no change for Port Expenses and small gains for Stevedoring and Lashing. | No recency window in this release. |
| **A "typical range" would mislead** | The middle-half range of past values contained the actual cost only about 40% of the time (about 65% for the wider 10–90% range). | The cue shows the plain lowest and highest past values, not a predicted range. |
| **Zero-cost calls are common for Lashing** | Lashing was zero on 30% of cargo calls, Stevedoring on 10%, Port Expenses on under 1%. At 5 of 39 ports with enough history, half or more of the past Lashing calls were zero. | Zero-cost rule in FR-3. |
| **Duplicates and multiple lines** | 84 exact duplicate lines were found, and about 14% of voyage/port/head combinations had several lines. | Exact duplicates are removed and multiple lines are summed per voyage (FR-3). |

### 2.4 Limits of the analysis

- The export had **no currency**, so all amounts were assumed to be USD.
- The export had **no Terms, Rate or Qty for the actual (FDA) lines**, so the Terms logic in this BRD could not be tested.
- The export had **no cargo type, cargo quantity, dates or vessel size (GT/DWT)**. The year was taken from the voyage number.
- Where a voyage had several lines for the same port and head, they were **added together**. It could not be confirmed whether those are separate invoices or repeated entries.
- The backtest orders voyages by year and creation order, not by actual dates.

---

## 3. Key Components

### 3.1 Current Behaviour (Baseline, verified on UAT)

Verified live on UAT (`coems.uat.admaren.org`, Inquiry → New Inquiry overlay, 2026-10-07) by selecting Singapore as Port of Loading and Rotterdam as Port of Discharge:

| Step | Observed behaviour |
|---|---|
| Before a port is selected | The Port of Loading / Port of Discharge block shows only the port search, terms, quantity and remarks fields. No days table and no Income/Expense table is shown. |
| Port of Loading selected | A **Loading Days** table appears (one row: Port working days, Unit = Number of Days, Rate = 1, Qty = "Add quantity", Time = None) and a port-level **Income/Expense** table appears. |
| Port of Discharge selected | A **Discharging Days** table appears (same single row) and a port-level **Income/Expense** table appears. |
| Default expense lines | Both Income/Expense tables are seeded with three lines, plus a blank fourth row for adding more. |

**Current default lines (identical for Loading and Discharge):**

| Account Head | Particulars | Terms | Rate | Qty | Amount |
|---|---|---|---|---|---|
| Port Expenses | Port Expenses | Lumpsum | 0 | 1 | $0 |
| Stevedoring expenses | Stevedoring expenses | Lumpsum | 0 | 1 | $0 |
| Lashing/welding gang | Lashing/welding gang | Lumpsum | 0 | 1 | $0 |

Each default line has an ✕ to remove it. A separate **Cargo Income/Expense** section (under Cargo Measurement Summary) holds only a blank row and no defaults and is not affected by this enhancement.

### 3.2 Target Behaviour

When a port is selected in either block, the three default lines still appear as above, but **Terms, Rate, Qty and Amount are pre-filled from that port's history** rather than set to Lumpsum / 0 / 1 / $0. Account Head and Particulars are unchanged.

**Illustrative example** (figures are invented, for explanation only). Rotterdam is selected as Port of Discharge. Five earlier completed voyages loaded or discharged at Rotterdam and recorded final Port Expenses of $11,000, $12,000, $12,500, $13,000 and $48,000 (the last one a delayed call). The median is **$12,500**, where the average would have been $19,300:

| Account Head | Terms | Rate | Qty | Amount | Cue shown on the line |
|---|---|---|---|---|---|
| Port Expenses | Lumpsum | 12,500 | 1 | $12,500 | *Median of 5 past calls at Rotterdam · lowest–highest $11,000–$48,000 · Good confidence* |
| Stevedoring expenses | *(from Stevedoring history)* | | | | *Indicative, depends on cargo* |
| Lashing/welding gang | *(from Lashing history, or default if none)* | | | | *Indicative, depends on cargo* |

The user sees a suggested figure instead of $0, can overwrite it, and the cue disappears once they do.

### 3.3 Functional Requirements

#### FR-1 Trigger

- Suggestions are generated when a port is **selected or changed** in a **Port of Loading** or **Port of Discharge** block, in the New Inquiry overlay and when editing a saved Inquiry's port blocks.
- Each port block is independent. A multi-port Inquiry (added with the "+" next to Port of Loading / Port of Discharge) receives suggestions per port, from that port's own history.
- Suggestions are matched **per account head**. A line is never filled from another head's figures.

#### FR-2 Historical Data Source

| Rule | Decision |
|---|---|
| Which voyages | **Completed voyages only** (status Sail Completed or Finalized). In-progress voyages are excluded even if expenses are already booked. |
| Which port calls | **Cargo calls only**: the port was a Loading or Discharge port of that voyage. This applies to both the Loading and the Discharge block, so Loading history may inform a Discharge block and vice versa. **Intermediate port calls (stops) are excluded.** |
| Which amount | The **final actual (FDA)**. The estimate or proforma amount is **never** used. |
| Which expense heads | Only the same three heads: Port Expenses, Stevedoring expenses, Lashing/welding gang. |
| Other record types | Inquiries, Fixtures, Voyage Estimates and Voyage-level costs with no port are **not** a source. |
| Matching key | **Port alone.** No narrowing by cargo, vessel, size or any other Inquiry field. |
| Recency | **No cut-off.** All completed voyages at the port are included. |
| Minimum sample | **None.** A suggestion is shown even with one past call, labelled by confidence (FR-7). |

#### FR-3 Calculation

For each account head at the selected port:

1. **Build one data point per past voyage.** For each qualifying voyage (FR-2), add together the final actual (FDA) of all lines for that head at that port in that voyage. Remove exact duplicate lines first. Ignore voyages where no actual has been recorded for the head.
2. **Convert** each data point to the Inquiry's **Base Currency** using that voyage's **original conversion rate** (FR-5).
3. **Zero-cost check.** Count the data points whose actual is exactly 0. If **half or more** of the data points are 0, make **no suggestion** for this head (the line keeps the default, FR-4).
4. **Discard the zero data points.** If none remain, the line keeps the default.
5. **Amount = the median** of the remaining data points.
6. **Terms = the most frequent Terms** among the lines behind those voyages, copied as-is and never converted to Lumpsum. If two Terms are equally frequent, the Terms from the more recent voyage win.
7. **Qty and Rate.** If the Terms are Lumpsum: Qty = 1 and Rate = Amount. For any other Terms: Qty = the median Qty and Rate = Amount ÷ Qty, so that Rate × Qty = Amount always holds.
8. **Round** to the same decimal precision the fields already display.

> The median is taken on the **total cost of the head per port call**, not on individual lines. This keeps the suggestion comparable to how the cost is finally booked.

#### FR-4 Fallback When There Is No Usable History

The line keeps today's default, **Lumpsum / 0 / 1 / $0**, silently, with no error or empty-state message, when any of the following is true:

- The port has no qualifying completed voyage with a recorded actual for that head.
- The port has history **only as an intermediate stop**, never as a loading or discharge port. A stop-only figure is not a valid guide to a cargo call.
- Half or more of the port's past calls had zero cost for that head (FR-3 step 3).

Partial history is handled head by head: a port with Port Expenses history but no Lashing history fills the first line and leaves the others on the default.

#### FR-5 Currency

- Suggested Amount (and Rate where it is a monetary rate) is shown in the Inquiry's **Base Currency** (US Dollar by default).
- A past expense recorded in another currency is converted using **that voyage's own original conversion rate**, not today's rate and not the Inquiry's Conversion Rate As On date.
- Conversion is applied to each historical value **before** the median is taken.
- A suggestion is never displayed in a currency different from the rest of the Inquiry's Income/Expense.

#### FR-6 Editing and Overwrite Rules

- All pre-filled values are ordinary editable fields. The user may overwrite Terms, Rate, Qty or Amount, or remove the line with the existing ✕.
- Amount continues to follow the existing Rate × Qty calculation when the user edits Rate or Qty.
- **Changing the port** in a block re-derives suggestions for the new port **only for lines the user has not edited**. Edited lines keep their values.
- **Clearing the port** behaves as today. Suggested values are not retained for a port that is no longer selected.
- A line the user has deleted is **not** re-added by a later port change.
- The system never silently overwrites anything the user has typed.

#### FR-7 Visual Indication, Basis and Confidence

Every suggested line carries a cue (tooltip or badge) that is **removed as soon as the user edits the line**. The cue shows:

- **What it is:** "Suggested from previous voyages".
- **Basis:** the number of past calls used, for example "Median of 5 past calls at Rotterdam".
- **Past range:** the **lowest and highest** past value, shown as plain facts ("lowest–highest $11,000–$48,000"). It is **not** presented as a predicted range.
- **Coverage:** how often the cost occurred, for example "cost recorded on 9 of 10 past calls", shown where some past calls had zero cost.
- **Confidence label**, based on the number of past calls:

| Past calls | Label |
|---|---|
| 1–2 | Low confidence |
| 3–4 | Medium confidence |
| 5 or more | Good confidence |

- **Stevedoring expenses** and **Lashing/welding gang** additionally carry the note **"Indicative, depends on cargo"**, regardless of the number of calls, because the analysis showed the port alone predicts these two heads only roughly.

#### FR-8 Persistence and Downstream Carry-Over

- On save, the three lines are stored like any other Income/Expense entry and become the Inquiry's own data. Later changes to the port's history never retroactively change a saved Inquiry.
- The values carry over through "Make a Fixture" and to linked Voyage Estimates exactly as manually entered port expense lines do today. No new carry-over logic is required.
- The cue is a creation-time aid only and is not required to persist after save.

#### FR-9 Accuracy Tracking *(recommended)*

To confirm after launch that suggestions keep their accuracy, the system should record, for each suggested line that is saved: the suggested Amount, the Amount finally saved on the Inquiry, the port, the head and the number of past calls used. This allows later comparison with the final actual (FDA) when the voyage completes. It is internal data and has no screen in this release.

### 3.4 Business Rules Summary

| # | Rule |
|---|---|
| BR-1 | Suggestions apply only to the three default expense lines per port block, on both Port of Loading and Port of Discharge. |
| BR-2 | History is **completed voyages only**, **cargo calls only** (loading or discharge port), **final actuals only**, matched on **port alone**. |
| BR-3 | Suggested Amount is the **median** of the per-voyage total actual, after discarding zero-cost calls. |
| BR-4 | If half or more of a port's past calls had zero cost for a head, no suggestion is made for that head. |
| BR-5 | Terms are copied as-is from history, never forced to Lumpsum. For Lumpsum, Qty = 1 and Rate = Amount. |
| BR-6 | Each historical amount is converted at its own voyage's original rate before the median is taken. |
| BR-7 | No usable history for a head means the existing Lumpsum / 0 / 1 / $0 default, silently. |
| BR-8 | Every suggestion shows the number of past calls and a confidence label. Stevedoring and Lashing are always marked indicative. |
| BR-9 | User-edited lines are never overwritten by a port change. |
| BR-10 | A suggestion never changes a saved Inquiry after the fact. |

### 3.5 Edge Cases

| Scenario | Expected behaviour |
|---|---|
| Port has exactly one completed cargo call with the expense | The suggestion equals that call's total, labelled **Low confidence**. |
| Port has history under mixed Terms (e.g. Lumpsum on two voyages, per-day on one) | Most frequent Terms (Lumpsum) are used; Qty and Rate follow FR-3 step 7. |
| Two Terms equally frequent | The Terms from the more recent completed voyage win. |
| Past expense recorded in a foreign currency | Converted at that voyage's own rate, then included in the median. |
| Port is mostly a passing stop but has a few cargo calls (e.g. Singapore) | Only the cargo calls are used. The stop history is ignored. |
| Port has been only a passing stop, never a loading or discharge port | No suggestion; the line stays on the default. |
| A voyage has several lines for the same port and head | Their actuals are added into one data point for that voyage. Exact duplicate lines are removed first. |
| A voyage called at the same port twice | Treated as one data point for that voyage and head (call-level separation is not available in the data). |
| A past voyage has no actual recorded for the head | That voyage is ignored for that head. |
| Half or more of past calls had zero cost for the head | No suggestion for that head. |
| Port selected, then the same port re-selected | No change. User-edited lines are untouched. |
| Port changed after the user edited one of the three lines | The edited line is kept; the other two lines are re-derived. |
| User deleted a default line, then changed the port | The deleted line stays deleted. |
| Port selected as both a Loading and a Discharge port on the same Inquiry | Each block receives the same history-derived suggestion independently. |
| Historical data exists for the port but only for non-default heads | All three lines stay on the default. |

---

## 4. Project Scope

### 4.1 In Scope

- Pre-filling Terms, Rate, Qty and Amount on the three default Income/Expense lines (Port Expenses, Stevedoring expenses, Lashing/welding gang)
- Both Port of Loading and Port of Discharge blocks, in the New Inquiry overlay and on a saved Inquiry in Edit mode
- Read-only lookup of **final actual** expense data from completed voyages, per port and per account head, limited to cargo calls
- Median calculation, zero-cost rule, per-voyage original-rate currency conversion and silent fallback to the current defaults
- The suggestion cue: basis, past range, coverage, confidence label and the "indicative" note
- Edit, delete and port-change handling as defined in FR-6
- Recording suggested versus saved values for later accuracy tracking (FR-9)

### 4.2 Out of Scope

- **Cargo Income/Expense** (the separate section under Cargo Measurement Summary): unchanged
- **Loading Days / Discharging Days**: not suggested from history
- Changing which three account heads are the defaults, or the logic that makes the days and Income/Expense sections appear
- Suggestions for any other account head, or for rows the user adds manually
- **Cargo-type and cargo-quantity based refinement** of Stevedoring and Lashing (recommended for a later phase, once cargo data is available in the history)
- **Vessel-size adjustment** (no effect found in the current fleet)
- A **recency window** or time-weighting (reviewed after launch)
- Tariff-based estimation from vessel particulars (see Section 9)
- Forecasting or machine-learning price prediction
- Changes to how expenses are recorded against a voyage
- Voyage Estimate, Fixture and Voyage module screens
- A bulk "refresh suggestions" action on an already-saved Inquiry
- Reporting or dashboards on suggestion accuracy

---

## 5. Business Drivers

- Remove the manual lookup of port costs that chartering users currently do before they can produce a credible Inquiry estimate
- Replace estimates that were found to run above the real cost (actuals came in about 9–11% below estimate on Port Expenses and Stevedoring and about 27% below on Lashing) with figures grounded in what ports have actually cost the company
- Make Inquiry-stage cost estimates consistent across users
- Reduce data-entry time and re-keying errors on new Inquiries
- Improve the quality of the economics carried forward into Fixtures and Voyage Estimates
- Make better use of voyage expense data the company already records and currently only uses retrospectively

---

## 6. Assumptions

- Completed voyages record expenses against the same three account heads, so a like-for-like match per head is possible. The export analysed contained only these three heads, so how other heads relate to them was **not** tested. **To be verified before build.**
- Each historical expense line records the port, its **final actual (FDA)**, **Terms, Rate and Qty for that actual**, the **currency** and the **conversion rate** in force on that voyage. The export lacked currency and the actual's Terms/Rate/Qty, so FR-3 steps 6–7 and FR-5 **cannot be confirmed until the data model is checked**.
- The system can tell whether a port was a **loading or discharge port** of a voyage as opposed to an intermediate stop (in the export this was identifiable as the line source: POL/POD versus Port Call).
- A voyage's status (completed versus in-progress) is reliably available to filter on.
- Port identity is consistent across modules, because Inquiry port selection and voyage port calls both use the COEMS port master database. The export showed no duplicate or variant port names.
- Several lines for the same voyage, port and head are **additive** (separate invoices), not repeated copies of one cost. This was assumed in the analysis and **needs confirming with the voyage operations team**.
- The Inquiry's Base Currency is known when a port is selected.
- The existing Rate × Qty = Amount behaviour of Income/Expense lines is retained.
- The thresholds used here (zero-cost rule at half or more, confidence labels at 1–2 / 3–4 / 5+ calls, and the Qty/Rate derivation for non-Lumpsum Terms) are **proposed defaults drawn from the analysis**. They can be changed without affecting the rest of the design.

---

## 7. Constraints

- Suggestions are only as good as the history. About one port call in three has no earlier cargo call at the same port and will show the default.
- **Stevedoring and Lashing/welding are only roughly predictable from the port.** Their typical error is around 40–45%, and they depend on cargo that the suggestion does not take into account. They are labelled "indicative" for this reason.
- With **no recency window**, old values carry the same weight as recent ones. Costs have drifted (Stevedoring and Lashing rising by about 10–26% a year), so a stale figure is possible. The median limits the effect, and the window is a review item after launch.
- With **no minimum sample size**, a figure based on one or two past calls can look more authoritative than it is. The confidence label and the call count are the mitigation.
- Port-only matching ignores cargo type and size. Users are expected to edit suggestions where the cargo is atypical.
- Lookup must not noticeably delay the form after a port is chosen.
- The enhancement must not change any existing saved Inquiry. It applies to port-selection events only.

---

## 8. Decisions Log

| Question | Decision | Basis |
|---|---|---|
| Which past calls count? | **Cargo calls only** (loading or discharge port of the voyage). Intermediate stops are excluded. | Stop costs are far lower at some ports (Section 2.3) |
| Which historical value? | **Median** of the per-voyage total actual | Robust to one-off high bills (Section 2.3) |
| Estimate or actual as source? | **Final actual (FDA) only** | Estimates ran above actuals (Section 2.3) |
| Which voyages count? | **Completed voyages only** | Product owner |
| Currency conversion basis | **The original voyage's conversion rate** | Product owner |
| Non-Lumpsum Terms | **Copied as-is** | Product owner |
| Narrow by cargo type or vessel? | **No. Port alone.** | Port explains Port Expenses; vessel adds nothing (Section 2.3) |
| Mixed Terms | **Most frequent Terms** | Product owner |
| Recency window | **None**, reviewed after launch | A window gave little gain (Section 2.3) |
| Minimum sample size | **None**; call count and confidence label shown | Product owner; accuracy improves with call count (Section 2.3) |
| Zero-cost calls | **Excluded**; no suggestion if half or more are zero | Common for Lashing (Section 2.3) |
| Display of basis | **Call count, lowest–highest past value, confidence label**; Stevedoring and Lashing marked "indicative" | Sections 2.2 and 2.3 |

**Points for the product owner to confirm (proposed defaults in this document):**

1. The zero-cost rule: no suggestion when half or more of past calls had zero cost.
2. The confidence labels: 1–2 low, 3–4 medium, 5 or more good.
3. Marking Stevedoring and Lashing as "indicative" permanently.
4. How Qty and Rate are derived for non-Lumpsum Terms (FR-3 step 7).
5. Whether to recheck the recency question after about six months of live use, using the data captured under FR-9.

---

## 9. Dependencies and Risks

| Item | Detail |
|---|---|
| Voyage expense data model | Must expose, per completed voyage, per port and per account head: the final actual, Terms, Rate, Qty, **currency** and the voyage's **conversion rate**, and whether the line belongs to a loading/discharge port or a stop. The analysis export lacked currency and the actual's Terms/Rate/Qty. **Confirm before build.** |
| Multiple lines per port and head | About 14% of voyage/port/head combinations had several lines, and 84 lines were exact duplicates. Confirm with voyage operations whether these are separate invoices (add them) or repeated entries (use once). The wrong choice would overstate suggestions. |
| Cost folded between heads | Voyage notes on past calls include text such as "FDA incl shore crane", where one head's cost was booked under another. Per-head history will be noisy until heads are booked consistently. |
| Other expense heads | Voyages also carry other heads (for example shore cranes, towage). Whether any belong inside the three default heads was not tested. |
| Data quality of actuals | About 10% of port/head data points had no recorded actual, and about 10% were exactly zero. Voyages still being settled may be incomplete. |
| Drift in costs | Costs for Stevedoring and Lashing have risen year on year. Review the recency window after launch. |
| Port master consistency | Duplicate or renamed ports would split history. No variants were found in the export. |
| Performance | Calculating the median across a port's history on every port selection should be cached or pre-aggregated if volumes are large. |
| User trust | Users may over-rely on suggestions. Mitigated by the cue, call count, confidence label and editable values. |

### Possible later phases (not committed)

- **Cargo-based refinement** for Stevedoring and Lashing using cargo type and quantity, the likely missing drivers.
- **Estimate-versus-actual feedback**: using FR-9 data to show users how past suggestions compared with the final actual.
- **Tariff-based estimates** for ports with little or no company history. Industry tools such as HarborLab and Marcura DA-Desk compute port costs from published tariffs and vessel particulars, and use history for validation. This would need a tariff data source.

---

## 10. User Stories Reference

| Story | Description |
|---|---|
| Inquiry Port Expense Historical Suggestions | Pre-fill the three default port expense lines with the median of final actuals from completed cargo calls at the selected port ([user story](../docs/user-stories/inquiry-port-expense-historical-suggestions.md)) |

---

## 11. Mockup Reference

The existing Inquiry UI is documented in COEMS-INQ-BRD-001 (sections 2.2 New Inquiry Creation, 2.3.5 Port Calls Tab and 2.3.8 Accounting Tab). The baseline behaviour in Section 3.1 was verified on the UAT environment.

**UAT Environment:** [https://coems.uat.admaren.org](https://coems.uat.admaren.org)

Key source files (prototype):

1. **Inquiry Listing and New Inquiry overlay** — `src/app/components/inquiry.tsx`
2. **Inquiry Detail Overlay (Cargo and Port Calls tabs)** — `src/app/components/inquiry-detail.tsx`

No mockup change has been made for this enhancement yet.
