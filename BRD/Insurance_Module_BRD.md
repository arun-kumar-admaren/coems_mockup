# Insurance Module — Business Requirements Document

**Source file:** `src/app/components/insurance.tsx` (form fields/logic), `src/app/components/insurance-constants.ts` (shared lists/mappings)
**Applies to:** COEMS mockup, both Version 1.0 and Version 2.0 (differences called out throughout)
**Last updated:** 2026-08-11

This is the single, self-contained reference for the Insurance module — listing page, add/edit form, every field, every Financials formula, and the Type of Cover → field mapping. It exists because an earlier version of this document was lost when the working directory was corrupted; treat this file as the primary source of truth and keep it up to date going forward.

---

## 1. Purpose

The Insurance module tracks insurance policies taken out against a Vessel, Fixture, or Crew, records their financial terms (premiums, tax, sums insured), and links them to Legal Review, Claims, and other COEMS modules.

Two parallel versions exist in this mockup, switchable from the sidebar's Version 1.0/2.0 dropdown:
- **Version 1.0** — the original/current-production design.
- **Version 2.0** — the redesigned form per the client's BRD comments and demo feedback (COEMS-21188, COEMS-21212, and follow-ups). This is where nearly all of the detail in this document lives; Version 1.0 sections are called out explicitly where they differ.

---

## 2. Listing Page

