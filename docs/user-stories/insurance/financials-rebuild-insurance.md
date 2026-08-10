#### **USER Story:**

**As a user managing Insurance records (Version 2.0),**
**I want to** enter the financial details for whichever single Type of Cover a policy actually has, see the premium/tax figures the broker's actuarial spreadsheet would calculate computed automatically, and be steered toward only the field group that applies to my policy
**So that** I never have to duplicate the same number in two places, never have to manually work out a formula the source spreadsheet already defines, and never see five other cover types' worth of irrelevant fields open on my screen.

> **Supersedes COEMS-21212** ("Insurance – New fields based on Type of Cover"). That story specified a **static** set of fields — all 6 cover-type groups always present with **no conditional logic** tied to Type of Cover, and several fields (Sum Insured, Deductible, Premium Rate (%), Annual Premium, Leading Underwriter) kept as shared/common fields alongside the new per-type ones. Based on the client's Friday demo feedback and a full field/formula reconciliation against the broker's **"Vessel Insurance Overview"** workbook, both of those decisions are reversed below: the common fields turned out to duplicate the per-type fields, several fields the workbook calculates via formula were sitting as free-text/manual entry, and the client explicitly asked that only the group matching the selected Type of Cover be enabled.

---

#### **acceptance criteria:**

### 1. Common fields removed (duplicated the per-type groups)

The following fields are **removed from the Financials section for Version 2.0 only** (Version 1.0 is unchanged). Each was a vessel-wide figure that only ever meant "the Hull & Machinery number," which now lives inside the Hull & Machinery + Increased Value group instead:

| Removed field | Where it now lives instead |
| --- | --- |
| Sum Insured | H&M Sum Insured (Hull & Machinery + Increased Value group) |
| Deductible | PA Deductible (Hull & Machinery + Increased Value group) |
| Premium Rate (%) | H&M Rate (%) (Hull & Machinery + Increased Value group) |
| Annual Premium | H&M Premium (Hull & Machinery + Increased Value group) |
| Leading Underwriter | Leading H&M/IV/LoH/War Underwriter (each group has its own) |

* Sum Insured and Deductible were previously mandatory fields; removing them for Version 2.0 means Insurance Status, Policy Start/End Date, and Insurer/Club remain the only mandatory Financials-adjacent fields.

### 2. New field added: H&M Sum Insured

* The Hull & Machinery + Increased Value group is missing its own Sum Insured field in the original COEMS-21212 build — every downstream formula (TSI, H&M Premium, War H&M mirror) needs it. **H&M Sum Insured** (Currency, manual entry) is added as the first field in that group.

### 3. New fields added: per-type Tax and Total fields

The following 12 fields are added, one Tax + one Total pair per group that the source workbook actually calculates a tax/total for. All are **read-only, calculated** (see formulas in section 5) — the user never types into them.

| Group | Tax field (new) | Total field (new) |
| --- | --- | --- |
| Hull & Machinery + Increased Value | Tax H&M | Total Net Premium (H&M+IV) |
| Hull & Machinery + Increased Value | Tax IV | Total Gross Premium Incl. Tax (H&M+IV) |
| Loss of Hire | Tax (LoH) | Total Gross Premium Incl. Tax (LoH) |
| P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D | Tax (P&I) | Total Premium Incl. Tax (P&I) |
| P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D | Tax (FD&D) | Total (FD&D) – Total Gross Premium Incl. Tax |
| Strike and Delay | Tax (Strike and Delay) | Premium Incl. Tax (Strike and Delay) |

* War Risks has no Tax/Total fields — the source workbook has none for this group either (see section 6).
* C/L P&I and C/L FD&D (inside the P&I group) also have no Tax/Total fields — same reason, no formula exists for them in the source.

### 4. Existing fields converted from manual entry to read-only, calculated

The following fields already existed (added under COEMS-21212 as plain manual Currency inputs) and are now **read-only, calculated** instead — see section 5 for the exact formula each one uses:

* Total Sum Insured (TSI) — *(now conditional, see section 8)*
* H&M Premium
* H&M Premium Net of Upfront Performance Bonus
* IV Premium
* LoH Sum Insured
* LoH Premium
* War H&M (sum), War IV (sum), War TSI (sum) — see section 6
* 10% OGD (Gard) / 10% PB (London)
* Net Premium P&I
* Premium (Strike and Delay)
* Upfront NCB 10%
* Premium Net of NCB
* Cost of Extended Covers (ECL/CCC), Incl. Tax — see section 7

