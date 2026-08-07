// ─── Claim Types ─────────────────────────────────────────────────────────────

// Version 2.0 — generic, cover-independent claim types (COEMS-21182), replacing the
// old compound cover+claim strings (e.g. "P&I cargo"). Filtered dynamically by
// TYPE_OF_COVER_TO_CLAIM_TYPES based on the claim's selected Type of Cover.
export type ClaimType =
  | "Cargo"
  | "Crew"
  | "Property Damage"
  | "Personal Injury"
  | "Pollution"
  | "Pre-Loading Survey"
  | "Wreck Removal"
  | "Other"
  | "Damage To Hull"
  | "FD&D"
  | "Loss of Hire"
  | "Strike and Delay"
  | "Cyber"
  | "Particular Average"
  | "FFO"
  | "Third Party Liability (other than FFO)"
  | "Machinery"
  | "General Average"
  | "Total Loss"
  | "Equipment"
  | "H&M"
  | "IV"
  | "P&I"
  | "Indemnities"
  | "Waiver of General Average Contribution and/or Possessory Lien"
  | "Irrecoverable General Average Contribution"
  | "Third Party Liability";

export type ClaimStatus = "Open" | "Close";

export type Priority = "None" | "Low" | "Medium" | "High" | "Overdue";

export type RecoverableBy = "Insurance" | "Client" | "Other" | "Non-recoverable";

export interface CostAllocation {
  id: string;
  description: string;
  amount: number;
  recoverability: "Insurance" | "Client" | "Non-recoverable" | "none";
  category: string;
}

export interface Claim {
  id: string;
  claimNo: string;
  claimType: ClaimType;
  typeOfCover: string;
  priority: Priority;
  // Vessel & Voyage
  vessel: string;
  fixture: string;
  voyage: string;
  pol: string;
  pod: string;
  location: string;
  portCall: string;
  latitude: string;
  longitude: string;
  // Incident Link
  incidentLinked: boolean;
  incidentNo: string;
  // Parties
  claimant: string;
  claimantReference: string;
  picLegal: string[];
  broker: string;
  brokerReference: string;
  brokerContact: string;
  leadingInsurer: string;
  insurerReference: string; // Version 2.0 — new, free text, next to Insurer (COEMS-21137)
  insurerContact: string;
  // Dates
  dateOfIncident: string;
  dateOfNotification: string;
  // Financials
  claimEstimate: number;
  claimAmount: number;
  currency: string;
  deductible: number;
  recoverableBy: RecoverableBy;
  costAllocations: CostAllocation[];
  // Status & Workflow
  status: ClaimStatus;
  insuranceWorkflowStatus: string;
  reviewedByInsurance: boolean;
  approvedByInsurance: boolean;
  signedOffPending: boolean;
  documentChecklist: string[];
  // Standalone claim fields
  damageAsKnown: string;
  stepsTaken: string;
  requiredAssistanceFromInsurance: string;
  representativeOfClaimantPresent: string;
  portAgent: string;
  // General
  createdBy: string;
  createdDate: string;
  remarks: string;
  description: string;
  statusDescription: string;
  // State flags
  archived: boolean;
  deleted: boolean;
}

// ─── Reference data ───────────────────────────────────────────────────────────

export const CLAIM_TYPES: ClaimType[] = [
  "Cargo",
  "Crew",
  "Property Damage",
  "Personal Injury",
  "Pollution",
  "Pre-Loading Survey",
  "Wreck Removal",
  "Other",
  "Damage To Hull",
  "FD&D",
  "Loss of Hire",
  "Strike and Delay",
  "Cyber",
  "Particular Average",
  "FFO",
  "Third Party Liability (other than FFO)",
  "Machinery",
  "General Average",
  "Total Loss",
  "Equipment",
  "H&M",
  "IV",
  "P&I",
  "Indemnities",
  "Waiver of General Average Contribution and/or Possessory Lien",
  "Irrecoverable General Average Contribution",
  "Third Party Liability",
];

export const CLAIM_STATUSES: ClaimStatus[] = ["Open", "Close"];

export const PRIORITY_OPTIONS: Priority[] = ["None", "Low", "Medium", "High", "Overdue"];