- **Search bar** — free-text search across insurance records.
- **Filters popover** — Status (multi-select from the version's status list), plus Version 2.0 only: Bi-annual Declaration to Broker (Yes/No), Intended Vessel (searchable checklist). Version 1.0 only: Insurance Category filter. A badge shows the active filter count; "Clear All" resets everything.
- **Status quick-tabs** — one-click buttons above the table: "All" plus every status value.
- **New Insurance** button opens the add form.
- **Listing table columns:**

| Column | Version | Notes |
| --- | --- | --- |
| Insurance No | Both | Formatted `UHL-INS-[YYYY]-[XXX]` in v2.0, `INS-[YYYY]-[XXX]` in v1.0 |
| Category | v1.0 only | Vessel / Fixture / Crew |
| Type of Cover | Both | |
| Intended Vessel | v2.0 only | |
| Linked Entity | Both | The linked Vessel/Fixture/Crew record |
| Broker | Both | |
| Insurer / Club | Both | |
| Policy Start / Policy End | Both | |
| Insurance Owner | Both | |
| Sum Insured | Both | Common field (section 5.2) |
| Annual Premium | Both | Common field (section 5.2) |
| Status | Both | Colour-coded badge |
| Bi-annual Declaration to Broker | v2.0 only | Yes/No badge |
| Actions | Both | Row-level menu (kebab) |

- A footer shows "Found N records" and "N of Total total".
- Clicking a row opens that record in the Edit overlay.

---

## 3. Add / Edit Overlay — Structure

Opens as a right-side sheet. **Header** shows Insurance No, Type of Cover, Policy Period, Status (editable inline), and Insurer/Club as a quick-glance summary when editing an existing record. **Tabs** (edit mode only): **Overview** (the form itself) and **Legal Review** (linked Legal Reviews for this Insurance record — Add New Review / Link Review, review cards, unassign via card kebab menu; same pattern used across other COEMS modules).

The Overview tab has 5 sections, in this order: **Cover Details → Financials → Parties → Workflow & Dates → General.** Footer buttons: **Cancel** (discards, no confirmation) and **Create/Update Insurance** (saves and closes).

---

## 4. Section 1 — Cover Details

### 4.1 Category & Entity (Version 1.0 only)

| Field | Type | Notes |
| --- | --- | --- |
| Insurance Category | Select | Vessel / Fixture / Crew |
| Vessel / Fixture / Crew | Select or Free Text | Shown conditionally based on Category |

### 4.2 Related to (Version 2.0 only)

Replaces Category & Entity. The client no longer wants Insurance linked/added from the Fixture or Vessel edit overlays — the Insurance record itself picks exactly one Fixture or one Vessel here.

| Field | Type | Notes |
| --- | --- | --- |
| Related to | Select | Fixture / Vessel |
| Select Fixture | Select | Shown when Related to = Fixture |
| Select Vessel | Select | Shown when Related to = Vessel |

Reuses the same underlying `insuranceCategory`/`fixture`/`vessel` fields as Version 1.0's Category & Entity, so listing/module-display logic needs no changes between versions.

### 4.3 Cover & Policy

| Field | Version | Type | Notes |
| --- | --- | --- | --- |
| Type of Cover | Both | Select | v1.0: options depend on Insurance Category. v2.0: single flat 16-value list, shared with the Claims module (section 6) |
| Intended Vessel | v2.0 only | Select | Standalone field, no relation to Related to/Fixture/Vessel. **Hidden when Related to = Vessel** — Select Vessel already captures the vessel; if the user switches Related to back to Vessel after picking an Intended Vessel, the stored value is cleared |
| Insurance Type / Clause Type | v1.0 only | Select | Removed in v2.0 per client comment |
| Policy Number | v1.0 only | Free Text | Removed in v2.0 |
| Policy / Cover Reference | v1.0 only | Free Text | Removed in v2.0 |

### 4.4 Broker, Insurer & Policy Dates (Version 2.0 only)

Reordered up next to Type of Cover per client comment (Version 1.0 keeps these fields down in the Parties and Workflow & Dates sections instead). Order: Broker → Insurer/Club → Policy Start Date → Bi-annual Declaration to Broker (checkbox) → Policy End Date.

| Field | Type | Notes |
| --- | --- | --- |
| Broker | Select | |
| Insurer / Club | Select | Mandatory |
| Policy Start Date | Date | Mandatory |
| Bi-annual Declaration to Broker | Checkbox | New in v2.0 |
| Policy End Date | Date | Mandatory |

---

## 5. Section 2 — Financials

This is the most heavily revised part of the module (COEMS-21212 and its follow-ups). Version 1.0's Financials section is small and entirely manual entry (section 5.6). Everything below describes Version 2.0.

### 5.1 Layout

Financials has two subsections: **Coverage Values** then **Premium Details**. All 11 fields in these two subsections are **constant** — always visible, for every Type of Cover (section 5.2). Directly under Premium Details, after the constant fields, the fields specific to the selected Type of Cover render — flat, no accordion, no grouping UI, nothing to click to expand (section 5.4). If no Type of Cover is selected, nothing renders there.

### 5.2 Constant fields (Coverage Values + Premium Details)

Always visible, both versions, every Type of Cover:

| Field | Type | Mandatory? | Manual / Calculated |
| --- | --- | --- | --- |
| Currency | Select (USD/EUR/GBP) | No | Manual |
| Sum Insured | Currency | **Yes** | Manual — also used directly as the insured value in every Hull & Machinery + Increased Value formula (section 5.5) and the War Risks mirror (section 5.7) |
| Total Sum Insured (TSI) | Currency | No | Calculated when the active Type of Cover models a Sum Insured concept (H&M+IV, War Risks, Loss of Hire); manual otherwise |
| Deductible | Currency | **Yes** | Manual — the only deductible field in the form |
| Daily Indemnity (LoH) | Currency | No (required if Type of Cover is Loss of Hire) | Manual — feeds LoH Sum Insured (section 5.5) |
| Basis / Terms | Free Text | No | Manual |
| Premium Rate (%) | Percentage | No | Manual — no cross-cover formula applies (each cover type prices differently), never calculated in either version |
| Annual Premium | Currency | No | Manual, same reasoning as Premium Rate (%) |
| Tax Rate (%) | Percentage | No | Manual — the single shared input every per-type Tax formula multiplies by |
| Tax Amount | Currency | No | Calculated when the active Type of Cover has its own tax breakdown (H&M+IV, Loss of Hire, P&I family, Strike and Delay, Extended Covers); manual for War Risks or no Type of Cover selected |
| Total Premium Incl. Tax | Currency | No | Same calculated/manual split as Tax Amount |

**Leading Underwriter is not a common field** — removed for Version 2.0. Each cover type that has an underwriter concept (H&M, IV, LoH, War) has its own Leading Underwriter field instead (section 5.5/5.7), since they can genuinely differ from each other on the same policy.

### 5.3 Field inventory, by Type of Cover

One row per field. **Type of Cover** lists every cover that field appears for — covers that share the exact same fields are listed together in one cell rather than the field being repeated in a separate table per cover.

| Type of Cover | Field | Field Type | Formula |
| --- | --- | --- | --- |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Disbursements | Currency | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Freight Total Loss | Currency | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Equipment (H&M) | Currency | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Freight All Risks | Currency | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | IV Total | Currency | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | AMD | Currency | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Leading H&M Underwriter | Free Text | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Leading IV Underwriter | Free Text | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | H&M Rate (%) | Percentage | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | IV Rate (%) | Percentage | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | H&M Premium | Currency | ROUND(Sum Insured × H&M Rate %, 0) |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Upfront Performance Bonus (PB/CC) | Currency | Manual entry |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | H&M Premium Net of Upfront Performance Bonus | Currency | H&M Premium − Upfront Performance Bonus (PB/CC) |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | IV Premium | Currency | ROUND(IV Total × IV Rate %, 0) |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Tax H&M | Currency | ROUND(H&M Premium Net of Upfront Performance Bonus × Tax Rate %, 2) |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Tax IV | Currency | ROUND(IV Premium × Tax Rate %, 2) |
| Hull and Machinery (H&M), Increased Value (IV), War Risk, Extra War Risk insurance (EWRI) | Total Net Premium (H&M+IV) | Currency | H&M Premium Net of Upfront Performance Bonus + IV Premium |
| Loss of Hire (LOH) | LoH Sum Insured | Currency | 180 × Daily Indemnity (LoH) |
| Loss of Hire (LOH) | LoH Leading Underwriter | Free Text | Manual entry |
| Loss of Hire (LOH) | LoH Rate (%) | Percentage | Manual entry |
| Loss of Hire (LOH) | LoH Premium | Currency | ROUND(LoH Sum Insured × LoH Rate %, 0) |
| War Risk, Extra War Risk insurance (EWRI) | War H&M (sum) | Currency | = Sum Insured (live mirror) |
| War Risk, Extra War Risk insurance (EWRI) | War IV (sum) | Currency | = IV Total (live mirror) |
| War Risk, Extra War Risk insurance (EWRI) | War-Leading Underwriter | Free Text | Manual entry |
| War Risk, Extra War Risk insurance (EWRI) | War Rate (%) | Percentage | Manual entry |
| War Risk, Extra War Risk insurance (EWRI) | War LoH Daily | Currency | Manual entry (confirmed no formula in source) |
| War Risk, Extra War Risk insurance (EWRI) | War LoH Basis | Numeric | Manual entry |
| War Risk, Extra War Risk insurance (EWRI) | War LoH TSI | Currency | Manual entry |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | P&I Club | Free Text | Manual entry |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Gross Premium P&I Incl. R/I | Currency | Manual entry |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Rate per GT Incl. R/I | Currency | Manual entry (no vessel GT field to calculate from — section 8) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | R/I (Reinsurance) Alone | Currency | Manual entry |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | 10% OGD (Gard) / 10% PB (London) | Currency | Gross Premium P&I Incl. R/I − Net Premium P&I |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Net Premium P&I | Currency | ROUND(Gross Premium P&I Incl. R/I × 0.9, 0) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Tax (P&I) | Currency | ROUND(Net Premium P&I × Tax Rate %, 2) — Gard-vessel variant only (section 8) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Total Premium Incl. Tax (P&I) | Currency | Net Premium P&I + Tax (P&I) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | FD&D | Currency | Manual entry |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Premium FD&D | Currency | Manual entry |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Tax (FD&D) | Currency | ROUND(Premium FD&D × Tax Rate %, 2) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Total (FD&D) – Total Gross Premium Incl. Tax | Currency | Premium FD&D + Tax (FD&D) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | C/L P&I | Currency | Manual entry (no formula in source) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Premium TCL P&I | Currency | Manual entry |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | C/L FD&D | Currency | Manual entry (no formula in source) |
| Protection & Indemnity (P&I), Charterer's Liability (CL), FD&D (UHL as charterer), FD&D (UHL as owner), Extended Crew Cover (P&I extension) | Premium TCL FD&D | Currency | Manual entry |
| Strike and Delay | Insurer (Strike and Delay) | Free Text | Manual entry |
| Strike and Delay | Daily Entered Sum | Currency | Manual entry |
| Strike and Delay | Rate (Strike and Delay) | Currency | Manual entry |
| Strike and Delay | Premium (Strike and Delay) | Currency | ROUND(Daily Entered Sum × Rate (Strike and Delay), 2) |
| Strike and Delay | Upfront NCB 10% | Currency | ROUND(Premium (Strike and Delay) × 10%, 2) |
| Strike and Delay | Premium Net of NCB | Currency | Premium (Strike and Delay) − Upfront NCB 10% |
| Comprehensive Carrier's Liability Cover (CCC), Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC) | Cost of Extended Covers (ECL/CCC), Excl. Tax | Currency | Manual entry (source formula references an external, non-vessel workbook — section 8) |

**Comprehensive General Liability (CGL), Transport insurance, Professional indemnity** have no fields in this table — no fields or formulas exist for them anywhere in the source workbook. Only the constant fields (section 5.2) apply.

**War Risks has no Tax or Total field of its own**, and **C/L P&I / C/L FD&D have no Tax/Total fields** either — the source workbook has none for these.

### 5.4 Type of Cover → which fields render

Selecting a Type of Cover shows exactly the field-set(s) it maps to (section 5.3), flat, directly — no accordion, no collapsible sections, nothing greyed out. **Every Type of Cover shows exactly one field-set, except War Risk and Extra War Risk insurance (EWRI), which show two** — the War Risks fields plus the Hull & Machinery + Increased Value fields, because the War mirror (section 5.7) needs IV Total to be editable there. Selecting H&M or IV directly does **not** also show the War Risks fields — the relationship is one-directional. If no Type of Cover has been selected, nothing renders.

**Values clear on change**: switching Type of Cover resets every field belonging to any of the 6 field-sets, plus the Total Sum Insured (TSI)/Tax Amount/Total Premium Incl. Tax fallback values, to blank/zero — so a previous selection's numbers never linger unseen behind the newly-shown fields. The constant fields (Currency, Sum Insured, Deductible, Daily Indemnity, Basis/Terms, Tax Rate, Premium Rate, Annual Premium) are unaffected. This only fires on an actual user change to the dropdown — opening an existing record for editing loads its saved data without clearing anything.

### 5.5 Fields calculated but intentionally not shown separately

Because only one field-set is ever populated per record, a cover type whose Tax/Total equivalent comes from a **single** contributing field is identical to the constant Tax Amount / Total Premium Incl. Tax / TSI field. These are calculated internally (feeding the constant field) but not displayed as their own field, to avoid showing the same number twice:

| Field | Cover type | Duplicates |
| --- | --- | --- |
| War TSI (sum) | War Risk, EWRI | Total Sum Insured (TSI) |
| Tax (LoH) | Loss of Hire | Tax Amount |
| Total Gross Premium Incl. Tax (LoH) | Loss of Hire | Total Premium Incl. Tax |
| Tax (Strike and Delay) | Strike and Delay | Tax Amount |
| Premium Incl. Tax (Strike and Delay) | Strike and Delay | Total Premium Incl. Tax |
| Total Gross Premium Incl. Tax (H&M+IV) | H&M, IV | Total Premium Incl. Tax |
| Cost of Extended Covers (ECL/CCC), Incl. Tax | CCC, ECL/ECC | Total Premium Incl. Tax |

H&M+IV's Tax H&M/Tax IV/Total Net Premium, and the P&I family's Tax (P&I)/Tax (FD&D)/Total Premium Incl. Tax (P&I)/Total (FD&D), stay visible — each of those groups has **two** contributing sub-covers, so the constant field is their *sum*, not identical to either one individually.

Extended Covers' 19% uplift amount (Incl. Tax − Excl. Tax) feeds the constant Tax Amount field, and its full Incl. Tax figure feeds Total Premium Incl. Tax.

### 5.6 Version 1.0 Financials (unchanged, for reference)

Currency, Sum Insured\*, Total Sum Insured (TSI), Deductible\*, Daily Indemnity (LoH), Basis/Terms, Premium Rate (%), Annual Premium, Tax Rate (%), Tax Amount, Total Premium Incl. Tax — all plain manual entry, no dynamic per-type fields, no collapsible groups. (\*mandatory)

### 5.7 War Risks mirroring, in detail

War H&M (sum) and War IV (sum) are read-only fields that live-copy Sum Insured (from Coverage Values) and IV Total (from the H&M+IV fields) respectively — a 1:1 mirror, not a value the user re-enters. War TSI (their sum) is calculated but not shown separately (section 5.5). War LoH Daily/Basis/TSI are manual — confirmed no formula exists for these. A caption appears above the H&M+IV fields when they're shown for War Risk's benefit: *"War Risk premium is calculated from Sum Insured / IV Total above. Hull & Machinery / Increased Value fields below are that cover's own details."* The H&M+IV group's Premium/Rate/Tax/Total fields describe the vessel's H&M+IV cover, not the War Risk policy's own premium — so Tax Amount/Total Premium Incl. Tax still fall back to manual entry for a War Risk record.

---

## 6. Type of Cover — the full 16-value list (Version 2.0)

Shared with the Claims module. Single flat list, no category dependency:

Protection & Indemnity (P&I) · Charterer's Liability (CL) · FD&D (UHL as charterer) · Loss of Hire (LOH) · Strike and Delay · Hull and Machinery (H&M) · Increased Value (IV) · FD&D (UHL as owner) · Extra War Risk insurance (EWRI) · War Risk · Extended Crew Cover (P&I extension) · Comprehensive Carrier's Liability Cover (CCC) · Comprehensive General Liability (CGL) · Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC) · Transport insurance · Professional indemnity

