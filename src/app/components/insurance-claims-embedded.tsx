import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Search, MoreVertical, ChevronDown, ChevronRight, X, FileSearch } from "lucide-react";
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

interface InsuranceRecord {
  id: string;
  typeOfCover: string;
  policyNumber: string;
  leadingInsurer: string;
  broker: string;
  brokerRef: string;
  coverFrom: string;
  coverTo: string;
  currency: string;
  deductible: number;
  limitOfLiability: number;
  sumInsured: number;
  status: string;
  remarks: string;
}

interface CoverageDetail {
  coverageConfirmed: string;
  coverageDecisionDate: string;
  coverageDecisionRemarks: string;
  coveredScope: string;
  coveragePercentage: string;
  coverageLimitApplied: string;
  deductibleApplies: string;
  deductibleExceeded: string;
  insurerResponseStatus: string;
  dateSentToInsurer: string;
  insurerContactPerson: string;
  brokerContactPerson: string;
  requiresFollowup: string;
  nextFollowupDate: string;
  followupNote: string;
  primaryInsurance: string;
  activeLink: string;
  decisionAttachmentAvailable: string;
  decisionDocumentReference: string;
  internalNotes: string;
}

const DEFAULT_COVERAGE: CoverageDetail = {
  coverageConfirmed: "Pending",
  coverageDecisionDate: "",
  coverageDecisionRemarks: "",
  coveredScope: "",
  coveragePercentage: "",
  coverageLimitApplied: "",
  deductibleApplies: "Yes",
  deductibleExceeded: "",
  insurerResponseStatus: "Not Sent",
  dateSentToInsurer: "",
  insurerContactPerson: "",
  brokerContactPerson: "",
  requiresFollowup: "No",
  nextFollowupDate: "",
  followupNote: "",
  primaryInsurance: "No",
  activeLink: "Yes",
  decisionAttachmentAvailable: "No",
  decisionDocumentReference: "",
  internalNotes: "",
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_INSURANCE: InsuranceRecord[] = [
  {
    id: "INS-2024-001",
    typeOfCover: "Hull and machinery (H&M)",
    policyNumber: "POL-HM-2024-0912",
    leadingInsurer: "Lloyd's of London",
    broker: "Marsh Marine",
    brokerRef: "MMB-2024-1120",
    coverFrom: "2024-01-01",
    coverTo: "2024-12-31",
    currency: "USD",
    deductible: 50000,
    limitOfLiability: 5000000,
    sumInsured: 8000000,
    status: "Active",
    remarks: "Full H&M cover for fleet vessels.",
  },
  {
    id: "INS-2024-002",
    typeOfCover: "Protection & Indemnity (P&I)",
    policyNumber: "POL-PI-2024-0345",
    leadingInsurer: "Gard P&I Club",
    broker: "AON Marine",
    brokerRef: "AON-2024-0891",
    coverFrom: "2024-02-01",
    coverTo: "2025-01-31",
    currency: "USD",
    deductible: 25000,
    limitOfLiability: 10000000,
    sumInsured: 0,
    status: "Active",
    remarks: "Club entry — P&I coverage for crew and cargo liabilities.",
  },
  {
    id: "INS-2024-003",
    typeOfCover: "Charterer's liability (CL)",
    policyNumber: "POL-CL-2024-0671",
    leadingInsurer: "Britannia P&I",
    broker: "Maritime Insurance Brokers",
    brokerRef: "MIB-2024-0567",
    coverFrom: "2024-03-01",
    coverTo: "2024-08-31",
    currency: "USD",
    deductible: 10000,
    limitOfLiability: 2000000,
    sumInsured: 2000000,
    status: "Expired",
    remarks: "Charterer's liability for voyage charter.",
  },
  {
    id: "INS-2024-004",
    typeOfCover: "Cargo",
    policyNumber: "POL-CG-2024-1089",
    leadingInsurer: "Swiss Re Marine",
    broker: "Willis Towers Watson",
    brokerRef: "WTW-2024-2201",
    coverFrom: "2024-04-01",
    coverTo: "2025-03-31",
    currency: "USD",
    deductible: 5000,
    limitOfLiability: 3000000,
    sumInsured: 3000000,
    status: "Active",
    remarks: "All-risk cargo cover per voyage.",
  },
  {
    id: "INS-2024-005",
    typeOfCover: "Loss of hire (LOH)",
    policyNumber: "POL-LH-2024-0443",
    leadingInsurer: "Norwegian Hull Club",
    broker: "Gallagher Marine",
    brokerRef: "GAL-2024-0882",
    coverFrom: "2024-01-15",
    coverTo: "2024-12-15",
    currency: "USD",
    deductible: 14,
    limitOfLiability: 180,
    sumInsured: 0,
    status: "Active",
    remarks: "LOH cover — 14-day deductible, max 180 days indemnity.",
  },
  {
    id: "INS-2024-006",
    typeOfCover: "War",
    policyNumber: "POL-WR-2024-0229",
    leadingInsurer: "Lloyd's of London",
    broker: "Marsh Marine",
    brokerRef: "MMB-2024-0330",
    coverFrom: "2024-06-01",
    coverTo: "2024-11-30",
    currency: "USD",
    deductible: 0,
    limitOfLiability: 7500000,
    sumInsured: 7500000,
    status: "Expired",
    remarks: "Additional war risk cover for high-risk trading areas.",
  },
  {
    id: "INS-2024-007",
    typeOfCover: "Freight, demurrage, defense (FD&D)",
    policyNumber: "POL-FD-2024-0788",
    leadingInsurer: "Standard Club",
    broker: "AON Marine",
    brokerRef: "AON-2024-1445",
    coverFrom: "2024-02-01",
    coverTo: "2025-01-31",
    currency: "USD",
    deductible: 0,
    limitOfLiability: 500000,
    sumInsured: 0,
    status: "Active",
    remarks: "Legal defence cover for freight disputes.",
  },
  {
    id: "INS-2024-008",
    typeOfCover: "Ext. cargo liability cover (ECL)",
    policyNumber: "POL-ECL-2024-0156",
    leadingInsurer: "Munich Re Marine",
    broker: "Maritime Insurance Brokers",
    brokerRef: "MIB-2024-0789",
    coverFrom: "2024-05-01",
    coverTo: "2025-04-30",
    currency: "USD",
    deductible: 15000,
    limitOfLiability: 4000000,
    sumInsured: 4000000,
    status: "Pending",
    remarks: "Extended cargo liability awaiting final endorsement.",
  },
  {
    id: "INS-2023-045",
    typeOfCover: "Hull and machinery (H&M)",
    policyNumber: "POL-HM-2023-0512",
    leadingInsurer: "Skuld Marine",
    broker: "Gallagher Marine",
    brokerRef: "GAL-2023-1190",
    coverFrom: "2023-01-01",
    coverTo: "2023-12-31",
    currency: "USD",
    deductible: 40000,
    limitOfLiability: 4500000,
    sumInsured: 7000000,
    status: "Expired",
    remarks: "Previous year H&M policy.",
  },
];

// ─── Helpers & constants ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-green-100 text-green-700",
  Expired:   "bg-gray-100 text-gray-500",
  Pending:   "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-600",
};

