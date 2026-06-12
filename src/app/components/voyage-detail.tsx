import React from "react";
import { X, Map as MapIcon, ChevronRight, ChevronDown, Download, MoreVertical, Maximize2, Flag, Circle, Plus, List, ArrowRight, Info, Check, ChevronsUpDown, Search, Activity, Banknote, Edit, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DatePicker } from "./ui/date-picker";
import { cn } from "./ui/utils";
import exampleImage from 'figma:asset/6931c210e64628b26cf918b8364d99257fc1fce7.png';
import { CLAIM_TYPES, TYPE_OF_COVER_OPTIONS, PRIORITY_OPTIONS, VESSELS, ALL_FIXTURES, LEGAL_USERS } from "./claims-types";

const INCIDENT_CATEGORIES = ["Cargo", "Environmental", "Near-Miss", "Personnel Accident", "Property Damage", "Security", "Technical", "Other"];
const FIXTURE_OPTIONS = ["FAI 2601", "FAI 2602", "FAI 2603", "FAI 2501"];

// Fixtures available per voyage — limits fixture selection in the Claims tab
const VOYAGE_FIXTURE_MAP: Record<string, string[]> = {
  "HLG 2605":  ["FAI 2601", "FAI 2602"],
  "HLSD 2605": ["FAI 2601", "FAI 2603"],
  "HLG 2601":  ["FAI 2601"],
  "HLG 2602":  ["FAI 2602", "FAI 2501"],
};


