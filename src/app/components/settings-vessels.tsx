import { useState } from "react";
import { ChevronLeft, Search, Plus, MoreVertical, RefreshCw, X } from "lucide-react";
import { InsuranceEmbedded } from "./insurance-embedded";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vessel {
  id: number;
  name: string;
  abbreviation: string;
  vesselType: string;
  vesselClass: string;
  deadWeight: number | null;
  vesselIceClass: string;
  averageSpeed: number | null;
  maxSpeed: number | null;
  byConstructions: string;
  typeDetailed: string;
  design: string;
  loa: number | null;
  beam: number | null;
  lbp: number | null;
  depth: number | null;
  designDraught: number | null;
  imoNumber: string;
  category: string;
  tceDeltaThreshold: string;
  headquartersCommission: number;
  vesselStatus: string;
  defaultDraft: string;
  defaultSpeed: string;
  fuelPortIdle: string;
  fuelPortWorking: string;
  fuelEca: string;
  fuelNonEca: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const VESSELS: Vessel[] = [
  {
    id: 1, name: "MV OCEAN STAR", abbreviation: "OCS",
    vesselType: "Own Vessel Type", vesselClass: "Handymax",
    deadWeight: 52000, vesselIceClass: "None",
    averageSpeed: 14, maxSpeed: 15.5,
    byConstructions: "None", typeDetailed: "None", design: "None",
    loa: 190.0, beam: 32.2, lbp: 185.0, depth: 16.5, designDraught: 12.0,
    imoNumber: "IMO9234567", category: "Bulk Carrier",
    tceDeltaThreshold: "None", headquartersCommission: 0,
    vesselStatus: "Active", defaultDraft: "None", defaultSpeed: "None",
    fuelPortIdle: "None", fuelPortWorking: "None", fuelEca: "None", fuelNonEca: "None",
  },
  {
    id: 2, name: "MV PACIFIC VOYAGER", abbreviation: "PAV",
    vesselType: "Own Vessel Type", vesselClass: "Panamax",
    deadWeight: 75000, vesselIceClass: "None",
    averageSpeed: 13, maxSpeed: 14.5,
    byConstructions: "None", typeDetailed: "None", design: "None",
    loa: 225.0, beam: 32.3, lbp: 218.0, depth: 19.3, designDraught: 13.5,
    imoNumber: "IMO9345678", category: "Bulk Carrier",
    tceDeltaThreshold: "None", headquartersCommission: 0,
    vesselStatus: "Active", defaultDraft: "None", defaultSpeed: "None",
    fuelPortIdle: "None", fuelPortWorking: "None", fuelEca: "None", fuelNonEca: "None",
  },
  {
    id: 3, name: "MV ATLANTIC PRIDE", abbreviation: "ATP",
    vesselType: "Own Vessel Type", vesselClass: "Supramax",
    deadWeight: 58000, vesselIceClass: "None",
    averageSpeed: 13.5, maxSpeed: 15.0,
    byConstructions: "None", typeDetailed: "None", design: "None",
    loa: 197.0, beam: 32.0, lbp: 190.0, depth: 17.8, designDraught: 12.8,
    imoNumber: "IMO9456789", category: "Bulk Carrier",
    tceDeltaThreshold: "None", headquartersCommission: 0,
    vesselStatus: "Active", defaultDraft: "None", defaultSpeed: "None",
    fuelPortIdle: "None", fuelPortWorking: "None", fuelEca: "None", fuelNonEca: "None",
  },
  {
    id: 4, name: "MV NORTHERN LIGHT", abbreviation: "NLT",
    vesselType: "External Vessel Type", vesselClass: "Handysize",
    deadWeight: 32000, vesselIceClass: "1A",
    averageSpeed: 12.5, maxSpeed: 14.0,
    byConstructions: "None", typeDetailed: "None", design: "None",
    loa: 172.0, beam: 27.5, lbp: 165.0, depth: 14.0, designDraught: 9.8,
    imoNumber: "IMO9567890", category: "General Cargo",
    tceDeltaThreshold: "None", headquartersCommission: 0,
    vesselStatus: "Active", defaultDraft: "None", defaultSpeed: "None",
    fuelPortIdle: "None", fuelPortWorking: "None", fuelEca: "None", fuelNonEca: "None",
  },
  {
    id: 5, name: "HLS DIAMOND", abbreviation: "HLSD",
    vesselType: "Own Vessel Type", vesselClass: "Ultramax",
    deadWeight: 63000, vesselIceClass: "None",
    averageSpeed: 14.5, maxSpeed: 16.0,
    byConstructions: "None", typeDetailed: "None", design: "None",
    loa: 199.9, beam: 32.26, lbp: 194.0, depth: 18.6, designDraught: 13.0,
    imoNumber: "IMO9678901", category: "Bulk Carrier",
    tceDeltaThreshold: "None", headquartersCommission: 0,
    vesselStatus: "Active", defaultDraft: "None", defaultSpeed: "None",
    fuelPortIdle: "None", fuelPortWorking: "None", fuelEca: "None", fuelNonEca: "None",
  },
  {
    id: 6, name: "MV GULF NAVIGATOR", abbreviation: "GNV",
    vesselType: "External Vessel Type", vesselClass: "Handymax",
    deadWeight: 48000, vesselIceClass: "None",
    averageSpeed: 13, maxSpeed: 14.5,
    byConstructions: "None", typeDetailed: "None", design: "None",
    loa: 185.0, beam: 30.4, lbp: 180.0, depth: 15.8, designDraught: 11.5,
    imoNumber: "IMO9789012", category: "Bulk Carrier",
    tceDeltaThreshold: "None", headquartersCommission: 0,
    vesselStatus: "Inactive", defaultDraft: "None", defaultSpeed: "None",
    fuelPortIdle: "None", fuelPortWorking: "None", fuelEca: "None", fuelNonEca: "None",
  },
];

// ─── Vessel Detail Overlay ─────────────────────────────────────────────────────

const VESSEL_TABS = [
  "Vessel Details", "Capacity", "Hold / hatches",
  "Permissible Loads", "Speed & Consumption",
  "Technical Details", "Vessel Cost", "Insurance",
];

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <div className="text-[12px] text-gray-400 mb-0.5">{label}</div>
      <div className="text-[13px] text-gray-800 font-medium">{value ?? "None"}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[13px] font-semibold text-gray-900 mt-6 mb-3">{children}</h4>
  );
}

