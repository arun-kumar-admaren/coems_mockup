#### **USER Story:**

**As a user managing Insurance records (Version 2.0),**
**I want to** pick a Type of Cover and immediately see just that cover's own financial fields appear, with the premium/tax figures the broker's actuarial spreadsheet would calculate computed automatically
**So that** I never have to duplicate the same number in two places, never have to manually work out a formula the source spreadsheet already defines, and never have to click through a menu of other cover types' fields to find the ones that apply to my policy.

> Supersedes COEMS-21212 ("Insurance – New fields based on Type of Cover").

---

#### **acceptance criteria:**

### 1. Common fields (constant, not tied to Type of Cover)

The following fields in **Coverage Values** / **Premium Details** are always visible and editable, for every Type of Cover, in both versions: **Currency, Sum Insured, Total Sum Insured (TSI), Deductible, Daily Indemnity (LoH), Basis/Terms, Premium Rate (%), Annual Premium, Tax Rate (%), Tax Amount, Total Premium Incl. Tax.**

* **Sum Insured** and **Deductible** are mandatory in both versions; the rest are optional.
* **Sum Insured** is used directly as the insured value in the Hull & Machinery + Increased Value formulas (H&M Premium, Total Sum Insured (TSI), War H&M mirror — sections 4–5). There is no separate H&M-specific Sum Insured field.
* **Deductible** is the only deductible field in the form. There is no per-cover-type deductible field.
* **Leading Underwriter is not a common field** — each cover type that has an underwriter concept (H&M, IV, LoH, War) has its own Leading Underwriter field instead, since they can genuinely differ from each other on the same policy.

### 2. Field inventory, by Type of Cover

One table per set of Type of Cover values that share the exact same fields — the table title lists every cover that set applies to. The common fields from section 1 aren't repeated here since they apply to all 16 types equally. **Formula** reads "Manual entry" where the source workbook has no formula for that field.

#### Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI)

| Field | Field Type | Formula |
| --- | --- | --- |
| Disbursements | Currency | Manual entry |
| Freight Total Loss | Currency | Manual entry |
| Equipment (H&M) | Currency | Manual entry |
| Freight All Risks | Currency | Manual entry |
| IV Total | Currency | Manual entry |
| AMD | Currency | Manual entry |
| Leading H&M Underwriter | Free Text | Manual entry |
| Leading IV Underwriter | Free Text | Manual entry |
| H&M Rate (%) | Percentage | Manual entry |
| IV Rate (%) | Percentage | Manual entry |
| H&M Premium | Currency | ROUND(Sum Insured × H&M Rate %, 0) |
| Upfront Performance Bonus (PB/CC) | Currency | Manual entry |
| H&M Premium Net of Upfront Performance Bonus | Currency | H&M Premium − Upfront Performance Bonus (PB/CC) |
| IV Premium | Currency | ROUND(IV Total × IV Rate %, 0) |
| Tax H&M | Currency | ROUND(H&M Premium Net of Upfront Performance Bonus × Tax Rate %, 2) |
| Tax IV | Currency | ROUND(IV Premium × Tax Rate %, 2) |
| Total Net Premium (H&M+IV) | Currency | H&M Premium Net of Upfront Performance Bonus + IV Premium |

#### Loss of Hire (LOH)

| Field | Field Type | Formula |
| --- | --- | --- |
| LoH Sum Insured | Currency | 180 × Daily Indemnity (LoH) |
| LoH Leading Underwriter | Free Text | Manual entry |
| LoH Rate (%) | Percentage | Manual entry |
| LoH Premium | Currency | ROUND(LoH Sum Insured × LoH Rate %, 0) |

#### War Risk, Extra War Risk insurance (EWRI)

| Field | Field Type | Formula |
| --- | --- | --- |
| War H&M (sum) | Currency | = Sum Insured (mirror) |
| War IV (sum) | Currency | = IV Total (mirror) |
| War-Leading Underwriter | Free Text | Manual entry |
| War Rate (%) | Percentage | Manual entry |
| War LoH Daily | Currency | Manual entry |
| War LoH Basis | Numeric | Manual entry |
| War LoH TSI | Currency | Manual entry |

*War Risks has no Tax or Total field of its own — the source workbook has none for this cover (section 5).*

#### Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension)

