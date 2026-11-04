import { useState } from "react";
import {
  X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Maximize2,
  MoreVertical, Download, List, Settings,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VoyageEstimateDetailProps {
  estimate: { number: string; name: string; vessel: string };
  onClose: () => void;
}

interface ParticularRow {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}

interface BunkerRow {
  fuel: string;
  rate: string;
  cons: string;
  cost: string;
}

interface PortCallEntry {
  port: string;
  window: string;
  laycan?: string;
  amount: string;
  badge: string;
  legDistance?: string;
  legSpeed?: string;
  legDraft?: string;
  legFuel?: string;
  legExtra?: string;
  legAmount?: string;
  legBadge?: string;
}

interface LinkedFixtureCard {
  number: string;
  tag: string;
  ports: string[];
  amount: string;
  delta: string;
}

// ─── Mock data (static — mirrors a real Voyage Estimate workspace) ──────────

const OPEN_TABS = [
  "EST-2026-1151", "EST-2026-1108-1", "EST-2026-1131-1", "EST-2026-1141-2",
  "EST-2026-1142-2", "EST-2026-1143", "EST-2026-1140-2", "EST-2026-1144-2",
  "EST-2026-1096-5", "EST-2026-1099",
];

const PARTICULARS: ParticularRow[] = [
  { label: "Gross Freight", value: "$ 32,185,558" },
  { label: "Additional Income", value: "$ 330,070" },
  { label: "Detention Demurrage", value: "$ 56,000" },
  { label: "Commissions", value: "$ -13,078,213" },
  { label: "Port Cost", value: "$ 911,679" },
  { label: "Bunker Expense", value: "$ -135,133" },
  { label: "Additional Expense", value: "$ -138,220" },
  { label: "EU ETS Cost", value: "$ -317,807" },
  { label: "Fuel EU Penalty", value: "$ -15,781,163" },
  { label: "Total Income", value: "$ 34,128,907", color: "text-emerald-600" },
  { label: "Total Expense", value: "$ -30,096,138", color: "text-red-500" },
  { label: "Result", value: "$ 4,032,769", bold: true },
  { label: "TCE", value: "$ 26,440", bold: true },
  { label: "Running Cost", value: "$ -823,643" },
  { label: "Profit/Loss", value: "$ 3,209,126", color: "text-emerald-600" },
];

const BUNKERS: BunkerRow[] = [
  { fuel: "VLSFO", rate: "$100", cons: "478mt", cost: "$ 47,848" },
  { fuel: "MGO", rate: "$200", cons: "436mt", cost: "$ 87,285" },
];

const EU_ETS_ROWS = [
  { label: "Total Emission", value: "2,889 tCO2" },
  { label: "Compliance Balance", value: "3,156,232,615 gCO2eq" },
  { label: "Total Emission Cost", value: "$ -317,807" },
  { label: "Fuel EU Compliance Balance", value: "" },
];

const LINKED_FIXTURES: LinkedFixtureCard[] = [
  { number: "UES-F-2026-1353", tag: "FLOATING CARGO", ports: ["Durban", "Cape Town", "Monrovia", "Luanda"], amount: "$1,309,672 / $ -435,838", delta: "727,122l/s" },
  { number: "CR-2026-1354", tag: "BREAKBULK & ...", ports: ["Lisboa", "Syros Island", "Jeddah", "Mogadishu"], amount: "$ 31,256,893 / $ -12,788,838", delta: "$30,530,354" },
  { number: "CR-2026-1355", tag: "FLOATING CARGO", ports: ["Durban", "Cape Town", "Luanda", "Monrovia"], amount: "$1,562,342 / $ -622,358", delta: "811,062l/s" },
];

const PORT_CALLS: PortCallEntry[] = [
  { port: "Aalesund", window: "MON 17-05-2027 02:00", amount: "$ 0", badge: "0" },
  {
    port: "Lisboa", window: "SUN 23-05-2027 18:27 - SAT 29-05-2027 18:27", amount: "$ -44,150", badge: "1",
    legDistance: "1768.34 nm", legSpeed: "6.73", legDraft: "9.2 m", legFuel: "11.5 kn", legExtra: "5 %", legAmount: "$ 0", legBadge: "0",
  },
  {
    port: "Syros Island", window: "SAT 05-06-2027 19:07 - FRI 11-06-2027 19:07", amount: "$ -62,250", badge: "1",
    legDistance: "1825.57 nm", legSpeed: "6.95", legDraft: "9.2 m", legFuel: "11.5 kn", legExtra: "5 %", legAmount: "$ 17,425", legBadge: "16.04mt | 79.108mt",
  },
  {
    port: "Suez Canal", window: "MON 14-06-2027 01:18 - TUE 15-06-2027 01:18", amount: "$ -15,000", badge: "0",
    legDistance: "604.40 nm", legSpeed: "2.3", legDraft: "9.2 m", legFuel: "11.5 kn", legExtra: "5 %", legAmount: "$ 6,032", legBadge: "2.684mt | 28.817mt",
  },
  {
    port: "Jeddah", window: "THU 17-06-2027 13:20 - WED 23-06-2027 13:20", amount: "$ -38,500", badge: "1",
    legDistance: "646.73 nm", legSpeed: "2.46", legDraft: "9.2 m", legFuel: "11.5 kn", legExtra: "5 %", legAmount: "$ 3,371", legBadge: "33.707mt | 0mt",
  },
  {
    port: "Mogadishu", window: "WED 30-06-2027 15:14 - SUN 04-07-2027 15:14", amount: "$ -42,500", badge: "1",
    legDistance: "1860.99 nm", legSpeed: "7.08", legDraft: "9.2 m", legFuel: "11.5 kn", legExtra: "5 %", legAmount: "$ 9,699", legBadge: "96.994mt | 0mt",
  },
  {
    port: "Durban", window: "MON 12-07-2027 15:31 - FRI 30-07-2027 03:31", amount: "$ -62,300", badge: "2",
    legDistance: "2117.06 nm", legSpeed: "8.05", legDraft: "9.2 m", legFuel: "11.5 kn", legExtra: "5 %", legAmount: "$ 11,034", legBadge: "110.34mt | 0mt",
  },
  {
    port: "Cape Town", window: "MON 02-08-2027 09:04 - FRI 13-08-2027 21:04", amount: "$ -126,300", badge: "2",
    legDistance: "849.50 nm", legSpeed: "3.23", legDraft: "9.2 m", legFuel: "11.5 kn", legExtra: "5 %", legAmount: "$ 4,428", legBadge: "44.276mt | 0mt",
  },
];

const PORT_INCOME_EXPENSE = [
  { port: "Lisboa", amount: "$ 67,950" },
  { port: "Syros Island", amount: "$ 92,850" },
  { port: "Suez Canal", amount: "$ -15,000" },
  { port: "Jeddah", amount: "$ 82,069" },
  { port: "Mogadishu", amount: "$ 85,500" },
  { port: "Durban", amount: "$ 180,310" },
  { port: "Cape Town", amount: "$ 110,800" },
  { port: "Luanda", amount: "$ 100,400" },
];

const MAP_PINS = [
  { label: "1", name: "Aalesund", x: 24, y: 14 },
  { label: "2", name: "Lisboa", x: 21, y: 40 },
  { label: "3", name: "Syros Island", x: 29, y: 40 },
  { label: "4", name: "Suez Canal", x: 33, y: 43 },
  { label: "5", name: "Jeddah", x: 35, y: 47 },
  { label: "10", name: "Monrovia", x: 20, y: 55 },
  { label: "6", name: "Mogadishu", x: 41, y: 58 },
  { label: "9", name: "Luanda", x: 27, y: 65 },
  { label: "7", name: "Durban", x: 37, y: 76 },
  { label: "8", name: "Cape Town", x: 32, y: 80 },
];

// ─── Small pieces ─────────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] text-gray-400">{label}</span>
      <div className="text-[13px] text-gray-800 font-medium truncate">{children}</div>
    </div>
  );
}

