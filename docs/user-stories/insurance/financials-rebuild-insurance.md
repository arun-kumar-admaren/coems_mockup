#### **USER Story:**

**As a user managing Insurance records (Version 2.0),**
**I want to** pick a Type of Cover and immediately see just that cover's own financial fields appear, with the premium/tax figures the broker's actuarial spreadsheet would calculate computed automatically
**So that** I never have to duplicate the same number in two places, never have to manually work out a formula the source spreadsheet already defines, and never have to click through a menu of other cover types' fields to find the ones that apply to my policy.

> **Supersedes COEMS-21212** ("Insurance – New fields based on Type of Cover"). That story specified a **static** set of fields — all 6 cover-type groups always present as collapsible/expandable sections with **no conditional logic** tied to Type of Cover, and several fields (Sum Insured, Deductible, Premium Rate (%), Annual Premium, Leading Underwriter) kept as shared/common fields alongside the new per-type ones. Two rounds of client feedback reversed this: first, a full field/formula reconciliation against the broker's **"Vessel Insurance Overview"** workbook plus a client demo request changed it to 6 always-visible groups where only the one matching the selected Type of Cover could be expanded (everything below reflects that). Then a further client follow-up removed the grouping/accordion UI entirely — **no collapsible sections at all**; the fields for the selected Type of Cover simply appear, flat, under Premium Details. The Type of Cover → field-set mapping from the group-based design is reused as-is to decide *which* fields to show; only the container (accordion vs. plain dynamic fields) changed.

---

#### **acceptance criteria:**

### 1. Common fields are constant — the whole original Financials header is unconditional again

Every field in the Financials section's Coverage Values / Premium Details header — **Currency, Sum Insured, Total Sum Insured (TSI), Deductible, Daily Indemnity (LoH), Basis/Terms, Premium Rate (%), Annual Premium, Tax Rate (%), Tax Amount, Total Premium Incl. Tax** — is **constant**: always visible for every Type of Cover, in both versions, with the same validation Version 1.0 has always had (Sum Insured and Deductible mandatory, the rest optional). Only the per-cover-type fields below the header (section 11) are dynamic.

This is the settled end state after three rounds of back-and-forth, worth recording so the reasoning isn't lost:

1. **First attempt**: Sum Insured, Deductible, Premium Rate (%), Annual Premium, and Leading Underwriter were removed for Version 2.0, on the theory that each was duplicated by a per-cover-type field (H&M Sum Insured, PA Deductible, H&M Rate, H&M Premium, Leading H&M/IV/LoH/War Underwriter).
2. **Client follow-up**: that was too aggressive. A common field should only be removed when a Type of Cover's own field is a **genuine, literal duplicate** — the same value, not just a similarly-named one. Sum Insured and PA Deductible really were the same value (both meant "the H&M+IV insured value" / "the H&M+IV deductible"), so those two stay removed in spirit — but rather than deleting the common field, **the duplicate per-type field is what gets deleted**, and the common field becomes the single source of truth:
   * **Deductible**: PA Deductible is removed from the Hull & Machinery + Increased Value fields. Deductible in Coverage Values is the one and only deductible field in the form.
   * **Sum Insured**: "H&M Sum Insured" (originally added as its own field, see the old section 2 below) is removed from the Hull & Machinery + Increased Value fields. Sum Insured in Coverage Values is used directly, unconditionally, as the insured value in every formula that needs it — H&M Premium, Total Sum Insured (TSI) (section 4), and the War H&M mirror (section 5) — so no calculation is lost, it just reads from one field instead of two.
3. **Premium Rate (%) and Annual Premium** never had a literal duplicate — each cover type's own Rate/Premium fields (H&M Rate, LoH Rate, War Rate, H&M Premium, LoH Premium, etc.) are more granular sub-component figures, not the same "one vessel-wide rate/premium" concept. Removing them didn't eliminate a duplicate, it just lost the field. Both are restored, unconditional, with the same plain manual-entry behavior they've always had (in Version 1.0 too — neither was ever calculated).
4. **Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax** were never removed, but went through a phase of being hidden per Type of Cover. They're constant too now (section 8 covers the calculated/manual split, which still varies by Type of Cover even though visibility no longer does).

**Leading Underwriter is the only field that stays removed** — every cover type that has an underwriter concept (H&M, IV, LoH, War) genuinely has its own named underwriter, which can legitimately differ across them on the same policy, so there's no single "one vessel-wide underwriter" value for a common field to hold.

### 2. New fields added: per-type Tax and Total fields

