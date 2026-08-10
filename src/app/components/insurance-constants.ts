// Version 2.0 — single flat Type of Cover list, shared with Claims (16 values, confirmed 2026-07-28)
export const TYPE_OF_COVER_V2 = [
  "Protection & Indemnity (P&I)",
  "Charterer's Liability (CL)",
  "FD&D (UHL as charterer)",
  "Loss of Hire (LOH)",
  "Strike and Delay",
  "Hull and Machinery (H&M)",
  "Increased Value (IV)",
  "FD&D (UHL as owner)",
  "Extra War Risk insurance (EWRI)",
  "War Risk",
  "Extended Crew Cover (P&I extension)",
  "Comprehensive Carrier's Liability Cover (CCC)",
  "Comprehensive General Liability (CGL)",
  "Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)",
  "Transport insurance",
  "Professional indemnity",
];

// Version 2.0 — maps each Type of Cover to the Financials collapsible group(s) that
// apply to it (COEMS-21212 Financials rebuild, client demo follow-up). Only the
// matching group(s) are enabled when a given cover is selected; the rest are disabled.
// War Risk / EWRI map to TWO groups: War H&M/IV/TSI mirror the Hull & Machinery +
// Increased Value group's Sum Insured fields live, so that group must also be unlocked
// for the mirror to have anything real to read from — otherwise it would always mirror
// zero. The FIRST entry in each array is the "primary" group, used to decide whether
// the common TSI / Tax Amount / Total Premium Incl. Tax fields fall back to manual
// entry (see groupHasOwnSumInsured / groupHasOwnTaxAndTotal in insurance.tsx) — for War
// Risk that's "war" itself, not "hm", since the H&M+IV group's Premium/Tax figures
// belong to a different policy and aren't this record's actual premium.
// Three cover types (CGL, Transport insurance, Professional indemnity) have no
// premium/tax fields anywhere in the source workbook, so they map to no group at all.
export const TYPE_OF_COVER_TO_FINANCIALS_GROUP: Record<string, string[]> = {
  "Hull and Machinery (H&M)": ["hm"],
  "Increased Value (IV)": ["hm"],
  "Loss of Hire (LOH)": ["loh"],
  "War Risk": ["war", "hm"],
  "Extra War Risk insurance (EWRI)": ["war", "hm"],
  "Protection & Indemnity (P&I)": ["pi"],
  "Charterer's Liability (CL)": ["pi"],
  "FD&D (UHL as charterer)": ["pi"],
  "FD&D (UHL as owner)": ["pi"],
  "Extended Crew Cover (P&I extension)": ["pi"],
  "Strike and Delay": ["sd"],
  "Comprehensive Carrier's Liability Cover (CCC)": ["ext"],
  "Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)": ["ext"],
};

// Version 2.0 — display-format an Insurance No as UHL-INS-[YYYY]-[XXX].
// Applies to pre-seeded records (e.g. "INS-2026-001") so existing records also
// reflect the v2.0 numbering convention; numbers already in the new format
// (newly created in v2.0) pass through unchanged.
export const formatInsuranceNo = (policyNo: string, isV2: boolean): string => {
  if (!isV2 || !policyNo) return policyNo;
  const m = policyNo.match(/^INS-(\d{4})-(\d+)$/);
  if (!m) return policyNo;
  return `UHL-INS-${m[1]}-${m[2].padStart(3, "0")}`;
};