(Version 1.0 uses a different, category-dependent list — see `TYPE_OF_COVER_BY_CATEGORY` in the source file.)

---

## 7. Section 3 — Parties (Version 1.0 only in full; Version 2.0 partial)

Version 2.0 moved Broker, Insurer/Club, and Policy Dates up into Cover Details (section 4.4); this section keeps only what wasn't moved.

| Field | Version | Notes |
| --- | --- | --- |
| Broker | v1.0 only | Moved to Cover Details in v2.0 |
| Broker Reference Number | v1.0 only | Not modeled in v2.0 (see BRD comment on Broker/PDF Export limitations under Claims) |
| Broker Contact | v1.0 only | |
| Insurer / Club | v1.0 only | Moved to Cover Details in v2.0 |
| Leading Underwriter | v1.0 only | Removed for v2.0 — replaced by per-cover-type Leading Underwriter fields (section 5.3) |
| Insurer Contact | v1.0 only | Removed in v2.0 per client comment |

---

## 8. Section 4 — Workflow & Dates

| Field | Version | Type | Notes |
| --- | --- | --- | --- |
| Date of Notification to Broker | Both | Date | |
| Policy Start Date | v1.0 only | Date, mandatory | Moved to Cover Details in v2.0 |
| Policy End Date | v1.0 only | Date, mandatory | Moved to Cover Details in v2.0 |
| Renewal Terms | Both | Free Text | |

