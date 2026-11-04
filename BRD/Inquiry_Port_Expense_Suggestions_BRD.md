# Business Requirements Document
## Inquiry — Historical Port Expense Suggestions — COEMS Platform

**Document Reference:** COEMS-INQ-PES-BRD-001  
**Version:** 1.0  
**Date:** 2026-10-07  
**Project:** COEMS (Commercial Operations & Enterprise Management System)  
**Parent Module:** Inquiry (see COEMS-INQ-BRD-001, `BRD/Inquiry_Module_BRD.md`)  
**Related User Story:** [inquiry-port-expense-historical-suggestions.md](../docs/user-stories/inquiry-port-expense-historical-suggestions.md)

---

## 1. Description

When a chartering user selects a Port of Loading or a Port of Discharge on an Inquiry, COEMS already reveals a **Loading Days / Discharging Days** table and a port-level **Income/Expense** table, and seeds that table with three default expense lines. Today those three lines are empty placeholders (Terms = Lumpsum, Rate = 0, Qty = 1, Amount = $0), so the user has to look up or recall what each cost has historically been at that port and type it in.

This enhancement replaces the placeholder values with **suggestions derived from the company's own history**: for each of the three default expense heads, COEMS looks at what that expense actually was on previous **completed voyages that called at the selected port** and pre-fills **Terms, Rate, Qty and Amount** with the average of those historical values. The user can accept, edit or delete any suggestion exactly as they can today.

The enhancement enables:

- A realistic, port-specific starting estimate for port costs from the moment a port is chosen, instead of $0 placeholders
- Consistent costing across the chartering team, because everyone starts from the same historical baseline rather than individual memory
- Faster Inquiry creation — less manual lookup and re-keying of port costs
- Better quality Inquiry-stage economics, which flow onward into Fixtures and Voyage Estimates

This BRD covers **only** the pre-fill of the three default expense lines. It does not change when the Days and Income/Expense sections appear, which three account heads are the defaults, or how voyage expenses are recorded.

---

## 2. Key Components

### 2.1 Current Behaviour (Baseline — Verified on UAT)

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

- Each default line has an ✕ to remove it.
- A separate **Cargo Income/Expense** section (under Cargo Measurement Summary) holds only a blank row and no defaults. It is not affected by this enhancement.

### 2.2 Target Behaviour

When a port is selected in either block, the three default lines still appear as above, but **Terms, Rate, Qty and Amount are pre-filled from that port's history** rather than set to Lumpsum / 0 / 1 / $0. Account Head and Particulars are unchanged.

**Illustrative example** (figures are invented, for explanation only). Rotterdam is selected as Port of Discharge. Three completed voyages previously called at Rotterdam and recorded Port Expenses of $11,000, $12,500 and $13,500 (all Lumpsum, Qty 1):

| Account Head | Terms | Rate | Qty | Amount |
|---|---|---|---|---|
| Port Expenses | Lumpsum | 12,333 | 1 | $12,333 |
| Stevedoring expenses | *(from Stevedoring history)* | | | |
| Lashing/welding gang | *(from Lashing history, or default if none)* | | | |

The user sees a suggested figure of $12,333 for Port Expenses instead of $0, can overwrite it, and the line carries a "suggested from previous voyages" cue until they do.

### 2.3 Functional Requirements

#### FR-1 Trigger

- Suggestions are generated when a port is **selected or changed** in a **Port of Loading** or **Port of Discharge** block, in the New Inquiry overlay and when editing a saved Inquiry's port blocks.
- Each port block is independent. A multi-port Inquiry (added with the "+" next to Port of Loading / Port of Discharge) receives suggestions per port, from that port's own history.
- Suggestions are matched **per account head**. Port Expenses are suggested only from past Port Expenses, Stevedoring only from past Stevedoring, Lashing/welding gang only from past Lashing/welding gang. A line is never filled from another head.

#### FR-2 Historical Data Source