function MapPane() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#cfe8f3]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
        <path d="M5,20 Q20,5 40,10 T70,15 L85,25 L80,40 L60,35 L45,45 L30,40 L15,50 Z" fill="#a9d6a9" />
        <path d="M15,55 Q25,50 35,60 L45,75 L38,90 L22,88 L12,70 Z" fill="#a9d6a9" />
        <path d="M55,50 Q70,45 82,55 L88,70 L70,78 L58,65 Z" fill="#e0d7a8" />
      </svg>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <polyline
          points={MAP_PINS.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#dc2626"
          strokeWidth="0.6"
          strokeDasharray="1.5,1"
        />
      </svg>
      {MAP_PINS.map((p) => (
        <div
          key={p.name}
          title={p.name}
          className="absolute flex items-center gap-1 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="flex items-center justify-center size-4 rounded-full bg-blue-700 text-white text-[9px] font-bold shadow">
            {p.label}
          </span>
          <span className="text-[10px] font-medium text-gray-700 bg-white/80 rounded px-1 whitespace-nowrap">{p.name}</span>
        </div>
      ))}
    </div>
  );
}

function LinkedFixtureCards() {
  return (
    <div className="absolute top-3 right-3 w-64 space-y-2">
      {LINKED_FIXTURES.map((f) => (
        <div key={f.number} className="bg-white rounded-md shadow-md border border-gray-200 p-2.5 text-[11px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-blue-700 truncate">{f.number}</span>
            <span className="flex items-center justify-center size-4 rounded-full bg-gray-800 text-white text-[9px] font-bold flex-shrink-0">JE</span>
          </div>
          <div className="space-y-0.5 text-gray-600">
            {f.ports.map((port, i) => (
              <div key={port} className="flex items-center gap-1">
                <span className="text-gray-400">{i === 0 ? "↑" : i === f.ports.length - 1 ? "↓" : "•"}</span>
                {port}
              </div>
            ))}
          </div>
          <span className="inline-block mt-1.5 rounded bg-cyan-100 text-cyan-800 text-[9px] font-semibold px-1.5 py-0.5">{f.tag}</span>
          <div className="mt-1.5 flex items-center justify-between text-gray-500">
            <span>{f.delta}</span>
            <span className="font-medium text-gray-700">{f.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ParticularsPanel() {
  return (
    <div className="overflow-y-auto h-full p-3 text-[12px]">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-200">
            <th className="pb-1.5 font-medium">Particulars</th>
            <th className="pb-1.5 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {PARTICULARS.map((row) => (
            <tr key={row.label} className="border-b border-gray-50">
              <td className={`py-1.5 ${row.bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>{row.label}</td>
              <td className={`py-1.5 text-right ${row.bold ? "font-semibold text-gray-900" : row.color ?? "text-gray-700"}`}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-[12px] font-semibold text-gray-800 mt-4 mb-1.5">Bunker</p>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-200">
            <th className="pb-1.5 font-medium">Fuel</th>
            <th className="pb-1.5 font-medium text-right">Rate</th>
            <th className="pb-1.5 font-medium text-right">Cons</th>
            <th className="pb-1.5 font-medium text-right">Cost</th>
          </tr>
        </thead>
        <tbody>
          {BUNKERS.map((b) => (
            <tr key={b.fuel} className="border-b border-gray-50">
              <td className="py-1.5 text-gray-600">{b.fuel}</td>
              <td className="py-1.5 text-right text-gray-700">{b.rate}</td>
              <td className="py-1.5 text-right text-gray-700">{b.cons}</td>
              <td className="py-1.5 text-right text-gray-700">{b.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-[12px] font-semibold text-gray-800 mt-4 mb-1.5">EU ETS Emissions</p>
      <div className="space-y-1">
        {EU_ETS_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-gray-600">
            <span>{row.label}</span>
            <span className="text-gray-700">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortCallsTable() {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [canals, setCanals] = useState({ suez: true, kiel: true, panama: true });
  const toggle = (port: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(port)) next.delete(port);
      else next.add(port);
      return next;
    });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 flex-shrink-0 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-600">Assign Port Calls</span>
          <Settings className="size-3.5 text-gray-400" />
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          {(["Suez Canal", "Kiel Canal", "Panama Canal"] as const).map((c) => {
            const key = c.split(" ")[0].toLowerCase() as keyof typeof canals;
            return (
              <label key={c} className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={canals[key]} onChange={() => setCanals((p) => ({ ...p, [key]: !p[key] }))} className="accent-blue-600" />
                {c}
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 px-3 py-1.5 text-[11px] text-blue-600 border-b border-gray-100 flex-shrink-0">
        <button onClick={() => setCollapsed(new Set())}>Expand All</button>
        <button onClick={() => setCollapsed(new Set(PORT_CALLS.map((p) => p.port)))}>Collapse All</button>
      </div>
      <div className="flex-1 overflow-y-auto text-[11px]">
        {PORT_CALLS.map((call) => {
          const isOpen = !collapsed.has(call.port);
          return (
            <div key={call.port} className="border-b border-gray-100">
              <button onClick={() => toggle(call.port)} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left">
                {isOpen ? <ChevronUp className="size-3 text-gray-400 flex-shrink-0" /> : <ChevronDown className="size-3 text-gray-400 flex-shrink-0" />}
                <span className="font-medium text-gray-800 w-24 truncate flex-shrink-0">{call.port}</span>
                <span className="text-gray-400 flex-1 truncate">{call.window}</span>
                <span className="flex items-center justify-center size-4 rounded-full bg-gray-200 text-gray-600 text-[9px] font-semibold flex-shrink-0">{call.badge}</span>
                <span className="w-20 text-right text-gray-700 flex-shrink-0">{call.amount}</span>
              </button>
              {isOpen && call.legDistance && (
                <div className="flex items-center gap-3 px-3 pb-1.5 pl-8 text-gray-400">
                  <span className="w-20 flex-shrink-0">{call.legDistance}</span>
                  <span>{call.legSpeed}</span>
                  <span>{call.legDraft}</span>
                  <span>{call.legFuel}</span>
                  <span>{call.legExtra}</span>
                  <span className="flex-1 text-right">{call.legBadge}</span>
                  <span className="w-16 text-right text-gray-600">{call.legAmount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PortIncomeExpensePanel() {
  const [activeTab, setActiveTab] = useState<"Port" | "Cargo" | "Voyage" | "Emission">("Port");
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-4 px-3 py-2 border-b border-gray-200 flex-shrink-0 text-[12px]">
        {(["Port", "Cargo", "Voyage", "Emission"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === t ? "border-gray-900 text-gray-900 font-medium" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "Port" ? (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-200">
                <th className="pb-1.5 font-medium">Port</th>
                <th className="pb-1.5 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {PORT_INCOME_EXPENSE.map((row) => (
                <tr key={row.port} className="border-b border-gray-50">
                  <td className="py-2 text-blue-700 font-medium">{row.port}</td>
                  <td className="py-2 text-right text-gray-700">Subtotal &nbsp; {row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <List className="size-6 text-gray-300 mb-2" />
            <p className="text-[12px] text-gray-400">{activeTab} breakdown isn't part of this MVP yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────

export function VoyageEstimateDetail({ estimate, onClose }: VoyageEstimateDetailProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[300]" onClick={onClose} />
      <div className="fixed inset-4 lg:inset-10 bg-white rounded-lg shadow-2xl z-[310] flex flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50 text-[12.5px] flex-shrink-0 overflow-x-auto">
          <button onClick={onClose} title="Close" className="px-3 py-2.5 text-gray-400 hover:text-gray-700 flex-shrink-0">
            <X className="size-3.5" />
          </button>
          <button className="px-3 py-2.5 text-gray-500 border-r border-gray-200 whitespace-nowrap flex-shrink-0">All Estimates</button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 flex-shrink-0"><ChevronLeft className="size-3.5" /></button>
          {OPEN_TABS.map((t) => {
            const active = t === estimate.number;
            return (
              <div
                key={t}
                className={`flex items-center gap-1.5 px-3 py-2.5 border-r border-gray-200 whitespace-nowrap flex-shrink-0 ${
                  active ? "bg-white text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {t}
                {active && <ChevronDown className="size-3" />}
                <X className="size-3 text-gray-300 hover:text-gray-600" />
              </div>
            );
          })}
          <button className="p-1.5 text-gray-400 hover:text-gray-600 flex-shrink-0 ml-auto mr-2"><ChevronRight className="size-3.5" /></button>
        </div>

        {/* Header field row */}
        <div className="flex items-center gap-5 px-4 py-2 border-b border-gray-200 flex-shrink-0 flex-wrap text-[12px]">
          <FieldGroup label="Estimate Name">{estimate.name}</FieldGroup>
          <FieldGroup label="Vessel">{estimate.vessel}</FieldGroup>
          <FieldGroup label="Start Date">17/05/2027</FieldGroup>
          <FieldGroup label="Status">Preplanning</FieldGroup>
          <FieldGroup label="Previous Voyage">STE 2602</FieldGroup>
          <FieldGroup label="EU ETS">$ 110</FieldGroup>
          <FieldGroup label="Running Cost">$ 5,400</FieldGroup>

          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            <FieldGroup label="VLSFO">$ 100</FieldGroup>
            <FieldGroup label="MGO">$ 200</FieldGroup>
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 rounded px-2 py-1">EU ETS</span>
            <span className="text-[10px] font-semibold text-white bg-red-500 rounded px-2 py-1">FUEL EU</span>
            <button className="text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 rounded px-3 py-1.5 whitespace-nowrap">Target TCE &amp; P/L</button>
            <button className="text-[12px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded px-3 py-1.5">Result</button>
            <button className="text-[12px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded px-3 py-1.5 whitespace-nowrap">Review Checklist</button>
            <button title="Download" className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Download className="size-4" /></button>
            <button title="More" className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><MoreVertical className="size-4" /></button>
          </div>
        </div>

        {/* Main 2x2 content area */}
        <div className="flex-1 grid grid-cols-2 overflow-hidden" style={{ gridTemplateRows: "55% 45%" }}>
          <div className="relative border-r border-b border-gray-200 overflow-hidden">
            <MapPane />
            <LinkedFixtureCards />
          </div>
          <div className="border-b border-gray-200 overflow-hidden">
            <ParticularsPanel />
          </div>
          <div className="border-r border-gray-200 overflow-hidden">
            <PortCallsTable />
          </div>
          <div className="overflow-hidden">
            <PortIncomeExpensePanel />
          </div>
        </div>
      </div>
    </>
  );
}
