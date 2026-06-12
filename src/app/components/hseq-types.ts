export interface ControlAction {
  id: string;
  type: string;
  controlAreas: string[];
  description: string;
  responsiblePerson: string;
  dueDate: string;
  completionDate?: string;
  status: string;
}

export interface CauseEntry {
  id: string;
  immediateCause: string;
  substandardActCondition: string;
  basicCause: string;
  category: string;
  subCategory: string;
  rootCauseCode: string;
  rootCauseDescription: string;
  controlActions?: ControlAction[];
}

export interface ClaimEntry {
  id: string;
  reference: string;
  amount: number;
}

export interface DocumentEntry {
  id: string;
  folderLink: string;
  checklistType: string;
}

export interface Incident {
  id: string;
  incidentNumber: string;
  vessel: string;
  voyage: string;
  fixtures: string[];
  date: string;
  portCall?: string;
  incidentCategory: string;
  location: string;
  latitude?: string;
  longitude?: string;
  class: string; // Level 2: Incident Class / Near-Miss Type / etc.
  type: string;  // Level 3: Incident Type
  eventSeverity?: string; // Level 4: Event Severity Classification
  shortDesc: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  detailedDesc: string;
  status: "Open" | "Closed" | "Pending" | "Cancelled";
  claimExists: boolean;
  innocent: boolean;
  fixtureData?: Record<string, any>;
  exposureHours?: number;
  causes: CauseEntry[];
  controlActions: ControlAction[]; // Keeping for backward compatibility or global actions if needed, but will likely be unused or migrated
  linkedClaims: ClaimEntry[];
  documents: DocumentEntry[];
}

export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";
export type IncidentStatus = "Open" | "Closed" | "Pending" | "Cancelled";

