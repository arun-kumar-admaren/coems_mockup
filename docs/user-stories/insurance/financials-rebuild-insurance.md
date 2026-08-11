#### **USER Story:**

**As a user managing Insurance records (Version 2.0),**
**I want to** pick a Type of Cover and immediately see just that cover's own financial fields appear, with the premium/tax figures the broker's actuarial spreadsheet would calculate computed automatically
**So that** I never have to duplicate the same number in two places, never have to manually work out a formula the source spreadsheet already defines, and never have to click through a menu of other cover types' fields to find the ones that apply to my policy.

> **Supersedes COEMS-21212** ("Insurance – New fields based on Type of Cover"). That story specified a **static** set of fields — all 6 cover-type groups always present as collapsible/expandable sections with **no conditional logic** tied to Type of Cover, and several fields (Sum Insured, Deductible, Premium Rate (%), Annual Premium, Leading Underwriter) kept as shared/common fields alongside the new per-type ones. Two rounds of client feedback reversed this: first, a full field/formula reconciliation against the broker's **"Vessel Insurance Overview"** workbook plus a client demo request changed it to 6 always-visible groups where only the one matching the selected Type of Cover could be expanded (everything below reflects that). Then a further client follow-up removed the grouping/accordion UI entirely — **no collapsible sections at all**; the fields for the selected Type of Cover simply appear, flat, under Premium Details. The Type of Cover → field-set mapping from the group-based design is reused as-is to decide *which* fields to show; only the container (accordion vs. plain dynamic fields) changed.

---

#### **acceptance criteria:**

### 1. Common fields: removed, restored, or made constant

The following fields were duplicated by a per-type equivalent and are **removed from the Financials section for Version 2.0 only** (Version 1.0 is unchanged):

| Removed field | Where it now lives instead |
| --- | --- |
| Sum Insured | H&M Sum Insured (Hull & Machinery + Increased Value fields) |
| Leading Underwriter | Leading H&M/IV/LoH/War Underwriter (each cover type has its own) |

* Sum Insured was previously a mandatory field; removing it for Version 2.0 means Insurance Status, Policy Start/End Date, and Insurer/Club remain the only mandatory Financials-adjacent fields.

The following fields went through a removal-then-restoration cycle and are now treated as **constant** — always visible regardless of Type of Cover, exactly like Currency or Tax Rate (%) always were. A client follow-up established the underlying rule: a common field only gets removed if a Type of Cover's own field is a genuine, literal duplicate of it (like Sum Insured/H&M Sum Insured, or Deductible/PA Deductible below); otherwise it stays constant, and any actual duplicate is what gets removed, not the common field:

* **Deductible** — briefly made conditional (hidden only for Hull & Machinery/Increased Value, since that group had its own "PA Deductible"), but PA Deductible turned out to just duplicate it. **PA Deductible is removed from the Hull & Machinery + Increased Value fields**; Deductible in Coverage Values is the one and only deductible field in the whole form, shown unconditionally.
* **Premium Rate (%)** and **Annual Premium** — briefly removed outright for Version 2.0 on the assumption they were replaced by each cover type's own Rate/Premium fields (H&M Rate, LoH Rate, War Rate, etc.). On reflection there's no literal duplicate to point to — those per-type rates and premiums are more granular figures for a sub-component, not the same "one vessel-wide rate/premium" concept — so nothing was actually removed by deleting them, only lost. Both are restored, unconditional, with the same plain manual-entry behavior they've always had (in Version 1.0 too — neither field was ever calculated).
* **Total Sum Insured (TSI)**, **Tax Amount**, and **Total Premium Incl. Tax** — these three are also constant now (see section 8 for the calculated/manual split, which still varies by Type of Cover even though visibility no longer does).

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

* Total Sum Insured (TSI) — *(calculated only some of the time, see section 8)*
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

All other fields in the six groups (e.g. Disbursements, Freight Total Loss, Leading H&M/IV/LoH/War Underwriter, H&M/IV/LoH/War/S&D Rate, P&I Club, Gross Premium P&I Incl. R/I, Rate per GT Incl. R/I, R/I Alone, FD&D, Premium FD&D, C/L P&I, Premium TCL P&I, C/L FD&D, Premium TCL FD&D, Insurer (S&D), Daily Entered Sum, Rate (S&D), War-Leading Underwriter, War Rate, War LoH Daily/Basis/TSI, Cost of Extended Covers Excl. Tax) remain manual entry — the source workbook has no formula for them either (two exceptions called out explicitly in section 9: Rate per GT Incl. R/I and Cost of Extended Covers Excl. Tax).

