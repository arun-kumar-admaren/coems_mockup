import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DatePicker } from "./ui/date-picker";
import { Search, SlidersHorizontal, Menu, Bell, ChevronDown, Plus, FileText, ChevronUp, ChevronsUpDown, Check, Trash2, PlusCircle, X, Info, Activity, ShieldCheck, Banknote, FileSpreadsheet, Upload, AlertCircle, ArrowRight, Download, MoreVertical, FileDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { cn } from "./ui/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { Incident, CauseEntry, ControlAction, ClaimEntry, DocumentEntry, IncidentSeverity, IncidentStatus } from "./hseq-types";
import { INITIAL_CLAIMS_DATA } from "./claims-types";
import { ClaimsIncidentEmbedded } from "./claims-incident-embedded";

const INCIDENT_CATEGORIES = [
  "Accident", 
  "Near-Miss", 
  "Non-Conformity", 
  "Innocent Incident"
];

// --- MSCAT Constants ---

const IMMEDIATE_CAUSE_TYPES = ["Substandard Act", "Substandard Condition"];

const SUBSTANDARD_ACTS = [
  "Failure to Follow Procedures",
  "Improper Lifting",
  "Working Without Permit",
  "Improper Use of Tools/Equipment",
  "Bypassing Safety Devices",
  "Failure to Use PPE",
  "Operating Equipment Without Authority",
  "Improper Position / Unsafe Posture",
  "Improper Loading / Stacking",
  "Using Defective Equipment",
  "Distraction / Inattention",
  "Improper Signaling",
  "Unsafe Speed",
  "Failure to Isolate Energy"
];

const SUBSTANDARD_CONDITIONS = [
  "Inadequate Guarding",
  "Defective Equipment",
  "Poor Housekeeping",
  "Inadequate Lighting",
  "Inadequate Ventilation",
  "Congested Work Area",
  "Inadequate Warning Systems",
  "Unsafe Access / Egress",
  "Improper Design",
  "Excessive Noise",
  "Inadequate Maintenance",
  "Environmental Hazards"
];

const BASIC_CAUSE_TYPES = ["Personal Factors", "Job / System Factors"];

const PERSONAL_FACTORS = [
  "Lack of Knowledge",
  "Lack of Skill",
  "Inadequate Training",
  "Stress",
  "Fatigue",
  "Physical Limitation",
  "Mental Limitation",
  "Inadequate Supervision",
  "Lack of Awareness",
  "Motivation Issues"
];

const JOB_SYSTEM_FACTORS = [
  "Inadequate Procedures",
  "Poor Risk Assessment",
  "Inadequate Maintenance Program",
  "Poor Communication",
  "Inadequate Planning",
  "Inadequate Supervision",
  "Deficient Design",
  "Inadequate Inspection",
  "Contractor Management Failure",
  "Resource Constraints"
];

const MSCAT_SUB_CATEGORIES: Record<string, string[]> = {
  "Lack of Knowledge": ["No formal training", "Inadequate certification", "New to task"],
  "Lack of Skill": ["Insufficient practice", "Task too complex"],
  "Inadequate Procedures": ["Procedure not available", "Procedure unclear", "Procedure outdated", "Conflicting instructions"],
  "Poor Risk Assessment": ["Hazard not identified", "Controls not adequate", "Risk assessment not reviewed"],
  "Inadequate Maintenance Program": ["Preventive maintenance not followed", "Parts unavailable", "Maintenance schedule inappropriate"],
  // Fallbacks
  "Stress": ["High workload", "Time pressure", "Personal issues"],
  "Fatigue": ["Lack of sleep", "Long hours", "Shift work"],
  "Improper Signaling": ["No signalman", "Wrong signal", "Radio failure"],
  "Defective Equipment": ["Wear and tear", "Manufacturing defect", "Improper repair"],
};

const ROOT_CAUSE_CODES = [
  "RC-01: Procedures/Standards inadequate",
  "RC-02: Communication failure",
  "RC-03: Training/Knowledge gap",
  "RC-04: Supervision/Leadership inadequate",
  "RC-05: Tools/Equipment inadequate",
  "RC-06: Work environment issues",
  "RC-07: Risk Management failure",
  "RC-08: Contractor Management failure",
  "RC-09: Emergency Response failure",
  "RC-10: Human Factors"
];

const ACTION_TYPES = ["Corrective", "Preventive"];

const CONTROL_AREAS = [
  "Leadership",
  "Policy & Procedures",
  "Risk Assessment",
  "Work Permits",
  "Maintenance",
  "Training & Competence",
  "Communication",
  "Supervision",
  "Contractor Management",
  "Emergency Preparedness",
  "Incident Reporting",
  "Inspection & Audit",
  "Management Review",
  "Safe Work Practices",
  "Resource Allocation"
];

const DEPARTMENTS = [
  "Deck Department",
  "Engine Department",
  "Catering Department",
  "HSEQ Office",
  "Marine Operations",
  "Technical Office",
  "Crewing",
  "Management"
];

const ACTION_STATUSES = ["Open", "Closed"];

const DOCUMENT_CHECKLIST_TYPES = [
  "Log Books",
  "Damaged Cargo Matrices",
  "Delivery Notes",
  "Claim Notice from Client",
  "Photos",
  "Survey Invitation",
  "Rejection Letter",
  "Notification Letters"
];

const VESSEL_OPTIONS = [
  "UHL F900", "UHL FAITH", "UHL FORCE", "UHL FIERCE", "UHL FELICITY",
  "UHL FINESSE", "UHL FLAIR", "UHL PASSION", "BOLD WIND", "UML VERONICA", "UHL FUTURE"
];

const VOYAGE_OPTIONS = [
  "FAI 2601", "FAI 2602", "FAI 2603", "FAI 2501", "FAI 2502", "FAI 2503"
];

const PORT_CALL_OPTIONS = [
  "Rotterdam", "Singapore", "Houston", "Shanghai", "Jebel Ali", "Santos"
];

const SEVERITY_OPTIONS_FILTER = ["Low", "Medium", "High", "Critical"];
const STATUS_OPTIONS_FILTER = ["Open", "Closed", "Pending", "Cancelled"];
const YES_NO_OPTIONS = ["Yes", "No"];

// Configuration for hierarchy
const HIERARCHY: Record<string, {
  label: string;
  options: string[];
  hasLevel3?: boolean;
}> = {
  "Accident": {
    label: "Incident Class",
    options: [
      "Personnel Accident",
      "Vessel Damage and/or Loss",
      "Cargo Damage and/or Loss",
      "Environmental Accident",
      "Security Accident"
    ],
    hasLevel3: true
  },
  "Near-Miss": {
    label: "Near-Miss Type",
    options: ["Unsafe Condition", "Unsafe Act"],
    hasLevel3: false
  },
  "Non-Conformity": {
    label: "Non-Conformity Type",
    options: [
      "Failure to fulfil Flag State regulation",
      "Failure to fulfil Port State regulation",
      "Failure to fulfil customer requirements & expectations",
      "Failure to follow company procedures",
      "Personnel Complaint",
      "Others"
    ],
    hasLevel3: false
  },
  "Innocent Incident": {
    label: "Innocent Incident Type",
    options: ["Illness / Medical treatment"],
    hasLevel3: false
  }
};

const INCIDENT_LEVEL_3_TYPES: Record<string, string[]> = {
  "Personnel Accident": [
    "Fall From Elevation (Person)",
    "Fall on the Same Level (Slip/Trip)",
    "Struck Against (Bump Into/Run Into)",
    "Struck By (Hit by Moving Object)",
    "Caught In, On, Between or Under",
    "Contact with Temperature Extremes (Heat/Cold)",
    "Contact with Electricity",
    "Expose to Noise",
    "Expose to Vibration",
    "Expose to Radiation",
    "Contact with Hazardous Substance/Dose",
    "Overstress by Overexertion/Overload/Ergonomic Factors",
    "Act of Violence"
  ],
  "Vessel Damage and/or Loss": [
    "Ship Collision",
    "Ship Allision",
    "Ship Grounding",
    "Fire",
    "Explosions",
    "Loss of Ship Hull/Watertight Integrity",
    "Fall from elevation (Equipment/Material)"
  ],
  "Cargo Damage and/or Loss": [
    "Contact with vessel structure",
    "Fire / Exposure to high temperatures",
    "Contact with other cargo",
    "Contact with lashing material"
  ],
  "Environmental Accident": [
    "Contained Spill",
    "Environmental Release"
  ],
  "Security Accident": [
    "Theft",
    "Robbery",
    "Stowaway boarding",
    "Smuggling",
    "Hijacking"
  ]
};

const EVENT_SEVERITY_OPTIONS = [
  "Fatality (FAT)",
  "Permanent Total Disability",
  "Permanent Partial Disability",
  "Lost/Restricted Work Case",
  "Medical Treatment Case",
  "First Aid Case"
];

const FIXTURE_OPTIONS = [
  "UHL-F-2026-001",
  "UHL-F-2026-002",
  "UHL-F-2026-003",
  "UHL-F-2026-004",
];

const MOCK_FIXTURE_DETAILS: Record<string, any> = {
  "UHL-F-2026-001": { 
    pol: ["Hamburg"],
    pod: ["Newcastle"],
    fixedBy: "UNITED HEAVY TRANSPORT GmbH – Headquarters",
    personInCharge: "Tester Admaren",
    bookingDate: "11/01/2026",
    typeOfCP: "Gencon 94",
    cpStatus: { signed: true, pdf: true, hardCopy: false },
    insurance: { requirement: "Not Required", details: "None", nda: "None" }
  },
  "UHL-F-2026-002": { 
    pol: ["Antwerp", "Rotterdam"],
    pod: ["Houston", "New Orleans"],
    fixedBy: "UNITED HEAVY TRANSPORT GmbH – Headquarters",
    personInCharge: "John Doe",
    bookingDate: "15/01/2026",
    typeOfCP: "Heavycon 2007",
    cpStatus: { signed: true, pdf: true, hardCopy: true },
    insurance: { requirement: "ECL Required", details: "Standard P&I", nda: "Standard" }
  },
  "UHL-F-2026-003": { 
    pol: ["Shanghai"],
    pod: ["Jebel Ali", "Dammam"],
    fixedBy: "Global Chartering Inc.",
    personInCharge: "Sarah Smith",
    bookingDate: "20/01/2026",
    typeOfCP: "BIMCO",
    cpStatus: { signed: false, pdf: false, hardCopy: false },
    insurance: { requirement: "CCC Required", details: "Extended Coverage", nda: "Strict" }
  },
  "UHL-F-2026-004": { 
    pol: ["Rotterdam"],
    pod: ["Singapore"],
    fixedBy: "Nordic Freight",
    personInCharge: "Erik Hansen",
    bookingDate: "25/01/2026",
    typeOfCP: "NYPE 2015",
    cpStatus: { signed: true, pdf: false, hardCopy: false },
    insurance: { requirement: "Not Required", details: "None", nda: "None" }
  },
};

interface HSEQProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
}