The following 12 fields are added, one Tax + one Total pair per group that the source workbook actually calculates a tax/total for. All are **read-only, calculated** (see formulas in section 4) — the user never types into them.

| Group | Tax field (new) | Total field (new) |
| --- | --- | --- |
| Hull & Machinery + Increased Value | Tax H&M | Total Net Premium (H&M+IV) |
| Hull & Machinery + Increased Value | Tax IV | Total Gross Premium Incl. Tax (H&M+IV) |
| Loss of Hire | Tax (LoH) | Total Gross Premium Incl. Tax (LoH) |
| P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D | Tax (P&I) | Total Premium Incl. Tax (P&I) |
| P&I, FD&D, Charterer's Liability (C/L), and C/L FD&D | Tax (FD&D) | Total (FD&D) – Total Gross Premium Incl. Tax |
| Strike and Delay | Tax (Strike and Delay) | Premium Incl. Tax (Strike and Delay) |

* War Risks has no Tax/Total fields — the source workbook has none for this group either (see section 5).
* C/L P&I and C/L FD&D (inside the P&I group) also have no Tax/Total fields — same reason, no formula exists for them in the source.
* **Tax (LoH), Total Gross Premium Incl. Tax (LoH), Tax (Strike and Delay), Premium Incl. Tax (Strike and Delay), and Total Gross Premium Incl. Tax (H&M+IV) are calculated but not displayed as separate fields** — see section 14 for why (they're identical to the common Tax Amount / Total Premium Incl. Tax fields whenever their group is the active one).

### 3. Existing fields converted from manual entry to read-only, calculated

The following fields already existed (added under COEMS-21212 as plain manual Currency inputs) and are now **read-only, calculated** instead — see section 4 for the exact formula each one uses:

* Total Sum Insured (TSI) — *(calculated only some of the time, see section 7)*
* H&M Premium
* H&M Premium Net of Upfront Performance Bonus
* IV Premium
* LoH Sum Insured
* LoH Premium
* War H&M (sum), War IV (sum), War TSI (sum) — see section 5
* 10% OGD (Gard) / 10% PB (London)
* Net Premium P&I
* Premium (Strike and Delay)
* Upfront NCB 10%
* Premium Net of NCB
* Cost of Extended Covers (ECL/CCC), Incl. Tax — see section 6

All other fields in the six groups (e.g. Disbursements, Freight Total Loss, Leading H&M/IV/LoH/War Underwriter, H&M/IV/LoH/War/S&D Rate, P&I Club, Gross Premium P&I Incl. R/I, Rate per GT Incl. R/I, R/I Alone, FD&D, Premium FD&D, C/L P&I, Premium TCL P&I, C/L FD&D, Premium TCL FD&D, Insurer (S&D), Daily Entered Sum, Rate (S&D), War-Leading Underwriter, War Rate, War LoH Daily/Basis/TSI, Cost of Extended Covers Excl. Tax) remain manual entry — the source workbook has no formula for them either (two exceptions called out explicitly in section 8: Rate per GT Incl. R/I and Cost of Extended Covers Excl. Tax).

* A calculated field is visually distinguished from a manual field: grey background, non-editable, and a small **"(calculated)"** tag next to its label.

### 4. Formulas, by group

All formulas are taken directly from the source "Vessel Insurance Overview" workbook's cell formulas (not reverse-engineered from static values). **Sum Insured** and **Tax Rate (%)** are the shared common fields used directly as inputs below — neither is duplicated per group.

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

*(Note: Total Sum Insured (TSI) and Sum Insured are both the common fields shared with Coverage Values, not fields inside this group — see section 7 for when TSI is shown calculated vs. manual.)*

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

*(C/L P&I and C/L FD&D have no formulas — the source workbook has none for them either; both stay manual, see section 3.)*

**Strike and Delay**

| # | Field | Formula |
| --- | --- | --- |
| 19 | Premium (Strike and Delay) | ROUND(Daily Entered Sum × Rate (Strike and Delay), 2) |
| 20 | Upfront NCB 10% | ROUND(Premium (Strike and Delay) × 10%, 2) |
| 21 | Premium Net of NCB | Premium (Strike and Delay) − Upfront NCB 10% |
| 22 | Tax (Strike and Delay) | ROUND(Premium Net of NCB × Tax Rate %, 2) |
| 23 | Premium Incl. Tax (Strike and Delay) | Premium Net of NCB + Tax (Strike and Delay) |

**War Risks** and **Extended Covers (ECL/CCC/ECC)** have their own formulas too, covered separately in sections 5 and 6 since they work differently (a live mirror, and a fixed-rate uplift, rather than a Tax Rate (%)-driven chain).

### 5. War Risks: mirrored fields, not independent entry

* **War H&M (sum)** and **War IV (sum)** are read-only fields that automatically copy **Sum Insured** and **IV Total** respectively, live — Sum Insured from Coverage Values, IV Total from the Hull & Machinery + Increased Value fields — this is a 1:1 mirror in the source workbook, not a separate figure the user re-enters.
* **War TSI (sum)** = War H&M (sum) + War IV (sum) is calculated internally but **not displayed** as its own field — see section 14, it's identical to the common Total Sum Insured (TSI) field whenever War Risk is the active cover.
* **War LoH Daily**, **War LoH Basis**, and **War LoH TSI** remain manual entry — confirmed there is no formula for these in the source workbook.
* War Risks has no Tax or Total field of its own (see section 7 for how tax/total are still captured for this cover type).
* Selecting **War Risk** or **Extra War Risk insurance (EWRI)** as Type of Cover also shows the Hull & Machinery + Increased Value fields (see section 10) — since War H&M/IV/TSI mirror IV Total from there, the user needs IV Total to be editable; Sum Insured itself is already always available in Coverage Values (section 1). A plain italic caption ("War Risk premium is calculated from Sum Insured / IV Total above. Hull & Machinery / Increased Value fields below are that cover's own details.") appears above the Hull & Machinery + Increased Value fields whenever they're shown for this reason rather than because H&M/IV was the actual selected cover — this is a one-line note, not a section heading, since the redesign in section 10 has no headings at all. The rest of those fields (Premium, Rate, Tax H&M/IV, Totals) are still fully usable in this state — those figures describe the vessel's H&M+IV cover, not the War Risk policy's own premium, so they don't feed anything on the War Risks side and the common Tax Amount / Total Premium Incl. Tax fields (section 7) still fall back to manual entry for a War Risk record rather than assuming the H&M+IV fields' totals belong to it.

### 6. Cost of Extended Covers

* **Cost of Extended Covers (ECL/CCC), Excl. Tax** remains manual entry — the source formula references a separate, external workbook not available to this system.
* **Cost of Extended Covers (ECL/CCC), Incl. Tax** is calculated: `Cost of Extended Covers (ECL/CCC), Excl. Tax × 1.19` (a fixed 19% uplift baked into the source formula, independent of the Tax Rate (%) field). It's calculated internally but **not displayed** as its own field — see section 14, it's identical to the common Total Premium Incl. Tax field whenever CCC/ECL/ECC is the active cover.
* The 19% uplift amount (Incl. Tax minus Excl. Tax) also feeds the common Tax Amount field — see section 14 for a gap this closed.
* This field-set, **Extended Covers (ECL/CCC/ECC)** (see section 9), is not part of the "Total insurance costs (rollup)" fields any more (see section 8).

### 7. Total Sum Insured (TSI) / Tax Amount / Total Premium Incl. Tax: always shown, calculated vs. manual

These three fields are **always visible** in the Financials section (Coverage Values / Premium Details) regardless of Type of Cover — they used to be hidden in an earlier round, but a client follow-up made every common field constant (section 1). What still varies by Type of Cover is whether each one displays as **read-only calculated** or plain **manual entry**:

| Field | Calculated (the shown fields already have the equivalent) | Manual entry |
| --- | --- | --- |
| Total Sum Insured (TSI) | Hull & Machinery + Increased Value, War Risks, Loss of Hire | P&I family, Strike and Delay, Extended Covers, or no Type of Cover selected yet |
| Tax Amount | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected yet |
| Total Premium Incl. Tax | Hull & Machinery + Increased Value, Loss of Hire, P&I family, Strike and Delay, Extended Covers | War Risks, or no Type of Cover selected yet |

* This exists so that War Risks (which has no Tax/Total field of its own) and the three Type of Cover values with no matching field-set at all (section 10) still have somewhere to record a premium and tax figure — since nothing calculates it for them, the field just becomes a plain input, exactly as if it were always manual (which is also what it does before any Type of Cover is picked).
* When calculated, the value is derived from whichever single field-set is showing (only one field-set's numbers are ever real per record, since one record = one Type of Cover).
* **Deductible, Sum Insured, Premium Rate (%), and Annual Premium are not part of this table** — see section 1. They're plain, always-shown, always-manual common fields regardless of Type of Cover, same as Currency or Tax Rate (%). Sum Insured is *used by* the calculations in this table (it's an input to TSI, H&M Premium, and the War mirror), but it never itself switches into a calculated display — only Deductible, Premium Rate, and Annual Premium have literally no formula anywhere.

### 8. "Total insurance costs (rollup)" group removed

* The original COEMS-21212 group **"Total insurance costs (rollup)"** and its 4 sum fields — **Total Annual Premium, Excl. Tax**, **Total Daily Premium, Excl. Tax**, **Total Annual Premium, Incl. Tax**, **Total Daily Premium, Incl. Tax** — are **removed entirely**.
* Reason: in the source workbook, one sheet tracks a vessel's *entire* insurance program (H&M, LoH, War, P&I, S&D all at once), so summing across those column blocks produces a real "total insurance cost for this vessel." In this system, one Insurance record represents **one** Type of Cover, so at most one group is ever populated — summing across all 6 groups on a single record just reproduces that one group's number plus a run of zeros. It is not a meaningful total and is dropped rather than kept as a always-zero-padded figure.
* **Total Cost Incl. Extended Covers, Excl. Tax** and **Total Cost Incl. Extended Covers, Incl. Tax** are also removed — they were defined as "the rollup above + Cost of Extended Covers," so once the rollup is gone they'd be identical to the Cost of Extended Covers fields themselves.
* Rate per GT Incl. R/I remains manual entry — its source formula divides by vessel Gross Tonnage (GT), which is not currently captured anywhere on the Insurance record. *(Flagged as a follow-up: add a GT field if this calculation is wanted.)*

### 9. Extended Covers (ECL/CCC/ECC) field-set

* A field-set named **Extended Covers (ECL/CCC/ECC)** replaces the deleted rollup fields in the same position (still under Financials → Premium Details, after the other cover-type fields).
* Contains 2 fields: **Cost of Extended Covers (ECL/CCC), Excl. Tax** (manual) and **Cost of Extended Covers (ECL/CCC), Incl. Tax** (calculated, section 6).
* Shown when Type of Cover is **Comprehensive Carrier's Liability Cover (CCC)** or **Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)** (section 10).

### 10. Type of Cover determines which fields are shown — no grouping/collapsible UI

This has gone through two rounds of client feedback. First (COEMS-21212 demo follow-up): *when a Type of Cover is selected, only the matching group should be enabled — the rest disabled/greyed out.* Then, a further client follow-up removed the grouping UI altogether: **no collapsible/expandable sections, no group headers, no greyed-out "not applicable" groups on screen at all — just the relevant fields, appearing directly.**

* Under Financials → Premium Details, right after the common Tax Rate (%) / Tax Amount / Total Premium Incl. Tax fields (section 7), the fields belonging to the selected Type of Cover render directly — flat, in the same field grid, with no border box, no heading, and nothing to click to reveal them.
* If no Type of Cover has been selected yet, no cover-specific fields render at all (only the common fields from Coverage Values / Premium Details are visible).
* Every Type of Cover shows exactly one field-set, **except War Risk and EWRI, which show two** — the War Risks fields plus the Hull & Machinery + Increased Value fields, since the War mirror needs IV Total to be editable there (section 5). Selecting Hull and Machinery (H&M) or Increased Value (IV) directly does **not** also show the War Risks fields — the relationship is one-directional.
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

* **Comprehensive General Liability (CGL)**, **Transport insurance**, and **Professional indemnity** have no fields or formulas anywhere in the source workbook, so nothing extra renders for them. Per section 7, these types still get Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax as manual fields so a premium can still be recorded.

### 11. Values clear when Type of Cover changes

* Whenever the user changes **Type of Cover** while adding or editing a record, every field belonging to any of the 6 Type of Cover field-sets — plus the common Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax fallback fields (section 7) — resets to blank/zero. This prevents a previous selection's numbers from lingering, unseen, behind the newly-shown fields (e.g. entering LoH figures, switching to Strike and Delay, then switching back to Loss of Hire would otherwise silently restore the old LoH numbers).
* Only Type of Cover–specific fields are cleared. Currency, **Sum Insured**, Deductible, Daily Indemnity (LoH), Basis/Terms, Tax Rate (%), Premium Rate (%), and Annual Premium are unaffected, since they're constant common fields, not tied to a specific cover type — Sum Insured in particular stays put across a switch to/from War Risk precisely because it's what the War mirror reads from (section 5).
* This only fires on an actual user change to the dropdown — opening an existing record for editing does not clear anything; its saved cover-specific data loads and displays normally.

### 12. Data correction: existing seed records

* 3 pre-existing Insurance records carried Type of Cover values from before this rebuild (e.g. "Hull & Machinery", "Charterers' P&I", "Crew Liability") that no longer match the current 16-value list, which meant their Type of Cover dropdown showed blank and no cover-specific fields rendered regardless of the record's actual cover type. These are corrected to their closest current equivalents: "Hull and Machinery (H&M)", "Charterer's Liability (CL)", and "Extended Crew Cover (P&I extension)".

### 13. Cover Details: Intended Vessel hidden when Related to = Vessel

* In the Cover Details section (outside Financials), the **Intended Vessel** field (COEMS-21188) is only shown when **Related to** is **Fixture** or not yet selected. When **Related to = Vessel**, Intended Vessel is hidden — **Select Vessel** (shown directly under Related to) already captures the vessel, so asking for it a second time via Intended Vessel was redundant.
* If a user had already picked an Intended Vessel and then switches Related to back to **Vessel**, the stored Intended Vessel value is cleared (reset to unselected) rather than left saved-but-hidden.

### 14. Dynamic-field duplicates of the constant fields: audited and removed

Since the constant fields in section 1 include Total Sum Insured (TSI), Tax Amount, and Total Premium Incl. Tax, and each of those is calculated from whichever cover-type field-set is active (section 7), a follow-up audit checked every dynamic field for the same literal-duplicate problem Sum Insured/H&M Sum Insured and Deductible/PA Deductible had. Because only one field-set is ever populated per record, **any group whose Tax Amount / Total Premium Incl. Tax equivalent comes from a single field is an exact duplicate of the common field** — the "sum" of one thing is just that thing:

| Common field | Duplicated by | Cover type |
| --- | --- | --- |
| Total Sum Insured (TSI) | War TSI (sum) | War Risk / EWRI |
| Tax Amount | Tax (LoH) | Loss of Hire |
| Tax Amount | Tax (Strike and Delay) | Strike and Delay |
| Total Premium Incl. Tax | Total Gross Premium Incl. Tax (H&M+IV) | Hull and Machinery (H&M) / Increased Value (IV) |
| Total Premium Incl. Tax | Total Gross Premium Incl. Tax (LoH) | Loss of Hire |
| Total Premium Incl. Tax | Premium Incl. Tax (Strike and Delay) | Strike and Delay |
| Total Premium Incl. Tax | Cost of Extended Covers (ECL/CCC), Incl. Tax | CCC / ECL/ECC |

All 7 are **removed from display** the same way as the earlier duplicates — the underlying calculation still runs and still feeds the common field, nothing is lost, it just isn't shown twice.

**Not removed, by the same logic in reverse**: Hull & Machinery + Increased Value's Tax H&M / Tax IV and Total Net Premium (H&M+IV), and the P&I family's Tax (P&I) / Tax (FD&D) / Total Premium Incl. Tax (P&I) / Total (FD&D), all stay visible. Both of those groups have **two** contributing sub-covers, so the common field is their *sum* — not identical to either sub-field individually, so there's no single field to point to as "the duplicate."

**A real gap found and fixed while auditing, not a duplicate**: Extended Covers (CCC/ECL/ECC) was already listed (section 7) as a cover type whose Tax Amount / Total Premium Incl. Tax should display calculated — but the calculation never actually included its number. Those two common fields were silently showing **0** for every CCC/ECL/ECC record instead of the real Cost of Extended Covers figure. Fixed by feeding the 19% uplift amount (Incl. Tax − Excl. Tax) into Tax Amount, and the full Incl. Tax figure into Total Premium Incl. Tax.

### 15. Out of scope / known gaps (unchanged from investigation, carried forward for visibility)

* **Rate per GT Incl. R/I** stays manual — no vessel Gross Tonnage (GT) field exists on the Insurance record to calculate it from.
* **Cost of Extended Covers (ECL/CCC), Excl. Tax** stays manual — its source formula references a separate external workbook not available to this system.
* **C/L P&I**, **Premium TCL P&I**, **C/L FD&D**, **Premium TCL FD&D** stay manual — the source workbook has no formula for these either.
* This story applies to **Version 2.0 only**. Version 1.0's Financials section (Sum Insured, Deductible, Premium Rate, Annual Premium — all always mandatory-per-original-validation where applicable, Leading Underwriter, no dynamic fields at all) is unchanged.

---

#### **technical details:**

(To be updated by Techleads)

#### **NON-Functional Requirements:**

| Particulars | Name | Date | Comments |
| --- | --- | --- | --- |
| Document Owner | | | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