* A calculated field is visually distinguished from a manual field: grey background, non-editable, and a small **"(calculated)"** tag next to its label.

### 5. Formulas, by group

All formulas are taken directly from the source "Vessel Insurance Overview" workbook's cell formulas (not reverse-engineered from static values). **Tax Rate (%)** is the single shared field used as the rate input for every Tax calculation below — it is not duplicated per group.

**Hull & Machinery + Increased Value**

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

*(Note: Total Sum Insured (TSI) is the common field shared with Coverage Values, not a field inside this group — see section 8 for when it's shown here vs. there.)*

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
| 15 | Tax (P&I) | ROUND(Net Premium P&I × Tax Rate %, 2) |
| 16 | Total Premium Incl. Tax (P&I) | Net Premium P&I + Tax (P&I) |
| 17 | Tax (FD&D) | ROUND(Premium FD&D × Tax Rate %, 2) |
| 18 | Total (FD&D) – Total Gross Premium Incl. Tax | Premium FD&D + Tax (FD&D) |

*(C/L P&I and C/L FD&D have no formulas — the source workbook has none for them either; both stay manual, see section 4.)*

**Strike and Delay**

| # | Field | Formula |
| --- | --- | --- |
| 19 | Premium (Strike and Delay) | ROUND(Daily Entered Sum × Rate (Strike and Delay), 2) |
| 20 | Upfront NCB 10% | ROUND(Premium (Strike and Delay) × 10%, 2) |
| 21 | Premium Net of NCB | Premium (Strike and Delay) − Upfront NCB 10% |
| 22 | Tax (Strike and Delay) | ROUND(Premium Net of NCB × Tax Rate %, 2) |
| 23 | Premium Incl. Tax (Strike and Delay) | Premium Net of NCB + Tax (Strike and Delay) |

**War Risks** and **Extended Covers (ECL/CCC/ECC)** have their own formulas too, covered separately in sections 6 and 7 since they work differently (a live mirror, and a fixed-rate uplift, rather than a Tax Rate (%)-driven chain).

### 6. War Risks: mirrored fields, not independent entry

* **War H&M (sum)** and **War IV (sum)** are read-only fields that automatically copy **H&M Sum Insured** and **IV Total** respectively, live, as the user types in the Hull & Machinery + Increased Value group — this is a 1:1 mirror in the source workbook, not a separate figure the user re-enters.
* **War TSI (sum)** = War H&M (sum) + War IV (sum), calculated.
* **War LoH Daily**, **War LoH Basis**, and **War LoH TSI** remain manual entry — confirmed there is no formula for these in the source workbook.
* War Risks has no Tax or Total field of its own (see section 8 for how tax/total are still captured for this cover type).
* **Because the mirror needs a real, editable source:** selecting **War Risk** or **Extra War Risk insurance (EWRI)** as Type of Cover shows **both** the War Risks fields **and** the Hull & Machinery + Increased Value fields together (see section 11) — the user enters H&M Sum Insured / IV Total there as the insured-value basis war risk is priced against, and War H&M/IV/TSI mirror it live. A plain italic caption ("Hull & Machinery / Increased Value fields below are the insured-value basis the War Risk premium is calculated from") appears above the H&M+IV fields whenever they're shown for this reason rather than because H&M/IV was the actual selected cover — this is a one-line note, not a section heading, since the redesign in section 11 has no headings at all. The rest of those H&M+IV fields (Premium, Rate, Tax H&M/IV, Totals) are still fully usable in this state — those figures describe the vessel's H&M+IV cover, not the War Risk policy's own premium, so they don't feed anything on the War Risks side and the common Tax Amount / Total Premium Incl. Tax fields (section 8) still fall back to manual entry for a War Risk record rather than assuming the H&M+IV fields' totals belong to it.

### 7. Cost of Extended Covers

* **Cost of Extended Covers (ECL/CCC), Excl. Tax** remains manual entry — the source formula references a separate, external workbook not available to this system.
* **Cost of Extended Covers (ECL/CCC), Incl. Tax** is calculated: `Cost of Extended Covers (ECL/CCC), Excl. Tax × 1.19` (a fixed 19% uplift baked into the source formula, independent of the Tax Rate (%) field).
* These two fields sit in their own field-set, **Extended Covers (ECL/CCC/ECC)** (see section 10) — they are not part of the "Total insurance costs (rollup)" fields any more (see section 9).

### 8. Total Sum Insured (TSI) / Tax Amount / Total Premium Incl. Tax: always shown, calculated vs. manual

These three fields are **always visible** in the Financials section (Coverage Values / Premium Details) regardless of Type of Cover — they used to be hidden in an earlier round, but a client follow-up made every common field constant (section 1). What still varies by Type of Cover is whether each one displays as **read-only calculated** or plain **manual entry**:

| Field | Calculated (the shown fields already have the equivalent) | Manual entry |
| --- | --- | --- |
| Total Sum Insured (TSI) | Hull & Machinery + Increased Value, War Risks, Loss of Hire | P&I family, Strike and Delay, Extended Covers, or no Type of Cover selected yet |
| Tax Amount | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected yet |
| Total Premium Incl. Tax | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected yet |

* This exists so that War Risks (which has no Tax/Total field of its own) and the three Type of Cover values with no matching field-set at all (section 11) still have somewhere to record a premium and tax figure — since nothing calculates it for them, the field just becomes a plain input, exactly as if it were always manual (which is also what it does before any Type of Cover is picked).
* When calculated, the value is derived from whichever single field-set is showing (only one field-set's numbers are ever real per record, since one record = one Type of Cover).
* **Deductible is not part of this table** — see section 1. It's a plain, always-shown, always-manual common field regardless of Type of Cover, same as Currency, Tax Rate (%), Premium Rate (%), or Annual Premium — it has no formula anywhere, so there's no calculated state for it to switch into.

### 9. "Total insurance costs (rollup)" group removed

* The original COEMS-21212 group **"Total insurance costs (rollup)"** and its 4 sum fields — **Total Annual Premium, Excl. Tax**, **Total Daily Premium, Excl. Tax**, **Total Annual Premium, Incl. Tax**, **Total Daily Premium, Incl. Tax** — are **removed entirely**.
* Reason: in the source workbook, one sheet tracks a vessel's *entire* insurance program (H&M, LoH, War, P&I, S&D all at once), so summing across those column blocks produces a real "total insurance cost for this vessel." In this system, one Insurance record represents **one** Type of Cover, so at most one group is ever populated — summing across all 6 groups on a single record just reproduces that one group's number plus a run of zeros. It is not a meaningful total and is dropped rather than kept as a always-zero-padded figure.
* **Total Cost Incl. Extended Covers, Excl. Tax** and **Total Cost Incl. Extended Covers, Incl. Tax** are also removed — they were defined as "the rollup above + Cost of Extended Covers," so once the rollup is gone they'd be identical to the Cost of Extended Covers fields themselves.
* Rate per GT Incl. R/I remains manual entry — its source formula divides by vessel Gross Tonnage (GT), which is not currently captured anywhere on the Insurance record. *(Flagged as a follow-up: add a GT field if this calculation is wanted.)*

### 10. Extended Covers (ECL/CCC/ECC) field-set

* A field-set named **Extended Covers (ECL/CCC/ECC)** replaces the deleted rollup fields in the same position (still under Financials → Premium Details, after the other cover-type fields).
* Contains 2 fields: **Cost of Extended Covers (ECL/CCC), Excl. Tax** (manual) and **Cost of Extended Covers (ECL/CCC), Incl. Tax** (calculated, section 7).
* Shown when Type of Cover is **Comprehensive Carrier's Liability Cover (CCC)** or **Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)** (section 11).

### 11. Type of Cover determines which fields are shown — no grouping/collapsible UI

This has gone through two rounds of client feedback. First (COEMS-21212 demo follow-up): *when a Type of Cover is selected, only the matching group should be enabled — the rest disabled/greyed out.* Then, a further client follow-up removed the grouping UI altogether: **no collapsible/expandable sections, no group headers, no greyed-out "not applicable" groups on screen at all — just the relevant fields, appearing directly.**

* Under Financials → Premium Details, right after the common Tax Rate (%) / Tax Amount / Total Premium Incl. Tax fields (section 8), the fields belonging to the selected Type of Cover render directly — flat, in the same field grid, with no border box, no heading, and nothing to click to reveal them.
* If no Type of Cover has been selected yet, no cover-specific fields render at all (only the common fields from Coverage Values / Premium Details are visible).
* The Type of Cover → field-set mapping carried over unchanged from the group-based design (section 10 of the prior round): every Type of Cover shows exactly one field-set, **except War Risk and EWRI, which show two** — the War Risks fields plus the Hull & Machinery + Increased Value fields, since the War mirror needs the latter's Sum Insured fields to be editable (section 6). Selecting Hull and Machinery (H&M) or Increased Value (IV) directly does **not** also show the War Risks fields — the relationship is one-directional.
* Mapping of each of the 16 Type of Cover values to the field-set(s) it shows:

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
| Comprehensive General Liability (CGL) | *(none — see below)* |
| Transport insurance | *(none — see below)* |
| Professional indemnity | *(none — see below)* |

* **Comprehensive General Liability (CGL)**, **Transport insurance**, and **Professional indemnity** have no fields or formulas anywhere in the source workbook, so nothing extra renders for them. Per section 8, these types still get Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax as manual fields so a premium can still be recorded.

### 12. Values clear when Type of Cover changes

* Whenever the user changes **Type of Cover** while adding or editing a record, every field belonging to any of the 6 Type of Cover field-sets — plus the common Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax fallback fields (section 8) — resets to blank/zero. This prevents a previous selection's numbers from lingering, unseen, behind the newly-shown fields (e.g. entering H&M figures, switching to Loss of Hire, then switching back to Hull and Machinery would otherwise silently restore the old H&M numbers).
* Only Type of Cover–specific fields are cleared. Currency, Deductible, Daily Indemnity (LoH), Basis/Terms, and Tax Rate (%) are unaffected, since they aren't tied to a specific cover type.
* This only fires on an actual user change to the dropdown — opening an existing record for editing does not clear anything; its saved cover-specific data loads and displays normally.

### 13. Data correction: existing seed records

* 3 pre-existing Insurance records carried Type of Cover values from before this rebuild (e.g. "Hull & Machinery", "Charterers' P&I", "Crew Liability") that no longer match the current 16-value list, which meant their Type of Cover dropdown showed blank and no cover-specific fields rendered regardless of the record's actual cover type. These are corrected to their closest current equivalents: "Hull and Machinery (H&M)", "Charterer's Liability (CL)", and "Extended Crew Cover (P&I extension)".

### 14. Cover Details: Intended Vessel hidden when Related to = Vessel

* In the Cover Details section (outside Financials), the **Intended Vessel** field (COEMS-21188) is only shown when **Related to** is **Fixture** or not yet selected. When **Related to = Vessel**, Intended Vessel is hidden — **Select Vessel** (shown directly under Related to) already captures the vessel, so asking for it a second time via Intended Vessel was redundant.
* If a user had already picked an Intended Vessel and then switches Related to back to **Vessel**, the stored Intended Vessel value is cleared (reset to unselected) rather than left saved-but-hidden.

### 15. Out of scope / known gaps (unchanged from investigation, carried forward for visibility)

* **Rate per GT Incl. R/I** stays manual — no vessel Gross Tonnage (GT) field exists on the Insurance record to calculate it from.
* **Cost of Extended Covers (ECL/CCC), Excl. Tax** stays manual — its source formula references a separate external workbook not available to this system.
* **C/L P&I**, **Premium TCL P&I**, **C/L FD&D**, **Premium TCL FD&D** stay manual — the source workbook has no formula for these either.
* This story applies to **Version 2.0 only**. Version 1.0's Financials section (Sum Insured, Deductible, Premium Rate, Annual Premium, Leading Underwriter, no dynamic fields at all) is unchanged.

---

#### **technical details:**

(To be updated by Techleads)

#### **NON-Functional Requirements:**

| Particulars | Name | Date | Comments |
| --- | --- | --- | --- |
| Document Owner | | | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
