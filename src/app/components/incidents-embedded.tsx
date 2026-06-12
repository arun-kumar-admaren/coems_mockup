import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Search, MoreVertical, ChevronDown, X, AlertTriangle } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Incident {
  id: string;
  title: string;
  vessel: string;
  voyage: string;
  portCall: string;
  fixtures: string[];
  date: string;
  incidentCategory: string;
  incidentClass: string;
  type: string;
  location: string;
  shortDesc: string;
  detailedDesc: string;
  severity: string;
  status: string;
  pol: string;
  pod: string;
}

interface StandaloneDetails {
  vessel: string;
  voyage: string;
  relatedFixtures: string[];
  dateOfIncident: string;
  location: string;
  damageKnown: string;
  stepsTaken: string;
  assistanceRequired: string;
  portAgentDetails: string;
  picLegal: string[];
  shortClaimDescription: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_INCIDENTS: Incident[] = [
  {
    id: "INC-2024-120",
    title: "Container Spill During Heavy Weather",
    vessel: "MV OCEAN STAR",
    voyage: "FAI 2601",
    portCall: "Rotterdam",
    fixtures: ["FIX-2024-067"],
    date: "2024-02-15",
    incidentCategory: "Cargo Damage",
    incidentClass: "Heavy Weather",
    type: "Container loss",
    location: "At Sea",
    shortDesc: "Multiple containers lost overboard.",
    detailedDesc: "Vessel encountered heavy weather resulting in cargo shift and loss of several containers overboard.",
    severity: "High",
    status: "Active",
    pol: "Rotterdam",
    pod: "Singapore",
  },
  {
    id: "INC-2024-145",
    title: "Collision with Pier",
    vessel: "MV PACIFIC VOYAGER",
    voyage: "FAI 2502",
    portCall: "Houston",
    fixtures: ["FIX-2024-089"],
    date: "2024-03-01",
    incidentCategory: "Hull Damage",
    incidentClass: "Collision",
    type: "Contact with fixed object",
    location: "Port",
    shortDesc: "Contact with pier during berthing.",
    detailedDesc: "Vessel made contact with the pier while berthing, resulting in dented hull plates on the starboard bow.",
    severity: "Medium",
    status: "Open",
    pol: "Houston",
    pod: "Santos",
  },
  {
    id: "INC-2024-089",
    title: "Crew Slip and Fall",
    vessel: "MV SOUTHERN CROSS",
    voyage: "FAI 2312",
    portCall: "Piraeus",
    fixtures: ["FIX-2024-112"],
    date: "2024-02-28",
    incidentCategory: "Personal Injury",
    incidentClass: "Slip & Fall",
    type: "Personal injury — crew",
    location: "At Sea",
    shortDesc: "Crew member injured on deck during rough weather.",
    detailedDesc: "Crew member slipped on the wet main deck during rough weather conditions and sustained a leg fracture.",
    severity: "Medium",
    status: "Open",
    pol: "Piraeus",
    pod: "Alexandria",
  },
  {
    id: "INC-2024-167",
    title: "Oil Spill During Cargo Transfer",
    vessel: "MV WESTERN SPIRIT",
    voyage: "FAI 2498",
    portCall: "Houston",
    fixtures: ["FIX-2024-056"],
    date: "2024-02-05",
    incidentCategory: "Pollution",
    incidentClass: "Spill",
    type: "Oil spill",
    location: "Port",
    shortDesc: "Oil leak during cargo transfer operations.",
    detailedDesc: "Hydraulic hose failure caused an oil spill into the water during cargo transfer. Port authorities notified.",
    severity: "High",
    status: "Active",
    pol: "Houston",
    pod: "Veracruz",
  },
  {
    id: "INC-2024-201",
    title: "Terminal Crane Struck During Loading",
    vessel: "MV NORTHERN LIGHT",
    voyage: "FAI 2601",
    portCall: "Le Havre",
    fixtures: ["FIX-2024-134"],
    date: "2024-03-10",
    incidentCategory: "Property Damage",
    incidentClass: "Collision",
    type: "Contact with port equipment",
    location: "Port",
    shortDesc: "Vessel superstructure struck terminal crane arm.",
    detailedDesc: "During loading operations, vessel superstructure came into contact with the terminal crane resulting in damage to both structures.",
    severity: "Medium",
    status: "Open",
    pol: "Le Havre",
    pod: "Tilbury",
  },
  {
    id: "INC-2024-178",
    title: "Crew Heat Exhaustion in Engine Room",
    vessel: "MV TROPICAL WAVE",
    voyage: "FAI 2715",
    portCall: "Santos",
    fixtures: ["FIX-2024-118"],
    date: "2024-02-20",
    incidentCategory: "Personal Injury",
    incidentClass: "Heat Illness",
    type: "Personal injury — crew",
    location: "At Sea",
    shortDesc: "Engineer suffered heat exhaustion in engine room.",
    detailedDesc: "Chief engineer collapsed in the engine room due to extreme heat. Vessel was operating in tropical waters with inadequate ventilation.",
    severity: "Low",
    status: "Closed",
    pol: "Santos",
    pod: "Mombasa",
  },
  {
    id: "INC-2023-445",
    title: "Engine Room Fire",
    vessel: "MV HORIZON",
    voyage: "FAI 1998",
    portCall: "Yokohama",
    fixtures: ["FIX-2023-289"],
    date: "2023-11-15",
    incidentCategory: "Fire",
    incidentClass: "Machinery Fire",
    type: "Fire — machinery space",
    location: "At Sea",
    shortDesc: "Major fire broke out in the engine room.",
    detailedDesc: "A fuel oil leak near the main engine ignited and caused a serious engine room fire. Fixed CO2 suppression system activated. Vessel diverted to nearest port.",
    severity: "Critical",
    status: "Closed",
    pol: "Yokohama",
    pod: "Long Beach",
  },
];

const EMPTY_STANDALONE: StandaloneDetails = {
  vessel: "",
  voyage: "",
  relatedFixtures: [],
  dateOfIncident: "",
  location: "",
  damageKnown: "",
  stepsTaken: "",
  assistanceRequired: "",
  portAgentDetails: "",
  picLegal: [],
  shortClaimDescription: "",
};

const FIXTURE_OPTIONS = [
  "FIX-2024-067", "FIX-2024-089", "FIX-2024-045", "FIX-2024-112",
  "FIX-2024-056", "FIX-2024-134", "FIX-2024-118", "FIX-2023-289",
];

const LEGAL_USERS = [
  "Priya Nair", "Thomas Berg", "Sara Johansson", "Ahmed Al-Rashid",
  "Elena Vasquez", "Marco Bianchi",
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<string, string> = {
  Critical: "bg-red-100 text-red-800",
  High:     "bg-orange-100 text-orange-800",
  Medium:   "bg-yellow-100 text-yellow-800",
  Low:      "bg-green-100 text-green-800",
};

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-blue-100 text-blue-800",
  Open:   "bg-blue-100 text-blue-800",
  Closed: "bg-gray-100 text-gray-600",
  Closed_: "bg-gray-100 text-gray-600",
};

const INCIDENT_CATEGORIES = [
  "Cargo Damage", "Hull Damage", "Personal Injury", "Pollution",
  "Property Damage", "Fire", "Machinery Failure", "Near Miss", "Other",
];

const INCIDENT_CLASSES = [
  "Heavy Weather", "Collision", "Slip & Fall", "Spill", "Heat Illness",
  "Machinery Fire", "Navigation Error", "Contact", "Other",
];

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];
const STATUS_OPTIONS = ["Open", "Active", "Under Investigation", "Closed"];