| Rule | Decision |
|---|---|
| Which voyages | **Completed voyages only.** In-progress voyages, even with expenses already booked, are excluded. |
| Which port role | **Any past call at the port**, regardless of whether it was a Loading or a Discharge call. Loading history may inform a Discharge block and vice versa. |
| Which expense heads | Only the same three heads: Port Expenses, Stevedoring expenses, Lashing/welding gang. |
| Other record types | Inquiries, Fixtures and Voyage Estimates that never became a voyage are **not** a source. Only actual voyage expense data counts. |
| Matching key | **Port alone.** No narrowing by Cargo Category, Subcategory, cargo size, vessel or any other Inquiry field. |
| Recency | **No cut-off.** All completed voyages at the port are included, however old. |
| Minimum sample | **None.** A suggestion is shown even when only one completed voyage exists. |

#### FR-3 Calculation

For each account head at the selected port:

1. Collect every qualifying historical expense line (FR-2).
2. Convert each line's amounts to the Inquiry's **Base Currency** using that line's **original voyage conversion rate** (FR-5), before any averaging.
3. Determine the **Terms** to use: take the **most frequent Terms** among the qualifying lines. If two Terms are equally frequent, the Terms from the **more recent** completed voyage win.
4. Keep only the lines that used those Terms. Lines on other Terms are ignored for that head.
5. Compute the **average** of Rate, Qty and Amount across the remaining lines.
6. Round to the same decimal precision the Rate, Qty and Amount fields already display.
7. Pre-fill the line with: the chosen Terms (copied as-is), and the averaged Rate, Qty and Amount.

Terms are **never** converted to Lumpsum. Non-Lumpsum Terms (for example per-day or per-unit) are preserved exactly as recorded.

#### FR-4 Fallback When There Is No History

- If the selected port has no qualifying completed voyage with a recorded expense for a given head, that line keeps today's default: **Lumpsum / 0 / 1 / $0**.
- No error, warning or empty-state message is shown.
- Partial history is handled head by head: a port with Port Expenses and Stevedoring history but no Lashing history fills the first two lines and leaves the third on the plain default.

#### FR-5 Currency

- Suggested Amount (and Rate where it is a monetary rate) is shown in the Inquiry's **Base Currency** (US Dollar by default in the overlay's Cargo Details).
- Where a past expense was recorded in another currency, it is converted using **that voyage's own original conversion rate**, not today's rate and not the Inquiry's Conversion Rate As On date.
- Conversion is applied to each historical value **before** the average is taken.
- A suggestion is never displayed in a currency different from the rest of the Inquiry's Income/Expense.

#### FR-6 Editing and Overwrite Rules

- All pre-filled values are ordinary editable fields. The user may overwrite Terms, Rate, Qty or Amount, or remove the line with the existing ✕.
- Amount continues to follow the existing Rate × Qty calculation when the user edits Rate or Qty after a suggestion has been applied.
- **Changing the port** in a block re-derives suggestions for the new port **only for lines the user has not edited**. Lines the user has edited keep their values.
- **Clearing the port** behaves as today. Suggested values are not retained for a port that is no longer selected.
- A line the user has deleted is **not** re-added by a later port change.
- The system never silently overwrites anything the user has typed.

#### FR-7 Visual Indication

- Suggested values must be visibly distinguishable from user-entered values, for example a subtle "Suggested from previous voyages" tooltip or badge on the line.
- The indication is removed as soon as the user edits that line.

#### FR-8 Persistence and Downstream Carry-Over

- On save, the three lines are stored like any other Income/Expense entry and become the Inquiry's own data. Later changes to the port's history never retroactively change a saved Inquiry.
- The values carry over through "Make a Fixture" and to linked Voyage Estimates exactly as manually entered port expense lines do today. No new carry-over logic is required.
- The "suggested" indication is a creation-time cue only and is not required to persist after save.

### 2.4 Business Rules Summary