All other fields in the six groups (e.g. Disbursements, Freight Total Loss, PA Deductible, Leading H&M/IV/LoH/War Underwriter, H&M/IV/LoH/War/S&D Rate, P&I Club, Gross Premium P&I Incl. R/I, Rate per GT Incl. R/I, R/I Alone, FD&D, Premium FD&D, C/L P&I, Premium TCL P&I, C/L FD&D, Premium TCL FD&D, Insurer (S&D), Daily Entered Sum, Rate (S&D), War-Leading Underwriter, War Rate, War LoH Daily/Basis/TSI, Cost of Extended Covers Excl. Tax) remain manual entry — the source workbook has no formula for them either (two exceptions called out explicitly in section 9: Rate per GT Incl. R/I and Cost of Extended Covers Excl. Tax).

* A calculated field is visually distinguished from a manual field: grey background, non-editable, and a small **"(calculated)"** tag next to its label.

### 5. Formulas — Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay

All formulas are taken directly from the source "Vessel Insurance Overview" workbook's cell formulas (not reverse-engineered from static values). **Tax Rate (%)** is the single shared field used as the rate input for every Tax calculation below — it is not duplicated per group.

| # | Field | Formula |
| --- | --- | --- |
| 1 | Total Sum Insured (TSI) | H&M Sum Insured + IV Total |
| 2 | H&M Premium | ROUND(H&M Sum Insured × H&M Rate %, 0) |
| 3 | H&M Premium Net of Upfront Performance Bonus | H&M Premium − Upfront Performance Bonus (PB/CC) |
| 4 | Tax H&M | ROUND(H&M Premium Net of Upfront Performance Bonus × Tax Rate %, 2) |
| 5 | IV Premium | ROUND(IV Total × IV Rate %, 0) |
| 6 | Tax IV | ROUND(IV Premium × Tax Rate %, 2) |
| 7 | Total Net Premium (H&M+IV) | H&M Premium Net of Upfront Performance Bonus + IV Premium |
| 8 | Total Gross Premium Incl. Tax (H&M+IV) | Total Net Premium (H&M+IV) + Tax H&M + Tax IV |
| 9 | LoH Sum Insured | 180 × Daily Indemnity (LoH) |
| 10 | LoH Premium | ROUND(LoH Sum Insured × LoH Rate %, 0) |
| 11 | Tax (LoH) | ROUND(LoH Premium × Tax Rate %, 2) |
| 12 | Total Gross Premium Incl. Tax (LoH) | LoH Premium + Tax (LoH) |
| 13 | Net Premium P&I | ROUND(Gross Premium P&I Incl. R/I × 0.9, 0) |
| 14 | 10% OGD (Gard) / 10% PB (London) | Gross Premium P&I Incl. R/I − Net Premium P&I |
| 15 | Tax (P&I) | ROUND(Net Premium P&I × Tax Rate %, 2) |
| 16 | Total Premium Incl. Tax (P&I) | Net Premium P&I + Tax (P&I) |
| 17 | Tax (FD&D) | ROUND(Premium FD&D × Tax Rate %, 2) |
| 18 | Total (FD&D) – Total Gross Premium Incl. Tax | Premium FD&D + Tax (FD&D) |
| 19 | Premium (Strike and Delay) | ROUND(Daily Entered Sum × Rate (Strike and Delay), 2) |
| 20 | Upfront NCB 10% | ROUND(Premium (Strike and Delay) × 10%, 2) |
| 21 | Premium Net of NCB | Premium (Strike and Delay) − Upfront NCB 10% |
| 22 | Tax (Strike and Delay) | ROUND(Premium Net of NCB × Tax Rate %, 2) |
| 23 | Premium Incl. Tax (Strike and Delay) | Premium Net of NCB + Tax (Strike and Delay) |

### 6. War Risks: mirrored fields, not independent entry

