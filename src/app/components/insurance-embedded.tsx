import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, MoreVertical, ChevronDown, X, Shield } from "lucide-react";
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

// ─── Constants ────────────────────────────────────────────────────────────────

const INSURANCE_STATUSES = ["Active", "Pending", "Approved", "Expired", "Cancelled", "Rejected"];

const STATUS_ORDER = ["Active", "Pending", "Approved", "Expired", "Cancelled", "Rejected"];

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-green-100 text-green-700",
  Pending:   "bg-yellow-100 text-yellow-700",
  Approved:  "bg-blue-100 text-blue-700",
  Expired:   "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-700",
  Rejected:  "bg-red-100 text-red-700",
};

const CATEGORY_STYLES: Record<string, string> = {
  Fixture: "bg-violet-100 text-violet-700",
  Vessel:  "bg-sky-100 text-sky-700",
  Crew:    "bg-orange-100 text-orange-700",
};

const TYPE_OF_COVER_BY_CATEGORY: Record<string, string[]> = {
  Fixture: [
    "Charterers' P&I", "FD&D / Defence", "Cargo Liability",
    "Additional Contractual Insurance", "Bunkers Cover", "Container / Equipment Cover",
  ],
  Vessel: [
    "Hull & Machinery", "Owners' P&I", "War Risks", "Loss of Hire",
    "Pollution Liability", "Wreck Removal", "Marine Liability / Property Damage",
  ],
  Crew: [
    "Crew Liability", "Medical Expenses", "Repatriation",
    "Death & Disability", "Crew Wages", "Personal Effects",
  ],
};

const CLAUSE_TYPES = [
  "Institute Cargo Clauses A", "Institute Cargo Clauses B", "Institute Cargo Clauses C",
  "Institute Time Clauses Hull", "Institute Voyage Clauses Hull",
  "Institute War Clauses (Ship)", "P&I Rules", "Bespoke / Other",
];

const BROKERS = [
  "Maritime Insurance Brokers", "Global Marine Insurance",
  "Seaborne Insurance Group", "International Marine Brokers",
];

const INSURERS = [
  "Gard P&I", "UK P&I Club", "Skuld",
  "West of England", "American Club", "North Standard",
];