| # | Rule |
|---|---|
| BR-1 | Suggestions apply only to the three default expense lines per port block, on both Port of Loading and Port of Discharge. |
| BR-2 | History = completed voyages only, any past call at the port, port alone as the matching key. |
| BR-3 | Suggested value = average of Rate, Qty and Amount across qualifying lines sharing the most frequent Terms. |
| BR-4 | Terms are copied as-is from history, never forced to Lumpsum. |
| BR-5 | Each historical amount is converted at its own voyage's original rate before averaging. |
| BR-6 | No history for a head means the existing Lumpsum / 0 / 1 / $0 default, silently. |
| BR-7 | User-edited lines are never overwritten by a port change. |
| BR-8 | A suggestion never changes a saved Inquiry after the fact. |

### 2.5 Edge Cases

| Scenario | Expected behaviour |
|---|---|
| Port has exactly one completed voyage with the expense | The suggestion equals that voyage's values. |
| Port has history under mixed Terms (e.g. Lumpsum on two voyages, per-day on one) | Most frequent Terms (Lumpsum) are used; the per-day voyage is excluded from that head's average. |
| Two Terms equally frequent | The Terms from the more recent completed voyage win. |
| Past expense recorded in a foreign currency | Converted at that voyage's own rate, then averaged. |
| Port selected, then the same port re-selected | No change; user-edited lines are untouched, untouched lines keep their suggestion. |
| Port changed after the user edited one of the three lines | Edited line is kept; the other two lines are re-derived for the new port. |
| User deleted a default line, then changed the port | The deleted line stays deleted. |
| Port selected as both a Loading and a Discharge port on the same Inquiry | Each block receives the same history-derived suggestion independently. |
| Historical data exists for the port but only for non-default heads | All three lines stay on the plain default. |

---

## 3. Project Scope

### 3.1 In Scope

- Pre-filling Terms, Rate, Qty and Amount on the three default Income/Expense lines (Port Expenses, Stevedoring expenses, Lashing/welding gang)
- Both Port of Loading and Port of Discharge blocks
- The New Inquiry overlay and the port blocks on a saved Inquiry in Edit mode
- Read-only lookup of historical expense data from completed voyages, per port and per account head
- Averaging with most-frequent-Terms selection, per-voyage original-rate currency conversion, and silent fallback to current defaults
- A visual "suggested" cue on pre-filled lines
- Edit, delete and port-change handling as defined in FR-6

### 3.2 Out of Scope

- **Cargo Income/Expense** (the separate section under Cargo Measurement Summary): unchanged
- **Loading Days / Discharging Days** (Port working days row): not suggested from history
- Changing which three account heads are the defaults, or the logic that makes the days and Income/Expense sections appear on port selection
- Suggestions for any account head other than the three defaults, or for rows the user adds manually
- Any change to how expenses are recorded against a voyage. This enhancement only reads existing data
- Forecasting, trend analysis or machine-learning price prediction
- Narrowing history by cargo type, vessel, season or any field other than the port
- Voyage Estimate, Fixture and Voyage module screens, which are not changed
- A bulk "refresh suggestions" action on an already-saved Inquiry
- Reporting or dashboards on suggestion accuracy

---

## 4. Business Drivers

- Remove the manual lookup of port costs that chartering users currently do before they can produce a credible Inquiry estimate
- Make Inquiry-stage cost estimates consistent across users and grounded in what ports have actually cost the company
- Reduce data-entry time and re-keying errors on new Inquiries
- Improve the quality of the economics carried forward into Fixtures and Voyage Estimates
- Make better use of voyage expense data the company already records and currently only uses retrospectively

---

## 5. Assumptions

