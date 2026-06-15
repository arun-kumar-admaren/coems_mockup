import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, SlidersHorizontal, Menu, Bell, Plus, FileText, ChevronUp, ChevronDown, ChevronsUpDown, Check, Trash2, PlusCircle, X, Info, ShieldCheck, Banknote, FileSpreadsheet, Upload, AlertCircle, ArrowRight, Download, MoreVertical, FileDown, Paperclip, Link as LinkIcon, History, MessageSquare, ClipboardList, Copy, Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
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
import { cn } from "./ui/utils";
import { Claim, ClaimType, ClaimStatus, Priority, RecoverableBy, CostAllocation, INITIAL_CLAIMS_DATA, CLAIM_TYPES, CLAIM_STATUSES, TYPE_OF_COVER_OPTIONS, PRIORITY_OPTIONS, RECOVERABLE_BY_OPTIONS, LEGAL_USERS, VESSELS, ALL_FIXTURES, PORT_AGENTS } from "./claims-types";
import { IncidentsEmbedded } from "./incidents-embedded";
import { InsuranceClaimsEmbedded } from "./insurance-claims-embedded";
import { LegalReviewEmbedded } from "./legal-review-embedded";
import { FinancialsEmbedded } from "./financials-embedded";
import { ClosureEmbedded, DocumentsChecklist } from "./closure-embedded";


function FixtureLookupField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch]  = useState("");

  const available = ALL_FIXTURES.filter(
    (f) =>
      !value.includes(f.id) &&
      (f.id.toLowerCase().includes(search.toLowerCase()) ||
        f.vessel.toLowerCase().includes(search.toLowerCase()) ||
        f.voyage.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (id: string) => {
    onChange([...value, id]);
    setSearch("");
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((f) => f !== id));
  };

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium"
            >
              {id}
              <button
                type="button"
                onClick={() => handleRemove(id)}
                className="text-blue-400 hover:text-blue-700 rounded p-0.5 transition-colors"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Lookup trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2 w-full border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Search className="size-4 text-gray-400" />
          <span className="flex-1 text-left text-gray-500 font-normal">Search fixtures…</span>
          <ChevronDown className="size-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by fixture no, vessel, voyage…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {available.length === 0 ? (
                <div className="py-5 text-center text-sm text-gray-400">No fixtures available</div>
              ) : (
                available.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelect(f.id)}
                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{f.id}</span>
                      <span className="text-xs text-gray-400">{f.voyage}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{f.vessel}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 z-[199]"
            onClick={() => { setIsOpen(false); setSearch(""); }}
          />
        )}
      </div>
    </div>
  );
}


// ─── External Parties ────────────────────────────────────────────────────────

interface ExternalParty {
  id: string;
  type: string;
  name: string;
  parentCompany: string;
  dateAppointed: string;
  status: string;
}

const PARTY_TYPE_OPTIONS   = ["Surveyor", "Lawyer", "Correspondent", "Adjuster", "Engineer"];
const PARTY_STATUS_OPTIONS = ["Appointed", "Active", "Response Received", "Closed"];

const SEED_PARTIES: Record<string, ExternalParty[]> = {
  "1": [
    { id: "p1-1", type: "Surveyor",     name: "James Whitfield",  parentCompany: "Marine Survey Group",      dateAppointed: "2024-03-15", status: "Active"    },
    { id: "p1-2", type: "Lawyer",       name: "Sarah Thornton",   parentCompany: "Maritime Law Partners",    dateAppointed: "2024-03-20", status: "Active"    },
  ],
  "6": [
    { id: "p6-1", type: "Adjuster",     name: "Robert Chen",      parentCompany: "Global Claims Adjusters", dateAppointed: "2024-06-10", status: "Active"    },
  ],
  "7": [
    { id: "p7-1", type: "Correspondent",name: "Anil Menon",       parentCompany: "Port Agents Ltd",         dateAppointed: "2024-07-01", status: "Appointed" },
    { id: "p7-2", type: "Engineer",     name: "Lena Brandt",      parentCompany: "Marine Tech Services",    dateAppointed: "2024-07-05", status: "Active"    },
  ],
};

const INITIAL_FORM_DATA = {
  id: "",
  claimNo: "",
  claimTitle: "",
  claimContext: "Incident Related",
  claimType: "none" as ClaimType | "none",
  typeOfCover: "none",
  priority: "None" as Priority,
  expectedSettlementDate: "",
  statusDescription: "",
  vessel: "none",
  fixture: "none",
  voyage: "",
  pol: "",
  pod: "",
  incidentLinked: false,
  incidentNo: "none",
  claimant: "",
  claimantReference: "",
  picLegal: "",
  broker: "none",
  brokerReference: "",
  brokerContact: "",
  leadingInsurer: "",
  insurerContact: "",
  claimEstimate: 0,
  claimAmount: 0,
  costAllocations: [] as CostAllocation[],
  currency: "USD",
  deductible: 0,
  recoverableBy: "none" as RecoverableBy | "none",
  status: "none" as ClaimStatus | "none",
  dateOfIncident: "",
  dateOfNotification: "",
  description: "",
  remarks: "",
  insuranceWorkflowStatus: "none",
  reviewedByInsurance: false,
  approvedByInsurance: false,
  signedOffPending: false,
  documentChecklist: [] as string[],
  relatedFixtures: [] as string[],
  location: "none",
  portCall: "",
  latitude: "",
  longitude: "",
  damageAsKnown: "",
  stepsTaken: "",
  requiredAssistanceFromInsurance: "none",
  representativeOfClaimantPresent: "",
  portAgent: "none",
};