---

## 9. Section 5 — General

| Field | Type | Notes |
| --- | --- | --- |
| Insurance Status | Select, mandatory | v1.0: Active, Expired, Cancelled, Closed. v2.0: Foreseen, Active, Expired, Cancelled |
| Created By | Select | |
| Remarks | Textarea | |

---

## 10. Known gaps / out of scope

- **Rate per GT Incl. R/I** stays manual — no vessel Gross Tonnage (GT) field exists on the Insurance record. Would need a GT field added (or a vessel lookup) to calculate.
- **Cost of Extended Covers (ECL/CCC), Excl. Tax** stays manual — its source formula references a separate external workbook not available to this system.
- **C/L P&I, Premium TCL P&I, C/L FD&D, Premium TCL FD&D** stay manual — no formula exists for these in the source workbook.
- **Tax (P&I) only models the Gard-vessel variant** (tax on net premium). The source workbook also has a London-vessel variant (tax on gross premium) which is not modeled — every P&I record is currently taxed the Gard way regardless of which club/market it's actually with.
- **Vessel identity fields** in the source workbook (Vessel name, GT, DWT, IMO No., Built, Call Sign, Flag, Class, Owner, Technical/Commercial/Crewing Manager, Mortgagee) are vessel master data, not Insurance fields — out of scope here.
- The source workbook tracks **two renewal time periods** side by side for every cover type, plus a separate "2-year deal" P&I renewal variant. Since one Insurance record already represents one period via Policy Start/End Date, only one set of fields is modeled.
- The "Total insurance costs (rollup)" concept from the source workbook (summing every cover type's premium for one vessel) does not apply here — one Insurance record = one Type of Cover, so a cross-type sum would be meaningless. Removed entirely rather than kept as an always-mostly-zero rollup.
- Row-level "Actions" kebab menu on the listing table is present in the UI but not yet wired to an action menu (Export/Delete) in this mockup.

---

## 11. Change history (major milestones)

| Change | Reference |
| --- | --- |
| Add/edit form cleanup, reorder, new fields (Related to, Intended Vessel, Bi-annual Declaration) | COEMS-21188 |
| Original per-cover-type field groups, static/always-visible design | COEMS-21212 (superseded) |
| Full Financials rebuild: dedup common fields, wire every formula, Type of Cover gating, then flat dynamic fields with no accordion | This document, section 5; full narrative in `docs/user-stories/insurance/financials-rebuild-insurance.md` |
| Claims field updates shared with this module (Type of Cover list, Insurer Reference Number, etc.) | COEMS-21137, COEMS-21182 |

For the detailed round-by-round narrative of how the Financials section reached its current design (what was tried, what the client asked to change, and why), see `docs/user-stories/insurance/financials-rebuild-insurance.md`. This BRD describes the **current, settled state only**.