const USERS = [
  "Nikhil Mathew", "John Doe", "Tester Adminren",
  "Aiswaryaa Adminren", "Jacson Tom", "Safna Basheer",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface InsuranceRecord {
  id: string;
  policyNo: string;
  insuranceCategory: string;
  fixture: string;
  vessel: string;
  crew: string;
  typeOfCover: string;
  insuranceTypeClauseType: string;
  policyNumber: string;
  policyCoverReference: string;
  currency: string;
  deductible: number;
  limitOfLiability: number;
  broker: string;
  brokerReferenceNumber: string;
  brokerContact: string;
  leadingInsurer: string;
  insurerContact: string;
  dateOfNotificationToBroker: string;
  coverStartDate: string;
  coverEndDate: string;
  insuranceStatus: string;
  insuranceOwner: string;
  remarks: string;
  createdAt: string;
}

interface InsuranceForm {
  typeOfCover: string;
  insuranceTypeClauseType: string;
  policyNumber: string;
  policyCoverReference: string;
  currency: string;
  deductible: string;
  limitOfLiability: string;
  broker: string;
  brokerReferenceNumber: string;
  brokerContact: string;
  leadingInsurer: string;
  insurerContact: string;
  dateOfNotificationToBroker: string;
  coverStartDate: string;
  coverEndDate: string;
  insuranceStatus: string;
  insuranceOwner: string;
  remarks: string;
}

const EMPTY_FORM: InsuranceForm = {
  typeOfCover: "",
  insuranceTypeClauseType: "",
  policyNumber: "",
  policyCoverReference: "",
  currency: "USD",
  deductible: "",
  limitOfLiability: "",
  broker: "",
  brokerReferenceNumber: "",
  brokerContact: "",
  leadingInsurer: "",
  insurerContact: "",
  dateOfNotificationToBroker: "",
  coverStartDate: "",
  coverEndDate: "",
  insuranceStatus: "",
  insuranceOwner: "",
  remarks: "",
};

// Seed data — matches the main Insurance module's initial records
const SEED_RECORDS: InsuranceRecord[] = [
  {
    id: "ins-1", policyNo: "INS-2026-001", createdAt: "2026-01-10",
    insuranceCategory: "Vessel", fixture: "", vessel: "MV OCEAN STAR", crew: "",
    typeOfCover: "Hull & Machinery", insuranceTypeClauseType: "Institute Time Clauses Hull",
    policyNumber: "POL-2026-HM-001", policyCoverReference: "REF-HM-001",
    deductible: 10000, limitOfLiability: 5000000, currency: "USD",
    broker: "Maritime Insurance Brokers", brokerReferenceNumber: "MIB-2026-001",
    brokerContact: "James Wilson", leadingInsurer: "Gard P&I", insurerContact: "Sarah Lee",
    dateOfNotificationToBroker: "2026-01-10", coverStartDate: "2026-02-01", coverEndDate: "2027-01-31",
    insuranceStatus: "Active", insuranceOwner: "Nikhil Mathew", remarks: "Renew policy before expiry.",
  },
  {
    id: "ins-2", policyNo: "INS-2026-002", createdAt: "2026-02-01",
    insuranceCategory: "Fixture", fixture: "AEW-F-2026-407", vessel: "", crew: "",
    typeOfCover: "Charterers' P&I", insuranceTypeClauseType: "P&I Rules",
    policyNumber: "POL-2026-PI-002", policyCoverReference: "REF-PI-002",
    deductible: 15000, limitOfLiability: 10000000, currency: "USD",
    broker: "Global Marine Insurance", brokerReferenceNumber: "GMI-2026-002",
    brokerContact: "Linda Kovacs", leadingInsurer: "UK P&I Club", insurerContact: "Mark Spencer",
    dateOfNotificationToBroker: "2026-02-05", coverStartDate: "2026-03-01", coverEndDate: "2026-08-31",
    insuranceStatus: "Active", insuranceOwner: "Jacson Tom", remarks: "",
  },
  {
    id: "ins-3", policyNo: "INS-2026-003", createdAt: "2026-03-15",
    insuranceCategory: "Crew", fixture: "", vessel: "", crew: "All crew — MV PACIFIC VOYAGER",
    typeOfCover: "Crew Liability", insuranceTypeClauseType: "Bespoke / Other",
    policyNumber: "", policyCoverReference: "", deductible: 5000, limitOfLiability: 500000, currency: "USD",
    broker: "Seaborne Insurance Group", brokerReferenceNumber: "", brokerContact: "",
    leadingInsurer: "American Club", insurerContact: "",
    dateOfNotificationToBroker: "", coverStartDate: "2026-04-01", coverEndDate: "2026-09-30",
    insuranceStatus: "Pending", insuranceOwner: "Aiswaryaa Adminren", remarks: "Awaiting approval from insurer.",
  },
];

const generatePolicyNo = (count: number) =>
  `INS-${new Date().getFullYear()}-${String(count).padStart(3, "0")}`;

// ─── Props ────────────────────────────────────────────────────────────────────

interface InsuranceEmbeddedProps {
  moduleType: "Fixture" | "Vessel";
  moduleId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InsuranceEmbedded({ moduleType, moduleId }: InsuranceEmbeddedProps) {
  const storageKey = `insurance-links-${moduleType}-${moduleId}`;
  const recordsKey = "insurance-embedded-records";

  // ── State ──────────────────────────────────────────────────────────────────

  const [allRecords, setAllRecords] = useState<InsuranceRecord[]>(() => {
    try {
      const stored = localStorage.getItem(recordsKey);
      return stored ? JSON.parse(stored) : SEED_RECORDS;
    } catch { return SEED_RECORDS; }
  });

  const [nextCount, setNextCount] = useState<number>(() => {
    try { return parseInt(localStorage.getItem("insurance-embedded-count") ?? "4", 10); }
    catch { return 4; }
  });

  const [linkedIds, setLinkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
      // Pre-link INS-2026-002 to fixture AEW-F-2026-407
      if (moduleType === "Fixture" && moduleId === "AEW-F-2026-407") return ["ins-2"];
      return [];
    } catch { return []; }
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [form, setForm] = useState<InsuranceForm>(EMPTY_FORM);
  const [linkSearch, setLinkSearch] = useState("");
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Persistence ────────────────────────────────────────────────────────────

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(linkedIds)); }, [linkedIds, storageKey]);
  useEffect(() => { localStorage.setItem(recordsKey, JSON.stringify(allRecords)); }, [allRecords]);
  useEffect(() => { localStorage.setItem("insurance-embedded-count", String(nextCount)); }, [nextCount]);

  useEffect(() => {
    if (isLinkOpen) {
      try {
        const fresh = JSON.parse(localStorage.getItem(recordsKey) ?? "[]");
        if (fresh.length > 0) setAllRecords(fresh);
      } catch {}
    }
  }, [isLinkOpen]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const linkedRecords = linkedIds
    .map((id) => allRecords.find((r) => r.id === id))
    .filter(Boolean) as InsuranceRecord[];

  const sortedLinked = [...linkedRecords].sort(
    (a, b) => STATUS_ORDER.indexOf(a.insuranceStatus) - STATUS_ORDER.indexOf(b.insuranceStatus)
  );

  const unlinkableRecords = allRecords.filter(
    (r) =>
      !linkedIds.includes(r.id) &&
      (r.policyNo.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.typeOfCover.toLowerCase().includes(linkSearch.toLowerCase()) ||
        r.insuranceStatus.toLowerCase().includes(linkSearch.toLowerCase()))
  );

  const coverTypes = TYPE_OF_COVER_BY_CATEGORY[moduleType] ?? [];
  const canSave = form.typeOfCover !== "" && form.insuranceStatus !== "";

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    const newRecord: InsuranceRecord = {
      id: `ins-emb-${nextCount}`,
      policyNo: generatePolicyNo(nextCount),
      insuranceCategory: moduleType,
      fixture: moduleType === "Fixture" ? moduleId : "",
      vessel: moduleType === "Vessel" ? moduleId : "",
      crew: "",
      typeOfCover: form.typeOfCover,
      insuranceTypeClauseType: form.insuranceTypeClauseType,
      policyNumber: form.policyNumber,
      policyCoverReference: form.policyCoverReference,
      currency: form.currency || "USD",
      deductible: parseFloat(form.deductible) || 0,
      limitOfLiability: parseFloat(form.limitOfLiability) || 0,
      broker: form.broker,
      brokerReferenceNumber: form.brokerReferenceNumber,
      brokerContact: form.brokerContact,
      leadingInsurer: form.leadingInsurer,
      insurerContact: form.insurerContact,
      dateOfNotificationToBroker: form.dateOfNotificationToBroker,
      coverStartDate: form.coverStartDate,
      coverEndDate: form.coverEndDate,
      insuranceStatus: form.insuranceStatus,
      insuranceOwner: form.insuranceOwner,
      remarks: form.remarks,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAllRecords((prev) => [newRecord, ...prev]);
    setLinkedIds((prev) => [newRecord.id, ...prev]);
    setNextCount((c) => c + 1);
    setIsSheetOpen(false);
  };

  const handleLink = (record: InsuranceRecord) => {
    setLinkedIds((prev) => [record.id, ...prev]);
    setIsLinkOpen(false);
    setLinkSearch("");
  };

  const handleDelete = () => {
    if (deleteId) {
      setLinkedIds((prev) => prev.filter((id) => id !== deleteId));
      setDeleteId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">

      {/* Action bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="size-4" />
          Add New Insurance
        </button>

        {/* Link Insurance dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLinkOpen((v) => !v)}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Search className="size-4" />
            Link Insurance
            <ChevronDown className="size-4 text-gray-400" />
          </button>

          {isLinkOpen && (
            <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by Insurance No or Type of Cover..."
                    value={linkSearch}
                    onChange={(e) => setLinkSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {unlinkableRecords.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-400">No insurance records available</div>
                ) : (
                  unlinkableRecords.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleLink(r)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{r.policyNo}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_STYLES[r.insuranceStatus] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.insuranceStatus}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{r.typeOfCover || "—"}</div>
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
      {sortedLinked.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-gray-400">
          <Shield className="size-10 opacity-30" />
          <p className="text-sm font-medium">No insurance records linked yet</p>
          <p className="text-xs">Use "Add New Insurance" or "Link Insurance" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sortedLinked.map((record) => (
            <div
              key={record.id}
              className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              {/* Kebab menu */}
              <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenKebabId(openKebabId === record.id ? null : record.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-all"
                >
                  <MoreVertical className="size-4" />
                </button>

                {openKebabId === record.id && (
                  <>
                    <div className="fixed inset-0 z-[199]" onClick={() => setOpenKebabId(null)} />
                    <div className="absolute right-0 top-7 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] py-1">
                      <button
                        onClick={() => { setOpenKebabId(null); setDeleteId(record.id); }}
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
                <span className="text-sm font-semibold text-gray-900">{record.policyNo}</span>
                {record.insuranceCategory && (
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${CATEGORY_STYLES[record.insuranceCategory] ?? "bg-gray-100 text-gray-600"}`}>
                    {record.insuranceCategory}
                  </span>
                )}
                {record.insuranceStatus && (
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_STYLES[record.insuranceStatus] ?? "bg-gray-100 text-gray-600"}`}>
                    {record.insuranceStatus}
                  </span>
                )}
              </div>

              {/* Card fields */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-[12px]">
                <div>
                  <span className="text-gray-400">Type of Cover</span>
                  <div className="text-gray-700 font-medium mt-0.5">{record.typeOfCover || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Cover Period</span>
                  <div className="text-gray-700 font-medium mt-0.5">
                    {record.coverStartDate && record.coverEndDate
                      ? `${record.coverStartDate} → ${record.coverEndDate}`
                      : "—"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Broker</span>
                  <div className="text-gray-700 font-medium mt-0.5">{record.broker || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Leading Insurer</span>
                  <div className="text-gray-700 font-medium mt-0.5">{record.leadingInsurer || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-400">Limit of Liability</span>
                  <div className="text-gray-700 font-medium mt-0.5">
                    {record.limitOfLiability
                      ? `${record.limitOfLiability.toLocaleString()} ${record.currency}`
                      : "—"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Created By</span>
                  <div className="text-gray-700 font-medium mt-0.5">{record.insuranceOwner || "—"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add New Insurance Sheet (Portal) ──────────────────────────────────── */}
      {isSheetOpen && createPortal(
        <>
          <div className="fixed inset-0 bg-black/20 z-[300]" onClick={() => setIsSheetOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-[580px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.15)] z-[310] flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Add New Insurance</h2>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Insurance No (auto-gen) */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Insurance No</Label>
                <Input value={generatePolicyNo(nextCount)} disabled className="bg-gray-50 text-gray-500 font-medium" />
              </div>

              {/* Category + Entity (pre-filled, read-only) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Insurance Category</Label>
                  <Input value={moduleType} disabled className="bg-gray-50 text-gray-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">{moduleType}</Label>
                  <Input value={moduleId} disabled className="bg-gray-50 text-gray-500" />
                </div>
              </div>

              {/* Type of Cover */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Type of Cover <span className="text-red-500">*</span>
                </Label>
                <Select value={form.typeOfCover} onValueChange={(v) => setForm((f) => ({ ...f, typeOfCover: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select type of cover" /></SelectTrigger>
                  <SelectContent className="z-[600]">
                    {coverTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Clause Type */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Insurance Type / Clause Type</Label>
                <Select value={form.insuranceTypeClauseType} onValueChange={(v) => setForm((f) => ({ ...f, insuranceTypeClauseType: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select clause type" /></SelectTrigger>
                  <SelectContent className="z-[600]">
                    {CLAUSE_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Policy Number + Cover Reference */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Policy Number</Label>
                  <Input value={form.policyNumber} onChange={(e) => setForm((f) => ({ ...f, policyNumber: e.target.value }))} placeholder="e.g. POL-2026-001" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Policy / Cover Reference</Label>
                  <Input value={form.policyCoverReference} onChange={(e) => setForm((f) => ({ ...f, policyCoverReference: e.target.value }))} placeholder="e.g. REF-001" />
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Currency</Label>
                  <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Deductible</Label>
                  <div className="relative">
                    <Input type="number" min={0} value={form.deductible} onChange={(e) => setForm((f) => ({ ...f, deductible: e.target.value }))} className="pl-7" placeholder="0.00" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Limit of Liability</Label>
                  <div className="relative">
                    <Input type="number" min={0} value={form.limitOfLiability} onChange={(e) => setForm((f) => ({ ...f, limitOfLiability: e.target.value }))} className="pl-7" placeholder="0.00" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  </div>
                </div>
              </div>

              {/* Broker */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Broker</Label>
                  <Select value={form.broker} onValueChange={(v) => setForm((f) => ({ ...f, broker: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select broker" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {BROKERS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Broker Ref Number</Label>
                  <Input value={form.brokerReferenceNumber} onChange={(e) => setForm((f) => ({ ...f, brokerReferenceNumber: e.target.value }))} placeholder="e.g. BRK-REF-001" />
                </div>
              </div>

              {/* Insurer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Leading Insurer</Label>
                  <Select value={form.leadingInsurer} onValueChange={(v) => setForm((f) => ({ ...f, leadingInsurer: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select insurer" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {INSURERS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Insurer Contact</Label>
                  <Input value={form.insurerContact} onChange={(e) => setForm((f) => ({ ...f, insurerContact: e.target.value }))} placeholder="Contact name or email" />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Notification to Broker</Label>
                  <Input type="date" value={form.dateOfNotificationToBroker} onChange={(e) => setForm((f) => ({ ...f, dateOfNotificationToBroker: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Cover Start Date</Label>
                  <Input type="date" value={form.coverStartDate} onChange={(e) => setForm((f) => ({ ...f, coverStartDate: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Cover End Date</Label>
                  <Input type="date" value={form.coverEndDate} onChange={(e) => setForm((f) => ({ ...f, coverEndDate: e.target.value }))} />
                </div>
              </div>

              {/* Status + Created By */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    Insurance Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={form.insuranceStatus} onValueChange={(v) => setForm((f) => ({ ...f, insuranceStatus: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {INSURANCE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Created By</Label>
                  <Select value={form.insuranceOwner} onValueChange={(v) => setForm((f) => ({ ...f, insuranceOwner: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                    <SelectContent className="z-[600]">
                      {USERS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                  <span className="text-xs text-gray-400">{form.remarks.length} / 10,000</span>
                </div>
                <Textarea
                  value={form.remarks}
                  onChange={(e) => {
                    if (e.target.value.length <= 10000) setForm((f) => ({ ...f, remarks: e.target.value }));
                  }}
                  placeholder="Add any remarks or notes..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
              <button
                onClick={() => setIsSheetOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!canSave}
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-[#fde047] hover:bg-[#facc15] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Insurance
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ── Unassign Confirmation Dialog (Portal) ─────────────────────────────── */}
      {deleteId && createPortal(
        <>
          <div className="fixed inset-0 bg-black/30 z-[400]" />
          <div className="fixed inset-0 flex items-center justify-center z-[410]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Unassign Insurance</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to unassign this insurance record from the {moduleType}? The insurance record itself will not be deleted.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
