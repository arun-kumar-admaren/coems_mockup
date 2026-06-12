import React, { useState, useMemo } from "react";
import { Plus, Trash2, Lock, RefreshCw } from "lucide-react";
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

interface CostEntry {
  id: string;
  description: string;
  amount: string;
  date: string;
  currency: string;
  fxRate: string;
  recoverableBy: string;
  recoverabilityStatus: string;
}

interface FinancialsState {
  // Claim Values
  claimEstimate: string;
  claimSize: string;
  claimSizeManual: boolean;
  settlementAmount: string;
  settlementCurrency: string;
  // Insurance Thresholds (deductible seeded from insurance module)
  deductible: string;
  // Recovery
  recoveryAmount: string;
  recoveryDate: string;
  // Cost Allocation
  costs: CostEntry[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENCIES = ["USD", "EUR", "GBP", "SGD", "AED", "Other"];

const CLAIM_SIZE_OPTIONS = [
  "Claim notification (below deductible)",
  "< USD 75k (small claim)",
  "USD 75k – 250k (big claim)",
  "> USD 250k (special claim)",
];

const RECOVERABLE_BY_OPTIONS = ["Insurance", "Client", "Counterparty", "Non-recoverable"];

const RECOVERABILITY_STATUS_OPTIONS = ["Pending", "Confirmed", "Rejected", "Recovered"];

// Deductible seeded from insurance module (read-only in this tab)
const SEED_DEDUCTIBLES: Record<string, number> = {
  "1": 15000,
  "2": 25000,
  "3": 10000,
  "4": 20000,
  "5": 15000,
  "6": 30000,
  "7": 25000,
  "8": 10000,
  "9": 20000,
  "10": 15000,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _costId = 1;
function genId() { return `cost-${Date.now()}-${_costId++}`; }

function deriveClaimSize(estimate: number, deductible: number): string {
  if (estimate <= 0) return "";
  if (deductible > 0 && estimate < deductible) return "Claim notification (below deductible)";
  if (estimate < 75000) return "< USD 75k (small claim)";
  if (estimate <= 250000) return "USD 75k – 250k (big claim)";
  return "> USD 250k (special claim)";
}

function fmt(val: number): string {
  if (!val && val !== 0) return "—";
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Seed data ────────────────────────────────────────────────────────────────

function buildSeed(claimId: string): FinancialsState {
  const deductible = SEED_DEDUCTIBLES[claimId] ?? 15000;

  const seeds: Record<string, Partial<FinancialsState>> = {
    "1": {
      claimEstimate: "185000",
      settlementAmount: "162500",
      settlementCurrency: "USD",
      recoveryAmount: "95000",
      recoveryDate: "2024-04-15",
      costs: [
        { id: "c1", description: "Marine survey fees", amount: "8500", date: "2024-02-22", currency: "USD", fxRate: "1.0000", recoverableBy: "Insurance", recoverabilityStatus: "Confirmed" },
        { id: "c2", description: "Legal & documentation fees", amount: "22000", date: "2024-03-10", currency: "USD", fxRate: "1.0000", recoverableBy: "Insurance", recoverabilityStatus: "Pending" },
        { id: "c3", description: "Emergency cargo handling", amount: "45000", date: "2024-02-18", currency: "USD", fxRate: "1.0000", recoverableBy: "Insurance", recoverabilityStatus: "Confirmed" },
      ],
    },
    "2": {
      claimEstimate: "95000",
      settlementAmount: "88000",
      settlementCurrency: "EUR",
      recoveryAmount: "0",
      costs: [
        { id: "c4", description: "Port damage assessment", amount: "5200", date: "2024-03-07", currency: "EUR", fxRate: "1.0820", recoverableBy: "Insurance", recoverabilityStatus: "Confirmed" },
        { id: "c5", description: "Repair supervision", amount: "12000", date: "2024-03-15", currency: "EUR", fxRate: "1.0820", recoverableBy: "Insurance", recoverabilityStatus: "Pending" },
      ],
    },
    "7": {
      claimEstimate: "320000",
      settlementAmount: "0",
      settlementCurrency: "USD",
      recoveryAmount: "0",
      costs: [
        { id: "c6", description: "Oil spill response & containment", amount: "85000", date: "2024-02-10", currency: "USD", fxRate: "1.0000", recoverableBy: "Insurance", recoverabilityStatus: "Confirmed" },
        { id: "c7", description: "Environmental consultant fees", amount: "28000", date: "2024-02-15", currency: "USD", fxRate: "1.0000", recoverableBy: "Insurance", recoverabilityStatus: "Confirmed" },
        { id: "c8", description: "Port authority fines", amount: "45000", date: "2024-02-20", currency: "USD", fxRate: "1.0000", recoverableBy: "Non-recoverable", recoverabilityStatus: "Confirmed" },
        { id: "c9", description: "P&I Club correspondent fees", amount: "18500", date: "2024-03-01", currency: "USD", fxRate: "1.0000", recoverableBy: "Insurance", recoverabilityStatus: "Pending" },
      ],
    },
  };

  const seed = seeds[claimId] ?? {};
  const estimate = parseFloat(seed.claimEstimate ?? "0") || 0;

  return {
    claimEstimate: "",
    claimSize: "",
    claimSizeManual: false,
    settlementAmount: "",
    settlementCurrency: "USD",
    deductible: String(deductible),
    recoveryAmount: "",
    recoveryDate: "",
    costs: [],
    ...seed,
    claimSize: deriveClaimSize(estimate, deductible),
    claimSizeManual: false,
  } as FinancialsState;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHead({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">{title}</h3>
  );
}

function ReadonlyField({ label, value, hint, highlight }: { label: string; value: string; hint?: string; highlight?: "green" | "red" | "amber" | "blue" }) {
  const colours: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-800",
    red:   "bg-red-50 border-red-200 text-red-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    blue:  "bg-blue-50 border-blue-200 text-blue-700",
  };
  const cls = highlight ? colours[highlight] : "bg-gray-50 border-gray-200 text-gray-700";
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
        {label}
        <Lock className="size-2.5 text-gray-300" />
      </Label>
      <div className={`flex items-center h-9 px-3 rounded-md border text-sm font-medium ${cls}`}>
        {value || "—"}
      </div>
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
    </div>
  );
}

function CurrencyInput({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">USD</span>
        <Input
          type="number"
          min="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "0.00"}
          className="pl-12 h-9 text-sm"
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface FinancialsEmbeddedProps {
  claimId: string;
}

export function FinancialsEmbedded({ claimId }: FinancialsEmbeddedProps) {
  const [state, setState] = useState<FinancialsState>(() => buildSeed(claimId));

  const set = (field: keyof FinancialsState, value: any) =>
    setState(prev => ({ ...prev, [field]: value }));

  // ── Business rules ────────────────────────────────────────────────────────

  const deductible = parseFloat(state.deductible) || 0;
  const estimate   = parseFloat(state.claimEstimate) || 0;
  const settlement = parseFloat(state.settlementAmount) || 0;
  const recovery   = parseFloat(state.recoveryAmount) || 0;

  const totalCosts = useMemo(
    () => state.costs.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0),
    [state.costs]
  );

  // Deductible exceeded: triggered by estimate OR settlement
  const deductibleExceeded = deductible > 0 && (estimate > deductible || settlement > deductible);

  // Summary calculations
  const total            = settlement + totalCosts;
  const netExposure      = settlement + totalCosts - recovery;
  const outstandingExp   = Math.max(0, (settlement + totalCosts) - recovery);
  const recoveryPct      = total > 0 ? (recovery / total) * 100 : 0;

  // Auto re-derive claim size when estimate changes (unless manually overridden)
  const handleEstimateChange = (val: string) => {
    set("claimEstimate", val);
    if (!state.claimSizeManual) {
      set("claimSize", deriveClaimSize(parseFloat(val) || 0, deductible));
    }
  };

  const handleClaimSizeChange = (val: string) => {
    setState(prev => ({ ...prev, claimSize: val, claimSizeManual: true }));
  };

  const resetClaimSize = () => {
    setState(prev => ({
      ...prev,
      claimSize: deriveClaimSize(parseFloat(prev.claimEstimate) || 0, deductible),
      claimSizeManual: false,
    }));
  };

  // Cost helpers
  const addCost = () => {
    const entry: CostEntry = {
      id: genId(),
      description: "",
      amount: "",
      date: "",
      currency: "USD",
      fxRate: "1.0000",
      recoverableBy: "Insurance",
      recoverabilityStatus: "Pending",
    };
    set("costs", [...state.costs, entry]);
  };

  const updateCost = (id: string, field: keyof CostEntry, value: string) =>
    set("costs", state.costs.map(c => c.id === id ? { ...c, [field]: value } : c));

  const removeCost = (id: string) =>
    set("costs", state.costs.filter(c => c.id !== id));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-8">

      {/* ── 1. Claim Values ─────────────────────────────────────────────── */}
      <div>
        <SectionHead title="Claim Values" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">

          {/* Claim Estimate */}
          <CurrencyInput label="Claim Estimate *" value={state.claimEstimate} onChange={handleEstimateChange} required />

          {/* Claim Size */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-600 flex items-center justify-between">
              <span>Claim Size<span className="text-red-400 ml-0.5">*</span></span>
              {state.claimSizeManual && (
                <button onClick={resetClaimSize} className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 font-normal">
                  <RefreshCw className="size-2.5" /> Auto-derive
                </button>
              )}
            </Label>
            <Select value={state.claimSize || "none"} onValueChange={handleClaimSizeChange}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select or auto-derive from estimate" /></SelectTrigger>
              <SelectContent className="z-[300]">
                <SelectItem value="none">Select size</SelectItem>
                {CLAIM_SIZE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {!state.claimSizeManual && state.claimSize && (
              <p className="text-[10px] text-blue-500">Auto-derived from Claim Estimate</p>
            )}
          </div>

          {/* Settlement Amount */}
          <CurrencyInput label="Settlement Amount *" value={state.settlementAmount} onChange={v => set("settlementAmount", v)} required />

          {/* Settlement Currency */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-600">Settlement Currency</Label>
            <Select value={state.settlementCurrency} onValueChange={v => set("settlementCurrency", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent className="z-[300]">
                {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {state.settlementCurrency !== "USD" && (
              <p className="text-[10px] text-amber-600">Non-USD currency — daily FX rate applied automatically by system</p>
            )}
          </div>

        </div>
      </div>

      {/* ── 2. Insurance Thresholds ──────────────────────────────────────── */}
      <div>
        <SectionHead title="Insurance Thresholds" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">

          <ReadonlyField
            label="Deductible (from Insurance)"
            value={deductible > 0 ? `USD ${fmt(deductible)}` : "—"}
            hint="Derived from linked insurance records. Edit in Insurance tab."
          />

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              Deductible Exceeded Flag
              <Lock className="size-2.5 text-gray-300" />
            </Label>
            <div className={`flex items-center h-9 px-3 rounded-md border text-sm font-semibold ${
              deductible === 0
                ? "bg-gray-50 border-gray-200 text-gray-400"
                : deductibleExceeded
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700"
            }`}>
              {deductible === 0 ? "No deductible set" : deductibleExceeded ? "Yes — Deductible exceeded" : "No — Within deductible"}
            </div>
            <p className="text-[10px] text-gray-400">
              Auto-set when Claim Estimate or Settlement Amount exceeds the deductible
            </p>
          </div>

        </div>
      </div>

      {/* ── 3. Cost Allocation ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Cost Allocation</h3>
          <button
            onClick={addCost}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="size-3.5" />
            Add Cost
          </button>
        </div>

        {state.costs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
            No costs recorded yet. Click "Add Cost" to begin.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1fr_1fr_80px_1fr_1fr_1fr_40px] gap-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              <span>Description *</span>
              <span>Amount *</span>
              <span>Date</span>
              <span>CCY</span>
              <span>FX Rate</span>
              <span>Recoverable By</span>
              <span>Rec. Status</span>
              <span></span>
            </div>

            {state.costs.map((cost) => (
              <div key={cost.id} className="grid grid-cols-[2fr_1fr_1fr_80px_1fr_1fr_1fr_40px] gap-2 items-center bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                <Input
                  value={cost.description}
                  onChange={e => updateCost(cost.id, "description", e.target.value)}
                  placeholder="Cost description"
                  className="h-8 text-xs bg-white"
                />
                <Input
                  type="number"
                  min="0"
                  value={cost.amount}
                  onChange={e => updateCost(cost.id, "amount", e.target.value)}
                  placeholder="0.00"
                  className="h-8 text-xs bg-white"
                />
                <Input
                  type="date"
                  value={cost.date}
                  onChange={e => updateCost(cost.id, "date", e.target.value)}
                  className="h-8 text-xs bg-white"
                />
                <Select value={cost.currency} onValueChange={v => updateCost(cost.id, "currency", v)}>
                  <SelectTrigger className="h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[300]">
                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={cost.fxRate}
                  onChange={e => updateCost(cost.id, "fxRate", e.target.value)}
                  placeholder="1.0000"
                  className="h-8 text-xs bg-white"
                />
                <Select value={cost.recoverableBy} onValueChange={v => updateCost(cost.id, "recoverableBy", v)}>
                  <SelectTrigger className="h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[300]">
                    {RECOVERABLE_BY_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={cost.recoverabilityStatus} onValueChange={v => updateCost(cost.id, "recoverabilityStatus", v)}>
                  <SelectTrigger className="h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[300]">
                    {RECOVERABILITY_STATUS_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => removeCost(cost.id)}
                  className="flex items-center justify-center h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}

            {/* Cost subtotal */}
            <div className="flex justify-end pt-1 pr-10">
              <span className="text-xs text-gray-500 mr-3">Total Costs:</span>
              <span className="text-sm font-semibold text-gray-900">USD {fmt(totalCosts)}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Recovery ─────────────────────────────────────────────────── */}
      <div>
        <SectionHead title="Recovery" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">

          <CurrencyInput label="Recovery Amount" value={state.recoveryAmount} onChange={v => set("recoveryAmount", v)} placeholder="Amount recovered" />

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-600">Recovery Date</Label>
            <Input
              type="date"
              value={state.recoveryDate}
              onChange={e => set("recoveryDate", e.target.value)}
              disabled={recovery === 0}
              className={`h-9 text-sm ${recovery === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {recovery === 0 && (
              <p className="text-[10px] text-gray-400">Enabled once Recovery Amount is entered</p>
            )}
          </div>

          <ReadonlyField
            label="Outstanding Exposure"
            value={`USD ${fmt(outstandingExp)}`}
            hint="(Settlement Amount + Total Costs) − Recovery Amount"
            highlight={outstandingExp > 0 ? "amber" : "green"}
          />

        </div>
      </div>

      {/* ── 5. Summary ──────────────────────────────────────────────────── */}
      <div>
        <SectionHead title="Summary" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Total</span>
            <span className="text-lg font-bold text-gray-900">USD {fmt(total)}</span>
            <p className="text-[10px] text-gray-400 mt-1">Settlement + Total Costs</p>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Total Costs</span>
            <span className="text-lg font-bold text-blue-700">USD {fmt(totalCosts)}</span>
            <p className="text-[10px] text-gray-400 mt-1">Sum of all cost entries</p>
          </div>

          <div className={`border rounded-lg p-4 ${netExposure > 0 ? "bg-amber-50/60 border-amber-100" : "bg-green-50/60 border-green-100"}`}>
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Net Exposure</span>
            <span className={`text-lg font-bold ${netExposure > 0 ? "text-amber-700" : "text-green-700"}`}>
              USD {fmt(netExposure)}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">Settlement + Costs − Recovery</p>
          </div>

          <div className={`border rounded-lg p-4 ${recoveryPct >= 80 ? "bg-green-50/60 border-green-100" : recoveryPct > 0 ? "bg-yellow-50/60 border-yellow-100" : "bg-gray-50 border-gray-200"}`}>
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Recovery %</span>
            <span className={`text-lg font-bold ${recoveryPct >= 80 ? "text-green-700" : recoveryPct > 0 ? "text-yellow-700" : "text-gray-500"}`}>
              {total > 0 ? `${recoveryPct.toFixed(1)}%` : "—"}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">Recovery ÷ Total</p>
          </div>
        </div>

        {/* Currency note */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
          <span className="text-xs font-semibold text-blue-700">USD</span>
          <span className="text-xs text-blue-600">
            All values displayed and reported in USD — original currency and FX rate stored per entry for full audit trail.
            Daily exchange rates applied automatically by system.
          </span>
        </div>
      </div>

    </div>
  );
}