| Field | Field Type | Formula |
| --- | --- | --- |
| P&I Club | Free Text | Manual entry |
| Gross Premium P&I Incl. R/I | Currency | Manual entry |
| Rate per GT Incl. R/I | Currency | Manual entry *(no GT field to calculate from — section 15)* |
| R/I (Reinsurance) Alone | Currency | Manual entry |
| 10% OGD (Gard) / 10% PB (London) | Currency | Gross Premium P&I Incl. R/I − Net Premium P&I |
| Net Premium P&I | Currency | ROUND(Gross Premium P&I Incl. R/I × 0.9, 0) |
| Tax (P&I) | Currency | ROUND(Net Premium P&I × Tax Rate %, 2) *(Gard-vessel variant — section 15)* |
| Total Premium Incl. Tax (P&I) | Currency | Net Premium P&I + Tax (P&I) |
| FD&D | Currency | Manual entry |
| Premium FD&D | Currency | Manual entry |
| Tax (FD&D) | Currency | ROUND(Premium FD&D × Tax Rate %, 2) |
| Total (FD&D) – Total Gross Premium Incl. Tax | Currency | Premium FD&D + Tax (FD&D) |
| C/L P&I | Currency | Manual entry |
| Premium TCL P&I | Currency | Manual entry |
| C/L FD&D | Currency | Manual entry |
| Premium TCL FD&D | Currency | Manual entry |

*C/L P&I and C/L FD&D have no Tax/Total fields — no formula exists for them in the source.*

#### Strike and Delay

| Field | Field Type | Formula |
| --- | --- | --- |
| Insurer (Strike and Delay) | Free Text | Manual entry |
| Daily Entered Sum | Currency | Manual entry |
| Rate (Strike and Delay) | Currency | Manual entry |
| Premium (Strike and Delay) | Currency | ROUND(Daily Entered Sum × Rate (Strike and Delay), 2) |
| Upfront NCB 10% | Currency | ROUND(Premium (Strike and Delay) × 10%, 2) |
| Premium Net of NCB | Currency | Premium (Strike and Delay) − Upfront NCB 10% |

#### Comprehensive Carrier's Liability Cover (CCC), Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)

| Field | Field Type | Formula |
| --- | --- | --- |
| Cost of Extended Covers (ECL/CCC), Excl. Tax | Currency | Manual entry |

#### Comprehensive General Liability (CGL), Transport insurance, Professional indemnity

No fields — only the common fields from section 1 apply to these three types.

* Several calculated fields are computed but not shown separately in the tables above because they'd duplicate a common field — section 14 lists exactly which ones and why.

### 3. Fields calculated from a formula, not manual entry

The following fields are **read-only, calculated** — formulas in section 4:

* Total Sum Insured (TSI) *(calculated only some of the time — section 7)*
* H&M Premium, H&M Premium Net of Upfront Performance Bonus, IV Premium
* LoH Sum Insured, LoH Premium
* War H&M (sum), War IV (sum) — section 5
* 10% OGD (Gard) / 10% PB (London), Net Premium P&I
* Premium (Strike and Delay), Upfront NCB 10%, Premium Net of NCB
* Cost of Extended Covers (ECL/CCC), Incl. Tax — section 6

All other fields (Disbursements, Freight Total Loss, Leading H&M/IV/LoH/War Underwriter, H&M/IV/LoH/War/S&D Rate, P&I Club, Gross Premium P&I Incl. R/I, Rate per GT Incl. R/I, R/I Alone, FD&D, Premium FD&D, C/L P&I, Premium TCL P&I, C/L FD&D, Premium TCL FD&D, Insurer (S&D), Daily Entered Sum, Rate (S&D), War-Leading Underwriter, War Rate, War LoH Daily/Basis/TSI, Cost of Extended Covers Excl. Tax) are manual entry — no formula exists for them in the source (section 8 covers two of these specifically: Rate per GT Incl. R/I and Cost of Extended Covers Excl. Tax).

* A calculated field is visually distinguished from a manual field: grey background, non-editable, with a small **"(calculated)"** tag next to its label, plus a small grey caption underneath the field showing the formula that produced it (e.g. "= ROUND(Sum Insured × H&M Rate %, 0)" under H&M Premium). Tax Amount and Total Premium Incl. Tax show a generic "sum of the active Type of Cover's field(s)" caption instead, since their actual formula varies by which cover type is active (section 7).

### 4. Formulas, by group

All formulas are taken directly from the source "Vessel Insurance Overview" workbook's cell formulas. **Sum Insured** and **Tax Rate (%)** are the shared common fields used directly as inputs below — neither is duplicated per group.