- Completed voyages record expenses against the same three account heads (Port Expenses, Stevedoring expenses, Lashing/welding gang), so a like-for-like match per head is possible. **To be verified against the voyage expense data model before build.**
- Each historical expense line records the port it relates to, its Terms, Rate, Qty, Amount, currency, and the conversion rate in force on that voyage. If any of these are not stored, FR-3 and FR-5 cannot be met as written.
- A voyage's status (completed versus in-progress) is reliably available to filter on.
- Port identity is consistent across modules, because Inquiry port selection and voyage port calls both use the COEMS port master database.
- The Inquiry's Base Currency is known at the time a port is selected.
- The existing Rate × Qty = Amount behaviour of Income/Expense lines is retained unchanged.
- The tie-break rule for equally frequent Terms (more recent voyage wins) is a drafting default, not a client decision, and can be changed without affecting the rest of the design.

---

## 6. Constraints

- Suggestions are only as good as the history. A port with little or no completed-voyage data will show defaults or a figure based on a single voyage.
- An average over **all** completed voyages with **no recency window** means very old tariffs carry the same weight as recent ones and can skew the suggestion. This is an accepted trade-off, decided by the client.
- With **no minimum sample size**, a suggestion based on one voyage can look more authoritative than it is. The "suggested" cue (FR-7) is the mitigation.
- Port-only matching ignores that costs vary by cargo type and size. Users are expected to edit suggestions where the cargo is atypical.
- Lookup must not noticeably delay the form after a port is chosen. The Days and Income/Expense sections already appear immediately and suggestions are expected to arrive without blocking that.
- The enhancement must not change any existing saved Inquiry. It applies to port selection events only.

---

## 7. Decisions Log

All decisions confirmed with the product owner on 2026-10-07.

| Question | Decision |
|---|---|
| Is history specific to the port's role (Loading vs Discharge)? | No. Any past call at the port counts. |
| Which historical value is suggested? | The average. |
| Currency conversion basis for foreign-currency history | The original voyage's conversion rate. |
| Which voyages count? | Completed voyages only. |
| Non-Lumpsum Terms | Copied as-is. |
| Narrow by cargo type? | No. Port alone is enough. |
| Mixed Terms when averaging | Use the most frequent Terms; average only the voyages that used them. |
| Recency window | None. Average covers all completed voyages. |
| Minimum sample size | None. A suggestion shows even with one completed voyage. |

**Open items:** none outstanding from the client. One drafting default (the equal-frequency Terms tie-break) is flagged in Section 5 for optional confirmation.

---

## 8. Dependencies and Risks

| Item | Detail |
|---|---|
| Voyage expense data model | Must expose, per completed voyage, per port and per account head: Terms, Rate, Qty, Amount, currency and the voyage's conversion rate. Confirm availability before build. |
| Historical data quality | Inconsistent account-head naming or free-text heads on past voyages would reduce match rates. Heads may need mapping to the three defaults. |
| Port master consistency | Duplicate or renamed ports in the port master would split history across records. |
| Performance | Averaging across a port's full history on every port selection should be cached or pre-aggregated if volumes are large. |
| User trust | Users may over-rely on suggestions. Mitigated by the visible "suggested" cue and by keeping every value editable. |

---

## 9. User Stories Reference

| Story | Description |
|---|---|
| Inquiry Port Expense Historical Suggestions | Pre-fill the three default port expense lines with averages from completed historical voyages at the selected port ([user story](../docs/user-stories/inquiry-port-expense-historical-suggestions.md)) |

---

## 10. Mockup Reference

The existing Inquiry UI is documented in COEMS-INQ-BRD-001 (sections 2.2 New Inquiry Creation, 2.3.5 Port Calls Tab and 2.3.8 Accounting Tab). The baseline behaviour in Section 2.1 above was verified on the UAT environment.

**UAT Environment:** [https://coems.uat.admaren.org](https://coems.uat.admaren.org)

Key source files (prototype):

1. **Inquiry Listing and New Inquiry overlay** — `src/app/components/inquiry.tsx`
2. **Inquiry Detail Overlay (Cargo and Port Calls tabs)** — `src/app/components/inquiry-detail.tsx`

No mockup change has been made for this enhancement yet.