export function HSEQ({ incidents, setIncidents }: HSEQProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState("mine");
  
  // Filter State
  const [filters, setFilters] = useState({
    incidentNumber: "",
    vessel: "",
    voyage: "",
    portCall: "",
    fixtures: "",
    date: "",
    incidentCategory: "",
    class: "",
    type: "",
    location: "",
    shortDesc: "",
    severity: "",
    status: "",
    claimExists: "",
    innocent: ""
  });

  // Filtered Incidents Logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      // Global Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          inc.incidentNumber.toLowerCase().includes(query) ||
          inc.vessel.toLowerCase().includes(query) ||
          inc.shortDesc.toLowerCase().includes(query) ||
          inc.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Column Filters
      if (filters.incidentNumber && !inc.incidentNumber.toLowerCase().includes(filters.incidentNumber.toLowerCase())) return false;
      if (filters.vessel && inc.vessel !== filters.vessel) return false;
      if (filters.voyage && inc.voyage !== filters.voyage) return false;
      if (filters.portCall && inc.portCall !== filters.portCall) return false;
      if (filters.fixtures && !inc.fixtures.some(f => f.toLowerCase().includes(filters.fixtures.toLowerCase()))) return false;
      if (filters.date && inc.date !== filters.date) return false;
      if (filters.incidentCategory && inc.incidentCategory !== filters.incidentCategory) return false;
      if (filters.class && inc.class !== filters.class) return false;
      if (filters.type && inc.type !== filters.type) return false;
      if (filters.location && !inc.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.shortDesc && !inc.shortDesc.toLowerCase().includes(filters.shortDesc.toLowerCase())) return false;
      if (filters.severity && inc.severity !== filters.severity) return false;
      if (filters.status && inc.status !== filters.status) return false;
      if (filters.claimExists) {
           const claimBool = filters.claimExists === "Yes";
           if (inc.claimExists !== claimBool) return false;
      }
      if (filters.innocent) {
           const innocentBool = filters.innocent === "Yes";
           if (inc.innocent !== innocentBool) return false;
      }
      return true;
    });
  }, [incidents, filters, searchQuery]);

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState({
    incidentNumber: "",
    vessel: "",
    voyage: "",
    portCall: "",
    fixtures: [] as string[],
    date: "",
    incidentCategory: "Accident",
    location: "none",
    latitude: "",
    longitude: "",
    class: "", // Level 2
    type: "", // Level 3
    eventSeverity: "", // Level 4
    shortDesc: "",
    severity: "Low" as IncidentSeverity,
    detailedDesc: "",
    status: "Open" as IncidentStatus,
    claimExists: false,
    innocent: false,
    exposureHours: null as number | null,
    causes: [] as CauseEntry[],
    // controlActions: [] as ControlAction[], // Deprecated in UI, merged into causes
    linkedClaims: [] as ClaimEntry[],
    documents: [] as DocumentEntry[]
  });

  // State for collapsible fixture details
  const [openFixtures, setOpenFixtures] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Reporting State
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>("PDF");
  const [excludedFields, setExcludedFields] = useState<string[]>([]);
  const internalFields = ["Witness Statements", "Root Cause Analysis (Detailed)", "Internal Comments", "Investigator Notes", "Personal Identifiers"];

  // MSCAT Handlers
  const addCause = () => {
    const newCause: CauseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      immediateCause: "",
      substandardActCondition: "",
      basicCause: "",
      category: "",
      subCategory: "",
      rootCauseCode: "",
      rootCauseDescription: "",
      controlActions: []
    };
    setFormData(prev => ({ ...prev, causes: [...prev.causes, newCause] }));
  };

  const removeCause = (id: string) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.filter(c => c.id !== id)
    }));
  };

  const updateCause = (id: string, field: keyof CauseEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.map(c => {
        if (c.id !== id) return c;
        const updated = { ...c, [field]: value };
        
        // Reset dependent fields
        if (field === "immediateCause") {
          updated.substandardActCondition = "";
        }
        if (field === "basicCause") {
          updated.category = "";
          updated.subCategory = "";
        }
        if (field === "category") {
          updated.subCategory = "";
        }
        
        return updated;
      })
    }));
  };

  // Control Actions (Nested in Causes)
  const addControlAction = (causeId: string) => {
    const newAction: ControlAction = {
      id: Math.random().toString(36).substr(2, 9),
      type: "Corrective",
      controlAreas: [],
      description: "",
      responsiblePerson: "",
      dueDate: "",
      status: "Open"
    };
    
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.map(c => {
        if (c.id !== causeId) return c;
        return {
          ...c,
          controlActions: [...(c.controlActions || []), newAction]
        };
      })
    }));
  };

  const removeControlAction = (causeId: string, actionId: string) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.map(c => {
        if (c.id !== causeId) return c;
        return {
          ...c,
          controlActions: (c.controlActions || []).filter(a => a.id !== actionId)
        };
      })
    }));
  };

  const updateControlAction = (causeId: string, actionId: string, field: keyof ControlAction, value: any) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.map(c => {
        if (c.id !== causeId) return c;
        return {
          ...c,
          controlActions: (c.controlActions || []).map(a => 
            a.id === actionId ? { ...a, [field]: value } : a
          )
        };
      })
    }));
  };

  const addLinkedClaim = () => {
    const newClaim: ClaimEntry = {
      id: Math.random().toString(36).substr(2, 9),
      reference: "",
      amount: 0
    };
    setFormData(prev => ({ ...prev, linkedClaims: [...prev.linkedClaims, newClaim] }));
  };

  const removeLinkedClaim = (id: string) => {
    setFormData(prev => ({
      ...prev,
      linkedClaims: prev.linkedClaims.filter(c => c.id !== id)
    }));
  };

  const updateLinkedClaim = (id: string, field: keyof ClaimEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      linkedClaims: prev.linkedClaims.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const addDocument = () => {
    const newDoc: DocumentEntry = {
      id: Math.random().toString(36).substr(2, 9),
      folderLink: "",
      checklistType: ""
    };
    setFormData(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
  };

  const removeDocument = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  const updateDocument = (id: string, field: keyof DocumentEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(d => 
        d.id === id ? { ...d, [field]: value } : d
      )
    }));
  };

  const toggleFixtureCollapse = (fixture: string) => {
    setOpenFixtures(prev => 
      prev.includes(fixture) 
        ? prev.filter(f => f !== fixture) 
        : [...prev, fixture]
    );
  };

  const generateIncidentNumber = () => {
    const currentYear = new Date().getFullYear();
    const prefix = `INC-${currentYear}`;
    
    // Find existing incidents for current year
    const yearIncidents = incidents.filter(i => i.incidentNumber.startsWith(prefix));
    
    // If no incidents, start with 001
    if (yearIncidents.length === 0) {
      return `${prefix}-001`;
    }
    
    // Parse last number and increment
    const lastIncident = yearIncidents[yearIncidents.length - 1];
    const lastNumber = parseInt(lastIncident.incidentNumber.split("-")[2]);
    const nextNumber = (lastNumber + 1).toString().padStart(3, "0");
    
    return `${prefix}-${nextNumber}`;
  };

  const handleOpenSheet = () => {
    const nextId = generateIncidentNumber();
    setEditingId(null);
    setFormData({
      incidentNumber: nextId,
      vessel: "",
      voyage: "",
      fixtures: [],
      date: new Date().toISOString().split('T')[0],
      incidentCategory: "Accident",
      location: "none",
      latitude: "",
      longitude: "",
      class: "",
      type: "",
      eventSeverity: "",
      shortDesc: "",
      severity: "Low",
      detailedDesc: "",
      status: "Open",
      claimExists: false,
      innocent: false,
      exposureHours: null,
      causes: [],
      // controlActions: [], // Removed as it is now nested in causes
      linkedClaims: [],
      documents: []
    });
    setOpenFixtures([]); // Reset open collapsibles
    setIsSheetOpen(true);
  };

  const handleEditIncident = (incident: Incident) => {
    setEditingId(incident.id);
    setFormData({
      incidentNumber: incident.incidentNumber,
      vessel: incident.vessel,
      voyage: incident.voyage,
      fixtures: incident.fixtures,
      date: incident.date,
      incidentCategory: incident.incidentCategory,
      location: incident.location || "none",
      latitude: incident.latitude || "",
      longitude: incident.longitude || "",
      class: incident.class,
      type: incident.type,
      eventSeverity: incident.eventSeverity || "",
      shortDesc: incident.shortDesc,
      severity: incident.severity,
      detailedDesc: incident.detailedDesc,
      status: incident.status,
      claimExists: incident.claimExists,
      innocent: incident.innocent,
      exposureHours: incident.exposureHours || null,
      causes: incident.causes || [],
      // controlActions: incident.controlActions || [],
      linkedClaims: incident.linkedClaims || [],
      documents: incident.documents || []
    });
    // Open fixture details if any fixtures are selected
    if (incident.fixtures.length > 0) {
      setOpenFixtures([incident.fixtures[0]]); // Open first one by default
    } else {
      setOpenFixtures([]);
    }
    setIsSheetOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Capture snapshot of fixture data
    const fixtureDataSnapshot: Record<string, any> = {};
    formData.fixtures.forEach(fixture => {
      if (MOCK_FIXTURE_DETAILS[fixture]) {
        fixtureDataSnapshot[fixture] = MOCK_FIXTURE_DETAILS[fixture];
      }
    });

    // We need to pass the controlActions that are nested in causes to the top level 
    // if the backend still expects them there, or just keep them in causes. 
    // The type definition expects controlActions at the top level, so we might need to 
    // populate it, but effectively we are managing them inside causes.
    // For now, I'll provide an empty array for top level controlActions to satisfy the type if needed,
    // or aggregate them if required. Since the UI logic has changed to nested, 
    // the source of truth is now in causes.controlActions.
    
    if (editingId) {
      // Update existing incident
      setIncidents(prev => prev.map(inc => 
        inc.id === editingId 
          ? { ...inc, ...formData, controlActions: [], fixtureData: fixtureDataSnapshot }
          : inc
      ));
    } else {
      // Create new incident
      const newIncident: Incident = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        controlActions: [],
        fixtureData: fixtureDataSnapshot,
      };
      setIncidents([...incidents, newIncident]);
    }
    
    setIsSheetOpen(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => {
      const updates: any = { [field]: value };
      
      // Cascade resets based on hierarchy
      if (field === "incidentCategory") {
        updates.class = "";
        updates.type = "";
        updates.eventSeverity = "";
      } else if (field === "class") {
        updates.type = "";
        updates.eventSeverity = "";
      } else if (field === "location") {
        if (value !== "At Sea") {
          updates.latitude = "";
          updates.longitude = "";
        }
        if (value !== "Port" && value !== "Anchorage") {
          updates.portCall = "";
        }
      }
      
      return { ...prev, ...updates };
    });
  };

  const toggleFixtureSelection = (fixture: string) => {
    setFormData(prev => {
      const newFixtures = prev.fixtures.includes(fixture)
        ? prev.fixtures.filter(f => f !== fixture)
        : [...prev.fixtures, fixture];
      
      // Automatically open the details for the newly selected fixture
      if (!prev.fixtures.includes(fixture)) {
        setOpenFixtures(curr => [...curr, fixture]);
      } else {
         // Close details if deselected
         setOpenFixtures(curr => curr.filter(f => f !== fixture));
      }

      return { ...prev, fixtures: newFixtures };
    });
  };

  // Derived state for dropdown options and labels
  const currentLevel2 = useMemo(() => {
    return HIERARCHY[formData.incidentCategory] || { label: "Class/Type", options: [], hasLevel3: false };
  }, [formData.incidentCategory]);

  const currentLevel3Options = useMemo(() => {
    if (!currentLevel2.hasLevel3) return [];
    return INCIDENT_LEVEL_3_TYPES[formData.class] || [];
  }, [formData.incidentCategory, formData.class, currentLevel2.hasLevel3]);
  
  const showLevel3 = currentLevel2.hasLevel3;
  
  const showLevel4 = formData.incidentCategory === "Accident" && 
                     formData.class === "Personnel Accident";

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa]">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center justify-end h-14 px-5">
          {/* Right side - User info and actions */}
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-600">
              USER_ID: 001 | Chennai, Kollam...
            </span>
            
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors relative">
              <Bell className="size-5 text-gray-600" />
              <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <Menu className="size-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-5 py-3">
          {/* Left side - Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-[#f5f5f5] border-0 text-[13px] placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-9 gap-2 text-[13px] font-normal border-gray-300 hover:bg-gray-50 bg-white px-3 transition-colors",
                    Object.values(filters).some(v => v) && "bg-blue-50 border-blue-200 text-blue-700"
                  )}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="start">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm leading-none">Filter Incidents</h4>
                  {(Object.values(filters).some(v => v) || searchQuery) && (
                     <Button 
                       variant="ghost" 
                       size="sm"
                       className="h-auto p-0 text-[11px] text-red-500 hover:text-red-600 hover:bg-transparent"
                       onClick={() => {
                         setSearchQuery("");
                         setFilters({
                            incidentNumber: "",
                            vessel: "",
                            voyage: "",
                            portCall: "",
                            fixtures: "",
                            date: "",
                            incidentCategory: "",
                            class: "",
                            type: "",
                            location: "",
                            shortDesc: "",
                            severity: "",
                            status: "",
                            claimExists: "",
                            innocent: ""
                         });
                       }}
                     >
                       Clear All
                     </Button>
                  )}
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Vessel</Label>
                    <Select value={filters.vessel} onValueChange={(val) => setFilters(prev => ({ ...prev, vessel: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Vessels">All Vessels</SelectItem>
                        {VESSEL_OPTIONS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Category</Label>
                    <Select value={filters.incidentCategory} onValueChange={(val) => setFilters(prev => ({ ...prev, incidentCategory: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        {INCIDENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Severity</Label>
                    <Select value={filters.severity} onValueChange={(val) => setFilters(prev => ({ ...prev, severity: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        {SEVERITY_OPTIONS_FILTER.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Status</Label>
                    <Select value={filters.status} onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS_FILTER.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Claim Exists</Label>
                    <Select value={filters.claimExists} onValueChange={(val) => setFilters(prev => ({ ...prev, claimExists: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        {YES_NO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Innocent Incident</Label>
                    <Select value={filters.innocent} onValueChange={(val) => setFilters(prev => ({ ...prev, innocent: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="none" /></SelectTrigger>
                      <SelectContent>
                        {YES_NO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Right side - View Switcher and Add Button */}
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    onClick={() => document.getElementById('near-miss-upload')?.click()}
                  >
                    <Upload className="size-4" />
                    Import Near Miss
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload Near miss details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input 
              type="file" 
              id="near-miss-upload" 
              className="hidden" 
              accept=".csv,.xlsx,.xls" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const currentYear = new Date().getFullYear();
                const prefix = `INC-${currentYear}`;
                const yearIncidents = incidents.filter(i => i.incidentNumber.startsWith(prefix));
                let lastNumber = 0;
                
                if (yearIncidents.length > 0) {
                  const lastIncident = yearIncidents[yearIncidents.length - 1];
                  const parts = lastIncident.incidentNumber.split("-");
                  if (parts.length >= 3) {
                    lastNumber = parseInt(parts[2]);
                  }
                }

                const newIncidents: Incident[] = [
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    incidentNumber: `${prefix}-${(lastNumber + 1).toString().padStart(3, "0")}`,
                    vessel: "UHL FUTURE",
                    voyage: "FAI 2605",
                    fixtures: [],
                    date: new Date().toISOString().split('T')[0],
                    incidentCategory: "Near-Miss",
                    location: "Main Deck",
                    class: "Unsafe Act",
                    type: "",
                    shortDesc: "Crew member working at height without safety harness hooked",
                    severity: "High",
                    detailedDesc: `Imported from ${file.name}. Observation of unsafe working practice during crane maintenance.`,
                    status: "Open",
                    claimExists: false,
                    innocent: false,
                    causes: [],
                    controlActions: [],
                    linkedClaims: [],
                    documents: []
                  },
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    incidentNumber: `${prefix}-${(lastNumber + 2).toString().padStart(3, "0")}`,
                    vessel: "UHL FLASH",
                    voyage: "FAI 2606",
                    fixtures: [],
                    date: new Date().toISOString().split('T')[0],
                    incidentCategory: "Near-Miss",
                    location: "Engine Room Workshop",
                    class: "Unsafe Condition",
                    type: "",
                    shortDesc: "Guarding missing on bench grinder",
                    severity: "Medium",
                    detailedDesc: `Imported from ${file.name}. Bench grinder guard was found removed during inspection.`,
                    status: "Pending",
                    claimExists: false,
                    innocent: false,
                    causes: [],
                    controlActions: [],
                    linkedClaims: [],
                    documents: []
                  }
                ];

                setIncidents(prev => [...prev, ...newIncidents]);
                e.target.value = ""; // Reset input
              }}
            />

            <Button onClick={handleOpenSheet} size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-transparent">
              <Plus className="mr-2 size-4" />
              New Incident
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Table */}
      <div className="flex-1 overflow-auto p-5">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 whitespace-nowrap w-[120px]">Incident No</th>
                  <th className="px-4 py-3 whitespace-nowrap">Vessel</th>
                  <th className="px-4 py-3 whitespace-nowrap">Voyage</th>
                  <th className="px-4 py-3 whitespace-nowrap">Port Call</th>
                  <th className="px-4 py-3 whitespace-nowrap">Related Fixtures</th>
                  <th className="px-4 py-3 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 whitespace-nowrap">Class</th>
                  <th className="px-4 py-3 whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 whitespace-nowrap">Description</th>
                  <th className="px-4 py-3 whitespace-nowrap">Severity</th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Claim</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Innocent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-[13px]">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900">No incidents found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => (
                    <tr 
                      key={incident.id} 
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                      onClick={() => handleEditIncident(incident)}
                    >
                      <td className="px-4 py-3 font-medium text-blue-600 whitespace-nowrap group-hover:underline">
                        {incident.incidentNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
                        {incident.vessel}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {incident.voyage}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {incident.portCall}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {incident.fixtures?.join(", ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {incident.date}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {incident.incidentCategory}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {incident.class}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {incident.type}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {incident.location}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]" title={incident.shortDesc}>
                        {incident.shortDesc}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          incident.severity === "High" || incident.severity === "Critical" 
                            ? "bg-red-100 text-red-800"
                            : incident.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          incident.status === "Open" 
                            ? "bg-blue-100 text-blue-800"
                            : incident.status === "Closed" || incident.status === "Cancelled"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-center">
                        {incident.claimExists ? (
                          <span className="text-blue-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-center">
                        {incident.innocent ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                
                {/* Empty rows to fill space if needed */}
                {filteredIncidents.length > 0 && filteredIncidents.length < 5 && Array.from({ length: 5 - filteredIncidents.length }).map((_, i) => (
                  <tr key={`empty-${i}`} className="hover:bg-gray-50 transition-colors h-[41px]">
                    <td colSpan={15} className="px-4 py-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div>Showing {filteredIncidents.length > 0 ? 1 : 0}-{filteredIncidents.length} of {filteredIncidents.length} incidents</div>
            <div className="flex gap-2">
              <button disabled className="px-2 py-1 rounded border border-gray-200 bg-white text-gray-400 cursor-not-allowed">Previous</button>
              <button disabled className="px-2 py-1 rounded border border-gray-200 bg-white text-gray-400 cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* New Incident Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="!max-w-none w-full sm:w-[500px] md:w-[600px] lg:w-1/2 flex flex-col h-full overflow-hidden p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{editingId ? "Edit Incident" : "Create New Incident"}</SheetTitle>
            <SheetDescription>
              {editingId ? "Update incident details below." : "Fill in the details below to report a new incident."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold text-gray-900">
                 {editingId ? "Edit Incident" : "Create New Incident"}
               </h2>
               {editingId && (
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                       <MoreVertical className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                       <FileDown className="mr-2 h-4 w-4" />
                       Export
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Summary Section - Visible only in Edit Mode */}
              {editingId && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Incident No</span>
                    <span className="font-semibold text-gray-900">{formData.incidentNumber}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</span>
                    <span className="font-semibold text-gray-900">{formData.incidentCategory}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Class</span>
                    <span className="font-medium text-gray-900">{formData.class || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type</span>
                    <span className="font-medium text-gray-900">{formData.type || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      formData.status === "Open" 
                        ? "bg-blue-100 text-blue-800"
                        : formData.status === "Closed" || formData.status === "Cancelled"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {formData.status}
                    </span>
                  </div>
                </div>
              )}

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full h-auto p-1 bg-gray-100/50 rounded-lg mb-6 border border-gray-200/50 flex flex-wrap sm:flex-nowrap gap-1">
                  <TabsTrigger 
                    value="general" 
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                  >
                    <Info className="w-3.5 h-3.5 mr-2" />
                    General Info
                  </TabsTrigger>
                  {editingId && (
                    <>
                      <TabsTrigger 
                        value="cause-analysis" 
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <Activity className="w-3.5 h-3.5 mr-2" />
                        Cause Analysis
                      </TabsTrigger>
                      {/* Control Actions Tab removed - nested inside Cause Analysis */}
                      <TabsTrigger 
                        value="claims" 
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <Banknote className="w-3.5 h-3.5 mr-2" />
                        Claims
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>

                {/* General Information Tab */}
                <TabsContent value="general" className="mt-0 space-y-8">
                  <div className="space-y-4">
                    {/* Incident Number - Visible only in Add Mode */}
                    {!editingId && (
                      <div className="space-y-2">
                        <Label>Incident Number</Label>
                        <Input 
                          value={formData.incidentNumber} 
                          disabled 
                          className="bg-gray-50 text-gray-500 font-medium"
                        />
                      </div>
                    )}

                    {/* Vessel */}
                    <div className="space-y-2">
                      <Label htmlFor="vessel">Vessel <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formData.vessel} 
                        onValueChange={(val) => updateField("vessel", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="none" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UHL F900">UHL F900</SelectItem>
                          <SelectItem value="UHL FAITH">UHL FAITH</SelectItem>
                          <SelectItem value="UHL FORCE">UHL FORCE</SelectItem>
                          <SelectItem value="UHL FIERCE">UHL FIERCE</SelectItem>
                          <SelectItem value="UHL FELICITY">UHL FELICITY</SelectItem>
                          <SelectItem value="UHL FINESSE">UHL FINESSE</SelectItem>
                          <SelectItem value="UHL FLAIR">UHL FLAIR</SelectItem>
                          <SelectItem value="UHL PASSION">UHL PASSION</SelectItem>
                          <SelectItem value="BOLD WIND">BOLD WIND</SelectItem>
                          <SelectItem value="UML VERONICA">UML VERONICA</SelectItem>
                          <SelectItem value="UHL FUTURE">UHL FUTURE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Voyage */}
                      <div className="space-y-2">
                        <Label htmlFor="voyage">Voyage</Label>
                        <Select 
                          value={formData.voyage} 
                          onValueChange={(val) => updateField("voyage", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FAI 2601">FAI 2601</SelectItem>
                            <SelectItem value="FAI 2602">FAI 2602</SelectItem>
                            <SelectItem value="FAI 2603">FAI 2603</SelectItem>
                            <SelectItem value="FAI 2501">FAI 2501</SelectItem>
                            <SelectItem value="FAI 2502">FAI 2502</SelectItem>
                            <SelectItem value="FAI 2503">FAI 2503</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.location} 
                          onValueChange={(val) => updateField("location", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="Port">Port</SelectItem>
                            <SelectItem value="Anchorage">Anchorage</SelectItem>
                            <SelectItem value="At Sea">At Sea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(formData.location === "Port" || formData.location === "Anchorage") && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="portCall">Port Call</Label>
                           <Select 
                             value={formData.portCall} 
                             onValueChange={(val) => updateField("portCall", val)}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="none" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Rotterdam">Rotterdam</SelectItem>
                                 <SelectItem value="Singapore">Singapore</SelectItem>
                                 <SelectItem value="Houston">Houston</SelectItem>
                                 <SelectItem value="Shanghai">Shanghai</SelectItem>
                                 <SelectItem value="Jebel Ali">Jebel Ali</SelectItem>
                                 <SelectItem value="Santos">Santos</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                      </div>
                    )}

                    {formData.location === "At Sea" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input 
                            id="latitude" 
                            value={formData.latitude || ""}
                            onChange={(e) => updateField("latitude", e.target.value)}
                            placeholder="e.g. 51.5074 N"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input 
                            id="longitude" 
                            value={formData.longitude || ""}
                            onChange={(e) => updateField("longitude", e.target.value)}
                            placeholder="e.g. 0.1278 W"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      {/* Related Fixtures (Multi-select) */}
                      <div className="space-y-2">
                        <Label>Related Fixture(s)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              role="combobox"
                              className="w-full justify-between h-9 text-[13px] font-normal px-3 border-gray-200"
                            >
                              {formData.fixtures.length > 0 
                                ? `${formData.fixtures.length} selected` 
                                : "Select fixtures..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-2" align="start">
                            <div className="space-y-1">
                              {FIXTURE_OPTIONS.map((fixture) => (
                                <div 
                                  key={fixture} 
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                  onClick={() => toggleFixtureSelection(fixture)}
                                >
                                  <div className={cn(
                                    "h-4 w-4 border border-gray-300 rounded flex items-center justify-center",
                                    formData.fixtures.includes(fixture) ? "bg-blue-500 border-blue-500" : "bg-white"
                                  )}>
                                    {formData.fixtures.includes(fixture) && (
                                      <Check className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  <span className="text-sm">{fixture}</span>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Selected Fixtures List */}
                    {formData.fixtures.length > 0 && (
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Selected Fixtures</h4>
                        <div className="space-y-2">
                          {formData.fixtures.map(fixture => (
                            <div key={fixture} className="flex items-center">
                              <a 
                                href={`/fixtures/${fixture}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                                onClick={(e) => e.preventDefault()}
                              >
                                {fixture}
                                <ArrowRight className="h-3 w-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor="date">Date of Incident <span className="text-red-500">*</span></Label>
                        <DatePicker 
                          value={formData.date} 
                          onChange={(val) => updateField("date", val)} 
                          className="bg-white"
                        />
                      </div>

                      {/* Incident Category */}
                      <div className="space-y-2">
                        <Label htmlFor="incidentCategory">Incident Category <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.incidentCategory} 
                          onValueChange={(val) => updateField("incidentCategory", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            {INCIDENT_CATEGORIES.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Level 2 & 3 Dynamic Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Level 2 */}
                      <div className="space-y-2">
                        <Label htmlFor="class">{currentLevel2.label} <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.class} 
                          onValueChange={(val) => updateField("class", val)}
                          disabled={!formData.incidentCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentLevel2.options.map(opt => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Level 3 (Conditional) */}
                      {showLevel3 && (
                        <div className="space-y-2">
                          <Label htmlFor="type">Incident Type <span className="text-red-500">*</span></Label>
                          <Select 
                            value={formData.type} 
                            onValueChange={(val) => updateField("type", val)}
                            disabled={!formData.class}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="none" />
                            </SelectTrigger>
                            <SelectContent>
                              {currentLevel3Options.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Level 4 (Conditional - only for Personnel Accident) */}
                    {showLevel4 && (
                      <div className="space-y-2">
                        <Label htmlFor="eventSeverity">Event Severity Classification <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.eventSeverity} 
                          onValueChange={(val) => updateField("eventSeverity", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            {EVENT_SEVERITY_OPTIONS.map(opt => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      {/* Short Description */}
                      <div className="space-y-2">
                        <Label htmlFor="shortDesc">Short Description <span className="text-red-500">*</span></Label>
                        <Input 
                          id="shortDesc" 
                          value={formData.shortDesc}
                          onChange={(e) => updateField("shortDesc", e.target.value)}
                          placeholder="Brief summary of the incident"
                          className="bg-white"
                          maxLength={100}
                        />
                        <div className="text-xs text-right text-gray-400">{formData.shortDesc.length}/100</div>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="detailedDesc">Detailed Description</Label>
                        <span className="text-xs text-gray-500">
                          {(formData.detailedDesc || "").length}/10000
                        </span>
                      </div>
                      <Textarea 
                        id="detailedDesc" 
                        value={formData.detailedDesc}
                        onChange={(e) => updateField("detailedDesc", e.target.value)}
                        placeholder="Full details of what happened..."
                        className="min-h-[100px] bg-white"
                        maxLength={10000}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Severity */}
                      <div className="space-y-2">
                        <Label htmlFor="severity">Initial Severity <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.severity} 
                          onValueChange={(val) => updateField("severity", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(val) => updateField("status", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.incidentCategory === "Near-Miss" && (
                      <div className="space-y-6 pt-4 border-t border-gray-100">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">
                            Near Miss Upload
                          </h3>

                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                            <div className="flex gap-3">
                              <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-semibold text-blue-900">Import Instructions</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                  Upload an Excel file containing near miss records. The system will validate dates, check for mandatory fields, and identify duplicate entries.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6" />
                              </div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</h4>
                              <p className="text-xs text-gray-500 mb-4">Excel files only (.xlsx, .xls)</p>
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                Select File
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-gray-900">Validation Rules</h4>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="bg-white border border-gray-200 rounded p-3 flex items-start gap-3">
                                  <div className="p-1.5 bg-green-100 text-green-700 rounded-full">
                                    <Check className="h-3.5 w-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold block text-gray-900">Date Validation</span>
                                    <span className="text-[10px] text-gray-500">Validates correct date formats</span>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded p-3 flex items-start gap-3">
                                  <div className="p-1.5 bg-green-100 text-green-700 rounded-full">
                                    <Check className="h-3.5 w-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold block text-gray-900">Mandatory Fields</span>
                                    <span className="text-[10px] text-gray-500">Checks for incomplete rows</span>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded p-3 flex items-start gap-3">
                                  <div className="p-1.5 bg-green-100 text-green-700 rounded-full">
                                    <Check className="h-3.5 w-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold block text-gray-900">Duplicate Check</span>
                                    <span className="text-[10px] text-gray-500">Prevents duplicate entries</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="claimExists_general" 
                            checked={formData.claimExists}
                            onCheckedChange={(checked) => updateField("claimExists", checked === true)}
                          />
                          <Label htmlFor="claimExists_general" className="cursor-pointer font-medium text-sm text-gray-700">Claim Exists</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="innocent" 
                            checked={formData.innocent}
                            onCheckedChange={(checked) => updateField("innocent", checked === true)}
                          />
                          <Label htmlFor="innocent" className="cursor-pointer font-medium text-sm text-gray-700">Innocent Incident</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Cause Analysis Tab */}
                <TabsContent value="cause-analysis" className="mt-0 space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        MSCAT Analysis
                      </h3>
                      <Button 
                        type="button" 
                        onClick={addCause}
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs"
                      >
                        <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                        Add Cause
                      </Button>
                    </div>

                    {formData.causes.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">No causes added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formData.causes.map((cause, index) => (
                          <div key={cause.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                                onClick={() => removeCause(cause.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Cause Entry #{index + 1}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Immediate Cause (Type)</Label>
                                <Select 
                                  value={cause.immediateCause} 
                                  onValueChange={(val) => updateCause(cause.id, "immediateCause", val)}
                                >
                                  <SelectTrigger className="h-8 text-xs bg-white">
                                    <SelectValue placeholder="none" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {IMMEDIATE_CAUSE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Substandard Act/Condition</Label>
                                <Select 
                                  value={cause.substandardActCondition} 
                                  onValueChange={(val) => updateCause(cause.id, "substandardActCondition", val)}
                                  disabled={!cause.immediateCause}
                                >
                                  <SelectTrigger className="h-8 text-xs bg-white">
                                    <SelectValue placeholder="none" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(cause.immediateCause === "Substandard Act" ? SUBSTANDARD_ACTS : SUBSTANDARD_CONDITIONS).map(t => (
                                      <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200/50">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Basic Cause (Type)</Label>
                                <Select 
                                  value={cause.basicCause} 
                                  onValueChange={(val) => updateCause(cause.id, "basicCause", val)}
                                >
                                  <SelectTrigger className="h-8 text-xs bg-white">
                                    <SelectValue placeholder="none" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {BASIC_CAUSE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Category</Label>
                                <Select 
                                  value={cause.category} 
                                  onValueChange={(val) => updateCause(cause.id, "category", val)}
                                  disabled={!cause.basicCause}
                                >
                                  <SelectTrigger className="h-8 text-xs bg-white">
                                    <SelectValue placeholder="none" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(cause.basicCause === "Personal Factors" ? PERSONAL_FACTORS : JOB_SYSTEM_FACTORS).map(t => (
                                      <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {cause.category && (
                              <div className="mb-4 pt-4 border-t border-gray-200/50">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Sub-Category / Root Cause</Label>
                                  <Select 
                                    value={cause.subCategory} 
                                    onValueChange={(val) => updateCause(cause.id, "subCategory", val)}
                                  >
                                    <SelectTrigger className="h-8 text-xs bg-white">
                                      <SelectValue placeholder="none" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(MSCAT_SUB_CATEGORIES[cause.category] || []).map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            <div className="space-y-1.5 pt-4 border-t border-gray-200/50">
                              <Label className="text-xs">Root Cause Code</Label>
                              <Select 
                                value={cause.rootCauseCode} 
                                onValueChange={(val) => updateCause(cause.id, "rootCauseCode", val)}
                              >
                                <SelectTrigger className="h-8 text-xs bg-white">
                                  <SelectValue placeholder="none" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ROOT_CAUSE_CODES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-1.5 pt-4 border-t border-gray-200/50">
                              <div className="flex justify-between items-center">
                                <Label className="text-xs">Detailed Description</Label>
                                <span className="text-[10px] text-gray-500">
                                  {(cause.rootCauseDescription || "").length}/10000
                                </span>
                              </div>
                              <Textarea 
                                value={cause.rootCauseDescription}
                                onChange={(e) => updateCause(cause.id, "rootCauseDescription", e.target.value)}
                                placeholder="Provide a detailed description of this cause..."
                                className="min-h-[80px] bg-white text-xs"
                                maxLength={10000}
                              />
                            </div>

                            {/* Embedded Control Actions for this Cause */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                    Control Actions
                                  </h5>
                                  <Button 
                                    type="button" 
                                    onClick={() => addControlAction(cause.id)}
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add Action
                                  </Button>
                                </div>

                                {(!cause.controlActions || cause.controlActions.length === 0) ? (
                                  <div className="text-center py-4 bg-white rounded border border-dashed border-gray-200">
                                    <p className="text-xs text-gray-400">No control actions for this cause.</p>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {cause.controlActions.map((action) => (
                                      <div key={action.id} className="bg-white p-3 rounded border border-gray-200 relative group">
                                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                                            onClick={() => removeControlAction(cause.id, action.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                          <div className="space-y-1">
                                            <Label className="text-[10px] text-gray-500">Action Type</Label>
                                            <Select 
                                              value={action.type} 
                                              onValueChange={(val) => updateControlAction(cause.id, action.id, "type", val)}
                                            >
                                              <SelectTrigger className="h-7 text-xs bg-gray-50">
                                                <SelectValue placeholder="none" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {ACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[10px] text-gray-500">Control Area</Label>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full h-7 text-xs justify-between bg-gray-50 px-2 font-normal text-gray-700">
                                                  {action.controlAreas && action.controlAreas.length > 0 
                                                    ? `${action.controlAreas.length} selected` 
                                                    : "Select Areas"}
                                                  <ChevronsUpDown className="ml-2 h-3 w-3 opacity-50" />
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-[200px] p-0" align="start">
                                                <Command>
                                                  <CommandInput placeholder="Search areas..." />
                                                  <CommandList>
                                                    <CommandEmpty>No area found.</CommandEmpty>
                                                    <CommandGroup>
                                                      {CONTROL_AREAS.map((area) => (
                                                        <CommandItem
                                                          key={area}
                                                          value={area}
                                                          onSelect={() => {
                                                            const current = action.controlAreas || [];
                                                            const newAreas = current.includes(area)
                                                              ? current.filter(a => a !== area)
                                                              : [...current, area];
                                                            updateControlAction(cause.id, action.id, "controlAreas", newAreas);
                                                          }}
                                                        >
                                                          <Check
                                                            className={cn(
                                                              "mr-2 h-3 w-3",
                                                              action.controlAreas?.includes(area) ? "opacity-100" : "opacity-0"
                                                            )}
                                                          />
                                                          {area}
                                                        </CommandItem>
                                                      ))}
                                                    </CommandGroup>
                                                  </CommandList>
                                                </Command>
                                              </PopoverContent>
                                            </Popover>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-1 mb-3">
                                          <Label className="text-[10px] text-gray-500">Description</Label>
                                          <Textarea 
                                            value={action.description}
                                            onChange={(e) => updateControlAction(cause.id, action.id, "description", e.target.value)}
                                            className="min-h-[50px] text-xs bg-gray-50 resize-y"
                                            placeholder="Describe the action..."
                                          />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                          <div className="space-y-1">
                                            <Label className="text-[10px] text-gray-500">Responsible department/ office</Label>
                                            <Select 
                                              value={action.responsiblePerson} 
                                              onValueChange={(val) => updateControlAction(cause.id, action.id, "responsiblePerson", val)}
                                            >
                                              <SelectTrigger className="h-7 text-xs bg-gray-50">
                                                <SelectValue placeholder="none" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[10px] text-gray-500">Due Date</Label>
                                            <Input 
                                              type="date" 
                                              value={action.dueDate}
                                              onChange={(e) => updateControlAction(cause.id, action.id, "dueDate", e.target.value)}
                                              className="h-7 text-xs bg-gray-50" 
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[10px] text-gray-500">Status</Label>
                                            <Select 
                                              value={action.status} 
                                              onValueChange={(val) => updateControlAction(cause.id, action.id, "status", val)}
                                            >
                                              <SelectTrigger className="h-7 text-xs bg-gray-50">
                                                <SelectValue placeholder="none" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {ACTION_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Old Control Actions Tab Content Removed */}

                <TabsContent value="claims" className="mt-0 p-0 flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
                  <ClaimsIncidentEmbedded
                    incidentNumber={formData.incidentNumber}
                    initialLinkedIds={
                      formData.linkedClaims
                        .map(lc => INITIAL_CLAIMS_DATA.find(c => c.claimNo === lc.reference)?.id)
                        .filter((id): id is string => !!id)
                    }
                  />
                </TabsContent>
              </Tabs>

              <SheetFooter className="pt-4 sm:justify-end gap-2 border-t border-gray-100 mt-8">
                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#ff6b35] hover:bg-[#ff5722]">
                  {editingId ? "Update Incident" : "Create Incident"}
                </Button>
              </SheetFooter>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Incident Report</DialogTitle>
            <DialogDescription>
              Configure export settings and download the incident report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Export Format */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Export Format <span className="text-red-500">*</span></Label>
              <div className="flex gap-4">
                <div 
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1",
                    exportFormat === "PDF" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                  )}
                  onClick={() => setExportFormat("PDF")}
                >
                  <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", exportFormat === "PDF" ? "border-blue-500" : "border-gray-300")}>
                    {exportFormat === "PDF" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">PDF Document</span>
                    <span className="text-xs text-gray-500">Standard report format</span>
                  </div>
                </div>
                
                <div 
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1",
                    exportFormat === "Word" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                  )}
                  onClick={() => setExportFormat("Word")}
                >
                  <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", exportFormat === "Word" ? "border-blue-500" : "border-gray-300")}>
                    {exportFormat === "Word" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Word Document</span>
                    <span className="text-xs text-gray-500">Editable report format</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclude Internal Fields */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Exclude Internal Fields <span className="text-red-500">*</span></Label>
              <p className="text-xs text-gray-500 mb-2">Select fields to exclude from the exported report.</p>
              
              <div className="grid grid-cols-1 gap-2 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                {internalFields.map((field) => (
                  <div key={field} className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-100">
                    <Checkbox 
                      id={`exclude-dialog-${field}`} 
                      checked={excludedFields.includes(field)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setExcludedFields([...excludedFields, field]);
                        } else {
                          setExcludedFields(excludedFields.filter(f => f !== field));
                        }
                      }}
                    />
                    <label 
                      htmlFor={`exclude-dialog-${field}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full select-none"
                    >
                      {field}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => setShowExportDialog(false)}>
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