* **War H&M (sum)** and **War IV (sum)** are read-only fields that automatically copy **H&M Sum Insured** and **IV Total** respectively, live, as the user types in the Hull & Machinery + Increased Value group — this is a 1:1 mirror in the source workbook, not a separate figure the user re-enters.
* **War TSI (sum)** = War H&M (sum) + War IV (sum), calculated.
* **War LoH Daily**, **War LoH Basis**, and **War LoH TSI** remain manual entry — confirmed there is no formula for these in the source workbook.
* War Risks has no Tax or Total field of its own (see section 8 for how tax/total are still captured for this cover type).
* **Because the mirror needs a real, editable source:** selecting **War Risk** or **Extra War Risk insurance (EWRI)** as Type of Cover unlocks **both** the War Risks group **and** the Hull & Machinery + Increased Value group together (see section 11) — the user enters H&M Sum Insured / IV Total there as the insured-value basis war risk is priced against, and War H&M/IV/TSI mirror it live. The Hull & Machinery + Increased Value group's header shows a small inline note ("unlocked — War Risk premium is based on Sum Insured / IV Total here") whenever it's open for this reason rather than because H&M/IV was the actual selected cover. The rest of that group (Premium, Rate, Tax H&M/IV, Totals) is still fully usable in this state — those figures describe the vessel's H&M+IV cover, not the War Risk policy's own premium, so they don't feed anything on the War Risks side and the common Tax Amount / Total Premium Incl. Tax fields (section 8) still fall back to manual entry for a War Risk record rather than assuming the unlocked H&M+IV group's totals belong to it.

### 7. Cost of Extended Covers

* **Cost of Extended Covers (ECL/CCC), Excl. Tax** remains manual entry — the source formula references a separate, external workbook not available to this system.
* **Cost of Extended Covers (ECL/CCC), Incl. Tax** is calculated: `Cost of Extended Covers (ECL/CCC), Excl. Tax × 1.19` (a fixed 19% uplift baked into the source formula, independent of the Tax Rate (%) field).
* These two fields move into their own new collapsible group, **Extended Covers (ECL/CCC/ECC)** (see section 10) — they are not part of the "Total insurance costs (rollup)" group any more (see section 9).

### 8. Total Sum Insured (TSI) / Tax Amount / Total Premium Incl. Tax: conditional fallback

These three fields stay in the Financials section (Coverage Values / Premium Details), but whether they're shown as **read-only calculated** or **manual entry**, or **hidden** entirely, now depends on which Financials group is active for the record's Type of Cover (section 11):

| Field | Hidden (group already shows the equivalent) | Falls back to manual entry |
| --- | --- | --- |
| Total Sum Insured (TSI) | Hull & Machinery + Increased Value, War Risks, Loss of Hire | P&I family, Strike and Delay, Extended Covers, or no Type of Cover selected yet |
| Tax Amount | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected yet |
| Total Premium Incl. Tax | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected yet |

* This exists so that War Risks (which has no Tax/Total field of its own) and the three Type of Cover values with no matching group at all (section 11) still have somewhere to record a premium and tax figure — hiding these fields unconditionally would leave those policies with no way to capture financial data.
* When shown as calculated, the value is derived from whichever single group is active (only one group is ever populated per record, since one record = one Type of Cover).

### 9. "Total insurance costs (rollup)" group removed

* The original COEMS-21212 group **"Total insurance costs (rollup)"** and its 4 sum fields — **Total Annual Premium, Excl. Tax**, **Total Daily Premium, Excl. Tax**, **Total Annual Premium, Incl. Tax**, **Total Daily Premium, Incl. Tax** — are **removed entirely**.
* Reason: in the source workbook, one sheet tracks a vessel's *entire* insurance program (H&M, LoH, War, P&I, S&D all at once), so summing across those column blocks produces a real "total insurance cost for this vessel." In this system, one Insurance record represents **one** Type of Cover, so at most one group is ever populated — summing across all 6 groups on a single record just reproduces that one group's number plus a run of zeros. It is not a meaningful total and is dropped rather than kept as a always-zero-padded figure.
* **Total Cost Incl. Extended Covers, Excl. Tax** and **Total Cost Incl. Extended Covers, Incl. Tax** are also removed — they were defined as "the rollup above + Cost of Extended Covers," so once the rollup is gone they'd be identical to the Cost of Extended Covers fields themselves.
* Rate per GT Incl. R/I remains manual entry — its source formula divides by vessel Gross Tonnage (GT), which is not currently captured anywhere on the Insurance record. *(Flagged as a follow-up: add a GT field if this calculation is wanted.)*

### 10. New group: Extended Covers (ECL/CCC/ECC)