// Version 2.0 — shares the same 16-value list confirmed for Insurance (COEMS-21182).
export const TYPE_OF_COVER_OPTIONS: string[] = [
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

// Version 2.0 — confirmed Type of Cover → Type of Claim mapping (COEMS-21182).
// Drives the dependent/filtered Type of Claim dropdown: disabled until a Type of
// Cover is picked, then limited to exactly the values listed here for that cover.
export const TYPE_OF_COVER_TO_CLAIM_TYPES: Record<string, ClaimType[]> = {
  "Protection & Indemnity (P&I)": ["Cargo", "Crew", "Property Damage", "Personal Injury", "Pollution", "Pre-Loading Survey", "Wreck Removal", "Other"],
  "Charterer's Liability (CL)": ["Cargo", "Damage To Hull", "Personal Injury", "Pre-Loading Survey", "Property Damage", "Other"],
  "FD&D (UHL as charterer)": ["FD&D"],
  "Loss of Hire (LOH)": ["Loss of Hire"],
  "Strike and Delay": ["Strike and Delay", "Cyber"],
  "Hull and Machinery (H&M)": ["Particular Average", "FFO", "Third Party Liability (other than FFO)", "Machinery", "General Average", "Total Loss"],
  "Increased Value (IV)": ["Total Loss", "Equipment"],
  "FD&D (UHL as owner)": ["FD&D"],
  "Extra War Risk insurance (EWRI)": ["H&M", "IV", "Loss of Hire", "P&I", "Other"],
  "War Risk": ["H&M", "IV", "Loss of Hire", "P&I", "Other"],
  "Extended Crew Cover (P&I extension)": ["Other"],
  "Comprehensive Carrier's Liability Cover (CCC)": ["Cargo", "Property Damage", "Personal Injury", "Pollution", "Indemnities", "Waiver of General Average Contribution and/or Possessory Lien", "Irrecoverable General Average Contribution", "Other"],
  "Comprehensive General Liability (CGL)": ["Other"],
  "Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)": ["Cargo", "Property Damage", "Personal Injury", "Pollution", "Indemnities", "Waiver of General Average Contribution and/or Possessory Lien", "Irrecoverable General Average Contribution", "Other"],
  "Transport insurance": ["Equipment"],
  "Professional indemnity": ["Third Party Liability"],
};

export const RECOVERABLE_BY_OPTIONS: RecoverableBy[] = [
  "Insurance",
  "Client",
  "Other",
  "Non-recoverable",
];

export const USERS = [
  "Nikhil Mathew",
  "John Doe",
  "Tester Adminren",
  "Aiswaryaa Adminren",
  "Jacson Tom",
  "Safna Basheer",
];

export const LEGAL_USERS = [
  "Arun Kumar",
  "Priya Nair",
  "Ravi Shankar",
  "Deepa Menon",
  "Anoop Krishnan",
  "Lakshmi Pillai",
  "Suresh Babu",
];

// Version 2.0 — PIC Legal values per client spec (multi-select), same codes as Legal Review's PIC Legal field.
export const PIC_LEGAL_OPTIONS = ["AVD", "AL", "MM", "MW", "LP", "MR"];

export const BROKERS = [
  "Howden",
  "Maritime Insurance Brokers",
  "Global Marine Insurance",
  "Seaborne Insurance Group",
  "International Marine Brokers",
  "Maritime Risk Solutions",
  "Marine Legal & Insurance",
];

// Kept in sync with INSURERS_CLUBS ("Insurer / Club") in insurance.tsx.
export const INSURERS = [
  "Gard P&I",
  "NorthStandard",
  "UK P&I Club",
  "UK Defence Club",
  "Skuld",
  "West of England",
  "American Club",
  "Britannia",
  "Swedish Club",
  "London P&I Club",
];

// Version 2.0 — display-format a Claim No as UHL-CL-[YYYY]-[XXX].
// Applies to pre-seeded records (e.g. "CLM-2024-001") so existing claims also
// reflect the v2.0 numbering convention; numbers already in the new format
// (newly created in v2.0) pass through unchanged.
export const formatClaimNo = (claimNo: string, isV2: boolean): string => {
  if (!isV2 || !claimNo) return claimNo;
  const m = claimNo.match(/^CLM-(\d{4})-(\d+)$/);
  if (!m) return claimNo;
  return `UHL-CL-${m[1]}-${m[2].padStart(3, "0")}`;
};

export const VESSELS = [
  "MV OCEAN STAR",
  "MV PACIFIC VOYAGER",
  "MV ATLANTIC PRIDE",
  "MV SOUTHERN CROSS",
  "MV EASTERN STAR",
  "MV NORTHERN LIGHT",
  "MV WESTERN SPIRIT",
  "MV HORIZON",
  "MV ARCTIC BREEZE",
  "MV TROPICAL WAVE",
  "MV GLOBAL TRADER",
  "MV LIBERTY BELLE",
];

export const PORT_AGENTS = [
  "Inchcape Shipping Services",
  "GAC Shipping",
  "Wilhelmsen Ships Service",
  "Gulf Agency Company (GAC)",
  "Svitzer",
  "Anglo-Eastern",
  "Columbia Ship Management",
  "V.Ships",
  "Bernhard Schulte Shipmanagement",
  "Wallem Group",
  "Transmar Agency",
  "Pacific Basin Shipping",
  "North Sea Shipping Agents",
  "Meridian Port Services",
  "Oceanbridge Maritime",
];

// Voyage codes here (VOY-2024-xxx) match each fixture's owning claim in
// INITIAL_CLAIMS_DATA 1:1, so the Voyage → Vessel → Fixture cascade in the
// Claims add/edit overlay (v2.0) has no ambiguous voyage-to-vessel mapping.
export const ALL_FIXTURES = [
  { id: "FIX-2024-067", vessel: "MV OCEAN STAR",      voyage: "VOY-2024-045" },
  { id: "FIX-2024-089", vessel: "MV PACIFIC VOYAGER", voyage: "VOY-2024-062" },
  { id: "FIX-2024-045", vessel: "MV ATLANTIC PRIDE",  voyage: "VOY-2024-031" },
  { id: "FIX-2024-112", vessel: "MV SOUTHERN CROSS",  voyage: "VOY-2024-078" },
  { id: "FIX-2024-078", vessel: "MV EASTERN STAR",    voyage: "VOY-2024-055" },
  { id: "FIX-2024-134", vessel: "MV NORTHERN LIGHT",  voyage: "VOY-2024-091" },
  { id: "FIX-2024-056", vessel: "MV WESTERN SPIRIT",  voyage: "VOY-2024-039" },
  { id: "FIX-2023-289", vessel: "MV HORIZON",         voyage: "VOY-2023-210" },
  { id: "FIX-2024-101", vessel: "MV ARCTIC BREEZE",   voyage: "VOY-2024-071" },
  { id: "FIX-2024-118", vessel: "MV TROPICAL WAVE",   voyage: "VOY-2024-082" },
  { id: "FIX-2024-092", vessel: "MV GLOBAL TRADER",   voyage: "VOY-2024-065" },
  { id: "FIX-2024-125", vessel: "MV LIBERTY BELLE",   voyage: "VOY-2024-088" },
];

// Version 2.0 — "all available voyages" for the Claims add/edit overlay's Voyage
// field; selecting a voyage auto-populates (and locks) Vessel from this list.
export const VOYAGE_LIST: { voyage: string; vessel: string }[] = ALL_FIXTURES.map(
  (f) => ({ voyage: f.voyage, vessel: f.vessel })
);

// ─── Seed data ────────────────────────────────────────────────────────────────

export const INITIAL_CLAIMS_DATA: Claim[] = [
  {
    id: "1",
    claimNo: "CLM-2024-001",
    claimType: "Cargo",
    typeOfCover: "Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)",
    priority: "High",
    vessel: "MV OCEAN STAR",
    fixture: "FIX-2024-067",
    voyage: "VOY-2024-045",
    pol: "Rotterdam",
    pod: "Singapore",
    location: "At Sea",
    portCall: "",
    latitude: "12.3456",
    longitude: "45.6789",
    incidentLinked: true,
    incidentNo: "INC-2024-120",
    claimant: "ABC Shipping Ltd",
    claimantReference: "ABC-CLM-2024-045",
    picLegal: ["Priya Nair"],
    broker: "Maritime Insurance Brokers",
    brokerReference: "MIB-2024-089",
    brokerContact: "James Wilson",
    leadingInsurer: "London P&I Club",
    insurerReference: "",
    insurerContact: "Sarah Connor",
    dateOfIncident: "2024-02-15",
    dateOfNotification: "2024-02-18",
    claimEstimate: 500000,
    claimAmount: 450000,
    currency: "USD",
    deductible: 25000,
    recoverableBy: "Insurance",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Submitted",
    reviewedByInsurance: true,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: ["Logbooks", "Photos", "Claim Notice"],
    createdBy: "Nikhil Mathew",
    createdDate: "2024-02-19",
    remarks: "Urgent follow-up required with surveyor.",
    description: "Container fell overboard during heavy weather causing cargo damage",
    archived: false,
    deleted: false,
  },
  {
    id: "2",
    claimNo: "CLM-2024-002",
    claimType: "Particular Average",
    typeOfCover: "Hull and Machinery (H&M)",
    priority: "High",
    vessel: "MV PACIFIC VOYAGER",
    fixture: "FIX-2024-089",
    voyage: "VOY-2024-062",
    pol: "Houston",
    pod: "Santos",
    location: "Port",
    portCall: "Houston",
    latitude: "",
    longitude: "",
    incidentLinked: true,
    incidentNo: "INC-2024-145",
    claimant: "Pacific Marine Services",
    claimantReference: "PMS-2024-089",
    picLegal: [],
    broker: "Global Marine Insurance",
    brokerReference: "GMI-2024-102",
    brokerContact: "Linda Kovacs",
    leadingInsurer: "American Club",
    insurerReference: "",
    insurerContact: "Mark Spencer",
    dateOfIncident: "2024-03-01",
    dateOfNotification: "2024-03-02",
    claimEstimate: 1300000,
    claimAmount: 1250000,
    currency: "USD",
    deductible: 50000,
    recoverableBy: "Insurance",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Under Investigation",
    reviewedByInsurance: true,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: ["Photos", "Survey Invitation"],
    createdBy: "Jacson Tom",
    createdDate: "2024-03-03",
    remarks: "",
    description: "Minor collision with pier during docking operations",
    archived: false,
    deleted: false,
  },
  {
    id: "3",
    claimNo: "CLM-2024-003",
    claimType: "FD&D",
    // Migration note: old data didn't capture charterer vs owner side; defaulted to charterer.
    typeOfCover: "FD&D (UHL as charterer)",
    priority: "Medium",
    vessel: "MV ATLANTIC PRIDE",
    fixture: "FIX-2024-045",
    voyage: "VOY-2024-031",
    pol: "Hamburg",
    pod: "Felixstowe",
    location: "",
    portCall: "",
    latitude: "",
    longitude: "",
    incidentLinked: false,
    incidentNo: "",
    claimant: "Charter Co International",
    claimantReference: "CCI-2024-033",
    picLegal: [],
    broker: "Maritime Risk Solutions",
    brokerReference: "",
    brokerContact: "Tom Richards",
    leadingInsurer: "NorthStandard",
    insurerReference: "",
    insurerContact: "",
    dateOfIncident: "2024-01-20",
    dateOfNotification: "2024-01-25",
    claimEstimate: 90000,
    claimAmount: 85000,
    currency: "USD",
    deductible: 10000,
    recoverableBy: "Client",
    costAllocations: [],
    status: "Close",
    insuranceWorkflowStatus: "Approved",
    reviewedByInsurance: true,
    approvedByInsurance: true,
    signedOffPending: false,
    documentChecklist: ["Delivery Notes", "Claim Notice"],
    createdBy: "Aiswaryaa Adminren",
    createdDate: "2024-01-26",
    remarks: "Settled via arbitration.",
    description: "Vessel delayed due to unexpected port congestion",
    archived: false,
    deleted: false,
  },
  {
    id: "4",
    claimNo: "CLM-2024-004",
    claimType: "Personal Injury",
    typeOfCover: "Protection & Indemnity (P&I)",
    priority: "Medium",
    vessel: "MV SOUTHERN CROSS",
    fixture: "FIX-2024-112",
    voyage: "VOY-2024-078",
    pol: "Piraeus",
    pod: "Alexandria",
    location: "At Sea",
    portCall: "",
    latitude: "34.5678",
    longitude: "28.9012",
    incidentLinked: true,
    incidentNo: "INC-2024-089",
    claimant: "Crew Member — John Smith",
    claimantReference: "CREW-2024-012",
    picLegal: [],
    broker: "Seaborne Insurance Group",
    brokerReference: "SIG-2024-089",
    brokerContact: "Rachel Kim",
    leadingInsurer: "Britannia",
    insurerReference: "",
    insurerContact: "David Hawkins",
    dateOfIncident: "2024-02-28",
    dateOfNotification: "2024-03-01",
    claimEstimate: 135000,
    claimAmount: 125000,
    currency: "USD",
    deductible: 5000,
    recoverableBy: "Insurance",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Submitted",
    reviewedByInsurance: false,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: ["Logbooks", "Notification Letters"],
    createdBy: "Safna Basheer",
    createdDate: "2024-03-02",
    remarks: "",
    description: "Crew member injured during deck operations",
    archived: false,
    deleted: false,
  },
  {
    id: "5",
    claimNo: "CLM-2024-005",
    claimType: "FD&D",
    typeOfCover: "FD&D (UHL as charterer)",
    priority: "Low",
    vessel: "MV EASTERN STAR",
    fixture: "FIX-2024-078",
    voyage: "VOY-2024-055",
    pol: "Antwerp",
    pod: "Busan",
    location: "",
    portCall: "",
    latitude: "",
    longitude: "",
    incidentLinked: false,
    incidentNo: "",
    claimant: "Eastern Trade Corporation",
    claimantReference: "ETC-2024-055",
    picLegal: [],
    broker: "Marine Legal & Insurance",
    brokerReference: "MLI-2024-078",
    brokerContact: "Chris Fenton",
    leadingInsurer: "Skuld",
    insurerReference: "",
    insurerContact: "Anna Bergström",
    dateOfIncident: "2024-01-10",
    dateOfNotification: "2024-01-15",
    claimEstimate: 340000,
    claimAmount: 325000,
    currency: "USD",
    deductible: 15000,
    recoverableBy: "Other",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Pending Submission",
    reviewedByInsurance: false,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: [],
    createdBy: "John Doe",
    createdDate: "2024-01-16",
    remarks: "Dispute over off-hire period calculation.",
    description: "Dispute over off-hire period calculation",
    archived: false,
    deleted: false,
  },
  {
    id: "6",
    claimNo: "CLM-2024-006",
    claimType: "Cargo",
    typeOfCover: "Protection & Indemnity (P&I)",
    priority: "Medium",
    vessel: "MV NORTHERN LIGHT",
    fixture: "FIX-2024-134",
    voyage: "VOY-2024-091",
    pol: "Le Havre",
    pod: "Tilbury",
    location: "Port",
    portCall: "Le Havre",
    latitude: "",
    longitude: "",
    incidentLinked: true,
    incidentNo: "INC-2024-201",
    claimant: "Port Authority",
    claimantReference: "PA-2024-134",
    picLegal: [],
    broker: "International Marine Brokers",
    brokerReference: "IMB-2024-134",
    brokerContact: "Paul Haynes",
    leadingInsurer: "Gard P&I",
    insurerReference: "",
    insurerContact: "Ingrid Solberg",
    dateOfIncident: "2024-03-10",
    dateOfNotification: "2024-03-12",
    claimEstimate: 100000,
    claimAmount: 95000,
    currency: "USD",
    deductible: 10000,
    recoverableBy: "Insurance",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Submitted",
    reviewedByInsurance: true,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: ["Photos", "Survey Invitation", "Claim Notice"],
    createdBy: "Nikhil Mathew",
    createdDate: "2024-03-13",
    remarks: "",
    description: "Damage to terminal crane during loading operations",
    archived: false,
    deleted: false,
  },
  {
    id: "7",
    claimNo: "CLM-2024-007",
    claimType: "Pollution",
    typeOfCover: "Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)",
    priority: "Overdue",
    vessel: "MV WESTERN SPIRIT",
    fixture: "FIX-2024-056",
    voyage: "VOY-2024-039",
    pol: "Houston",
    pod: "Veracruz",
    location: "Port",
    portCall: "Houston",
    latitude: "",
    longitude: "",
    incidentLinked: true,
    incidentNo: "INC-2024-167",
    claimant: "Global Commodities Inc",
    claimantReference: "GCI-2024-056",
    picLegal: [],
    broker: "Maritime Insurance Brokers",
    brokerReference: "MIB-2024-167",
    brokerContact: "James Wilson",
    leadingInsurer: "UK Defence Club",
    insurerReference: "",
    insurerContact: "Elena Moore",
    dateOfIncident: "2024-02-05",
    dateOfNotification: "2024-02-07",
    claimEstimate: 600000,
    claimAmount: 560000,
    currency: "USD",
    deductible: 30000,
    recoverableBy: "Insurance",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Under Investigation",
    reviewedByInsurance: false,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: ["Logbooks", "Photos", "Claim Notice", "Notification Letters"],
    createdBy: "Tester Adminren",
    createdDate: "2024-02-08",
    remarks: "Regulatory authority notified. Environmental assessment pending.",
    description: "Cargo contaminated during transfer operations — oil spill",
    archived: false,
    deleted: false,
  },
  {
    id: "8",
    claimNo: "CLM-2023-145",
    claimType: "Machinery",
    typeOfCover: "Hull and Machinery (H&M)",
    priority: "None",
    vessel: "MV HORIZON",
    fixture: "FIX-2023-289",
    voyage: "VOY-2023-210",
    pol: "Yokohama",
    pod: "Long Beach",
    location: "At Sea",
    portCall: "",
    latitude: "28.9012",
    longitude: "165.3456",
    incidentLinked: true,
    incidentNo: "INC-2023-445",
    claimant: "Horizon Shipping Ltd",
    claimantReference: "HSL-2023-289",
    picLegal: [],
    broker: "Global Marine Insurance",
    brokerReference: "GMI-2023-445",
    brokerContact: "Linda Kovacs",
    leadingInsurer: "London P&I Club",
    insurerReference: "",
    insurerContact: "Andrew Barnes",
    dateOfIncident: "2023-11-15",
    dateOfNotification: "2023-11-16",
    claimEstimate: 2200000,
    claimAmount: 2100000,
    currency: "USD",
    deductible: 100000,
    recoverableBy: "Insurance",
    costAllocations: [
      { id: "ca-1", description: "Engine room repairs", amount: 1800000, recoverability: "Insurance", category: "Repairs" },
      { id: "ca-2", description: "Surveyor fees", amount: 150000, recoverability: "Insurance", category: "Surveyor" },
      { id: "ca-3", description: "Legal costs", amount: 150000, recoverability: "Insurance", category: "Legal" },
    ],
    status: "Close",
    insuranceWorkflowStatus: "Approved",
    reviewedByInsurance: true,
    approvedByInsurance: true,
    signedOffPending: false,
    documentChecklist: ["Logbooks", "Photos", "Claim Notice", "Survey Invitation", "Delivery Notes"],
    createdBy: "Aiswaryaa Adminren",
    createdDate: "2023-11-17",
    remarks: "Major engine room fire requiring extensive repairs. Settlement agreed.",
    description: "Major engine room fire requiring extensive repairs",
    archived: true,
    deleted: false,
  },
  {
    id: "9",
    claimNo: "CLM-2024-008",
    claimType: "FD&D",
    typeOfCover: "FD&D (UHL as charterer)",
    priority: "Low",
    vessel: "MV ARCTIC BREEZE",
    fixture: "FIX-2024-101",
    voyage: "VOY-2024-071",
    pol: "Murmansk",
    pod: "Rotterdam",
    location: "",
    portCall: "",
    latitude: "",
    longitude: "",
    incidentLinked: false,
    incidentNo: "",
    claimant: "Nordic Shipping AS",
    claimantReference: "NSA-2024-101",
    picLegal: [],
    broker: "Seaborne Insurance Group",
    brokerReference: "SIG-2024-101",
    brokerContact: "Rachel Kim",
    leadingInsurer: "Swedish Club",
    insurerReference: "",
    insurerContact: "Björn Larsson",
    dateOfIncident: "2024-01-28",
    dateOfNotification: "2024-02-01",
    claimEstimate: 185000,
    claimAmount: 175000,
    currency: "USD",
    deductible: 0,
    recoverableBy: "Non-recoverable",
    costAllocations: [],
    status: "Close",
    insuranceWorkflowStatus: "Approved",
    reviewedByInsurance: true,
    approvedByInsurance: true,
    signedOffPending: false,
    documentChecklist: ["Claim Notice", "Delivery Notes"],
    createdBy: "Safna Basheer",
    createdDate: "2024-02-02",
    remarks: "Main engine failure causing voyage delay. Settled.",
    description: "Main engine failure causing voyage delay",
    archived: false,
    deleted: false,
  },
  {
    id: "10",
    claimNo: "CLM-2024-009",
    claimType: "Personal Injury",
    typeOfCover: "Protection & Indemnity (P&I)",
    priority: "None",
    vessel: "MV TROPICAL WAVE",
    fixture: "FIX-2024-118",
    voyage: "VOY-2024-082",
    pol: "Santos",
    pod: "Mombasa",
    location: "At Sea",
    portCall: "",
    latitude: "-15.4567",
    longitude: "32.1234",
    incidentLinked: true,
    incidentNo: "INC-2024-178",
    claimant: "Crew Member — Miguel Santos",
    claimantReference: "CREW-2024-019",
    picLegal: [],
    broker: "Maritime Risk Solutions",
    brokerReference: "MRS-2024-178",
    brokerContact: "Tom Richards",
    leadingInsurer: "UK P&I Club",
    insurerReference: "",
    insurerContact: "Helen Watts",
    dateOfIncident: "2024-02-20",
    dateOfNotification: "2024-02-21",
    claimEstimate: 50000,
    claimAmount: 45000,
    currency: "USD",
    deductible: 2500,
    recoverableBy: "Insurance",
    costAllocations: [],
    status: "Close",
    insuranceWorkflowStatus: "Approved",
    reviewedByInsurance: true,
    approvedByInsurance: true,
    signedOffPending: false,
    documentChecklist: ["Logbooks", "Notification Letters"],
    createdBy: "John Doe",
    createdDate: "2024-02-22",
    remarks: "",
    description: "Crew member suffered heat exhaustion in engine room",
    archived: false,
    deleted: false,
  },
  {
    id: "11",
    claimNo: "CLM-2024-010",
    claimType: "FD&D",
    typeOfCover: "FD&D (UHL as charterer)",
    priority: "Low",
    vessel: "MV GLOBAL TRADER",
    fixture: "FIX-2024-092",
    voyage: "VOY-2024-065",
    pol: "Durban",
    pod: "Colombo",
    location: "",
    portCall: "",
    latitude: "",
    longitude: "",
    incidentLinked: false,
    incidentNo: "",
    claimant: "International Trade Partners",
    claimantReference: "ITP-2024-092",
    picLegal: [],
    broker: "Marine Legal & Insurance",
    brokerReference: "MLI-2024-092",
    brokerContact: "Chris Fenton",
    leadingInsurer: "UK Defence Club",
    insurerReference: "",
    insurerContact: "Fiona Hughes",
    dateOfIncident: "2024-02-12",
    dateOfNotification: "2024-02-16",
    claimEstimate: 225000,
    claimAmount: 215000,
    currency: "USD",
    deductible: 10000,
    recoverableBy: "Client",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Pending Submission",
    reviewedByInsurance: false,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: [],
    createdBy: "Tester Adminren",
    createdDate: "2024-02-17",
    remarks: "Dispute over demurrage calculation at discharge port.",
    description: "Dispute over demurrage calculation at discharge port",
    archived: false,
    deleted: false,
  },
  {
    id: "12",
    claimNo: "CLM-2024-011",
    claimType: "Cargo",
    typeOfCover: "Extended Contractual Liability (ECL) / Extended Cargo Cover (ECC)",
    priority: "Medium",
    vessel: "MV LIBERTY BELLE",
    fixture: "FIX-2024-125",
    voyage: "VOY-2024-088",
    pol: "Felixstowe",
    pod: "Mumbai",
    location: "Port",
    portCall: "Mumbai",
    latitude: "",
    longitude: "",
    incidentLinked: false,
    incidentNo: "",
    claimant: "Continental Logistics",
    claimantReference: "CL-2024-125",
    picLegal: [],
    broker: "International Marine Brokers",
    brokerReference: "IMB-2024-125",
    brokerContact: "Paul Haynes",
    leadingInsurer: "West of England",
    insurerReference: "",
    insurerContact: "Nigel Foster",
    dateOfIncident: "2024-03-05",
    dateOfNotification: "2024-03-08",
    claimEstimate: 190000,
    claimAmount: 180000,
    currency: "USD",
    deductible: 10000,
    recoverableBy: "Insurance",
    costAllocations: [],
    status: "Open",
    insuranceWorkflowStatus: "Submitted",
    reviewedByInsurance: false,
    approvedByInsurance: false,
    signedOffPending: false,
    documentChecklist: ["Delivery Notes", "Photos"],
    createdBy: "Nikhil Mathew",
    createdDate: "2024-03-09",
    remarks: "Shortage discovered on cargo discharge.",
    description: "Shortage discovered on cargo discharge",
    archived: false,
    deleted: false,
  },
];
