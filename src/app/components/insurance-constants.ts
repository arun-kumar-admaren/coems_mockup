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