export function ClaimsInsurance() {
  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('voyage-claims') || '[]') as Claim[];
      // Dedup within the stored array itself (guards against duplicate ids from rapid saves)
      const seen = new Set<string>();
      const voyageClaims = raw.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
      const initialIds = new Set(INITIAL_CLAIMS_DATA.map(c => c.id));
      const newOnes = voyageClaims.filter(c => !initialIds.has(c.id));
      return newOnes.length > 0 ? [...newOnes, ...INITIAL_CLAIMS_DATA] : INITIAL_CLAIMS_DATA;
    } catch {
      return INITIAL_CLAIMS_DATA;
    }
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Full-sync from localStorage whenever the Voyage module creates or edits a claim
  useEffect(() => {
    const onVoyageClaims = () => {
      try {
        const raw = JSON.parse(localStorage.getItem('voyage-claims') || '[]') as Claim[];
        const seen = new Set<string>();
        const voyageClaims = raw.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
        const initialIds = new Set(INITIAL_CLAIMS_DATA.map(c => c.id));
        const nonInitial = voyageClaims.filter(c => !initialIds.has(c.id));
        // Replace all voyage-created claims with the fresh localStorage snapshot; keep INITIAL_CLAIMS_DATA
        setClaims([...nonInitial, ...INITIAL_CLAIMS_DATA]);
      } catch {}
    };
    window.addEventListener('voyage-claims-updated', onVoyageClaims);
    return () => window.removeEventListener('voyage-claims-updated', onVoyageClaims);
  }, []);

  // Filters
  const [filters, setFilters] = useState({
    type: "none",
    status: "none",
    vessel: "none",
    context: "none",
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showHeaderKebab, setShowHeaderKebab] = useState(false);

  // Radix Dialog sets pointer-events:none on <body> while the Sheet is open, which blocks
  // all portaled sub-overlays (Incidents, Insurance, Legal Review edit panels).
  // This observer clears that block immediately so portals stay interactive.
  useEffect(() => {
    if (!isSheetOpen) return;
    const clear = () => {
      if (document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = '';
      }
    };
    clear();
    const observer = new MutationObserver(clear);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, [isSheetOpen]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [editParties, setEditParties] = useState<ExternalParty[]>([]);
  const [openPartyKebabId, setOpenPartyKebabId] = useState<string | null>(null);

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (claim.claimNo ?? "").toLowerCase().includes(q) ||
        (claim.claimTitle ?? "").toLowerCase().includes(q) ||
        (claim.vessel ?? "").toLowerCase().includes(q);
      
      const matchesType = filters.type === "none" || claim.claimType === filters.type;
      const matchesStatus = filters.status === "none" || claim.status === filters.status;
      const matchesVessel = filters.vessel === "none" || claim.vessel === filters.vessel;
      const matchesContext = filters.context === "none" || ((claim as any).claimContext || "Incident Related") === filters.context;

      return matchesSearch && matchesType && matchesStatus && matchesVessel && matchesContext;
    });
  }, [claims, searchQuery, filters]);

  const uniqueVessels = useMemo(() => {
    return Array.from(new Set(claims.map(c => c.vessel))).sort();
  }, [claims]);

  const handleOpenAdd = () => {
    const newNo = `CLM-${new Date().getFullYear()}-${String(claims.length + 1).padStart(3, "0")}`;
    setFormData({ ...INITIAL_FORM_DATA, claimNo: newNo });
    setEditingId(null);
    setEditParties([]);
    setIsSheetOpen(true);
  };

  const handleEditClaim = (claim: Claim) => {
    setFormData({
      id: claim.id,
      claimNo: claim.claimNo,
      claimTitle: claim.description || "",
      claimType: claim.claimType || "none",
      typeOfCover: claim.typeOfCover || "none",
      priority: (claim as any).priority || "None",
      expectedSettlementDate: (claim as any).expectedSettlementDate || "",
      vessel: claim.vessel || "none",
      fixture: claim.fixture || "none",
      voyage: claim.voyage || "",
      pol: claim.pol || "",
      pod: claim.pod || "",
      incidentLinked: claim.incidentLinked,
      incidentNo: claim.incidentNo || "none",
      claimant: claim.claimant || "",
      claimantReference: claim.claimantReference || "",
      picLegal: (claim as any).picLegal || "",
      broker: claim.broker || "none",
      brokerReference: claim.brokerReference || "",
      brokerContact: claim.brokerContact || "",
      leadingInsurer: claim.leadingInsurer || "",
      insurerContact: claim.insurerContact || "",
      claimEstimate: claim.claimEstimate || 0,
      claimAmount: claim.claimAmount || 0,
      costAllocations: claim.costAllocations || [],
      currency: claim.currency || "USD",
      deductible: claim.deductible || 0,
      recoverableBy: claim.recoverableBy || "none",
      status: claim.status || "none",
      dateOfIncident: claim.dateOfIncident || "",
      dateOfNotification: claim.dateOfNotification || "",
      description: claim.description || "",
      remarks: claim.remarks || "",
      insuranceWorkflowStatus: claim.insuranceWorkflowStatus || "none",
      reviewedByInsurance: claim.reviewedByInsurance || false,
      approvedByInsurance: claim.approvedByInsurance || false,
      signedOffPending: claim.signedOffPending || false,
      documentChecklist: claim.documentChecklist || [],
      location: claim.location || "none",
      portCall: claim.portCall || "",
      latitude: claim.latitude || "",
      longitude: claim.longitude || "",
      ...(claim as any),
      relatedFixtures: (claim as any).relatedFixtures || [],
    } as any);
    setEditingId(claim.id);
    setEditParties((claim as any).externalParties || SEED_PARTIES[claim.id] || []);
    setIsSheetOpen(true);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addExternalParty = () => {
    const newParty: ExternalParty = { id: `ep-${Date.now()}`, type: "", name: "", parentCompany: "", dateAppointed: "", status: "Appointed" };
    setEditParties((prev) => [...prev, newParty]);
  };

  const updatePartyField = (id: string, field: keyof ExternalParty, value: string) =>
    setEditParties((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const removeParty = (id: string) => {
    setEditParties((prev) => prev.filter((p) => p.id !== id));
    setOpenPartyKebabId(null);
  };

  const handleSave = () => {
    if (!formData.claimant || formData.claimType === "none" || formData.status === "none") {
      alert("Please fill in required fields: Type of Claim, Claimant, and Claim Status.");
      return;
    }

    const claimToSave: Claim = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      claimNo: formData.claimNo || `CLM-${new Date().getFullYear()}-${String(claims.length + 1).padStart(3, "0")}`,
      claimType: formData.claimType as ClaimType,
      typeOfCover: formData.typeOfCover === "none" ? "" : formData.typeOfCover,
      priority: formData.priority as any,
      vessel: formData.vessel === "none" ? "" : formData.vessel,
      fixture: formData.fixture === "none" ? "" : formData.fixture,
      voyage: formData.voyage,
      pol: formData.pol,
      pod: formData.pod,
      incidentLinked: formData.incidentNo !== "none" && !!formData.incidentNo,
      incidentNo: formData.incidentNo === "none" ? "" : formData.incidentNo,
      claimant: formData.claimant,
      claimantReference: formData.claimantReference,
      picLegal: formData.picLegal,
      broker: formData.broker === "none" ? "" : formData.broker,
      brokerReference: formData.brokerReference,
      brokerContact: formData.brokerContact,
      leadingInsurer: formData.leadingInsurer,
      insurerContact: formData.insurerContact,
      claimEstimate: formData.claimEstimate,
      claimAmount: formData.claimAmount,
      costAllocations: formData.costAllocations,
      currency: formData.currency,
      deductible: formData.deductible,
      recoverableBy: formData.recoverableBy as RecoverableBy,
      status: formData.status as ClaimStatus,
      dateOfIncident: formData.dateOfIncident,
      dateOfNotification: formData.dateOfNotification,
      description: formData.claimTitle,
      statusDescription: formData.statusDescription || "",
      remarks: formData.remarks || "",
      insuranceWorkflowStatus: formData.insuranceWorkflowStatus === "none" ? "" : formData.insuranceWorkflowStatus,
      reviewedByInsurance: formData.reviewedByInsurance,
      approvedByInsurance: formData.approvedByInsurance,
      signedOffPending: formData.signedOffPending,
      documentChecklist: formData.documentChecklist,
      location: formData.location === "none" ? "" : formData.location,
      portCall: formData.portCall,
      latitude: formData.latitude,
      longitude: formData.longitude,
      createdBy: (formData as any).createdBy || "Nikhil Mathew",
      createdDate: (formData as any).createdDate || new Date().toISOString().split("T")[0],
      archived: (formData as any).archived ?? false,
      deleted: false,
    };

    if (editingId) {
      setClaims(claims.map((c) => (c.id === editingId ? claimToSave : c)));
    } else {
      setClaims([...claims, claimToSave]);
    }

    setIsSheetOpen(false);
  };

  const handleDelete = () => {
    if (editingId) {
      if (window.confirm("Are you sure you want to delete this claim?")) {
        setClaims(claims.filter((c) => c.id !== editingId));
        setIsSheetOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa]">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center justify-end h-14 px-5">
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-600">
              USER_ID: 001 | Chennai, Kollam...
            </span>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors relative">
              <Bell className="size-5 text-gray-600" />
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
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-gray-400" />
              <Input
                type="text"
                placeholder="Search claims..."
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
                    Object.values(filters).some(v => v !== "none") && "bg-blue-50 border-blue-200 text-blue-700"
                  )}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="start">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm leading-none">Filter Claims</h4>
                  {(Object.values(filters).some(v => v !== "none") || searchQuery) && (
                     <Button 
                       variant="ghost" 
                       size="sm"
                       className="h-auto p-0 text-[11px] text-red-500 hover:text-red-600 hover:bg-transparent"
                       onClick={() => {
                         setSearchQuery("");
                         setFilters({ type: "none", status: "none", vessel: "none", context: "none" });
                       }}
                     >
                       Clear All
                     </Button>
                  )}
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Claim Context</Label>
                    <Select value={filters.context} onValueChange={(val) => setFilters(prev => ({ ...prev, context: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Contexts" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">All Contexts</SelectItem>
                        <SelectItem value="Standalone">Standalone</SelectItem>
                        <SelectItem value="Incident Related">Incident Related</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Claim Type</Label>
                    <Select value={filters.type} onValueChange={(val) => setFilters(prev => ({ ...prev, type: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">All Types</SelectItem>
                        {CLAIM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Status</Label>
                    <Select value={filters.status} onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">All Statuses</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Close">Close</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Vessel</Label>
                    <Select value={filters.vessel} onValueChange={(val) => setFilters(prev => ({ ...prev, vessel: val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Vessels" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">All Vessels</SelectItem>
                        {uniqueVessels.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Group Button for Statuses */}
            <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm h-9">
              {(["All", "Open", "Close"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilters(prev => ({ ...prev, status: tab === "All" ? "none" : tab }))}
                  className={`px-4 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap h-full ${
                    (filters.status === "none" && tab === "All") || filters.status === tab
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleOpenAdd}
            >
              <Plus className="size-4" />
              New Claim
            </Button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-5">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 whitespace-nowrap">Claim No</th>
                  <th className="px-4 py-3 whitespace-nowrap">Claim Context</th>
                  <th className="px-4 py-3 whitespace-nowrap">Linked Incident</th>
                  <th className="px-4 py-3 whitespace-nowrap">Type of Claim</th>
                  <th className="px-4 py-3 whitespace-nowrap">Type of Cover</th>
                  <th className="px-4 py-3 whitespace-nowrap">Broker</th>
                  <th className="px-4 py-3 whitespace-nowrap">Leading Insurer</th>
                  <th className="px-4 py-3 whitespace-nowrap">Date of Incident</th>
                  <th className="px-4 py-3 whitespace-nowrap">Date of Notif.</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Claim Estimate</th>
                  <th className="px-4 py-3 whitespace-nowrap">Claimant</th>
                  <th className="px-4 py-3 whitespace-nowrap min-w-[200px]">Description</th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Addl. Ins.</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center sticky right-0 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900">No claims found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr 
                      key={claim.id} 
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                      onClick={() => handleEditClaim(claim)}
                    >
                      <td className="px-4 py-3 font-medium text-blue-600 whitespace-nowrap group-hover:underline">
                        {claim.claimNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(() => {
                          const ctx = (claim as any).claimContext || "Incident Related";
                          return ctx === "Standalone"
                            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Standalone</span>
                            : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Incident Related</span>;
                        })()}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.incidentLinked && claim.incidentNo ? (
                          <span className="inline-flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            {claim.incidentNo}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.claimType}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.typeOfCover || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.broker || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.leadingInsurer || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.dateOfIncident || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.dateOfNotification || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-right font-medium whitespace-nowrap">
                        {claim.claimAmount ? `${claim.claimAmount.toLocaleString()} ${claim.currency || "USD"}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {claim.claimant || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium truncate max-w-[250px]">
                        {claim.description || claim.claimTitle || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          claim.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                          claim.status === 'Close' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {claim.additionalInsurance ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : claim.additionalInsurance === false ? (
                          <span className="text-gray-500">No</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Claim Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="!max-w-none w-full sm:w-[500px] md:w-[600px] lg:w-1/2 flex flex-col h-full overflow-hidden p-0 bg-white"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex-1 overflow-y-auto p-6">
            <SheetHeader className="mb-6 space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-xl font-semibold text-gray-900">
                    {editingId ? "Edit Claim" : "New Claim"}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-500 mt-1">
                    {editingId
                      ? "Update claim details and manage associated records."
                      : "Enter details for the new claim record."}
                  </SheetDescription>
                </div>
                {editingId && (
                  <div className="relative ml-2 mt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowHeaderKebab(v => !v)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                    {showHeaderKebab && (
                      <>
                        <div className="fixed inset-0 z-[250]" onClick={() => setShowHeaderKebab(false)} />
                        <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[260] py-1">
                          <button
                            type="button"
                            onClick={() => setShowHeaderKebab(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FileDown className="size-4 text-gray-400" />
                            Export as PDF
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowHeaderKebab(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Copy className="size-4 text-gray-400" />
                            Copy Template
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowHeaderKebab(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Mail className="size-4 text-gray-400" />
                            Send as Email
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </SheetHeader>

            <div id="claim-overlay-content" className="w-full flex-1 mt-6">
              {/* Header Summary Section - Visible only in Edit Mode */}
              {editingId && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  {/* Row 1 — read-only fields */}
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Claim Number</span>
                      <span className="font-semibold text-gray-900">{formData.claimNo || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type of Claim</span>
                      <span className="font-medium text-gray-900 text-sm">{formData.claimType !== "none" ? formData.claimType : "-"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type of Cover</span>
                      <span className="font-medium text-gray-900 text-sm">{formData.typeOfCover && formData.typeOfCover !== "none" ? formData.typeOfCover : "-"}</span>
                    </div>
                  </div>
                  {/* Row 2 — Created By (read-only) + editable Claim Status + editable Priority */}
                  <div className="grid grid-cols-3 gap-4 items-end text-sm">
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Created By</span>
                      <span className="font-medium text-gray-900">{(formData as any).createdBy || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Claim Status</span>
                      <Select value={formData.status} onValueChange={(val) => updateField("status", val)}>
                        <SelectTrigger className="h-7 text-xs bg-white border-gray-300 focus:ring-blue-300 px-2">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select status</SelectItem>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Close">Close</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Priority</span>
                      <Select value={formData.priority || "None"} onValueChange={(val) => updateField("priority", val)}>
                        <SelectTrigger className="h-7 text-xs bg-white border-gray-300 focus:ring-blue-300 px-2">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full h-auto p-1 bg-gray-100/50 rounded-lg mb-6 border border-gray-200/50 flex flex-wrap sm:flex-nowrap gap-1">
                  <TabsTrigger
                    value="overview"
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                  >
                    <Info className="w-3.5 h-3.5 mr-2" />
                    Overview
                  </TabsTrigger>
                  {editingId && (
                    <>
                      <TabsTrigger
                        value="legal-review"
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <FileText className="w-3.5 h-3.5 mr-2" />
                        Legal Review
                      </TabsTrigger>
                      <TabsTrigger
                        value="incident-link"
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <LinkIcon className="w-3.5 h-3.5 mr-2" />
                        Incidents
                      </TabsTrigger>
                      <TabsTrigger
                        value="insurance"
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                        Insurance
                      </TabsTrigger>
                      <TabsTrigger
                        value="financials"
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <Banknote className="w-3.5 h-3.5 mr-2" />
                        Financials
                      </TabsTrigger>
                      <TabsTrigger
                        value="closure"
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-2" />
                        Closure
                      </TabsTrigger>
                      <TabsTrigger
                        value="docs"
                        className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 h-9 transition-all text-xs font-medium"
                      >
                        <ClipboardList className="w-3.5 h-3.5 mr-2" />
                        Docs
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
                  
                  <TabsContent value="overview" className="mt-0 space-y-6">

                  {/* Claim Context */}
                  <div className="space-y-2">
                    <Label>Claim Context <span className="text-red-500">*</span></Label>
                    <Select value={(formData as any).claimContext || "none"} onValueChange={(val) => updateField("claimContext", val)}>
                      <SelectTrigger><SelectValue placeholder="Select claim context" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select claim context</SelectItem>
                        <SelectItem value="Standalone">Standalone</SelectItem>
                        <SelectItem value="Incident Related">Incident Related</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData as any).claimContext === "Standalone" ? (<>

                  {/* Vessel & Voyage */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vessel</Label>
                      <Select value={formData.vessel} onValueChange={(val) => updateField("vessel", val)}>
                        <SelectTrigger><SelectValue placeholder="Select vessel" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select vessel</SelectItem>
                          {VESSELS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Voyage</Label>
                      <Input value={formData.voyage} onChange={(e) => updateField("voyage", e.target.value)} placeholder="e.g. FAI 2601" />
                    </div>
                  </div>

                  {/* Related Fixtures */}
                  <div className="space-y-2">
                    <Label>Related Fixtures</Label>
                    <FixtureLookupField value={formData.relatedFixtures || []} onChange={(val) => updateField("relatedFixtures", val)} />
                  </div>

                  {/* Date of Incident + Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Incident</Label>
                      <Input type="date" value={formData.dateOfIncident} onChange={(e) => updateField("dateOfIncident", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={(formData as any).location === "none" ? "" : ((formData as any).location || "")} onChange={(e) => updateField("location" as any, e.target.value)} placeholder="e.g. Port of Rotterdam, At Sea" />
                    </div>
                  </div>

                  {/* Short Claim Description */}
                  <div className="space-y-2">
                    <Label>Short Claim Description</Label>
                    <Textarea value={formData.claimTitle} onChange={(e) => updateField("claimTitle", e.target.value)} placeholder="Brief summary of the claim..." className="resize-none min-h-[80px]" />
                  </div>

                  {/* Damage as far as known */}
                  <div className="space-y-2">
                    <Label>Damage as far as known</Label>
                    <Textarea value={(formData as any).damageAsKnown || ""} onChange={(e) => updateField("damageAsKnown" as any, e.target.value)} placeholder="Describe the known damage..." className="resize-none min-h-[80px]" />
                  </div>

                  {/* Steps taken so far */}
                  <div className="space-y-2">
                    <Label>Steps taken so far</Label>
                    <Textarea value={(formData as any).stepsTaken || ""} onChange={(e) => updateField("stepsTaken" as any, e.target.value)} placeholder="Describe the steps taken..." className="resize-none min-h-[80px]" />
                  </div>

                  {/* Required assistance from insurance */}
                  <div className="space-y-2">
                    <Label>Required assistance from insurance</Label>
                    <Select value={(formData as any).requiredAssistanceFromInsurance || "none"} onValueChange={(val) => updateField("requiredAssistanceFromInsurance" as any, val)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Claimant */}
                  <div className="space-y-2">
                    <Label>Claimant</Label>
                    <Input value={formData.claimant} onChange={(e) => updateField("claimant", e.target.value)} placeholder="Enter claimant name" />
                  </div>

                  {/* Representative of claimant present */}
                  <div className="space-y-2">
                    <Label>Representative of claimant present</Label>
                    <Input value={(formData as any).representativeOfClaimantPresent || ""} onChange={(e) => updateField("representativeOfClaimantPresent" as any, e.target.value)} placeholder="Enter representative name" />
                  </div>

                  {/* Port Agent */}
                  <div className="space-y-2">
                    <Label>Port Agent (full style)</Label>
                    <Select value={(formData as any).portAgent || "none"} onValueChange={(val) => updateField("portAgent" as any, val)}>
                      <SelectTrigger><SelectValue placeholder="Select port agent" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select port agent</SelectItem>
                        {PORT_AGENTS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  </>) : (<>

                  {/* Type of Claim & Type of Cover */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type of Claim <span className="text-red-500">*</span></Label>
                      <Select value={formData.claimType} onValueChange={(val) => updateField("claimType", val)}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select type</SelectItem>
                          {CLAIM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type of Cover</Label>
                      <Select value={formData.typeOfCover} onValueChange={(val) => updateField("typeOfCover", val)}>
                        <SelectTrigger><SelectValue placeholder="Select cover" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select cover</SelectItem>
                          {TYPE_OF_COVER_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Vessel & Voyage */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vessel</Label>
                      <Select value={formData.vessel} onValueChange={(val) => updateField("vessel", val)}>
                        <SelectTrigger><SelectValue placeholder="Select vessel" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select vessel</SelectItem>
                          {VESSELS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Voyage</Label>
                      <Input
                        value={formData.voyage}
                        onChange={(e) => updateField("voyage", e.target.value)}
                        placeholder="e.g. FAI 2601"
                      />
                    </div>
                  </div>

                  {/* Related Fixtures */}
                  <div className="space-y-2">
                    <Label>Related Fixtures</Label>
                    <FixtureLookupField
                      value={formData.relatedFixtures || []}
                      onChange={(val) => updateField("relatedFixtures", val)}
                    />
                  </div>

                  {/* Broker + Broker Reference */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Broker</Label>
                      <Select value={formData.broker} onValueChange={(val) => updateField("broker", val)}>
                        <SelectTrigger><SelectValue placeholder="Select broker" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select broker</SelectItem>
                          <SelectItem value="Maritime Insurance Brokers">Maritime Insurance Brokers</SelectItem>
                          <SelectItem value="Global Marine Insurance">Global Marine Insurance</SelectItem>
                          <SelectItem value="Seaborne Insurance Group">Seaborne Insurance Group</SelectItem>
                          <SelectItem value="International Marine Brokers">International Marine Brokers</SelectItem>
                          <SelectItem value="Maritime Risk Solutions">Maritime Risk Solutions</SelectItem>
                          <SelectItem value="Marine Legal & Insurance">Marine Legal &amp; Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Broker Reference Number</Label>
                      <Input
                        value={formData.brokerReference}
                        onChange={(e) => updateField("brokerReference", e.target.value)}
                        placeholder="e.g. MIB-2024-089"
                      />
                    </div>
                  </div>

                  {/* Leading Insurer */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Leading Insurer</Label>
                      <Input
                        value={formData.leadingInsurer}
                        onChange={(e) => updateField("leadingInsurer", e.target.value)}
                        placeholder="Enter leading insurer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Notification to Broker</Label>
                      <Input
                        type="date"
                        value={formData.dateOfNotification}
                        onChange={(e) => updateField("dateOfNotification", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Claimant + Claimant Reference */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Claimant <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.claimant}
                        onChange={(e) => updateField("claimant", e.target.value)}
                        placeholder="Enter claimant name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Claimant Reference Number</Label>
                      <Input
                        value={formData.claimantReference}
                        onChange={(e) => updateField("claimantReference", e.target.value)}
                        placeholder="e.g. CLM-REF-2024-001"
                      />
                    </div>
                  </div>

                  {/* PIC Legal */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>PIC Legal</Label>
                      <Select value={formData.picLegal || "none"} onValueChange={(val) => updateField("picLegal", val === "none" ? "" : val)}>
                        <SelectTrigger><SelectValue placeholder="Select legal member" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select legal member</SelectItem>
                          {LEGAL_USERS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Short Claim Description */}
                  <div className="space-y-2">
                    <Label>Short Claim Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      value={formData.claimTitle}
                      onChange={(e) => updateField("claimTitle", e.target.value)}
                      placeholder="Brief summary of the claim for list view..."
                      className="resize-none min-h-[80px]"
                    />
                  </div>

                  {/* Status & Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Claim Status <span className="text-red-500">*</span></Label>
                      <Select value={formData.status} onValueChange={(val) => updateField("status", val)}>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select status</SelectItem>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Close">Close</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={formData.priority} onValueChange={(val) => updateField("priority", val)}>
                        <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Date Settled & Claim Duration — Edit only */}
                  {editingId && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          Date Settled
                          {formData.status === "Close" && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          type="date"
                          value={(formData as any).dateSettled || ""}
                          onChange={e => updateField("dateSettled" as any, e.target.value)}
                          min={(formData as any).createdDate || undefined}
                          className={`text-sm ${
                            formData.status === "Close" && !(formData as any).dateSettled
                              ? "border-amber-300 focus:ring-amber-300"
                              : ""
                          }`}
                        />
                        {formData.status === "Close" && !(formData as any).dateSettled && (
                          <p className="text-[10px] text-amber-500">Recommended when claim is closed</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-gray-500">
                          Claim Duration
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </Label>
                        <div className={`flex items-center h-10 px-3 rounded-md border text-sm ${
                          (formData as any).dateSettled && (formData as any).createdDate
                            ? "bg-blue-50 border-blue-200 text-blue-800 font-medium"
                            : "bg-gray-50 border-gray-200 text-gray-400"
                        }`}>
                          {(() => {
                            const settled = (formData as any).dateSettled;
                            const created = (formData as any).createdDate;
                            if (!settled || !created) return "—";
                            const days = Math.round((new Date(settled).getTime() - new Date(created).getTime()) / 86400000);
                            return days >= 0 ? `${days} day${days !== 1 ? "s" : ""}` : "—";
                          })()}
                        </div>
                        <p className="text-[10px] text-gray-400">Date Settled − Created Date</p>
                      </div>
                    </div>
                  )}

                  {/* Status Description */}
                  <div className="space-y-2">
                    <Label>Status Description</Label>
                    <Textarea
                      value={formData.statusDescription}
                      onChange={(e) => updateField("statusDescription", e.target.value)}
                      placeholder="Describe the current status of this claim..."
                      className="resize-none min-h-[80px]"
                    />
                  </div>

                  {/* Liability & Recovery */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Liability &amp; Recovery</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Liability Position</Label>
                        <Select value={(formData as any).liabilityPosition || "none"} onValueChange={(val) => updateField("liabilityPosition", val)}>
                          <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select position</SelectItem>
                            <SelectItem value="Liable">Liable</SelectItem>
                            <SelectItem value="Not Liable">Not Liable</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Shared Liability">Shared Liability</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Recovery Right Exists</Label>
                        <Select value={(formData as any).recoveryRightExists || "none"} onValueChange={(val) => updateField("recoveryRightExists", val)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(formData as any).recoveryRightExists === "Yes" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Recovery Against</Label>
                          <Select value={(formData as any).recoveryAgainst || "none"} onValueChange={(val) => updateField("recoveryAgainst", val)}>
                            <SelectTrigger><SelectValue placeholder="Select party" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Select party</SelectItem>
                              <SelectItem value="Owner">Owner</SelectItem>
                              <SelectItem value="Charterer">Charterer</SelectItem>
                              <SelectItem value="Shipper">Shipper</SelectItem>
                              <SelectItem value="Receiver">Receiver</SelectItem>
                              <SelectItem value="Terminal">Terminal</SelectItem>
                              <SelectItem value="Stevedore">Stevedore</SelectItem>
                              <SelectItem value="Insurer">Insurer</SelectItem>
                              <SelectItem value="Surveyor">Surveyor</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Recovery Route</Label>
                          <Select value={(formData as any).recoveryRoute || "none"} onValueChange={(val) => updateField("recoveryRoute", val)}>
                            <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Select route</SelectItem>
                              <SelectItem value="Insurance">Insurance</SelectItem>
                              <SelectItem value="Contractual">Contractual</SelectItem>
                              <SelectItem value="Legal">Legal</SelectItem>
                              <SelectItem value="Direct Settlement">Direct Settlement</SelectItem>
                              <SelectItem value="Arbitration">Arbitration</SelectItem>
                              <SelectItem value="Litigation">Litigation</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Liability Assessment Notes</Label>
                      <Textarea
                        value={(formData as any).liabilityNotes || ""}
                        onChange={(e) => updateField("liabilityNotes", e.target.value)}
                        placeholder="Notes on liability position, recovery prospects, legal opinions..."
                        className="resize-none min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Resolution & Security — Edit only */}
                  {editingId && <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Resolution &amp; Security</h3>

                    {/* Resolution Path */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Resolution Path <span className="text-red-500">*</span></Label>
                        <Select value={(formData as any).resolutionPath || "none"} onValueChange={(val) => updateField("resolutionPath", val)}>
                          <SelectTrigger><SelectValue placeholder="Select resolution path" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select path</SelectItem>
                            <SelectItem value="Under Negotiation">Under Negotiation</SelectItem>
                            <SelectItem value="Settlement">Settlement</SelectItem>
                            <SelectItem value="Defense">Defense</SelectItem>
                            <SelectItem value="Recovery">Recovery</SelectItem>
                            <SelectItem value="Litigation">Litigation</SelectItem>
                            <SelectItem value="Arbitration">Arbitration</SelectItem>
                            <SelectItem value="Closed without Action">Closed without Action</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Security Provided */}
                      <div className="space-y-2">
                        <Label>Security Provided</Label>
                        <Select
                          value={(formData as any).securityProvided || "No"}
                          onValueChange={(val) => {
                            updateField("securityProvided", val);
                            if (val === "No") {
                              updateField("securityType", "");
                              updateField("securityAmount", "");
                              updateField("securityCurrency", "USD");
                              updateField("securityIssuedDate", "");
                              updateField("securityReleasedDate", "");
                            }
                          }}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Security fields — shown only when Security Provided = Yes */}
                    {(formData as any).securityProvided === "Yes" && (
                      <div className="space-y-4 pl-4 border-l-2 border-blue-100">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Security Type */}
                          <div className="space-y-2">
                            <Label>Security Type <span className="text-red-500">*</span></Label>
                            <Select value={(formData as any).securityType || "none"} onValueChange={(val) => updateField("securityType", val)}>
                              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Select type</SelectItem>
                                <SelectItem value="Letter of Undertaking (LOU)">Letter of Undertaking (LOU)</SelectItem>
                                <SelectItem value="Bank Guarantee">Bank Guarantee</SelectItem>
                                <SelectItem value="Club Letter">Club Letter</SelectItem>
                                <SelectItem value="Cash Deposit">Cash Deposit</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {(formData as any).securityType === "Other" && (
                              <Input
                                value={(formData as any).securityTypeOther || ""}
                                onChange={(e) => updateField("securityTypeOther", e.target.value)}
                                placeholder="Describe security type..."
                                className="mt-2"
                              />
                            )}
                          </div>

                          {/* Security Currency */}
                          <div className="space-y-2">
                            <Label>Security Currency</Label>
                            <Select value={(formData as any).securityCurrency || "USD"} onValueChange={(val) => updateField("securityCurrency", val)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["USD","EUR","GBP","SGD","AED","Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Security Amount */}
                          <div className="space-y-2">
                            <Label>Security Amount</Label>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={(formData as any).securityAmount || ""}
                              onChange={(e) => updateField("securityAmount", e.target.value)}
                              placeholder="0.00"
                            />
                            {(formData as any).securityAmount && parseFloat((formData as any).securityAmount) <= 0 && (
                              <p className="text-xs text-red-500">Amount must be greater than 0</p>
                            )}
                          </div>

                          {/* Security Issued Date */}
                          <div className="space-y-2">
                            <Label>Security Issued Date</Label>
                            <Input
                              type="date"
                              value={(formData as any).securityIssuedDate || ""}
                              onChange={(e) => updateField("securityIssuedDate", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Security Released Date */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Security Released Date</Label>
                            <Input
                              type="date"
                              value={(formData as any).securityReleasedDate || ""}
                              onChange={(e) => {
                                const issued = (formData as any).securityIssuedDate;
                                if (issued && e.target.value && e.target.value < issued) return;
                                updateField("securityReleasedDate", e.target.value);
                              }}
                            />
                            {(formData as any).securityIssuedDate && (
                              <p className="text-xs text-gray-400">Must be on or after the issued date. Leave blank if still active.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Resolution Notes */}
                    <div className="space-y-2">
                      <Label>
                        Resolution Notes
                        {["Defense","Litigation","Arbitration","Closed without Action"].includes((formData as any).resolutionPath) && (
                          <span className="ml-2 text-xs font-normal text-amber-600">(Recommended for this resolution path)</span>
                        )}
                      </Label>
                      <Textarea
                        value={(formData as any).resolutionNotes || ""}
                        onChange={(e) => updateField("resolutionNotes", e.target.value)}
                        placeholder="Negotiation summary, defense strategy, arbitration rationale, or reason for closing without action..."
                        className="resize-none min-h-[80px]"
                      />
                    </div>
                  </div>}

                  {/* ── External Parties (edit only) ────────────────────── */}
                  {editingId && <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700">External Parties</h3>
                      <button
                        type="button"
                        onClick={addExternalParty}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Plus className="size-3.5" />
                        External Party
                      </button>
                    </div>

                    {editParties.length === 0 ? (
                      <div className="border border-dashed border-gray-200 rounded-lg py-6 text-center text-xs text-gray-400">
                        No external parties added. Click "+ External Party" to add one.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {editParties.map((party) => (
                          <div key={party.id} className="relative border border-gray-200 rounded-lg bg-white p-4 hover:border-gray-300 transition-colors">

                            {/* Kebab menu */}
                            <div className="absolute top-3 right-3">
                              <button
                                type="button"
                                onClick={() => setOpenPartyKebabId(openPartyKebabId === party.id ? null : party.id)}
                                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              >
                                <MoreVertical className="size-4" />
                              </button>
                              {openPartyKebabId === party.id && (
                                <>
                                  <div className="fixed inset-0 z-[199]" onClick={() => setOpenPartyKebabId(null)} />
                                  <div className="absolute right-0 top-7 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] py-1">
                                    <button
                                      type="button"
                                      onClick={() => removeParty(party.id)}
                                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Row 1: Type + Name */}
                            <div className="grid grid-cols-2 gap-3 pr-8 mb-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Type</Label>
                                <Select value={party.type || ""} onValueChange={(v) => updatePartyField(party.id, "type", v)}>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PARTY_TYPE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Name</Label>
                                <Input
                                  value={party.name}
                                  onChange={(e) => updatePartyField(party.id, "name", e.target.value)}
                                  placeholder="Full name"
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>

                            {/* Row 2: Parent Company + Date Appointed + Status */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Parent Company</Label>
                                <Input
                                  value={party.parentCompany}
                                  onChange={(e) => updatePartyField(party.id, "parentCompany", e.target.value)}
                                  placeholder="Company name"
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Date Appointed</Label>
                                <Input
                                  type="date"
                                  value={party.dateAppointed}
                                  onChange={(e) => updatePartyField(party.id, "dateAppointed", e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Status</Label>
                                <Select value={party.status || ""} onValueChange={(v) => updatePartyField(party.id, "status", v)}>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PARTY_STATUS_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>}

                  </>)}

              </TabsContent>

              <TabsContent value="legal-review" className="mt-0 p-0">
                <LegalReviewEmbedded moduleType="Claims" moduleId={editingId!} />
              </TabsContent>

              <TabsContent value="incident-link" className="mt-0 p-0">
                <IncidentsEmbedded claimId={editingId!} />
              </TabsContent>
              
              {editingId && (
                <>
                  <TabsContent value="financials" className="mt-0 p-0">
                <FinancialsEmbedded claimId={editingId!} />
              </TabsContent>

              <TabsContent value="closure" className="mt-0 p-0">
                <ClosureEmbedded
                  claimId={editingId!}
                  claimStatus={formData.status}
                  createdDate={(formData as any).createdDate}
                />
              </TabsContent>

              <TabsContent value="docs" className="mt-0 p-0">
                <DocumentsChecklist isClosed={formData.status === "Close"} />
              </TabsContent>

              <TabsContent value="insurance" className="mt-0 p-0">
                <InsuranceClaimsEmbedded claimId={editingId!} />
              </TabsContent>

                </>
              )}
            </Tabs>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center shrink-0 justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsSheetOpen(false)}
            className="bg-white"
          >
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            onClick={handleSave}
          >
            <Check className="w-4 h-4 mr-2" />
            {editingId ? "Update claim" : "Create claim"}
          </Button>
        </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}