const COVERAGE_CONFIRMED_STYLES: Record<string, string> = {
  Yes:     "bg-green-100 text-green-700",
  No:      "bg-red-100 text-red-600",
  Partial: "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-500",
};

const COVER_OPTIONS = [
  "Charterer's liability (CL)", "Charterer's loss of profit", "Charterer's loss of use",
  "Comp. carrier's liability (CCC)", "Comp. general liability (CGL)",
  "Ext. cargo liability cover (ECL)", "Ext. contractual cover (ECC)",
  "Extended crew cover", "Extra war risk insurance (EWRI)",
  "Freight, demurrage, defense (FD&D)", "Hull and machinery (H&M)",
  "Kidnap, ransom protection (K&R)", "Loss of hire (LOH)",
  "Northern Sea Route buy back (NSR)", "Professional indemnity",
  "Project insurance", "Property insurance", "Protection & Indemnity (P&I)",
  "Strike and delay", "TCL and FD&D", "War",
];

const STATUS_OPTIONS       = ["Active", "Pending", "Expired", "Cancelled"];
const CURRENCIES           = ["USD", "EUR", "GBP", "SGD", "NOK"];
const INSURERS = [
  "Lloyd's of London", "Gard P&I Club", "Britannia P&I", "Swiss Re Marine",
  "Norwegian Hull Club", "Gallagher Marine", "Skuld Marine", "Standard Club",
  "Munich Re Marine", "North P&I Club", "UK P&I Club", "Steamship Mutual",
];
const BROKERS = [
  "Marsh Marine", "AON Marine", "Gallagher Marine", "Willis Towers Watson",
  "Maritime Insurance Brokers", "JLT Specialty", "Jardine Lloyd Thompson",
];
const SCOPE_OPTIONS = [
  "Cargo damage", "Hull damage", "Legal costs", "Survey costs",
  "Crew injury", "Pollution", "Loss of hire", "Third party liability", "Other",
];
const INSURER_RESPONSE_OPTIONS = [
  "Not Sent", "Sent", "Awaiting Response", "Reviewed",
  "Accepted", "Rejected", "Partial Acceptance",
];