**Hull & Machinery + Increased Value**

| # | Field | Formula |
| --- | --- | --- |
| 1 | Total Sum Insured (TSI) | Sum Insured + IV Total |
| 2 | H&M Premium | ROUND(Sum Insured × H&M Rate %, 0) |
| 3 | H&M Premium Net of Upfront Performance Bonus | H&M Premium − Upfront Performance Bonus (PB/CC) |
| 4 | Tax H&M | ROUND(H&M Premium Net of Upfront Performance Bonus × Tax Rate %, 2) |
| 5 | IV Premium | ROUND(IV Total × IV Rate %, 0) |
| 6 | Tax IV | ROUND(IV Premium × Tax Rate %, 2) |
| 7 | Total Net Premium (H&M+IV) | H&M Premium Net of Upfront Performance Bonus + IV Premium |
| 8 | Total Gross Premium Incl. Tax (H&M+IV) | Total Net Premium (H&M+IV) + Tax H&M + Tax IV |

*(Total Sum Insured (TSI) is the common field shared with Coverage Values, not a field inside this group — section 7 covers when it's calculated vs. manual.)*

**Loss of Hire**

| # | Field | Formula |
| --- | --- | --- |
| 9 | LoH Sum Insured | 180 × Daily Indemnity (LoH) |
| 10 | LoH Premium | ROUND(LoH Sum Insured × LoH Rate %, 0) |
| 11 | Tax (LoH) | ROUND(LoH Premium × Tax Rate %, 2) |
| 12 | Total Gross Premium Incl. Tax (LoH) | LoH Premium + Tax (LoH) |

**P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D**

| # | Field | Formula |
| --- | --- | --- |
| 13 | Net Premium P&I | ROUND(Gross Premium P&I Incl. R/I × 0.9, 0) |
| 14 | 10% OGD (Gard) / 10% PB (London) | Gross Premium P&I Incl. R/I − Net Premium P&I |
| 15 | Tax (P&I) | ROUND(Net Premium P&I × Tax Rate %, 2) *(Gard-vessel variant — the source workbook also has a London-vessel variant, tax on gross premium rather than net, which is not modeled — section 15)* |
| 16 | Total Premium Incl. Tax (P&I) | Net Premium P&I + Tax (P&I) |
| 17 | Tax (FD&D) | ROUND(Premium FD&D × Tax Rate %, 2) |
| 18 | Total (FD&D) – Total Gross Premium Incl. Tax | Premium FD&D + Tax (FD&D) |

*(C/L P&I and C/L FD&D have no formulas — both stay manual, section 3.)*

**Strike and Delay**

| # | Field | Formula |
| --- | --- | --- |
| 19 | Premium (Strike and Delay) | ROUND(Daily Entered Sum × Rate (Strike and Delay), 2) |
| 20 | Upfront NCB 10% | ROUND(Premium (Strike and Delay) × 10%, 2) |
| 21 | Premium Net of NCB | Premium (Strike and Delay) − Upfront NCB 10% |
| 22 | Tax (Strike and Delay) | ROUND(Premium Net of NCB × Tax Rate %, 2) |
| 23 | Premium Incl. Tax (Strike and Delay) | Premium Net of NCB + Tax (Strike and Delay) |

**War Risks** and **Extended Covers (ECL/CCC/ECC)** have their own formulas, covered in sections 5 and 6 (a live mirror, and a fixed-rate uplift, rather than a Tax Rate (%)-driven chain).

### 5. War Risks: mirrored fields, not independent entry

* **War H&M (sum)** and **War IV (sum)** are read-only fields that automatically copy **Sum Insured** (from Coverage Values) and **IV Total** (from the Hull & Machinery + Increased Value fields) respectively, live. This is a 1:1 mirror in the source workbook, not a separate figure the user re-enters.
* War TSI (sum) = War H&M (sum) + War IV (sum) is calculated but not displayed — section 14.
* **War LoH Daily**, **War LoH Basis**, and **War LoH TSI** are manual entry — no formula exists for these in the source workbook.
* War Risks has no Tax or Total field of its own (section 7 covers how tax/total are still captured for this cover type).
* Selecting **War Risk** or **Extra War Risk insurance (EWRI)** also shows the Hull & Machinery + Increased Value fields (section 10), since War IV mirrors IV Total from there. A caption ("War Risk premium is calculated from Sum Insured / IV Total above. Hull & Machinery / Increased Value fields below are that cover's own details.") appears above those fields when shown for this reason. The rest of those fields (Premium, Rate, Tax H&M/IV, Totals) describe the vessel's H&M+IV cover, not the War Risk policy's own premium — the common Tax Amount / Total Premium Incl. Tax fields (section 7) fall back to manual entry for a War Risk record rather than treating the H&M+IV fields' totals as this record's own.

### 6. Cost of Extended Covers

* **Cost of Extended Covers (ECL/CCC), Excl. Tax** is manual entry — the source formula references a separate, external workbook not available to this system.
* **Cost of Extended Covers (ECL/CCC), Incl. Tax** = `Cost of Extended Covers (ECL/CCC), Excl. Tax × 1.19` (a fixed 19% uplift, independent of Tax Rate (%)). Calculated but not displayed as its own field — section 14.
* The 19% uplift amount (Incl. Tax − Excl. Tax) feeds the common Tax Amount field; the full Incl. Tax figure feeds the common Total Premium Incl. Tax field.
* This field-set, **Extended Covers (ECL/CCC/ECC)** (section 9), is not part of the "Total insurance costs (rollup)" fields (section 8).

### 7. Total Sum Insured (TSI) / Tax Amount / Total Premium Incl. Tax: calculated vs. manual

These three constant fields (section 1) switch between **read-only calculated** and plain **manual entry** depending on Type of Cover:

| Field | Calculated when | Manual entry when |
| --- | --- | --- |
| Total Sum Insured (TSI) | Hull & Machinery + Increased Value, War Risks, Loss of Hire | P&I family, Strike and Delay, Extended Covers, or no Type of Cover selected |
| Tax Amount | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected |
| Total Premium Incl. Tax | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected |

* When calculated, the value is derived from whichever single field-set is showing (only one field-set is ever real per record, since one record = one Type of Cover).
* War Risks (no Tax/Total field of its own) and the three Type of Cover values with no matching field-set (section 10) get manual entry so a premium can still be recorded.
* Deductible, Sum Insured, Premium Rate (%), and Annual Premium are not part of this table (section 1) — they're always manual, since none of them has a formula.

### 8. "Total insurance costs (rollup)" fields removed

* **Total Annual Premium, Excl. Tax**, **Total Daily Premium, Excl. Tax**, **Total Annual Premium, Incl. Tax**, **Total Daily Premium, Incl. Tax**, **Total Cost Incl. Extended Covers, Excl. Tax**, and **Total Cost Incl. Extended Covers, Incl. Tax** are removed. One Insurance record represents one Type of Cover, so at most one field-set is ever populated — summing across all of them on a single record just reproduces that one field-set's number.
* **Rate per GT Incl. R/I** stays manual — its formula divides by vessel Gross Tonnage (GT), which is not captured anywhere on the Insurance record.

### 9. Extended Covers (ECL/CCC/ECC) field-set

* Contains 2 fields: **Cost of Extended Covers (ECL/CCC), Excl. Tax** (manual) and **Cost of Extended Covers (ECL/CCC), Incl. Tax** (calculated, section 6).
* Shown when Type of Cover is **Comprehensive Carrier's Liability Cover (CCC)** or **Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)** (section 10).

### 10. Type of Cover determines which fields are shown — no grouping/collapsible UI

* Under Financials → Premium Details, right after the common fields (section 7), the fields belonging to the selected Type of Cover render directly — flat, in the same field grid, with no border box, no heading, and nothing to click to reveal them.
* If no Type of Cover has been selected yet, no cover-specific fields render at all.
* Every Type of Cover shows exactly one field-set, **except War Risk and EWRI, which show two** — War Risks plus Hull & Machinery + Increased Value, since the War mirror needs IV Total to be editable there (section 5). Selecting Hull and Machinery (H&M) or Increased Value (IV) directly does **not** also show the War Risks fields.

| Type of Cover | Field-set(s) shown |
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
| Comprehensive General Liability (CGL) | *(none)* |
| Transport insurance | *(none)* |
| Professional indemnity | *(none)* |

* **Comprehensive General Liability (CGL)**, **Transport insurance**, and **Professional indemnity** have no fields or formulas in the source workbook, so nothing extra renders for them. Per section 7, they still get Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax as manual fields.

### 11. Values clear when Type of Cover changes

* Whenever the user changes **Type of Cover** while adding or editing a record, every field belonging to any of the 6 Type of Cover field-sets — plus the common Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax fallback fields (section 7) — resets to blank/zero.
* Currency, Sum Insured, Deductible, Daily Indemnity (LoH), Basis/Terms, Tax Rate (%), Premium Rate (%), and Annual Premium are unaffected — they're constant common fields, not tied to a specific cover type.
* This only fires on an actual user change to the dropdown — opening an existing record for editing loads its saved data normally without clearing anything.

### 12. Data correction: existing seed records

* 3 pre-existing Insurance records carried Type of Cover values that no longer match the current 16-value list ("Hull & Machinery", "Charterers' P&I", "Crew Liability"), so their dropdown showed blank and no cover-specific fields rendered. Corrected to: "Hull and Machinery (H&M)", "Charterer's Liability (CL)", and "Extended Crew Cover (P&I extension)".

### 13. Cover Details: Intended Vessel hidden when Related to = Vessel

* The **Intended Vessel** field (COEMS-21188) is only shown when **Related to** is **Fixture** or not yet selected. When **Related to = Vessel**, Intended Vessel is hidden — **Select Vessel** already captures the vessel.
* If a user had already picked an Intended Vessel and switches Related to back to **Vessel**, the stored value is cleared rather than left saved-but-hidden.

### 14. Fields calculated but not displayed (duplicate of a common field)

Because only one field-set is ever populated per record, a group whose Tax/Total equivalent comes from a single field is identical to the common Tax Amount / Total Premium Incl. Tax / TSI field. These are calculated internally (feeding the common field) but not shown as their own field:

| Field | Group | Duplicates |
| --- | --- | --- |
| War TSI (sum) | War Risks | Total Sum Insured (TSI) |
| Tax (LoH) | Loss of Hire | Tax Amount |
| Total Gross Premium Incl. Tax (LoH) | Loss of Hire | Total Premium Incl. Tax |
| Tax (Strike and Delay) | Strike and Delay | Tax Amount |
| Premium Incl. Tax (Strike and Delay) | Strike and Delay | Total Premium Incl. Tax |
| Total Gross Premium Incl. Tax (H&M+IV) | Hull & Machinery + Increased Value | Total Premium Incl. Tax |
| Cost of Extended Covers (ECL/CCC), Incl. Tax | Extended Covers | Total Premium Incl. Tax |

* Hull & Machinery + Increased Value's Tax H&M / Tax IV / Total Net Premium (H&M+IV), and the P&I family's Tax (P&I) / Tax (FD&D) / Total Premium Incl. Tax (P&I) / Total (FD&D), stay visible — each of those groups has two contributing sub-covers, so the common field is their sum, not identical to either one individually.
* Extended Covers' 19% uplift amount feeds the common Tax Amount field, and its full Incl. Tax figure feeds Total Premium Incl. Tax — previously missing, so those two fields showed 0 for CCC/ECL/ECC records.

### 15. Out of scope / known gaps

* **Rate per GT Incl. R/I** stays manual — no vessel Gross Tonnage (GT) field exists on the Insurance record.
* **Cost of Extended Covers (ECL/CCC), Excl. Tax** stays manual — its source formula references a separate external workbook.
* **C/L P&I**, **Premium TCL P&I**, **C/L FD&D**, **Premium TCL FD&D** stay manual — no formula exists for these in the source.
* **Tax (P&I) only models the Gard-vessel variant** (tax on net premium). The source workbook also has a London-vessel variant (tax on gross premium, a manual figure there) which is not modeled — every P&I record is currently taxed the Gard way regardless of which club/market it's actually with.
* Vessel identity fields in the source workbook (Vessel name, GT, DWT, IMO No., Built, Call Sign, Flag, Class, Owner, Technical/Commercial/Crewing Manager, Mortgagee) are vessel master data, not Insurance Financials fields — out of scope for this record, they belong wherever vessel data is otherwise maintained.
* The source workbook tracks **two renewal time periods** side by side for every cover type, plus a separate "2-year deal" P&I renewal variant. Since one Insurance record already represents one period via Policy Start/End Date, only one set of fields is modeled — not a missing feature, a deliberate simplification.
* This story applies to **Version 2.0 only**. Version 1.0's Financials section (Sum Insured, Deductible, Premium Rate, Annual Premium, Leading Underwriter, no dynamic fields) is unchanged.

---

#### **technical details:**

(To be updated by Techleads)

#### **NON-Functional Requirements:**

| Particulars | Name | Date | Comments |
| --- | --- | --- | --- |
| Document Owner | | | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