* A new 6th collapsible group, **Extended Covers (ECL/CCC/ECC)**, replaces the deleted rollup group in the same position (still inside Financials → Premium Details, after the existing 5 groups).
* Contains 2 fields: **Cost of Extended Covers (ECL/CCC), Excl. Tax** (manual) and **Cost of Extended Covers (ECL/CCC), Incl. Tax** (calculated, section 7).
* Enabled when Type of Cover is **Comprehensive Carrier's Liability Cover (CCC)** or **Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)** (section 11).

### 11. Type of Cover gates which Financials group(s) are enabled

This reverses COEMS-21212's "no dynamic field visibility, no conditional logic" decision, per the client's Friday demo request: *when a Type of Cover is selected, only the matching group should be enabled — the rest should be disabled.*

* All 6 collapsible groups are always **visible** (not hidden from the page), but only the group(s) matching the record's selected **Type of Cover** can be expanded and edited. The rest render **greyed out**, cannot be clicked/expanded, and show the note **"Not applicable for selected Type of Cover"** in place of the expand chevron.
* If no Type of Cover has been selected yet, all 6 groups are disabled/greyed out.
* Every Type of Cover unlocks exactly one group, **except War Risk and EWRI, which unlock two** — War Risks itself plus Hull & Machinery + Increased Value, since the War Risks mirror needs that group's Sum Insured fields to be editable (section 6). Selecting Hull and Machinery (H&M) or Increased Value (IV) directly does **not** unlock War Risks — the relationship is one-directional.
* Mapping of each of the 16 Type of Cover values to its group(s):

| Type of Cover | Enabled group(s) |
| --- | --- |
| Hull and Machinery (H&M) | Hull & Machinery + Increased Value |
| Increased Value (IV) | Hull & Machinery + Increased Value |
| Loss of Hire (LOH) | Loss of Hire |
| War Risk | War Risks **and** Hull & Machinery + Increased Value |
| Extra War Risk insurance (EWRI) | War Risks **and** Hull & Machinery + Increased Value |
| Protection & Indemnity (P&I) | P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D |
| Charterer's Liability (CL) | P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D |
| FD&D (UHL as charterer) | P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D |
| FD&D (UHL as owner) | P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D |
| Extended Crew Cover (P&I extension) | P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D |
| Strike and Delay | Strike and Delay |
| Comprehensive Carrier's Liability Cover (CCC) | Extended Covers (ECL/CCC/ECC) |
| Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC) | Extended Covers (ECL/CCC/ECC) |
| Comprehensive General Liability (CGL) | *(none — see below)* |
| Transport insurance | *(none — see below)* |
| Professional indemnity | *(none — see below)* |

* **Comprehensive General Liability (CGL)**, **Transport insurance**, and **Professional indemnity** have no fields or formulas anywhere in the source workbook, so no group applies to them — all 6 groups stay disabled for these three types. Per section 8, these types still get Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax as manual fields so a premium can still be recorded.

### 12. Data correction: existing seed records

* 3 pre-existing Insurance records carried Type of Cover values from before this rebuild (e.g. "Hull & Machinery", "Charterers' P&I", "Crew Liability") that no longer match the current 16-value list, which meant their Type of Cover dropdown showed blank and every Financials group stayed disabled regardless of the record's actual cover type. These are corrected to their closest current equivalents: "Hull and Machinery (H&M)", "Charterer's Liability (CL)", and "Extended Crew Cover (P&I extension)".

### 13. Out of scope / known gaps (unchanged from investigation, carried forward for visibility)

* **Rate per GT Incl. R/I** stays manual — no vessel Gross Tonnage (GT) field exists on the Insurance record to calculate it from.
* **Cost of Extended Covers (ECL/CCC), Excl. Tax** stays manual — its source formula references a separate external workbook not available to this system.
* **C/L P&I**, **Premium TCL P&I**, **C/L FD&D**, **Premium TCL FD&D** stay manual — the source workbook has no formula for these either.
* This story applies to **Version 2.0 only**. Version 1.0's Financials section (Sum Insured, Deductible, Premium Rate, Annual Premium, Leading Underwriter, and no collapsible groups) is unchanged.

---

#### **technical details:**

(To be updated by Techleads)

#### **NON-Functional Requirements:**

| Particulars | Name | Date | Comments |
| --- | --- | --- | --- |
| Document Owner | | | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