interface VesselDetailProps {
  vessel: Vessel;
  onClose: () => void;
}

function VesselDetail({ vessel, onClose }: VesselDetailProps) {
  const [activeTab, setActiveTab] = useState("Vessel Details");

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/5 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-[860px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 flex flex-col animate-in slide-in-from-right duration-300">

        {/* Top action bar */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200 text-gray-400 shrink-0">
          <div className="flex items-center gap-4">
            <button className="hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors">
              <MoreVertical className="size-4" />
            </button>
            <button className="hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors">
              <RefreshCw className="size-4" />
            </button>
          </div>
          <button onClick={onClose} className="hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Header */}
        <div className="px-6 pt-5 pb-0 shrink-0">
          <div className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">Vessel Name:</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {vessel.name} ({vessel.abbreviation})
          </h1>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px] mb-5">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-28 shrink-0">Category</span>
              <span className="text-gray-400 mr-1">:</span>
              <span className="text-gray-800 font-medium">{vessel.category || "None"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-28 shrink-0">Vessel Type</span>
              <span className="text-gray-400 mr-1">:</span>
              <span className="text-blue-600 font-medium">{vessel.vesselType}</span>
            </div>
          </div>

          {/* Tab bar */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-5 overflow-x-auto">
              {VESSEL_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[13px] font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffd700]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Vessel Details tab ─────────────────────────────────────────── */}
          {activeTab === "Vessel Details" && (
            <div className="p-6 text-[13px]">
              <SectionLabel>Vessel Details</SectionLabel>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <Field label="IMO Number" value={vessel.imoNumber || "None"} />
                <Field label="Category" value={vessel.category || "None"} />
                <Field label="Vessel Name" value={vessel.name} />
                <Field label="Abbreviation" value={vessel.abbreviation} />
                <Field label="Vessel Type" value={vessel.vesselType} />
                <Field label="TCE Delta Threshold" value={vessel.tceDeltaThreshold} />
              </div>

              <SectionLabel>Default Values</SectionLabel>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <Field label="Headquarters Commission" value={vessel.headquartersCommission} />
                <Field label="Vessel Status" value={vessel.vesselStatus} />
                <Field label="Default Draft" value={vessel.defaultDraft} />
                <Field label="Default Speed" value={vessel.defaultSpeed} />
              </div>

              <SectionLabel>Preferred Fuels</SectionLabel>
              <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                <Field label="Port Idle" value={vessel.fuelPortIdle} />
                <Field label="Port Working" value={vessel.fuelPortWorking} />
                <Field label="ECA" value={vessel.fuelEca} />
                <Field label="Non ECA" value={vessel.fuelNonEca} />
              </div>

              <SectionLabel>Dimensions</SectionLabel>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <Field label="LOA" value={vessel.loa} />
                <Field label="Beam" value={vessel.beam} />
                <Field label="LBP" value={vessel.lbp} />
                <Field label="Depth" value={vessel.depth} />
                <Field label="Design Draught" value={vessel.designDraught} />
                <Field label="Dead Weight" value={vessel.deadWeight} />
                <Field label="Class" value={vessel.vesselClass} />
                <Field label="ICE Class" value={vessel.vesselIceClass || "None"} />
                <Field label="By Constructions" value={vessel.byConstructions} />
                <Field label="Maximum Speed" value={vessel.maxSpeed} />
                <Field label="Type Details" value={vessel.typeDetailed} />
                <Field label="Design" value={vessel.design} />
              </div>
            </div>
          )}

          {/* ── Insurance tab ──────────────────────────────────────────────── */}
          {activeTab === "Insurance" && (
            <InsuranceEmbedded moduleType="Vessel" moduleId={vessel.name} />
          )}

          {/* ── Placeholder tabs ───────────────────────────────────────────── */}
          {["Capacity", "Hold / hatches", "Permissible Loads", "Speed & Consumption", "Technical Details", "Vessel Cost"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-sm font-medium">{activeTab}</p>
              <p className="text-xs mt-1">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Vessels Listing ──────────────────────────────────────────────────────────

interface SettingsVesselsProps {
  onBack: () => void;
}

export function SettingsVessels({ onBack }: SettingsVesselsProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Vessel | null>(null);

  const filtered = VESSELS.filter((v) =>
    !search ||
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
    v.vesselType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white relative">

      {/* Top bar */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Own Vessel</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 h-8 border border-gray-200 rounded text-[13px] bg-white focus:outline-none focus:border-blue-400 w-52"
              />
            </div>
            <button className="flex items-center gap-1.5 border border-gray-200 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 h-8 rounded text-[13px] font-medium transition-colors">
              <Plus className="size-3.5" />
              Add Filter
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-4 h-8 rounded text-[13px] font-semibold transition-colors">
              Add New Vessel
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <MoreVertical className="size-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
              <th className="px-4 py-3 w-16">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Abbreviation</th>
              <th className="px-4 py-3">Vessel Type</th>
              <th className="px-4 py-3">Vessel Class</th>
              <th className="px-4 py-3 text-right">Dead Weight</th>
              <th className="px-4 py-3">Vessel ICE Class</th>
              <th className="px-4 py-3 text-right">Average Speed</th>
              <th className="px-4 py-3 text-right">Max Speed</th>
              <th className="px-4 py-3 text-right">LOA</th>
              <th className="px-4 py-3 text-right">Beam</th>
              <th className="px-4 py-3 text-right">LBP</th>
              <th className="px-4 py-3 text-right">Depth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[13px]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-12 text-center text-gray-400 text-sm">
                  No vessels found
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr
                  key={v.id}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  onClick={() => setSelected(v)}
                >
                  <td className="px-4 py-2.5 text-blue-600 font-medium">{v.id}</td>
                  <td className="px-4 py-2.5 font-semibold text-blue-600 group-hover:underline whitespace-nowrap">{v.name}</td>
                  <td className="px-4 py-2.5 text-gray-700">{v.abbreviation}</td>
                  <td className="px-4 py-2.5 text-blue-500">{v.vesselType}</td>
                  <td className="px-4 py-2.5 text-gray-600">{v.vesselClass || "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-right">{v.deadWeight?.toLocaleString() ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600">{v.vesselIceClass || "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-right">{v.averageSpeed ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-right">{v.maxSpeed ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-right">{v.loa ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-right">{v.beam ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-right">{v.lbp ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-right">{v.depth ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between text-[12px] text-gray-500 bg-gray-50/60">
        <span>Found <span className="font-medium text-gray-700">{filtered.length}</span> records</span>
        <div className="flex items-center gap-3">
          <span>Page 1 of 1</span>
          <span>Items per page:</span>
          <select className="border border-gray-200 rounded text-[12px] px-1 py-0.5">
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>

      {/* Vessel detail overlay */}
      {selected && (
        <VesselDetail vessel={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