function FixtureLookupFieldV({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const available = ALL_FIXTURES.filter(
    (f) => !value.includes(f.id) &&
      (f.id.toLowerCase().includes(search.toLowerCase()) ||
       f.vessel.toLowerCase().includes(search.toLowerCase()) ||
       f.voyage.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((id) => (
            <span key={id} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium">
              {id}
              <button type="button" onClick={() => onChange(value.filter(f => f !== id))} className="text-blue-400 hover:text-blue-700 rounded p-0.5 transition-colors">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <button type="button" onClick={() => setIsOpen(v => !v)} className="flex items-center gap-2 w-full border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
          <Search className="size-4 text-gray-400" />
          <span className="flex-1 text-left text-gray-500 font-normal">Search fixtures…</span>
          <ChevronDown className="size-4 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                <input autoFocus type="text" placeholder="Search by fixture no, vessel, voyage…" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {available.length === 0
                ? <div className="py-5 text-center text-sm text-gray-400">No fixtures available</div>
                : available.map((f) => (
                  <button key={f.id} type="button" onClick={() => { onChange([...value, f.id]); setSearch(""); }}
                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{f.id}</span>
                      <span className="text-xs text-gray-400">{f.voyage}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{f.vessel}</div>
                  </button>
                ))
              }
            </div>
          </div>
        )}
        {isOpen && <div className="fixed inset-0 z-[199]" onClick={() => { setIsOpen(false); setSearch(""); }} />}
      </div>
    </div>
  );
}

interface VoyageDetailProps {
  voyage: any;
  onClose: () => void;
}

const getVoyageDetails = (voyage: any) => {
  const isHLG2605 = voyage.number === "HLG 2605";

  if (isHLG2605) {
    return {
      euEts: "83.73",
      fixtureName: "ADM - F - 2026 - 551 NCC Unemploye...",
      fixtureTag: "BREAKBULK / ...",
      fixturePorts: ["Durban ( 01/02/2026 - 27/...)", "Luanda"],
      fixtureActual: "6.214.721.563 L/S",
      fixtureChange: "5.8.215.121.013 | 5.1.615.924.711",
      particulars: [
        { label: "Gross Freight", c1: "$ 2.322", c2: "$ 6.214.761.813", c3: "↑ $ 6.214.759.491", c3Color: "text-green-600" },
        { label: "Additional Income", c1: "$ 300", c2: "$ 72.100", c3: "↑ $ 71.800", c3Color: "text-green-600" },
        { label: "Detention Demurrage", c1: "$ 0", c2: "$ 22.000", c3: "↑ $ 22.000", c3Color: "text-green-600" },
        { label: "Commissions", c1: "$ -116", c2: "$ -1.615.839.611", c3: "↑ $ -1.615.839.495", c3Color: "text-red-500" },
        { label: "Port Cost", c1: "$ 50.150", c2: "$ 204.600", c3: "↑ $ 154.450", c3Color: "text-green-600" },
        { label: "Bunker Expense", c1: "$ 0", c2: "$ 0", c3: "$ 0" },
        { label: "Additional Expense", c1: "$ -200", c2: "$ -24.600", c3: "↑ $ -24.400", c3Color: "text-red-500" },
        { label: "CO2 Emission Cost", c1: "$ 0", c2: "$ -36.087", c3: "↑ $ -36.087", c3Color: "text-red-500" },
        { label: "Fuel EU Penalty", c1: "$ 0", c2: "$ 0", c3: "$ 0" },
        { label: "Total Income", c1: "$ 52.922", c2: "$ 6.215.121.013", c3: "↑ $ 6.215.068.091", color: "text-green-600", c3Color: "text-green-600" },
        { label: "Total Expense", c1: "$ -466", c2: "$ -1.615.060.798", c3: "↑ $ -1.615.060.332", color: "text-red-500", c3Color: "text-red-500" },
        { label: "Result", c1: "$ 52.456", c2: "$ 4.599.160.215", c3: "↑ $ 4.599.107.759", bold: true, c3Color: "text-green-600" },
        { label: "TCE", c1: "$ 22.048", c2: "$ 133.788.346", c3: "↑ $ 133.766.298", bold: true, c3Color: "text-green-600" },
        { label: "Running Cost", c1: "$ -24", c2: "$ -976.504", c3: "↑ $ -976.480", c3Color: "text-red-500" },
        { label: "Profit / Loss", c1: "$ 52.432", c2: "$ 4.598.183.712", c3: "↑ $ 4.598.131.280", c3Color: "text-green-600" },
      ],
      voyageDays: {
        portDays: { c1: "1", c2: "17", c3: "↑ 16", c3Color: "text-green-600" }
      },
      duration: "34.38",
      startDate: "13-12-26",
      endDate: "16-01-27",
      routes: [
        { 
          port: "Mogadishu", dist: "2117.06nm", cost: "", portColor: "bg-blue-600", 
          dateStr: "SUN 13-12-2026 07:48",
          stats: { speed: "8.05", draft: "8.3 m", fuel: "11.5 kn", extra: "5 %" },
          bunker: "0 mt | 98.259 mt" 
        },
        { 
          port: "Durban", dist: "2450.63nm", cost: "$ -25.200", portColor: "bg-green-600", 
          dateStr: "MON 21-12-2026 08:05 TUE 29-12-2026 20:05",
          lc: "L/C : 01-Feb - 27-Mar",
          stats: { speed: "9.32", draft: "8.3 m", fuel: "11.5 kn", extra: "5 %" },
          bunker: "0 mt | 113.741 mt" 
        },
        { 
          port: "Luanda", dist: "0 nm", cost: "$ -35.300", portColor: "bg-red-600", 
          dateStr: "FRI 08-01-2027 02:50 SAT 16-01-2027 14:50",
          stats: null,
          bunker: null,
          noExpand: true 
        },
      ],
      ports: [
        { name: "Mogadishu", amount: "$ 0" },
        { name: "Durban", amount: "$ 144.800" },
        { name: "Luanda", amount: "$ 59.800" },
      ],
      totalPortIncome: "$ 204.600"
    };
  }

  // Default / Original fallback
  return {
    euEts: "93.46",
    fixtureName: "ADM - F - 2026 - 601 CHANGE ACT...",
    fixtureTag: "CARGO CATEGO...",
    fixturePorts: ["Dafeng (11/04/2026 - 25/0...)", "Aalborg"],
    fixtureActual: "$ 161.310",
    fixtureChange: "$ 105.000",
    particulars: [
      { label: "Gross Freight", c1: "$ 0", c2: "$ 161.000", c3: "$ 161.000" },
      { label: "Additional Income", c1: "$ 0", c2: "$ 310", c3: "$ 310" },
      { label: "Detention Demurrage", c1: "$ 0", c2: "$ 0", c3: "$ 0" },
      { label: "Commissions", c1: "$ 0", c2: "$ -41.850", c3: "$ -41.850" },
      { label: "Port Cost", c1: "$ 0", c2: "$ -52.000", c3: "$ -52.000" },
      { label: "Bunker Expense", c1: "$ 0", c2: "$ 0", c3: "$ 0" },
      { label: "Additional Expense", c1: "$ 0", c2: "$ 0", c3: "$ 0" },
      { label: "CO2 Emission Cost", c1: "$ 0", c2: "$ 0", c3: "$ 0" },
      { label: "Fuel EU Penalty", c1: "$ 0", c2: "$ 0", c3: "$ 0" },
      { label: "Total Income", c1: "$ 0", c2: "$ 161.310", c3: "$ 161.310", color: "text-green-600" },
      { label: "Total Expense", c1: "$ 0", c2: "$ -93.850", c3: "$ -93.850", color: "text-red-500" },
      { label: "Result", c1: "$ 0", c2: "$ 67.460", c3: "$ 67.460", bold: true },
      { label: "TCE", c1: "$ 0", c2: "$ 3.328", c3: "$ 3.328", bold: true },
      { label: "Running Cost", c1: "$ 0", c2: "$ -60.800", c3: "$ -60.800" },
      { label: "Profit / Loss", c1: "$ 0", c2: "$ 6.660", c3: "$ 6.660" },
    ],
    voyageDays: {
      portDays: { c1: "0", c2: "20.27", c3: "20.27" }
    },
    duration: "20.27",
    startDate: "25-04-26",
    endDate: "15-05-26",
    routes: [
      { port: "Lisboa", dist: "0 nm", cost: "$ 0", portColor: "bg-green-600" },
      { port: "Boca Grande", dist: "0 nm", cost: "$ 0", portColor: "bg-red-600" },
      { port: "Adelaide", dist: "0 nm", cost: "$ 0", portColor: "bg-blue-600" },
      { port: "Bacolod", dist: "0 nm", cost: "$ 0", portColor: "bg-red-600" },
      { port: "Xinfeng", dist: "0 nm", cost: "$ -52.000", t: "T/T : 2 Days", portColor: "bg-red-600" },
    ],
    ports: [
      { name: "Lisboa", amount: "-" },
      { name: "Boca Grande", amount: "-" },
      { name: "Adelaide", amount: "-" },
      { name: "Bacolod", amount: "-" },
      { name: "Xinfeng", amount: "$ -52.000" },
    ],
    totalPortIncome: "$ -52.000"
  };
};

export function VoyageDetail({ voyage, onClose }: VoyageDetailProps) {
  const data = getVoyageDetails(voyage);
  const isHLG2605 = voyage.number === "HLG 2605";
  const [activeTab, setActiveTab] = React.useState("Port");
  const [incidents, setIncidents] = React.useState<any[]>([]);
  const [isIncidentSheetOpen, setIsIncidentSheetOpen] = React.useState(false);
  const [editingIncident, setEditingIncident] = React.useState<any | null>(null);

  // New Incident Form State
  const initialFormState = {
    id: "",
    incidentNumber: "INC-0004", // Mock auto-generated
    vessel: voyage.vessel || "",
    voyage: voyage.number || "",
    portCall: "none",
    fixtures: [] as string[],
    date: new Date().toISOString().split("T")[0],
    incidentCategory: "none",
    class: "none",
    type: "none",
    eventSeverity: "none",
    location: "none",
    latitude: "",
    longitude: "",
    shortDesc: "",
    detailedDesc: "",
    severity: "none",
    status: "Open"
  };
  const [formData, setFormData] = React.useState(initialFormState);

  const openNewIncident = () => {
    setEditingIncident(null);
    setFormData(initialFormState);
    setIsIncidentSheetOpen(true);
  };

  const openEditIncident = (incident: any) => {
    setEditingIncident(incident);
    setFormData({ ...incident });
    setIsIncidentSheetOpen(true);
  };

  const handleSaveIncident = () => {
    if (editingIncident) {
      setIncidents(incidents.map(inc => inc.id === editingIncident.id ? { ...formData } : inc));
    } else {
      setIncidents([...incidents, { ...formData, id: Date.now().toString() }]);
    }
    setIsIncidentSheetOpen(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => {
      const updates: any = { [field]: value };
      if (field === "location") {
        if (value !== "At Sea") {
          updates.latitude = "";
          updates.longitude = "";
        }
        if (value !== "Port" && value !== "Anchorage") {
          updates.portCall = "none";
        }
      }
      return { ...prev, ...updates };
    });
  };

  // ── Claims tab state ────────────────────────────────────────────────────────
  const voyageFixtures = VOYAGE_FIXTURE_MAP[voyage.number as string] || FIXTURE_OPTIONS;

  const [voyageClaims, setVoyageClaims] = React.useState<any[]>([]);
  const [isClaimSheetOpen, setIsClaimSheetOpen] = React.useState(false);
  const [editingClaim, setEditingClaim] = React.useState<any | null>(null);

  const initialClaimFormState = React.useMemo<any>(() => ({
    id: "",
    claimNo: "",
    claimTitle: "",
    claimType: "none",
    typeOfCover: "none",
    priority: "None",
    status: "none",
    vessel: voyage.vessel || "",
    voyage: voyage.number || "",
    relatedFixtures: [],
    broker: "none",
    brokerReference: "",
    leadingInsurer: "",
    dateOfNotification: "",
    claimant: "",
    claimantReference: "",
    picLegal: "none",
    statusDescription: "",
    expectedSettlementDate: "",
    liabilityPosition: "none",
    recoveryRightExists: "none",
    recoveryAgainst: "none",
    recoveryRoute: "none",
    liabilityNotes: "",
  }), [voyage.vessel, voyage.number]);
  const [claimFormData, setClaimFormData] = React.useState(initialClaimFormState);

  const openNewClaim = () => {
    setEditingClaim(null);
    setClaimFormData({ ...initialClaimFormState });
    setIsClaimSheetOpen(true);
  };

  const openEditClaim = (claim: any) => {
    setEditingClaim(claim);
    setClaimFormData({ ...claim });
    setIsClaimSheetOpen(true);
  };

  const handleSaveClaim = () => {
    const claimId = editingClaim?.id || String(Date.now());
    setVoyageClaims(prev => {
      // Generate claimNo from fresh prev.length so it's never stale
      const claimNo = editingClaim
        ? claimFormData.claimNo
        : `CLM-${new Date().getFullYear()}-V${String(prev.length + 1).padStart(2, "0")}`;
      const claim = { ...claimFormData, id: claimId, claimNo };
      const updated = editingClaim
        ? prev.map(c => c.id === editingClaim.id ? claim : c)
        : [claim, ...prev];
      // Sync all voyage claims to localStorage (covers both create and edit)
      try {
        const stored: any[] = JSON.parse(localStorage.getItem('voyage-claims') || '[]');
        const idx = stored.findIndex(c => c.id === claim.id);
        const next = idx >= 0 ? stored.map(c => c.id === claim.id ? claim : c) : [claim, ...stored];
        localStorage.setItem('voyage-claims', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('voyage-claims-updated'));
      } catch {}
      return updated;
    });
    setIsClaimSheetOpen(false);
  };

  const updateClaimField = (field: string, value: any) => {
    setClaimFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f7] w-full text-[13px] font-sans overflow-hidden">
      {/* Top Navigation Tabs */}
      <div className="flex items-center h-10 bg-white border-b border-gray-200 px-2 shrink-0">
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <X className="size-4" />
        </button>
        <div className="flex items-center ml-2 h-full">
          <button onClick={onClose} className="px-4 text-gray-500 hover:text-gray-900 h-full border-b-2 border-transparent">
            All Voyages
          </button>
          <div className="flex items-center px-4 bg-gray-50 border-t border-x border-gray-200 h-full mt-1 rounded-t-sm border-b-2 border-[#ffd700] text-gray-900 font-medium">
            <span>{voyage.number}</span>
            <button className="ml-2 text-gray-400 hover:text-gray-700" onClick={onClose}>
              <X className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Header */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 bg-white border-b border-gray-200 shrink-0 text-xs">
        <div>
          <span className="block text-gray-400 mb-0.5">Voyage No</span>
          <span className="font-medium text-gray-900">{voyage.number}</span>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">Vessel</span>
          <span className="font-medium text-gray-900">{voyage.vessel}</span>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">PIC Operations</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 truncate w-24">
            {voyage.operationInCharge}
          </div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">Status</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{voyage.status}</div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">Customs Filing</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{voyage.customsFiling || "Pending"}</div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">Bunker Planning</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{voyage.bunkerPlanning || "Pending"}</div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">Armed Guards</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{voyage.armedGuards || "Pending"}</div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">Transit Requirements</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{voyage.transitRequirements || "Pending"}</div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">AGM</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{voyage.agm || "Pending"}</div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">Close Out Meeting</span>
          <div className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">N/A</div>
        </div>
        <div>
          <span className="block text-gray-400 mb-0.5">EU ETS</span>
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 flex items-center justify-center bg-gray-100 border border-gray-200 rounded">S</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">{data.euEts}</span>
          </div>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><Download className="size-4" /></button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><Flag className="size-4" /></button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><Maximize2 className="size-4" /></button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><MoreVertical className="size-4" /></button>
          <button className="text-xs font-medium px-2 py-1 bg-white border border-gray-300 rounded shadow-sm flex items-center gap-1 text-gray-700">
            <List className="size-3" />
            Fuel Bunker Changes
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {/* Top Half */}
        <div className="flex gap-4 h-[350px]">
          {/* Map Area */}
          <div className="flex-[0.35] relative rounded border border-gray-200 overflow-hidden bg-blue-100">
            <div className="absolute inset-0 bg-[#81c0e8] opacity-80" style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
            
            {isHLG2605 ? (
              <>
                {/* SVG Route specifically for HLG 2605 */}
                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <path d="M 60 20 Q 80 40 80 70 T 40 90 T 20 50" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
                </svg>
                
                <div className="absolute top-[20%] left-[60%] flex items-center z-20">
                  <div className="size-2 bg-blue-600 rounded-full shadow border border-white z-10" />
                  <div className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow ml-1">1 Mogadishu</div>
                </div>
                <div className="absolute top-[70%] left-[80%] flex items-center z-20">
                  <div className="size-2 bg-blue-600 rounded-full shadow border border-white z-10" />
                  <div className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow ml-1">2 Durban</div>
                </div>
                <div className="absolute top-[50%] left-[20%] flex items-center z-20">
                  <div className="size-2 bg-blue-600 rounded-full shadow border border-white z-10" />
                  <div className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow ml-1">3 Luanda</div>
                </div>
              </>
            ) : (
              <>
                <svg className="absolute inset-0 w-full h-full z-10" style={{stroke: '#2563eb', strokeWidth: 2, fill: 'none', strokeDasharray: '4 4'}}>
                  <path d="M 150 100 Q 100 150 50 180 T 250 250 T 300 150" />
                </svg>
              </>
            )}
            
            {/* Map Overlays */}
            <div className="absolute top-2 right-2 bg-white rounded shadow text-xs z-30">
              <button className="px-2 py-1 font-medium border-b border-gray-100 flex items-center gap-1">Map <ChevronRight className="size-3" /></button>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] text-gray-700 bg-white/80 px-1 rounded z-30 font-medium">Google</div>
          </div>

          {/* Fixture Area */}
          <div className="flex-[0.2] bg-white border border-gray-200 rounded flex flex-col p-4 items-center">
            <div className="w-full bg-[#f8f9fa] border border-gray-200 rounded p-3 text-xs mb-4 relative shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900 truncate pr-4 text-[11px]" title={data.fixtureName}>
                  {data.fixtureName}
                </span>
                <span className="bg-gray-800 text-white text-[9px] px-1 rounded absolute right-2 top-2">SB</span>
              </div>
              
              <div className="flex items-center gap-1.5 mb-1 text-gray-600">
                <div className="w-3 h-2 bg-green-600"></div>
                <span className="truncate text-[11px]">{data.fixturePorts[0]}</span>
                <span className="bg-blue-100 text-blue-800 text-[8px] px-1 rounded ml-auto whitespace-nowrap shrink-0">{data.fixtureTag}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                <div className="w-3 h-2 bg-red-600"></div>
                <span className="text-[11px]">{data.fixturePorts[1]}</span>
              </div>
              
              <div className="flex flex-col text-[11px]">
                <span className="text-gray-900">{data.fixtureActual}</span>
                <span className="text-gray-500">{data.fixtureChange}</span>
              </div>
            </div>
            <button className="text-blue-600 font-medium text-xs hover:underline mt-auto">Open Fixture List</button>
          </div>

          {/* Particulars Area */}
          <div className="flex-[0.45] bg-white border border-gray-200 rounded flex flex-col text-[11px] overflow-hidden">
            <div className="grid grid-cols-[1.5fr_80px_100px_100px] gap-2 px-3 py-2 bg-[#f8f9fa] border-b border-gray-200 font-medium text-gray-600 sticky top-0">
              <div className="flex items-center gap-1">EST-2026-325(Current Version) <ChevronRight className="size-3 rotate-90"/></div>
              <div className="text-right"></div>
              <div className="text-right">Actual</div>
              <div className="text-right">Change</div>
            </div>
            <div className="flex-1 overflow-auto p-1 custom-scrollbar">
              {data.particulars.map((row: any, i: number) => (
                <div key={i} className="grid grid-cols-[1.5fr_80px_100px_100px] gap-2 px-2 py-1.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                  <div className={`${row.bold ? 'font-medium' : ''} ${row.color || 'text-gray-700'}`}>{row.label}</div>
                  <div className="text-right text-gray-500">{row.c1}</div>
                  <div className="text-right text-gray-900 font-medium">{row.c2}</div>
                  <div className={`text-right font-medium ${row.c3Color || 'text-gray-900'}`}>{row.c3}</div>
                </div>
              ))}
              
              <div className="grid grid-cols-[1.5fr_80px_100px_100px] gap-2 px-2 py-1.5 mt-2 bg-gray-50 font-medium text-gray-700">
                <div>Voyage Days</div>
                <div className="text-right"></div>
                <div className="text-right"></div>
                <div className="text-right"></div>
              </div>
              <div className="grid grid-cols-[1.5fr_80px_100px_100px] gap-2 px-2 py-1.5 border-b border-gray-100">
                <div className="text-gray-700">Port Days</div>
                <div className="text-right text-gray-500">{data.voyageDays.portDays.c1}</div>
                <div className="text-right text-gray-900">{data.voyageDays.portDays.c2}</div>
                <div className={`text-right ${data.voyageDays.portDays.c3Color || 'text-gray-900'}`}>{data.voyageDays.portDays.c3}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Half */}
        <div className="flex gap-4 flex-1 min-h-[280px]">
          {/* Route List */}
          <div className="flex-[0.45] bg-white border border-gray-200 rounded flex flex-col text-xs">
            <div className="p-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 bg-[#f8f9fa]">
              <div className="flex items-center gap-4 text-[11px]">
                <div>
                  <div className="text-gray-500 mb-0.5">Start Date</div>
                  <div className="font-medium text-gray-900">{data.startDate}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-0.5">End date</div>
                  <div className="font-medium text-gray-900">{data.endDate}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-0.5">Duration</div>
                  <div className="font-medium text-gray-900">{data.duration}</div>
                </div>
              </div>
              <Button size="sm" className="bg-[#ffd700] hover:bg-[#e6c200] text-black h-7 px-3 text-xs border-0 rounded font-medium shadow-sm">
                Assign Port Calls
              </Button>
              <div className="flex items-center gap-2 text-[10px] text-gray-600">
                 <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-[#ffd700] focus:ring-[#ffd700]" defaultChecked /> Med Seca</label>
                 <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-[#ffd700] focus:ring-[#ffd700]" /> Suez Canal</label>
                 <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-[#ffd700] focus:ring-[#ffd700]" /> Kiel Canal</label>
                 <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-[#ffd700] focus:ring-[#ffd700]" /> Panama Canal</label>
              </div>
            </div>
            
            <div className="px-3 py-1.5 flex justify-end gap-3 text-gray-600 border-b border-gray-100 bg-white text-[11px] font-medium">
              <button className="hover:text-gray-900">Expand All</button>
              <button className="hover:text-gray-900">Collapse All</button>
            </div>
            
            <div className="flex-1 overflow-auto bg-white">
              {data.routes.map((route: any, i: number) => (
                <div key={i} className="border-b border-gray-100 last:border-0 group">
                  <div className="flex flex-col gap-1 p-2 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 w-full">
                      <ChevronRight className={`size-3 text-gray-400 ${route.noExpand ? 'opacity-0' : ''}`} />
                      <div className={`w-2.5 h-2.5 ${route.portColor}`}></div>
                      <span className="font-medium text-gray-800">{route.port}</span>
                      {i === 0 && <Circle className="size-3 text-black fill-black ml-1" />}
                      <span className="text-blue-600 text-[10px] ml-2 font-medium">{route.dateStr}</span>
                      
                      <div className="ml-auto flex items-center gap-3">
                         {route.lc && <span className="text-red-400 text-[10px] mr-2">{route.lc}</span>}
                         <span className="text-red-500 font-medium">{route.cost}</span>
                         <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center text-[10px] text-gray-500 bg-white">1</div>
                         <MoreVertical className="size-3 text-gray-400" />
                      </div>
                    </div>

                    {/* Stats row below port name */}
                    {!route.noExpand && (
                      <div className="flex items-center text-[10px] text-gray-500 ml-6 pl-1 mt-1">
                         <div className="flex items-center gap-1.5 w-24">
                           <ArrowRight className="size-3 text-gray-400" />
                           {route.dist}
                         </div>
                         {route.stats ? (
                           <div className="flex items-center gap-4 flex-1">
                             <span className="text-blue-500">{route.stats.speed}</span>
                             <span>{route.stats.draft}</span>
                             <span>{route.stats.fuel}</span>
                             <span>{route.stats.extra}</span>
                           </div>
                         ) : (
                           <span className="flex-1">{route.t}</span>
                         )}
                         <div className="ml-auto flex items-center gap-1 pr-6">
                            <span className="w-2.5 h-2.5 rounded-full border border-gray-400 flex items-center justify-center text-[6px]">S</span>
                            <span className="text-[10px]">{route.bunker}</span>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Tabs */}
          <div className="flex-[0.55] bg-white border border-gray-200 rounded flex flex-col text-xs overflow-hidden">
            <div className="flex border-b border-gray-200 bg-[#f8f9fa] px-2 pt-2 gap-1">
              {['Port', 'Fixture', 'Voyage', 'Emission', 'Voyage Remarks', 'Incidents', 'Claims'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border-b-2 rounded-t-sm font-medium ${
                    activeTab === tab 
                      ? 'border-[#ffd700] bg-white text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex-1 p-4 overflow-auto">
              {activeTab === 'Port' && (
                <>
                  <div className="text-center font-medium text-gray-700 mb-4 bg-gray-50 py-2 rounded border border-gray-100 shadow-sm">
                    Port Income & Expenses
                  </div>
                  
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="py-2.5 font-medium">Port</th>
                        <th className="py-2.5 font-medium text-right w-32">Amount</th>
                        <th className="py-2.5 font-medium text-right w-32 pr-4">FDA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.ports.map((port: any, idx: number) => (
                        <React.Fragment key={idx}>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 text-gray-800">{port.name}</td>
                            <td className="py-3 text-right text-gray-400">-</td>
                            <td className="py-3 text-right pr-4 text-gray-400">$ 0</td>
                          </tr>
                          <tr className="bg-[#fcfcfc]">
                            <td className="py-2.5 text-right text-gray-500 font-medium">Subtotal</td>
                            <td className="py-2.5 text-right text-gray-900 font-medium">{port.amount}</td>
                            <td className="py-2.5 text-right pr-4 text-gray-900">$ 0</td>
                          </tr>
                        </React.Fragment>
                      ))}
                      <tr className="bg-gray-100 font-medium border-t-2 border-gray-200">
                        <td className="py-3.5 text-right text-gray-700">Total Port Income & Expense</td>
                        <td className="py-3.5 text-right text-gray-900 font-bold">{data.totalPortIncome}</td>
                        <td className="py-3.5 text-right pr-4 text-gray-900 font-bold">$ 0</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
              
              {activeTab === 'Incidents' && (
                <div className="flex flex-col h-full">
                  {incidents.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="bg-blue-50 p-4 rounded-full mb-4">
                        <PlusCircle className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No incidents recorded</h3>
                      <p className="text-xs text-gray-500 mb-4 max-w-sm">
                        Create or record an incident directly from inside the Voyage. Keep track of all related events.
                      </p>
                      <Button onClick={openNewIncident} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Incident
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">Recorded Incidents ({incidents.length})</h3>
                        <Button size="sm" onClick={openNewIncident} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-7 text-xs shadow-sm">
                          <Plus className="mr-1 h-3 w-3" />
                          New Incident
                        </Button>
                      </div>
                      <div className="flex-1 overflow-auto border border-gray-200 rounded-md bg-white">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="py-2 px-3 font-medium text-gray-600">Incident No</th>
                              <th className="py-2 px-3 font-medium text-gray-600">Date</th>
                              <th className="py-2 px-3 font-medium text-gray-600">Category</th>
                              <th className="py-2 px-3 font-medium text-gray-600">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {incidents.map((inc) => (
                              <tr 
                                key={inc.id} 
                                onClick={() => openEditIncident(inc)}
                                className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                              >
                                <td className="py-2.5 px-3 font-medium text-blue-600">{inc.incidentNumber}</td>
                                <td className="py-2.5 px-3 text-gray-600">{inc.date}</td>
                                <td className="py-2.5 px-3 text-gray-800">{inc.incidentCategory !== 'none' ? inc.incidentCategory : '-'}</td>
                                <td className="py-2.5 px-3">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    inc.status === "Open" ? "bg-blue-100 text-blue-800" :
                                    inc.status === "Closed" || inc.status === "Cancelled" ? "bg-gray-100 text-gray-800" :
                                    "bg-orange-100 text-orange-800"
                                  }`}>
                                    {inc.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'Claims' && (
                <div className="flex flex-col h-full">
                  {voyageClaims.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="bg-blue-50 p-4 rounded-full mb-4">
                        <PlusCircle className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No claims recorded</h3>
                      <p className="text-xs text-gray-500 mb-4 max-w-sm">
                        Create a claim directly from this voyage. Vessel and voyage details are pre-filled automatically.
                      </p>
                      <Button onClick={openNewClaim} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Claim
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">Claims ({voyageClaims.length})</h3>
                        <Button size="sm" onClick={openNewClaim} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-7 text-xs shadow-sm">
                          <Plus className="mr-1 h-3 w-3" />
                          New Claim
                        </Button>
                      </div>
                      <div className="flex-1 overflow-auto border border-gray-200 rounded-md bg-white">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="py-2 px-3 font-medium text-gray-600">Claim No</th>
                              <th className="py-2 px-3 font-medium text-gray-600">Title</th>
                              <th className="py-2 px-3 font-medium text-gray-600">Type</th>
                              <th className="py-2 px-3 font-medium text-gray-600">Priority</th>
                              <th className="py-2 px-3 font-medium text-gray-600">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {voyageClaims.map((claim) => (
                              <tr
                                key={claim.id}
                                onClick={() => openEditClaim(claim)}
                                className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                              >
                                <td className="py-2.5 px-3 font-medium text-blue-600">{claim.claimNo}</td>
                                <td className="py-2.5 px-3 text-gray-800">{claim.claimTitle || '-'}</td>
                                <td className="py-2.5 px-3 text-gray-600">{claim.claimType !== 'none' ? claim.claimType : '-'}</td>
                                <td className="py-2.5 px-3">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    claim.priority === 'High' || claim.priority === 'Overdue' ? 'bg-red-100 text-red-800' :
                                    claim.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                    claim.priority === 'Low' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>{claim.priority}</span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    claim.status === 'Open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                  }`}>{claim.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab !== 'Port' && activeTab !== 'Incidents' && activeTab !== 'Claims' && (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">
                  Content for {activeTab} will go here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Required CSS for custom scrollbar to match dense table look */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}</style>
      <Sheet open={isIncidentSheetOpen} onOpenChange={setIsIncidentSheetOpen}>
        <SheetContent side="right" className="!max-w-none w-full sm:w-[500px] md:w-[600px] lg:w-1/2 flex flex-col h-full overflow-hidden p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{editingIncident ? "Edit Incident" : "Create New Incident"}</SheetTitle>
            <SheetDescription>
              {editingIncident ? "Update incident details below." : "Fill in the details below to report a new incident."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingIncident ? "Edit Incident" : "Create New Incident"}
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Header Summary Section - Visible only in Edit Mode */}
              {editingIncident && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Incident No</span>
                    <span className="font-semibold text-gray-900">{formData.incidentNumber}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</span>
                    <span className="font-semibold text-gray-900">{formData.incidentCategory !== 'none' ? formData.incidentCategory : '-'}</span>
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

              <div className="space-y-4">
                {!editingIncident && (
                  <div className="space-y-2">
                    <Label>Incident Number</Label>
                    <Input 
                      value={formData.incidentNumber} 
                      disabled 
                      className="bg-gray-50 text-gray-500 font-medium"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="vessel">Vessel <span className="text-red-500">*</span></Label>
                  <Select value={formData.vessel || "none"} onValueChange={(val) => updateField("vessel", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="none" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled className="hidden">Select vessel</SelectItem>
                      <SelectItem value="UHL F900">UHL F900</SelectItem>
                      <SelectItem value="UHL FAITH">UHL FAITH</SelectItem>
                      <SelectItem value="UHL FORCE">UHL FORCE</SelectItem>
                      <SelectItem value="UHL FIERCE">UHL FIERCE</SelectItem>
                      <SelectItem value="UHL FELICITY">UHL FELICITY</SelectItem>
                      <SelectItem value="UHL FINESSE">UHL FINESSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4">
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
                      <PopoverContent className="w-[300px] p-2" align="start">
                        <div className="space-y-1">
                          {FIXTURE_OPTIONS.map((fixture) => (
                            <div 
                              key={fixture} 
                              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                              onClick={() => {
                                const newFixtures = formData.fixtures.includes(fixture)
                                  ? formData.fixtures.filter(f => f !== fixture)
                                  : [...formData.fixtures, fixture];
                                updateField("fixtures", newFixtures);
                              }}
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date of Incident <span className="text-red-500">*</span></Label>
                    <Input 
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => updateField("date", e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incidentCategory">Incident Category <span className="text-red-500">*</span></Label>
                    <Select value={formData.incidentCategory || "none"} onValueChange={(val) => updateField("incidentCategory", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="none" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled className="hidden">Select category</SelectItem>
                        {INCIDENT_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Incident Class</Label>
                    <Select value={formData.class || "none"} onValueChange={(val) => updateField("class", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="none" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled className="hidden">Select class</SelectItem>
                        <SelectItem value="Class A">Class A</SelectItem>
                        <SelectItem value="Class B">Class B</SelectItem>
                        <SelectItem value="Class C">Class C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Incident Type</Label>
                    <Select value={formData.type || "none"} onValueChange={(val) => updateField("type", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="none" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled className="hidden">Select type</SelectItem>
                        <SelectItem value="Type 1">Type 1</SelectItem>
                        <SelectItem value="Type 2">Type 2</SelectItem>
                        <SelectItem value="Type 3">Type 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Select value={formData.location || "none"} onValueChange={(val) => updateField("location", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="none" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled className="hidden">Select location</SelectItem>
                      <SelectItem value="Port">Port</SelectItem>
                      <SelectItem value="At Sea">At Sea</SelectItem>
                      <SelectItem value="Anchorage">Anchorage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.location === "Port" || formData.location === "Anchorage") && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="portCall">Port Call</Label>
                      <Select value={formData.portCall || "none"} onValueChange={(val) => updateField("portCall", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="none" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" disabled className="hidden">Select port call</SelectItem>
                          <SelectItem value="Mogadishu">Mogadishu</SelectItem>
                          <SelectItem value="Durban">Durban</SelectItem>
                          <SelectItem value="Luanda">Luanda</SelectItem>
                          <SelectItem value="Rotterdam">Rotterdam</SelectItem>
                          <SelectItem value="Singapore">Singapore</SelectItem>
                          <SelectItem value="Houston">Houston</SelectItem>
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

                <div className="space-y-2">
                  <Label htmlFor="shortDesc">Short Description <span className="text-red-500">*</span></Label>
                  <Input 
                    id="shortDesc" 
                    value={formData.shortDesc || ""}
                    onChange={(e) => updateField("shortDesc", e.target.value)}
                    placeholder="Brief summary of the incident"
                    className="bg-white"
                    maxLength={100}
                  />
                  <div className="text-xs text-right text-gray-400">{formData.shortDesc.length}/100</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailedDesc">Detailed Description</Label>
                  <Textarea 
                    id="detailedDesc" 
                    value={formData.detailedDesc || ""}
                    onChange={(e) => updateField("detailedDesc", e.target.value)}
                    placeholder="Full details of what happened..."
                    className="min-h-[100px] bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Initial Severity <span className="text-red-500">*</span></Label>
                    <Select value={formData.severity || "none"} onValueChange={(val) => updateField("severity", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="none" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled className="hidden">Select severity</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status || "none"} onValueChange={(val) => updateField("status", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="none" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled className="hidden">Select status</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsIncidentSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIncident} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white">
              {editingIncident ? "Update Incident" : "Create Incident"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Claims Sheet ─────────────────────────────────────────────────── */}
      <Sheet open={isClaimSheetOpen} onOpenChange={setIsClaimSheetOpen}>
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
                    {editingClaim ? "Edit Claim" : "New Claim"}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-500 mt-1">
                    {editingClaim ? "Update claim details and manage associated records." : "Enter details for the new claim record."}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="w-full flex-1 mt-6 space-y-6">
              {/* Type of Claim & Type of Cover */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type of Claim <span className="text-red-500">*</span></Label>
                  <Select value={claimFormData.claimType} onValueChange={(val) => updateClaimField("claimType", val)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select type</SelectItem>
                      {CLAIM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type of Cover</Label>
                  <Select value={claimFormData.typeOfCover} onValueChange={(val) => updateClaimField("typeOfCover", val)}>
                    <SelectTrigger><SelectValue placeholder="Select cover" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select cover</SelectItem>
                      {TYPE_OF_COVER_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vessel & Voyage — pre-filled from this voyage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vessel</Label>
                  <Select value={claimFormData.vessel || "none"} onValueChange={(val) => updateClaimField("vessel", val)}>
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
                    value={claimFormData.voyage}
                    onChange={(e) => updateClaimField("voyage", e.target.value)}
                    placeholder="e.g. FAI 2601"
                  />
                </div>
              </div>

              {/* Related Fixtures */}
              <div className="space-y-2">
                <Label>Related Fixtures</Label>
                <FixtureLookupFieldV
                  value={claimFormData.relatedFixtures || []}
                  onChange={(val) => updateClaimField("relatedFixtures", val)}
                />
              </div>

              {/* Broker + Broker Reference */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Broker</Label>
                  <Select value={claimFormData.broker || "none"} onValueChange={(val) => updateClaimField("broker", val)}>
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
                  <Input value={claimFormData.brokerReference} onChange={(e) => updateClaimField("brokerReference", e.target.value)} placeholder="e.g. MIB-2024-089" />
                </div>
              </div>

              {/* Leading Insurer + Date of Notification */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Leading Insurer</Label>
                  <Input value={claimFormData.leadingInsurer} onChange={(e) => updateClaimField("leadingInsurer", e.target.value)} placeholder="Enter leading insurer" />
                </div>
                <div className="space-y-2">
                  <Label>Date of Notification to Broker</Label>
                  <Input type="date" value={claimFormData.dateOfNotification} onChange={(e) => updateClaimField("dateOfNotification", e.target.value)} />
                </div>
              </div>

              {/* Claimant + Claimant Reference */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Claimant <span className="text-red-500">*</span></Label>
                  <Input value={claimFormData.claimant} onChange={(e) => updateClaimField("claimant", e.target.value)} placeholder="Enter claimant name" />
                </div>
                <div className="space-y-2">
                  <Label>Claimant Reference Number</Label>
                  <Input value={claimFormData.claimantReference} onChange={(e) => updateClaimField("claimantReference", e.target.value)} placeholder="e.g. CLM-REF-2024-001" />
                </div>
              </div>

              {/* PIC Legal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>PIC Legal</Label>
                  <Select value={claimFormData.picLegal || "none"} onValueChange={(val) => updateClaimField("picLegal", val === "none" ? "" : val)}>
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
                  value={claimFormData.claimTitle}
                  onChange={(e) => updateClaimField("claimTitle", e.target.value)}
                  placeholder="Brief summary of the claim for list view..."
                  className="resize-none min-h-[80px]"
                />
              </div>

              {/* Status & Priority & Expected Settlement Date */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Claim Status <span className="text-red-500">*</span></Label>
                  <Select value={claimFormData.status} onValueChange={(val) => updateClaimField("status", val)}>
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
                  <Select value={claimFormData.priority} onValueChange={(val) => updateClaimField("priority", val)}>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected Settlement Date</Label>
                  <Input type="date" value={claimFormData.expectedSettlementDate || ""} onChange={(e) => updateClaimField("expectedSettlementDate", e.target.value)} />
                </div>
              </div>

              {/* Status Description */}
              <div className="space-y-2">
                <Label>Status Description</Label>
                <Textarea
                  value={claimFormData.statusDescription}
                  onChange={(e) => updateClaimField("statusDescription", e.target.value)}
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
                    <Select value={claimFormData.liabilityPosition || "none"} onValueChange={(val) => updateClaimField("liabilityPosition", val)}>
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
                    <Select value={claimFormData.recoveryRightExists || "none"} onValueChange={(val) => updateClaimField("recoveryRightExists", val)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {claimFormData.recoveryRightExists === "Yes" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Recovery Against</Label>
                      <Select value={claimFormData.recoveryAgainst || "none"} onValueChange={(val) => updateClaimField("recoveryAgainst", val)}>
                        <SelectTrigger><SelectValue placeholder="Select party" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select party</SelectItem>
                          {["Owner","Charterer","Shipper","Receiver","Terminal","Stevedore","Insurer","Surveyor","Other"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Recovery Route</Label>
                      <Select value={claimFormData.recoveryRoute || "none"} onValueChange={(val) => updateClaimField("recoveryRoute", val)}>
                        <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select route</SelectItem>
                          {["Insurance","Contractual","Legal","Direct Settlement","Arbitration","Litigation","Other"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Liability Assessment Notes</Label>
                  <Textarea
                    value={claimFormData.liabilityNotes || ""}
                    onChange={(e) => updateClaimField("liabilityNotes", e.target.value)}
                    placeholder="Notes on liability position, recovery prospects, legal opinions..."
                    className="resize-none min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center shrink-0 justify-end gap-2">
            <Button variant="outline" onClick={() => setIsClaimSheetOpen(false)} className="bg-white">Cancel</Button>
            <Button onClick={handleSaveClaim} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
              <Check className="w-4 h-4 mr-2" />
              {editingClaim ? "Update Claim" : "Create Claim"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}