// ─── Field helpers ────────────────────────────────────────────────────────────

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2 pb-1 border-b border-gray-100">
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface InsuranceClaimsEmbeddedProps {
  claimId: string;
}

export function InsuranceClaimsEmbedded({ claimId }: InsuranceClaimsEmbeddedProps) {
  // ── Shared state ──────────────────────────────────────────────────────────

  const [allInsurance, setAllInsurance] = useState<InsuranceRecord[]>(SEED_INSURANCE);

  const [linkedIds, setLinkedIds] = useState<string[]>(() => {
    const prelinked: Record<string, string[]> = {
      "1":  ["INS-2024-001", "INS-2024-002"],
      "2":  ["INS-2024-004"],
      "3":  ["INS-2024-003"],
      "4":  ["INS-2024-002"],
      "5":  ["INS-2024-007"],
      "6":  ["INS-2024-001", "INS-2024-006"],
      "7":  ["INS-2024-002", "INS-2024-008"],
      "8":  ["INS-2023-045"],
      "9":  ["INS-2024-005"],
      "10": ["INS-2024-001"],
      "11": ["INS-2024-004"],
      "12": ["INS-2024-003"],
    };
    return prelinked[claimId] ?? [];
  });

  // ── Link Insurance search state ───────────────────────────────────────────
  const [linkSearch, setLinkSearch] = useState("");
  const [isLinkOpen, setIsLinkOpen] = useState(false);

  // ── Insurance edit overlay state ──────────────────────────────────────────
  const [editingRecord, setEditingRecord] = useState<InsuranceRecord | null>(null);
  const [editForm, setEditForm]           = useState<InsuranceRecord | null>(null);

  // ── Coverage Details state ────────────────────────────────────────────────
  const [expandedIds, setExpandedIds]   = useState<string[]>([]);
  const [coverageData, setCoverageData] = useState<Record<string, CoverageDetail>>({});
  const [openKebabId, setOpenKebabId]   = useState<string | null>(null);
  const [unassignId, setUnassignId]     = useState<string | null>(null);

  // ── Derived ───────────────────────────────────────────────────────────────

  const linkedRecords = linkedIds
    .map((id) => allInsurance.find((r) => r.id === id))
    .filter(Boolean) as InsuranceRecord[];

  const linkable = allInsurance.filter(
    (r) =>
      !linkedIds.includes(r.id) &&
      (r.id.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.typeOfCover.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.leadingInsurer.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.broker.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.policyNumber.toLowerCase().includes(linkSearch.toLowerCase()))
  );

  const getCoverage = (id: string): CoverageDetail =>
    coverageData[id] ?? { ...DEFAULT_COVERAGE };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLink = (record: InsuranceRecord) => {
    setLinkedIds((prev) => [record.id, ...prev]);
    setIsLinkOpen(false);
    setLinkSearch("");
  };

  const handleUnassign = () => {
    if (unassignId) {
      setLinkedIds((prev) => prev.filter((id) => id !== unassignId));
      setExpandedIds((prev) => prev.filter((id) => id !== unassignId));
      setUnassignId(null);
    }
  };

  const openEdit = (record: InsuranceRecord) => {
    setEditingRecord(record);
    setEditForm({ ...record });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    setAllInsurance((prev) => prev.map((r) => (r.id === editForm.id ? editForm : r)));
    setEditingRecord(null);
    setEditForm(null);
  };

  const updateEdit = (field: keyof InsuranceRecord, value: string | number) =>
    setEditForm((f) => (f ? { ...f, [field]: value } : f));

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const updateCoverage = (id: string, field: keyof CoverageDetail, value: string) =>
    setCoverageData((prev) => ({
      ...prev,
      [id]: { ...getCoverage(id), [field]: value },
    }));

  // Rule: only one insurance can be Primary per claim; auto-deselect others
  const handlePrimaryInsurance = (id: string, value: string) => {
    if (value === "Yes") {
      setCoverageData((prev) => {
        const next = { ...prev };
        linkedIds.forEach((lid) => {
          next[lid] = { ...getCoverage(lid), primaryInsurance: lid === id ? "Yes" : "No" };
        });
        return next;
      });
    } else {
      updateCoverage(id, "primaryInsurance", value);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <span className="text-sm font-medium text-gray-700">Coverage Details</span>

        {/* Link Insurance button + dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLinkOpen((v) => !v)}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            <Search className="size-3.5" />
            Link Insurance
            <ChevronDown className="size-3.5 text-gray-400" />
          </button>

          {isLinkOpen && (
            <div className="absolute right-0 top-full mt-1 w-[440px] bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by Insurance No, cover type, insurer, broker..."
                    value={linkSearch}
                    onChange={(e) => setLinkSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {linkable.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-400">No insurance records available to link</div>
                ) : (
                  linkable.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleLink(r)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">{r.id}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 font-medium mt-0.5 truncate">{r.typeOfCover}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{r.leadingInsurer} · {r.broker}</div>
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

      {/* ── Coverage Details list ─────────────────────────────────────────── */}
      <div className="p-4 overflow-y-auto flex-1">
        {linkedRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-gray-400">
            <FileSearch className="size-10 opacity-30" />
            <p className="text-sm font-medium">No insurance linked</p>
            <p className="text-xs">Use "Link Insurance" to associate policies with this claim.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {linkedRecords.map((record) => {
              const isOpen = expandedIds.includes(record.id);
              const cov = getCoverage(record.id);

              return (
                <div key={record.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">

                  {/* ── Line item header ──────────────────────────────── */}
                  <div className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">

                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleExpand(record.id)}
                      className="text-gray-400 shrink-0 hover:text-gray-600"
                    >
                      {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </button>

                    {/* Insurance ID — clickable link that opens the edit overlay */}
                    <button
                      onClick={() => openEdit(record)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline w-32 shrink-0 text-left"
                    >
                      {record.id}
                    </button>

                    <span
                      className="text-xs text-gray-500 w-40 shrink-0 truncate cursor-pointer"
                      onClick={() => toggleExpand(record.id)}
                    >
                      {record.policyNumber}
                    </span>
                    <span
                      className="text-xs font-medium text-blue-700 flex-1 truncate cursor-pointer"
                      onClick={() => toggleExpand(record.id)}
                    >
                      {record.typeOfCover}
                    </span>

                    {cov.coverageConfirmed && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 cursor-pointer ${COVERAGE_CONFIRMED_STYLES[cov.coverageConfirmed] ?? "bg-gray-100 text-gray-500"}`}
                        onClick={() => toggleExpand(record.id)}
                      >
                        {cov.coverageConfirmed}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 cursor-pointer ${STATUS_STYLES[record.status] ?? "bg-gray-100 text-gray-600"}`}
                      onClick={() => toggleExpand(record.id)}
                    >
                      {record.status}
                    </span>

                    {/* Kebab menu */}
                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenKebabId(openKebabId === record.id ? null : record.id)}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                      {openKebabId === record.id && (
                        <>
                          <div className="fixed inset-0 z-[199]" onClick={() => setOpenKebabId(null)} />
                          <div className="absolute right-0 top-7 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] py-1">
                            <button
                              onClick={() => { setOpenKebabId(null); setUnassignId(record.id); }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Unassign
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Expanded coverage details form ────────────────── */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                        {/* ── Coverage Decision ─────────────────────── */}
                        <SectionHeading>Coverage Decision</SectionHeading>

                        <FieldRow label="Coverage Confirmed" required>
                          <Select value={cov.coverageConfirmed} onValueChange={(v) => updateCoverage(record.id, "coverageConfirmed", v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              {["Yes", "No", "Partial", "Pending"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FieldRow>

                        <FieldRow label="Coverage Decision Date" required={["Yes","No","Partial"].includes(cov.coverageConfirmed)}>
                          <Input
                            type="date"
                            value={cov.coverageDecisionDate}
                            onChange={(e) => updateCoverage(record.id, "coverageDecisionDate", e.target.value)}
                            disabled={cov.coverageConfirmed === "Pending"}
                            className={`h-8 text-xs ${cov.coverageConfirmed === "Pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                          />
                          {cov.coverageConfirmed === "Pending" && (
                            <p className="text-[10px] text-gray-400 mt-0.5">Required once Coverage Confirmed is set to Yes / No / Partial</p>
                          )}
                        </FieldRow>

                        {cov.coverageConfirmed !== "Pending" && (
                          <div className="col-span-2">
                            <FieldRow label="Coverage Decision Remarks" required={["No","Partial"].includes(cov.coverageConfirmed)}>
                              <Textarea
                                value={cov.coverageDecisionRemarks}
                                onChange={(e) => updateCoverage(record.id, "coverageDecisionRemarks", e.target.value)}
                                placeholder={["No","Partial"].includes(cov.coverageConfirmed) ? "Required — explain the coverage decision..." : "Optional remarks on coverage decision..."}
                                rows={2}
                                className="resize-none text-xs"
                              />
                            </FieldRow>
                          </div>
                        )}

                        <div className="col-span-2">
                          <FieldRow label="Covered Portion / Scope" required={linkedIds.length > 1}>
                            <div className="flex gap-2">
                              <Select value={cov.coveredScope} onValueChange={(v) => updateCoverage(record.id, "coveredScope", v)}>
                                <SelectTrigger className="h-8 text-xs w-56 shrink-0"><SelectValue placeholder="Select scope" /></SelectTrigger>
                                <SelectContent className="z-[600]">
                                  {SCOPE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Input
                                value={cov.coveredScope}
                                onChange={(e) => updateCoverage(record.id, "coveredScope", e.target.value)}
                                placeholder="Or describe scope freely..."
                                className="h-8 text-xs flex-1"
                              />
                            </div>
                            {linkedIds.length > 1 && (
                              <p className="text-[10px] text-amber-600 mt-0.5">Required — this claim has multiple linked insurance records. Specify which part of the claim this policy covers.</p>
                            )}
                          </FieldRow>
                        </div>

                        <FieldRow label="Coverage Percentage (%)">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={cov.coveragePercentage}
                            onChange={(e) => {
                              const val = Math.min(100, Math.max(0, Number(e.target.value)));
                              updateCoverage(record.id, "coveragePercentage", String(val));
                            }}
                            placeholder="0–100"
                            disabled={cov.coverageConfirmed !== "Partial"}
                            className={`h-8 text-xs ${cov.coverageConfirmed !== "Partial" ? "opacity-50 cursor-not-allowed" : ""}`}
                          />
                          {cov.coverageConfirmed !== "Partial" && (
                            <p className="text-[10px] text-gray-400 mt-0.5">Only applicable when Coverage Confirmed = Partial</p>
                          )}
                        </FieldRow>

                        <FieldRow label="Coverage Limit Applied">
                          <Input
                            type="number"
                            min={0}
                            value={cov.coverageLimitApplied}
                            onChange={(e) => updateCoverage(record.id, "coverageLimitApplied", e.target.value)}
                            placeholder="Enter amount"
                            className="h-8 text-xs"
                          />
                        </FieldRow>

                        {/* ── Deductible ────────────────────────────── */}
                        <SectionHeading>Deductible</SectionHeading>

                        <FieldRow label="Deductible Applies">
                          <Select value={cov.deductibleApplies} onValueChange={(v) => updateCoverage(record.id, "deductibleApplies", v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldRow>

                        <FieldRow label="Deductible Exceeded">
                          <Select value={cov.deductibleExceeded} onValueChange={(v) => updateCoverage(record.id, "deductibleExceeded", v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldRow>

                        {/* ── Insurer Communication ─────────────────── */}
                        <SectionHeading>Insurer Communication</SectionHeading>

                        <FieldRow label="Insurer Response Status">
                          <Select value={cov.insurerResponseStatus} onValueChange={(v) => updateCoverage(record.id, "insurerResponseStatus", v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              {INSURER_RESPONSE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FieldRow>

                        <FieldRow label="Date Sent to Insurer">
                          <Input
                            type="date"
                            value={cov.dateSentToInsurer}
                            onChange={(e) => updateCoverage(record.id, "dateSentToInsurer", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </FieldRow>

                        <FieldRow label="Insurer Contact Person">
                          <Input
                            value={cov.insurerContactPerson}
                            onChange={(e) => updateCoverage(record.id, "insurerContactPerson", e.target.value)}
                            placeholder="Name or contact"
                            className="h-8 text-xs"
                          />
                        </FieldRow>

                        <FieldRow label="Broker Contact Person">
                          <Input
                            value={cov.brokerContactPerson}
                            onChange={(e) => updateCoverage(record.id, "brokerContactPerson", e.target.value)}
                            placeholder="Name or contact"
                            className="h-8 text-xs"
                          />
                        </FieldRow>

                        {/* ── Follow-up ─────────────────────────────── */}
                        <SectionHeading>Follow-up</SectionHeading>

                        <FieldRow label="Requires Follow-up">
                          <Select value={cov.requiresFollowup} onValueChange={(v) => updateCoverage(record.id, "requiresFollowup", v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldRow>

                        <FieldRow label="Next Follow-up Date" required={cov.requiresFollowup === "Yes"}>
                          <Input
                            type="date"
                            value={cov.nextFollowupDate}
                            onChange={(e) => updateCoverage(record.id, "nextFollowupDate", e.target.value)}
                            className="h-8 text-xs"
                            disabled={cov.requiresFollowup !== "Yes"}
                          />
                        </FieldRow>

                        {cov.requiresFollowup === "Yes" && (
                          <div className="col-span-2">
                            <FieldRow label="Follow-up Note" required>
                              <Textarea
                                value={cov.followupNote}
                                onChange={(e) => updateCoverage(record.id, "followupNote", e.target.value)}
                                placeholder="Describe the follow-up required..."
                                rows={2}
                                className="resize-none text-xs"
                              />
                            </FieldRow>
                          </div>
                        )}

                        {/* ── Metadata & Document ───────────────────── */}
                        <SectionHeading>Metadata & Document</SectionHeading>

                        <FieldRow label="Primary Insurance for Claim">
                          <Select value={cov.primaryInsurance} onValueChange={(v) => handlePrimaryInsurance(record.id, v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          {cov.primaryInsurance === "Yes" && linkedIds.length > 1 && (
                            <p className="text-[10px] text-green-600 mt-0.5">This is the primary insurance for this claim. Other linked records have been set to No.</p>
                          )}
                          {cov.primaryInsurance !== "Yes" && linkedIds.some(lid => lid !== record.id && getCoverage(lid).primaryInsurance === "Yes") && (
                            <p className="text-[10px] text-gray-400 mt-0.5">Another insurance is already marked as primary for this claim.</p>
                          )}
                        </FieldRow>

                        <FieldRow label="Active Link">
                          <Select value={cov.activeLink} onValueChange={(v) => updateCoverage(record.id, "activeLink", v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldRow>

                        <FieldRow label="Decision Attachment Available">
                          <Select value={cov.decisionAttachmentAvailable} onValueChange={(v) => updateCoverage(record.id, "decisionAttachmentAvailable", v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[600]">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldRow>

                        <FieldRow label="Decision Document Reference">
                          <Input
                            value={cov.decisionDocumentReference}
                            onChange={(e) => updateCoverage(record.id, "decisionDocumentReference", e.target.value)}
                            placeholder="e.g. M-Files ref or doc ID"
                            className="h-8 text-xs"
                          />
                        </FieldRow>

                        {/* ── Internal Notes ────────────────────────── */}
                        <div className="col-span-2">
                          <FieldRow label="Internal Notes">
                            <Textarea
                              value={cov.internalNotes}
                              onChange={(e) => updateCoverage(record.id, "internalNotes", e.target.value)}
                              placeholder="Internal-only remarks (not visible to insurer/broker)..."
                              rows={2}
                              className="resize-none text-xs"
                            />
                          </FieldRow>
                        </div>

                      </div>

                      {/* Save row */}
                      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => toggleExpand(record.id)}
                          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Save & Collapse
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Insurance Edit Overlay (Portal) ───────────────────────────────── */}
      {editingRecord && editForm && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[300]" onClick={() => { setEditingRecord(null); setEditForm(null); }} />
          <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.15)] z-[310] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Edit Insurance</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editingRecord.id}</p>
              </div>
              <button onClick={() => { setEditingRecord(null); setEditForm(null); }} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3 flex-wrap shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_STYLES[editForm.status] ?? "bg-gray-100 text-gray-600"}`}>{editForm.status}</span>
              <span className="text-xs text-blue-700 font-medium">{editForm.typeOfCover}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Insurance Number</Label>
                <Input value={editForm.id} disabled className="bg-gray-50 text-gray-500 font-medium" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Type of Cover</Label>
                <Select value={editForm.typeOfCover} onValueChange={(v) => updateEdit("typeOfCover", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[600]">{COVER_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Policy Number</Label>
                <Input value={editForm.policyNumber} onChange={(e) => updateEdit("policyNumber", e.target.value)} placeholder="e.g. POL-HM-2024-0912" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Leading Insurer</Label>
                <Select value={editForm.leadingInsurer} onValueChange={(v) => updateEdit("leadingInsurer", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[600]">{INSURERS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Broker</Label>
                  <Select value={editForm.broker} onValueChange={(v) => updateEdit("broker", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[600]">{BROKERS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Broker Reference</Label>
                  <Input value={editForm.brokerRef} onChange={(e) => updateEdit("brokerRef", e.target.value)} placeholder="e.g. MMB-2024-1120" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Cover From</Label>
                  <Input type="date" value={editForm.coverFrom} onChange={(e) => updateEdit("coverFrom", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Cover To</Label>
                  <Input type="date" value={editForm.coverTo} onChange={(e) => updateEdit("coverTo", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Currency</Label>
                  <Select value={editForm.currency} onValueChange={(v) => updateEdit("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[600]">{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Insurance Status</Label>
                  <Select value={editForm.status} onValueChange={(v) => updateEdit("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[600]">{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Deductible</Label>
                  <Input type="number" value={editForm.deductible} onChange={(e) => updateEdit("deductible", Number(e.target.value))} placeholder="0" min={0} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Limit of Liability</Label>
                  <Input type="number" value={editForm.limitOfLiability} onChange={(e) => updateEdit("limitOfLiability", Number(e.target.value))} placeholder="0" min={0} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Sum Insured</Label>
                <Input type="number" value={editForm.sumInsured} onChange={(e) => updateEdit("sumInsured", Number(e.target.value))} placeholder="0" min={0} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                <Textarea value={editForm.remarks} onChange={(e) => updateEdit("remarks", e.target.value)} placeholder="Additional notes..." rows={3} className="resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
              <button onClick={() => { setEditingRecord(null); setEditForm(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">Update Insurance</button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ── Unassign Confirmation (Portal) ────────────────────────────────── */}
      {unassignId && createPortal(
        <>
          <div className="fixed inset-0 bg-black/30 z-[400]" />
          <div className="fixed inset-0 flex items-center justify-center z-[410]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Unassign Insurance</h3>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to unassign this insurance policy from the claim? The policy record itself will not be deleted.</p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setUnassignId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">No</button>
                <button onClick={handleUnassign} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors">Yes</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

    </div>
  );
}