const VESSELS = [
  "MV OCEAN STAR", "MV PACIFIC VOYAGER", "MV ATLANTIC PRIDE", "MV SOUTHERN CROSS",
  "MV EASTERN STAR", "MV NORTHERN LIGHT", "MV WESTERN SPIRIT", "MV HORIZON",
  "MV ARCTIC BREEZE", "MV TROPICAL WAVE", "MV GLOBAL TRADER", "MV LIBERTY BELLE",
];

const LOCATION_OPTIONS = ["At Sea", "Port", "Anchorage", "Dry Dock", "Canal Transit", "River"];

// ─── Standalone Details Form ──────────────────────────────────────────────────

function StandaloneDetailsForm({
  details,
  onChange,
}: {
  details: StandaloneDetails;
  onChange: (d: StandaloneDetails) => void;
}) {
  const upd = (field: keyof StandaloneDetails, value: string | string[]) =>
    onChange({ ...details, [field]: value });

  const toggleFixture = (f: string) => {
    const next = details.relatedFixtures.includes(f)
      ? details.relatedFixtures.filter((x) => x !== f)
      : [...details.relatedFixtures, f];
    upd("relatedFixtures", next);
  };

  const toggleLegal = (u: string) => {
    const next = details.picLegal.includes(u)
      ? details.picLegal.filter((x) => x !== u)
      : [...details.picLegal, u];
    upd("picLegal", next);
  };

  return (
    <div className="space-y-5">

      {/* Vessel + Voyage */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">
            Vessel <span className="text-red-500">*</span>
          </Label>
          <Select value={details.vessel || "none"} onValueChange={(v) => upd("vessel", v === "none" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Select vessel" /></SelectTrigger>
            <SelectContent className="z-[600]">
              <SelectItem value="none">Select vessel</SelectItem>
              {VESSELS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">
            Voyage <span className="text-red-500">*</span>
          </Label>
          <Input
            value={details.voyage}
            onChange={(e) => upd("voyage", e.target.value)}
            placeholder="e.g. FAI 2601"
          />
        </div>
      </div>

      {/* Related Fixtures */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Related Fixtures <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2 p-3 rounded-md border border-gray-200 bg-gray-50 min-h-[44px]">
          {FIXTURE_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFixture(f)}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                details.relatedFixtures.includes(f)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {details.relatedFixtures.length > 0 && (
          <p className="text-[11px] text-gray-400">
            Selected: {details.relatedFixtures.join(", ")}
          </p>
        )}
      </div>

      {/* Date of Incident + Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">
            Date of Incident <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            value={details.dateOfIncident}
            onChange={(e) => upd("dateOfIncident", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </Label>
          <Select value={details.location || "none"} onValueChange={(v) => upd("location", v === "none" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
            <SelectContent className="z-[600]">
              <SelectItem value="none">Select location</SelectItem>
              {LOCATION_OPTIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Damage as far as known */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Damage as Far as Known <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={details.damageKnown}
          onChange={(e) => upd("damageKnown", e.target.value)}
          placeholder="Describe the nature and extent of damage as currently known..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Steps taken so far */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Steps Taken So Far <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={details.stepsTaken}
          onChange={(e) => upd("stepsTaken", e.target.value)}
          placeholder="What actions have already been taken in response to this incident..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Required Assistance from Insurance */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Required Assistance from Insurance <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={details.assistanceRequired}
          onChange={(e) => upd("assistanceRequired", e.target.value)}
          placeholder="Specify what assistance or coverage is being sought from insurers..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Port Agent Details */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Port Agent Details
          <span className="ml-1.5 text-[10px] font-normal text-gray-400">(Recommended)</span>
        </Label>
        <Textarea
          value={details.portAgentDetails}
          onChange={(e) => upd("portAgentDetails", e.target.value)}
          placeholder="Port agent name, contact details, and any communications..."
          rows={2}
          className="resize-none"
        />
      </div>

      {/* PIC Legal */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          PIC Legal <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2 p-3 rounded-md border border-gray-200 bg-gray-50 min-h-[44px]">
          {LEGAL_USERS.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => toggleLegal(u)}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                details.picLegal.includes(u)
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Short Claim Description */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Short Claim Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={details.shortClaimDescription}
          onChange={(e) => upd("shortClaimDescription", e.target.value)}
          placeholder="Concise description of the claim for reporting and reference..."
          rows={3}
          className="resize-none"
        />
      </div>

    </div>
  );
}

// ─── Linked Incidents panel (the existing content) ────────────────────────────

function LinkedIncidentsPanel({
  allIncidents,
  setAllIncidents,
  linkedIds,
  setLinkedIds,
}: {
  allIncidents: Incident[];
  setAllIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  linkedIds: string[];
  setLinkedIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [linkSearch, setLinkSearch]           = useState("");
  const [isLinkOpen, setIsLinkOpen]           = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [editForm, setEditForm]               = useState<Incident | null>(null);
  const [openKebabId, setOpenKebabId]         = useState<string | null>(null);
  const [unassignId, setUnassignId]           = useState<string | null>(null);

  const linkedRecords = linkedIds
    .map((id) => allIncidents.find((i) => i.id === id))
    .filter(Boolean) as Incident[];

  const linkable = allIncidents.filter(
    (i) =>
      !linkedIds.includes(i.id) &&
      (i.id.toLowerCase().includes(linkSearch.toLowerCase()) ||
        i.title.toLowerCase().includes(linkSearch.toLowerCase()) ||
        i.vessel.toLowerCase().includes(linkSearch.toLowerCase()) ||
        i.incidentCategory.toLowerCase().includes(linkSearch.toLowerCase()))
  );

  const handleLink = (incident: Incident) => {
    setLinkedIds((prev) => [incident.id, ...prev]);
    setIsLinkOpen(false);
    setLinkSearch("");
  };

  const handleUnassign = () => {
    if (unassignId) {
      setLinkedIds((prev) => prev.filter((id) => id !== unassignId));
      setUnassignId(null);
    }
  };

  const openEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setEditForm({ ...incident });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    setAllIncidents((prev) => prev.map((i) => (i.id === editForm.id ? editForm : i)));
    setEditingIncident(null);
    setEditForm(null);
  };

  const updateEdit = (field: keyof Incident, value: string | string[]) => {
    setEditForm((f) => f ? { ...f, [field]: value } : f);
  };

  return (
    <>
      {/* Action bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <button
            onClick={() => setIsLinkOpen((v) => !v)}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Search className="size-4" />
            Link Incident
            <ChevronDown className="size-4 text-gray-400" />
          </button>

          {isLinkOpen && (
            <div className="absolute left-0 top-full mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by Incident No, title, vessel..."
                    value={linkSearch}
                    onChange={(e) => setLinkSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {linkable.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-400">No incidents available to link</div>
                ) : (
                  linkable.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => handleLink(i)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">{i.id}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${SEVERITY_STYLES[i.severity] ?? "bg-gray-100 text-gray-600"}`}>
                          {i.severity}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 font-medium mt-0.5">{i.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{i.vessel} · {i.date}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {isLinkOpen && (
          <div className="fixed inset-0 z-[199]" onClick={() => { setIsLinkOpen(false); setLinkSearch(""); }} />
        )}
      </div>

      {/* Cards */}
      {linkedRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-gray-400">
          <AlertTriangle className="size-10 opacity-30" />
          <p className="text-sm font-medium">No incidents linked yet</p>
          <p className="text-xs">Use "Link Incident" to associate incidents with this claim.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {linkedRecords.map((incident) => (
            <div
              key={incident.id}
              className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => openEdit(incident)}
            >
              {/* Kebab */}
              <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenKebabId(openKebabId === incident.id ? null : incident.id)}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <MoreVertical className="size-4" />
                </button>
                {openKebabId === incident.id && (
                  <>
                    <div className="fixed inset-0 z-[199]" onClick={() => setOpenKebabId(null)} />
                    <div className="absolute right-0 top-7 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] py-1">
                      <button
                        onClick={() => { setOpenKebabId(null); setUnassignId(incident.id); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Unassign
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Card header */}
              <div className="flex items-center gap-2 mb-3 pr-8">
                <span className="text-sm font-semibold text-gray-900">{incident.id}</span>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-violet-100 text-violet-700">
                  {incident.incidentCategory}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${SEVERITY_STYLES[incident.severity] ?? "bg-gray-100 text-gray-600"}`}>
                  {incident.severity}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_STYLES[incident.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {incident.status}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-800 mb-3 pr-8">{incident.title}</p>

              <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-[12px]">
                <div>
                  <span className="text-gray-400">Vessel</span>
                  <div className="text-gray-700 font-medium mt-0.5">{incident.vessel || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Date of Incident</span>
                  <div className="text-gray-700 font-medium mt-0.5">{incident.date || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Location</span>
                  <div className="text-gray-700 font-medium mt-0.5">
                    {incident.location ? `${incident.location}${incident.portCall ? ` — ${incident.portCall}` : ""}` : "—"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Class</span>
                  <div className="text-gray-700 font-medium mt-0.5">{incident.incidentClass || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Type</span>
                  <div className="text-gray-700 font-medium mt-0.5">{incident.type || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Voyage</span>
                  <div className="mt-0.5">
                    {incident.voyage
                      ? <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">{incident.voyage}</span>
                      : <span className="text-gray-700 font-medium">—</span>}
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-400">Related Fixtures</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {incident.fixtures && incident.fixtures.length > 0 ? (
                      incident.fixtures.map((f) => (
                        <span key={f} className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium text-[12px]">
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-700 font-medium">—</span>
                    )}
                  </div>
                </div>
              </div>

              {incident.shortDesc && (
                <p className="text-[12px] text-gray-500 mt-3 border-t border-gray-100 pt-2 truncate">
                  {incident.shortDesc}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Incident Edit Overlay */}
      {editingIncident && editForm && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[300]" onClick={() => { setEditingIncident(null); setEditForm(null); }} />
          <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.15)] z-[310] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Edit Incident</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editingIncident.id}</p>
              </div>
              <button
                onClick={() => { setEditingIncident(null); setEditForm(null); }}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3 flex-wrap shrink-0">
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-violet-100 text-violet-700">
                {editForm.incidentCategory}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${SEVERITY_STYLES[editForm.severity] ?? "bg-gray-100 text-gray-600"}`}>
                {editForm.severity}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_STYLES[editForm.status] ?? "bg-gray-100 text-gray-600"}`}>
                {editForm.status}
              </span>
              <span className="text-xs text-gray-500 ml-auto">{editForm.vessel}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Incident Number</Label>
                <Input value={editForm.id} disabled className="bg-gray-50 text-gray-500 font-medium" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Incident Title</Label>
                <Input value={editForm.title} onChange={(e) => updateEdit("title", e.target.value)} placeholder="Enter incident title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Vessel</Label>
                  <Select value={editForm.vessel} onValueChange={(v) => updateEdit("vessel", v)}>
                    <SelectTrigger><SelectValue placeholder="Select vessel" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {VESSELS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Voyage</Label>
                  <Input value={editForm.voyage} onChange={(e) => updateEdit("voyage", e.target.value)} placeholder="e.g. FAI 2601" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Date of Incident</Label>
                  <Input type="date" value={editForm.date} onChange={(e) => updateEdit("date", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <Select value={editForm.location} onValueChange={(v) => updateEdit("location", v)}>
                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {LOCATION_OPTIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(editForm.location === "Port" || editForm.location === "Anchorage") && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Port Call</Label>
                  <Input value={editForm.portCall} onChange={(e) => updateEdit("portCall", e.target.value)} placeholder="Enter port name" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Port of Loading</Label>
                  <Input value={editForm.pol} onChange={(e) => updateEdit("pol", e.target.value)} placeholder="e.g. Rotterdam" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Port of Discharge</Label>
                  <Input value={editForm.pod} onChange={(e) => updateEdit("pod", e.target.value)} placeholder="e.g. Singapore" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Incident Category</Label>
                  <Select value={editForm.incidentCategory} onValueChange={(v) => updateEdit("incidentCategory", v)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {INCIDENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Incident Class</Label>
                  <Select value={editForm.incidentClass} onValueChange={(v) => updateEdit("incidentClass", v)}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {INCIDENT_CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Incident Type</Label>
                <Input value={editForm.type} onChange={(e) => updateEdit("type", e.target.value)} placeholder="e.g. Container loss" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Severity</Label>
                  <Select value={editForm.severity} onValueChange={(v) => updateEdit("severity", v)}>
                    <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {SEVERITY_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Incident Status</Label>
                  <Select value={editForm.status} onValueChange={(v) => updateEdit("status", v)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Short Description</Label>
                <Input value={editForm.shortDesc} onChange={(e) => updateEdit("shortDesc", e.target.value)} placeholder="Brief summary of the incident" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Detailed Description</Label>
                <Textarea value={editForm.detailedDesc} onChange={(e) => updateEdit("detailedDesc", e.target.value)} placeholder="Full narrative of what happened..." rows={4} className="resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
              <button onClick={() => { setEditingIncident(null); setEditForm(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">Update Incident</button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Unassign Confirmation */}
      {unassignId && createPortal(
        <>
          <div className="fixed inset-0 bg-black/30 z-[400]" />
          <div className="fixed inset-0 flex items-center justify-center z-[410]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Unassign Incident</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to unassign this incident from the claim? The incident record itself will not be deleted.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setUnassignId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">No</button>
                <button onClick={handleUnassign} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors">Yes</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface IncidentsEmbeddedProps {
  claimId: string;
}

export function IncidentsEmbedded({ claimId }: IncidentsEmbeddedProps) {
  const [allIncidents, setAllIncidents] = useState<Incident[]>(SEED_INCIDENTS);

  const [linkedIds, setLinkedIds] = useState<string[]>(() => {
    const prelinked: Record<string, string[]> = {
      "1": ["INC-2024-120"],
      "2": ["INC-2024-145"],
      "4": ["INC-2024-089"],
      "6": ["INC-2024-201"],
      "7": ["INC-2024-167"],
      "8": ["INC-2023-445"],
      "10": ["INC-2024-178"],
    };
    return prelinked[claimId] ?? [];
  });

  return (
    <div className="p-6">
      <LinkedIncidentsPanel
        allIncidents={allIncidents}
        setAllIncidents={setAllIncidents}
        linkedIds={linkedIds}
        setLinkedIds={setLinkedIds}
      />
    </div>
  );
}