export const INITIAL_DATA: Incident[] = [
  {
    id: "inc-001",
    incidentNumber: "INC-2024-001",
    vessel: "UHL F900",
    voyage: "FAI 2601",
    fixtures: ["UHL-F-2026-001"],
    portCall: "Hamburg",
    date: "2024-02-15",
    incidentCategory: "Accident",
    location: "Deck 1",
    class: "Personnel Accident",
    type: "Slip/Trip",
    eventSeverity: "Medical Treatment Case",
    shortDesc: "Crew member slipped on wet deck",
    severity: "Medium",
    detailedDesc: "While securing cargo during heavy rain, a crew member slipped on the wet deck surface near hatch cover 2. The anti-slip coating in this area was worn. The crew member sustained a sprained ankle and was given first aid immediately.",
    status: "Open",
    claimExists: true,
    innocent: false,
    fixtureData: {
      "UHL-F-2026-001": { 
        pol: ["Hamburg"],
        pod: ["Newcastle"],
        fixedBy: "UNITED HEAVY TRANSPORT GmbH – Headquarters",
        personInCharge: "Tester Admaren"
      }
    },
    causes: [
      {
        id: "cause-001",
        immediateCause: "Substandard Condition",
        substandardActCondition: "Poor Housekeeping",
        basicCause: "Job / System Factors",
        category: "Inadequate Maintenance Program",
        subCategory: "Maintenance schedule inappropriate",
        rootCauseCode: "RC-06: Work environment issues",
        rootCauseDescription: "Deck anti-slip coating maintenance schedule was delayed due to operational constraints.",
        controlActions: [
          {
            id: "act-001",
            type: "Corrective",
            controlAreas: ["Maintenance", "Safe Work Practices"],
            description: "Apply new anti-slip coating to the affected area immediately upon arrival at next port.",
            responsiblePerson: "Chief Officer",
            dueDate: "2024-02-20",
            status: "Open"
          }
        ]
      }
    ],
    controlActions: [],
    linkedClaims: [
      {
        id: "claim-001",
        reference: "CLM-2024-005",
        amount: 2500
      }
    ],
    documents: [
      {
        id: "doc-001",
        checklistType: "Photos",
        folderLink: "https://m-files.example.com/obj/12345"
      }
    ]
  },
  {
    id: "inc-002",
    incidentNumber: "INC-2024-002",
    vessel: "UHL FAITH",
    voyage: "FAI 2602",
    fixtures: ["UHL-F-2026-002"],
    portCall: "Houston",
    date: "2024-02-10",
    incidentCategory: "Near-Miss",
    location: "Engine Room",
    class: "Unsafe Condition",
    type: "",
    eventSeverity: "",
    shortDesc: "Oil leak detected near main engine",
    severity: "High",
    detailedDesc: "During routine rounds, the 2nd Engineer noticed a small oil leak from the fuel pump flange. The area was immediately isolated and cleaned. No fire or injury occurred, but potential for fire was high.",
    status: "Pending",
    claimExists: false,
    innocent: false,
    causes: [
      {
        id: "cause-002",
        immediateCause: "Substandard Condition",
        substandardActCondition: "Defective Equipment",
        basicCause: "Job / System Factors",
        category: "Inadequate Maintenance",
        subCategory: "Parts unavailable",
        rootCauseCode: "RC-05: Tools/Equipment inadequate",
        rootCauseDescription: "Gasket material quality was substandard causing premature failure.",
        controlActions: [
          {
            id: "act-002",
            type: "Preventive",
            controlAreas: ["Maintenance", "Resource Allocation"],
            description: "Replace all gaskets of the same batch and source higher quality spares.",
            responsiblePerson: "Chief Engineer",
            dueDate: "2024-02-12",
            status: "Closed"
          }
        ]
      }
    ],
    controlActions: [],
    linkedClaims: [],
    documents: []
  },
  {
    id: "inc-003",
    incidentNumber: "INC-2024-003",
    vessel: "UHL FUTURE",
    voyage: "FAI 2603",
    fixtures: [],
    portCall: "Singapore",
    date: "2024-01-28",
    incidentCategory: "Accident",
    location: "Cargo Hold 1",
    class: "Cargo Damage and/or Loss",
    type: "Contact with other cargo",
    eventSeverity: "",
    shortDesc: "Minor damage to project cargo during discharge",
    severity: "Low",
    detailedDesc: "During lifting operations, a wind turbine blade slightly grazed the adjacent container stack. Minor scratch observed on the blade surface. Survey conducted.",
    status: "Closed",
    claimExists: true,
    innocent: true,
    causes: [],
    controlActions: [],
    linkedClaims: [
      {
        id: "claim-002",
        reference: "CLM-2024-001",
        amount: 15000
      }
    ],
    documents: [
      {
        id: "doc-002",
        checklistType: "Survey Invitation",
        folderLink: "https://m-files.example.com/obj/67890"
      },
      {
        id: "doc-003",
        checklistType: "Photos",
        folderLink: "https://m-files.example.com/obj/67891"
      }
    ]
  },
  {
    id: "inc-004",
    incidentNumber: "INC-2024-004",
    vessel: "UHL FIERCE",
    voyage: "FAI 2503",
    fixtures: ["UHL-F-2026-004"],
    portCall: "Rotterdam",
    date: "2024-02-18",
    incidentCategory: "Non-Conformity",
    location: "Bridge",
    class: "Failure to follow company procedures",
    type: "",
    eventSeverity: "",
    shortDesc: "Navigation chart not updated before departure",
    severity: "Medium",
    detailedDesc: "Port State Control inspection revealed that the paper chart for the approach to Rotterdam was not the latest edition. The digital ECDIS was correct, but backup paper chart was outdated.",
    status: "Open",
    claimExists: false,
    innocent: false,
    causes: [
      {
        id: "cause-003",
        immediateCause: "Substandard Act",
        substandardActCondition: "Failure to Follow Procedures",
        basicCause: "Personal Factors",
        category: "Lack of Knowledge",
        subCategory: "New to task",
        rootCauseCode: "RC-03: Training/Knowledge gap",
        rootCauseDescription: "Second Officer was new to the vessel and unfamiliar with the specific chart update procedure.",
        controlActions: [
          {
            id: "act-003",
            type: "Corrective",
            controlAreas: ["Training & Competence"],
            description: "Conduct refresher training on chart management for all bridge officers.",
            responsiblePerson: "Master",
            dueDate: "2024-02-25",
            status: "Open"
          }
        ]
      }
    ],
    controlActions: [],
    linkedClaims: [],
    documents: []
  }
];
