// Version 2.0 — single flat Type of Cover list (BRD v2, Insurance Category framework removed)
export const TYPE_OF_COVER_V2 = [
  "Charterer's liability (CL)",
  "Charterer's loss of profit",
  "Charterer's loss of use",
  "Comp. carrier's liability (CCC)",
  "Comp. general liability (CGL)",
  "Ext. cargo liability cover (ECL)",
  "Ext. contractual cover (ECC)",
  "Extended crew cover",
  "Extra war risk insurance (EWRI)",
  "Freight, demurrage, defense (FD&D)",
  "Hull and machinery (H&M)",
  "Kidnap, ransom protection (K&R)",
  "Loss of hire (LOH)",
  "Northern Sea Route buy back (NSR)",
  "Professional indemnity",
  "Project insurance",
  "Property insurance",
  "Protection & Indemnity (P&I)",
  "Strike and delay",
  "TCL and FD&D",
  "War",
];

// Version 2.0 — display-format an Insurance No as UHL-IN-[YYYY]-[XXXX].
// Applies to pre-seeded records (e.g. "INS-2026-001") so existing records also
// reflect the v2.0 numbering convention; numbers already in the new format
// (newly created in v2.0) pass through unchanged.
export const formatInsuranceNo = (policyNo: string, isV2: boolean): string => {
  if (!isV2 || !policyNo) return policyNo;
  const m = policyNo.match(/^INS-(\d{4})-(\d+)$/);
  if (!m) return policyNo;
  return `UHL-IN-${m[1]}-${m[2].padStart(4, "0")}`;
};
