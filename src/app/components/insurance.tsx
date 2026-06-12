import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Search, SlidersHorizontal, Menu, Bell, Plus, MoreVertical,
  Shield, Check,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "./ui/utils";
import { LegalReviewEmbedded } from "./legal-review-embedded";

// ─── Constants ────────────────────────────────────────────────────────────────

const INSURANCE_STATUSES = ["Active", "Expired", "Cancelled", "Closed"];
const INSURANCE_CATEGORIES = ["Fixture", "Vessel", "Crew"];


const TYPE_OF_COVER_BY_CATEGORY: Record<string, string[]> = {
  Fixture: [
    "Charterers' P&I",
    "FD&D / Defence",
    "Cargo Liability",
    "Additional Contractual Insurance",
    "Bunkers Cover",
    "Container / Equipment Cover",
  ],
  Vessel: [
    "Hull & Machinery",
    "Owners' P&I",
    "War Risks",
    "Loss of Hire",
    "Pollution Liability",
    "Wreck Removal",
    "Marine Liability / Property Damage",
  ],
  Crew: [
    "Crew Liability",
    "Medical Expenses",
    "Repatriation",
    "Death & Disability",
    "Crew Wages",
    "Personal Effects",
  ],
};

const CLAUSE_TYPES = [
  "Institute Cargo Clauses A",
  "Institute Cargo Clauses B",
  "Institute Cargo Clauses C",
  "Institute Time Clauses Hull",
  "Institute Voyage Clauses Hull",
  "Institute War Clauses (Ship)",
  "P&I Rules",
  "Bespoke / Other",
];

const USERS = [
  "Nikhil Mathew", "John Doe", "Tester Adminren",
  "Aiswaryaa Adminren", "Jacson Tom", "Safna Basheer",
];

const BROKERS = [
  "Maritime Insurance Brokers", "Global Marine Insurance",
  "Seaborne Insurance Group", "International Marine Brokers",
];

const INSURERS_CLUBS = [
  "Gard P&I", "NorthStandard", "UK P&I Club", "UK Defence Club",
  "Skuld", "West of England", "American Club", "Britannia",
  "Swedish Club", "London P&I Club",
];

const VESSELS = [
  "MV OCEAN STAR", "MV PACIFIC VOYAGER", "MV ATLANTIC PRIDE", "MV NORTHERN LIGHT",
];

const FIXTURES = [
  "AEW-F-2026-407", "AEW-F-2026-405", "AEW-F-2026-401", "AEW-F-2026-398",
];

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-green-100 text-green-800",
  Expired:   "bg-gray-100 text-gray-700",
  Cancelled:        "bg-red-100 text-red-700",
  Closed:           "bg-slate-100 text-slate-600",
};

const CATEGORY_STYLES: Record<string, string> = {
  Fixture: "bg-violet-100 text-violet-700",
  Vessel:  "bg-sky-100 text-sky-700",
  Crew:    "bg-orange-100 text-orange-700",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface InsuranceRecord {
  id: string;
  policyNo: string;
  createdAt: string;
  // Basic Info
  additionalInsuranceRequired: boolean;
  insuranceStatus: string;
  insuranceOwner: string;
  assignedTo: string;
  nextActionDate: string;
  nextActionNote: string;
  // Cover Details
  insuranceCategory: string;
  fixture: string;
  vessel: string;
  crew: string;
  typeOfCover: string;
  insuranceTypeClauseType: string;
  policyNumber: string;
  policyCoverReference: string;
  // Financials — Coverage Values
  currency: string;
  sumInsured: number;
  totalSumInsured: number;
  deductible: number;
  dailyIndemnity: number;
  basisTerms: string;
  // Financials — Premium Details
  premiumRate: number;
  annualPremium: number;
  taxRate: number;
  taxAmount: number;
  totalPremiumInclTax: number;
  // Parties
  broker: string;
  brokerReferenceNumber: string;
  brokerContact: string;
  insurerClub: string;
  leadingUnderwriter: string;
  insurerContact: string;
  // Workflow & Dates
  dateOfNotificationToBroker: string;
  policyStartDate: string;
  policyEndDate: string;
  renewalTerms: string;
  // Workflow approval
  reviewedBy: string;
  reviewedDate: string;
  approvedBy: string;
  approvedDate: string;
  signedOffBy: string;
  signedOffDate: string;
  // Linkage
  sourceModule: string;
  inquiryReference: string;
  fixtureReference: string;
  claimReference: string;
  vesselLookup: string;
  voyageFixtureContext: string;
  linkedClaimExists: boolean;
  linkedClaimNumbers: string[];
}

// ─── Empty form ───────────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<InsuranceRecord, "id" | "createdAt"> = {
  policyNo: "",
  additionalInsuranceRequired: false,
  insuranceStatus: "none",
  insuranceOwner: "none",
  assignedTo: "none",
  nextActionDate: "",
  nextActionNote: "",
  insuranceCategory: "none",
  fixture: "none",
  vessel: "none",
  crew: "",
  typeOfCover: "none",
  insuranceTypeClauseType: "none",
  policyNumber: "",
  policyCoverReference: "",
  currency: "USD",
  sumInsured: 0,
  totalSumInsured: 0,
  deductible: 0,
  dailyIndemnity: 0,
  basisTerms: "",
  premiumRate: 0,
  annualPremium: 0,
  taxRate: 0,
  taxAmount: 0,
  totalPremiumInclTax: 0,
  broker: "none",
  brokerReferenceNumber: "",
  brokerContact: "",
  insurerClub: "none",
  leadingUnderwriter: "",
  insurerContact: "",
  dateOfNotificationToBroker: "",
  policyStartDate: "",
  policyEndDate: "",
  renewalTerms: "",
  reviewedBy: "none",
  reviewedDate: "",
  approvedBy: "none",
  approvedDate: "",
  signedOffBy: "none",
  signedOffDate: "",
  sourceModule: "none",
  inquiryReference: "",
  fixtureReference: "",
  claimReference: "",
  vesselLookup: "",
  voyageFixtureContext: "",
  linkedClaimExists: false,
  linkedClaimNumbers: [],
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const INITIAL_DATA: InsuranceRecord[] = [
  {
    id: "ins-1", policyNo: "INS-2026-001", createdAt: "2026-01-10",
    additionalInsuranceRequired: false, insuranceStatus: "Active",
    insuranceOwner: "Nikhil Mathew", assignedTo: "John Doe",
    nextActionDate: "2026-07-01", nextActionNote: "Renew policy before expiry.",
    insuranceCategory: "Vessel", fixture: "", vessel: "MV OCEAN STAR", crew: "",
    typeOfCover: "Hull & Machinery", insuranceTypeClauseType: "Institute Time Clauses Hull",

    policyNumber: "POL-2026-HM-001", policyCoverReference: "REF-HM-001",
    currency: "USD", sumInsured: 40312500, totalSumInsured: 53750000,
    deductible: 63975, dailyIndemnity: 0, basisTerms: "",
    premiumRate: 0.181992, annualPremium: 73366, taxRate: 3, taxAmount: 2201, totalPremiumInclTax: 75567,
    broker: "Maritime Insurance Brokers", brokerReferenceNumber: "MIB-2026-001",
    brokerContact: "James Wilson", insurerClub: "Gard P&I",
    leadingUnderwriter: "Gard M&E", insurerContact: "Sarah Lee",
    reviewedBy: "Tester Adminren", reviewedDate: "2026-01-15",
    approvedBy: "Aiswaryaa Adminren", approvedDate: "2026-01-20",
    signedOffBy: "", signedOffDate: "", dateOfNotificationToBroker: "2026-01-10",
    policyStartDate: "2026-02-01", policyEndDate: "2027-01-31", renewalTerms: "as expiry",
    sourceModule: "Vessel", inquiryReference: "", fixtureReference: "",
    claimReference: "", vesselLookup: "MV OCEAN STAR", voyageFixtureContext: "",
    linkedClaimExists: false, linkedClaimNumbers: [],
  },
  {
    id: "ins-2", policyNo: "INS-2026-002", createdAt: "2026-02-01",
    additionalInsuranceRequired: true, insuranceStatus: "Active",
    insuranceOwner: "Jacson Tom", assignedTo: "Safna Basheer",
    nextActionDate: "", nextActionNote: "",
    insuranceCategory: "Fixture", fixture: "AEW-F-2026-407", vessel: "", crew: "",
    typeOfCover: "Charterers' P&I", insuranceTypeClauseType: "P&I Rules",

    policyNumber: "POL-2026-PI-002", policyCoverReference: "REF-PI-002",
    currency: "USD", sumInsured: 10000000, totalSumInsured: 10000000,
    deductible: 15000, dailyIndemnity: 0, basisTerms: "",
    premiumRate: 0.8718, annualPremium: 87180, taxRate: 19, taxAmount: 16564, totalPremiumInclTax: 103744,
    broker: "Global Marine Insurance", brokerReferenceNumber: "GMI-2026-002",
    brokerContact: "Linda Kovacs", insurerClub: "UK P&I Club",
    leadingUnderwriter: "NHC", insurerContact: "Mark Spencer",
    reviewedBy: "Nikhil Mathew", reviewedDate: "2026-02-01",
    approvedBy: "", approvedDate: "", signedOffBy: "", signedOffDate: "",
    dateOfNotificationToBroker: "2026-02-05",
    policyStartDate: "2026-03-01", policyEndDate: "2026-08-31", renewalTerms: "+3%",
    sourceModule: "Fixture", inquiryReference: "", fixtureReference: "AEW-F-2026-407",
    claimReference: "", vesselLookup: "", voyageFixtureContext: "VOY-2026-045",
    linkedClaimExists: true, linkedClaimNumbers: ["CLM-2026-001"],
  },
  {
    id: "ins-3", policyNo: "INS-2026-003", createdAt: "2026-03-15",
    additionalInsuranceRequired: false, insuranceStatus: "Active",
    insuranceOwner: "Aiswaryaa Adminren", assignedTo: "Nikhil Mathew",
    nextActionDate: "2026-06-15", nextActionNote: "Awaiting approval from insurer.",
    insuranceCategory: "Crew", fixture: "", vessel: "", crew: "All crew — MV PACIFIC VOYAGER",
    typeOfCover: "Crew Liability", insuranceTypeClauseType: "Bespoke / Other",

    policyNumber: "", policyCoverReference: "",
    currency: "USD", sumInsured: 500000, totalSumInsured: 500000,
    deductible: 5000, dailyIndemnity: 22000, basisTerms: "14/180/180",
    premiumRate: 0, annualPremium: 0, taxRate: 0, taxAmount: 0, totalPremiumInclTax: 0,
    broker: "Seaborne Insurance Group", brokerReferenceNumber: "", brokerContact: "",
    insurerClub: "American Club", leadingUnderwriter: "", insurerContact: "",
    reviewedBy: "", reviewedDate: "", approvedBy: "", approvedDate: "",
    signedOffBy: "", signedOffDate: "", dateOfNotificationToBroker: "",
    policyStartDate: "2026-04-01", policyEndDate: "2026-09-30", renewalTerms: "",
    sourceModule: "Crew", inquiryReference: "", fixtureReference: "",
    claimReference: "", vesselLookup: "", voyageFixtureContext: "",
    linkedClaimExists: false, linkedClaimNumbers: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="text-sm font-semibold text-gray-900 whitespace-nowrap">{children}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5 mb-4">
      {children}
    </p>
  );
}

function CurrencyInput({
  label, value, onChange, currency, placeholder, mandatory,
}: {
  label: string; value: number; onChange: (v: number) => void;
  currency: string; placeholder?: string; mandatory?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}{mandatory && <span className="text-red-500 ml-0.5">*</span>}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium select-none">{currency}</span>
        <Input
          type="number" min={0}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pl-11"
          placeholder={placeholder ?? "0.00"}
        />
      </div>
    </div>
  );
}

function PercentInput({
  label, value, onChange, placeholder,
}: {
  label: string; value: number; onChange: (v: number) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="number" min={0} step="0.000001"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pr-7"
          placeholder={placeholder ?? "0.000"}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">%</span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Insurance() {
  const [policies, setPolicies] = useState<InsuranceRecord[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "none", status: "none", vessel: "none" });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<InsuranceRecord, "id" | "createdAt">>(EMPTY_FORM);
  const [activeOverlayTab, setActiveOverlayTab] = useState("Overview");

  // ── Derived ────────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        p.policyNo.toLowerCase().includes(q) ||
        p.insuranceCategory.toLowerCase().includes(q) ||
        p.typeOfCover.toLowerCase().includes(q) ||
        p.insurerClub.toLowerCase().includes(q) ||
        p.broker.toLowerCase().includes(q) ||
        p.vessel.toLowerCase().includes(q) ||
        p.fixture.toLowerCase().includes(q);

      const matchesCategory = filters.category === "none" || p.insuranceCategory === filters.category;
      const matchesStatus   = filters.status   === "none" || p.insuranceStatus   === filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [policies, searchQuery, filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== "none").length;

  const linkedEntity = (p: InsuranceRecord) => {
    if (p.insuranceCategory === "Vessel") return p.vessel || "—";
    if (p.insuranceCategory === "Fixture") return p.fixture || "—";
    if (p.insuranceCategory === "Crew") return p.crew || "—";
    return "—";
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const updateField = (field: string, value: unknown) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleOpenAdd = () => {
    const newNo = `INS-${new Date().getFullYear()}-${String(policies.length + 1).padStart(3, "0")}`;
    setFormData({ ...EMPTY_FORM, policyNo: newNo });
    setEditingId(null);
    setActiveOverlayTab("Overview");
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (p: InsuranceRecord) => {
    const { id: _id, createdAt: _c, ...rest } = p;
    setFormData(rest);
    setEditingId(p.id);
    setActiveOverlayTab("Overview");
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    const record: InsuranceRecord = {
      id: editingId || Math.random().toString(36).substring(2, 9),
      createdAt: editingId
        ? (policies.find((p) => p.id === editingId)?.createdAt ?? new Date().toISOString().slice(0, 10))
        : new Date().toISOString().slice(0, 10),
      ...formData,
      broker:         formData.broker         === "none" ? "" : formData.broker,
      insuranceOwner: formData.insuranceOwner === "none" ? "" : formData.insuranceOwner,
      assignedTo:     formData.assignedTo     === "none" ? "" : formData.assignedTo,
      reviewedBy:     formData.reviewedBy     === "none" ? "" : formData.reviewedBy,
      approvedBy:     formData.approvedBy     === "none" ? "" : formData.approvedBy,
      signedOffBy:    formData.signedOffBy    === "none" ? "" : formData.signedOffBy,
      insurerClub:    formData.insurerClub    === "none" ? "" : formData.insurerClub,
    };

    if (editingId) {
      setPolicies((prev) => prev.map((p) => (p.id === editingId ? record : p)));
    } else {
      setPolicies((prev) => [record, ...prev]);
    }
    setIsSheetOpen(false);
  };

  const coverTypes = formData.insuranceCategory !== "none"
    ? TYPE_OF_COVER_BY_CATEGORY[formData.insuranceCategory] ?? []
    : [];

  const isLoH = formData.typeOfCover === "Loss of Hire";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa]">

      {/* ── Top Header Bar ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center justify-end h-14 px-5">
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-600">USER_ID: 001 | Chennai, Kollam...</span>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <Bell className="size-5 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <Menu className="size-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Action Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-5 py-3">

          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-gray-400" />
              <Input
                type="text"
                placeholder="Search insurance..."
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
                    "h-9 gap-2 text-[13px] font-normal border-gray-300 hover:bg-gray-50 bg-white px-3",
                    activeFilterCount > 0 && "bg-blue-50 border-blue-200 text-blue-700"
                  )}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="start">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm">Filter Insurance</h4>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm"
                      className="h-auto p-0 text-[11px] text-red-500 hover:text-red-600 hover:bg-transparent"
                      onClick={() => setFilters({ category: "none", status: "none", vessel: "none" })}
                    >Clear All</Button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Insurance Category</Label>
                    <Select value={filters.category} onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Categories" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">All Categories</SelectItem>
                        {INSURANCE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Status</Label>
                    <Select value={filters.status} onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">All Statuses</SelectItem>
                        {INSURANCE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm h-9">
              {(["All", "Active", "Expired", "Cancelled", "Closed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilters((f) => ({ ...f, status: tab === "All" ? "none" : tab }))}
                  className={`px-3 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap h-full ${
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

          <Button size="sm" className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleOpenAdd}>
            <Plus className="size-4" />
            New Insurance
          </Button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-5">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 whitespace-nowrap">Insurance No</th>
                  <th className="px-4 py-3 whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 whitespace-nowrap">Type of Cover</th>
                  <th className="px-4 py-3 whitespace-nowrap">Linked Entity</th>
                  <th className="px-4 py-3 whitespace-nowrap">Broker</th>
                  <th className="px-4 py-3 whitespace-nowrap">Insurer / Club</th>
                  <th className="px-4 py-3 whitespace-nowrap">Policy Start</th>
                  <th className="px-4 py-3 whitespace-nowrap">Policy End</th>
                  <th className="px-4 py-3 whitespace-nowrap">Insurance Owner</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Sum Insured</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Annual Premium</th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center sticky right-0 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-4 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <Shield className="size-6 text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900">No insurance records found</p>
                        <p className="text-sm text-gray-400">
                          {searchQuery || activeFilterCount > 0
                            ? "Try adjusting your search or filters."
                            : "Click \"New Insurance\" to add the first record."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                      onClick={() => handleOpenEdit(p)}
                    >
                      <td className="px-4 py-3 font-medium text-blue-600 whitespace-nowrap group-hover:underline">{p.policyNo}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {p.insuranceCategory ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_STYLES[p.insuranceCategory] ?? "bg-gray-100 text-gray-600"}`}>
                            {p.insuranceCategory}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{p.typeOfCover || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{linkedEntity(p)}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.broker || "—"}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">{p.insurerClub || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.policyStartDate || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.policyEndDate || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.insuranceOwner || "—"}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium text-right whitespace-nowrap">
                        {p.sumInsured ? `${p.sumInsured.toLocaleString()} ${p.currency}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-right whitespace-nowrap">
                        {p.annualPremium ? `${p.annualPremium.toLocaleString()} ${p.currency}` : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[p.insuranceStatus] ?? "bg-gray-100 text-gray-700"}`}>
                          {p.insuranceStatus || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                          <MoreVertical className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="mt-auto border-t border-gray-100 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 bg-gray-50/60">
              <span>Found <span className="font-medium text-gray-700">{filtered.length}</span> record{filtered.length !== 1 ? "s" : ""}</span>
              <span>{filtered.length} of {policies.length} total</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit Sheet ──────────────────────────────────────────────── */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[49]"
          onClick={() => setIsSheetOpen(false)}
        />
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={false}>
        <SheetContent
          side="right"
          className="!max-w-none w-full sm:w-[500px] md:w-[600px] lg:w-1/2 flex flex-col h-full overflow-hidden p-0 bg-white"
        >

          {/* ── Fixed header ───────────────────────────────────────────────── */}
          <div className="shrink-0 px-6 pt-6">
            <SheetHeader className="mb-5 space-y-1">
              <SheetTitle className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Insurance" : "New Insurance"}
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                {editingId
                  ? "Update insurance details and manage associated records."
                  : "Enter details for the new insurance record."}
              </SheetDescription>
            </SheetHeader>

            {/* Summary strip — edit mode */}
            {editingId && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-8">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Insurance No</span>
                  <span className="font-semibold text-gray-900">{formData.policyNo || "—"}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</span>
                  <span className="font-medium text-gray-900">{formData.insuranceCategory !== "none" ? formData.insuranceCategory : "—"}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type of Cover</span>
                  <span className="font-medium text-gray-900">{formData.typeOfCover !== "none" ? formData.typeOfCover : "—"}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Policy Period</span>
                  <span className="font-medium text-gray-900">
                    {formData.policyStartDate && formData.policyEndDate
                      ? `${formData.policyStartDate} → ${formData.policyEndDate}`
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[formData.insuranceStatus] ?? "bg-gray-100 text-gray-800"}`}>
                    {formData.insuranceStatus !== "none" ? formData.insuranceStatus : "Draft"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Insurer / Club</span>
                  <span className="font-medium text-gray-900">{formData.insurerClub !== "none" && formData.insurerClub ? formData.insurerClub : "—"}</span>
                </div>
              </div>
            )}

            {/* Tab bar — edit mode */}
            {editingId && (
              <div className="border-b border-gray-200 mt-4">
                <div className="flex space-x-6">
                  {["Overview", "Legal Review"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveOverlayTab(tab)}
                      className={`pb-3 text-[13px] font-medium transition-colors relative ${
                        activeOverlayTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                      {activeOverlayTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffd700]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Scrollable content ──────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-6">

            {(!editingId || activeOverlayTab === "Overview") && (
            <div className="space-y-10">

              {/* ── 1. Cover Details ─────────────────────────────────────────── */}
              <div>
                <SectionHeader>Cover Details</SectionHeader>

                <SubHeader>Category &amp; Entity</SubHeader>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label>Insurance Category</Label>
                    <Select value={formData.insuranceCategory}
                      onValueChange={(v) => {
                        updateField("insuranceCategory", v);
                        updateField("typeOfCover", "none");
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select category</SelectItem>
                        {INSURANCE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.insuranceCategory === "Fixture" && (
                    <div className="space-y-2">
                      <Label>Fixture</Label>
                      <Select value={formData.fixture} onValueChange={(v) => updateField("fixture", v)}>
                        <SelectTrigger><SelectValue placeholder="Select fixture" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select fixture</SelectItem>
                          {FIXTURES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.insuranceCategory === "Vessel" && (
                    <div className="space-y-2">
                      <Label>Vessel</Label>
                      <Select value={formData.vessel} onValueChange={(v) => updateField("vessel", v)}>
                        <SelectTrigger><SelectValue placeholder="Select vessel" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select vessel</SelectItem>
                          {VESSELS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.insuranceCategory === "Crew" && (
                    <div className="space-y-2">
                      <Label>Crew</Label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.crew}
                        onChange={(e) => updateField("crew", e.target.value)}
                        placeholder="Crew member(s) or description"
                      />
                    </div>
                  )}
                </div>

                <SubHeader>Cover &amp; Policy</SubHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type of Cover</Label>
                    <Select
                      value={formData.typeOfCover}
                      onValueChange={(v) => updateField("typeOfCover", v)}
                      disabled={formData.insuranceCategory === "none"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.insuranceCategory === "none" ? "Select category first" : "Select type of cover"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select type of cover</SelectItem>
                        {coverTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {formData.insuranceCategory === "none" && (
                      <p className="text-xs text-amber-600">Select Insurance Category first to load options.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Insurance Type / Clause Type</Label>
                    <Select value={formData.insuranceTypeClauseType} onValueChange={(v) => updateField("insuranceTypeClauseType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select clause type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select clause type</SelectItem>
                        {CLAUSE_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Policy Number</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.policyNumber}
                      onChange={(e) => updateField("policyNumber", e.target.value)}
                      placeholder="e.g. POL-2026-001"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Policy / Cover Reference</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.policyCoverReference}
                      onChange={(e) => updateField("policyCoverReference", e.target.value)}
                      placeholder="e.g. REF-001"
                    />
                  </div>
                </div>
              </div>

              {/* ── 2. Financials ─────────────────────────────────────────────── */}
              <div>
                <SectionHeader>Financials</SectionHeader>

                <SubHeader>Coverage Values</SubHeader>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <CurrencyInput label="Sum Insured" value={formData.sumInsured} onChange={(v) => updateField("sumInsured", v)} currency={formData.currency} mandatory />
                  <CurrencyInput label="Total Sum Insured (TSI)" value={formData.totalSumInsured} onChange={(v) => updateField("totalSumInsured", v)} currency={formData.currency} />
                  <CurrencyInput label="Deductible" value={formData.deductible} onChange={(v) => updateField("deductible", v)} currency={formData.currency} mandatory />

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Daily Indemnity (LoH)
                      {isLoH && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium select-none">{formData.currency}</span>
                      <Input
                        type="number" min={0}
                        value={formData.dailyIndemnity || ""}
                        onChange={(e) => updateField("dailyIndemnity", Number(e.target.value))}
                        className="pl-11"
                        placeholder="e.g. 22000"
                      />
                    </div>
                    {isLoH && !formData.dailyIndemnity && (
                      <p className="text-[10px] text-amber-500">Required for LoH cover</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Basis / Terms
                      {isLoH && <span className="text-[10px] font-normal text-gray-400 ml-1">(LoH)</span>}
                    </Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.basisTerms}
                      onChange={(e) => updateField("basisTerms", e.target.value)}
                      placeholder="e.g. 14/180/180"
                    />
                  </div>
                </div>

                <SubHeader>Premium Details</SubHeader>
                <div className="grid grid-cols-2 gap-4">
                  <PercentInput label="Premium Rate (%)" value={formData.premiumRate} onChange={(v) => updateField("premiumRate", v)} placeholder="e.g. 0.181992" />
                  <CurrencyInput label="Annual Premium" value={formData.annualPremium} onChange={(v) => updateField("annualPremium", v)} currency={formData.currency} />
                  <PercentInput label="Tax Rate (%)" value={formData.taxRate} onChange={(v) => updateField("taxRate", v)} placeholder="e.g. 3" />
                  <CurrencyInput label="Tax Amount" value={formData.taxAmount} onChange={(v) => updateField("taxAmount", v)} currency={formData.currency} />
                  <div className="col-span-2">
                    <CurrencyInput label="Total Premium Incl. Tax" value={formData.totalPremiumInclTax} onChange={(v) => updateField("totalPremiumInclTax", v)} currency={formData.currency} />
                  </div>
                </div>
              </div>

              {/* ── 3. Parties ──────────────────────────────────────────────── */}
              <div>
                <SectionHeader>Parties</SectionHeader>

                <SubHeader>Broker</SubHeader>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label>Broker</Label>
                    <Select value={formData.broker} onValueChange={(v) => updateField("broker", v)}>
                      <SelectTrigger><SelectValue placeholder="Select broker" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select broker</SelectItem>
                        {BROKERS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Broker Reference Number</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.brokerReferenceNumber}
                      onChange={(e) => updateField("brokerReferenceNumber", e.target.value)}
                      placeholder="e.g. BRK-REF-001"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Broker Contact</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.brokerContact}
                      onChange={(e) => updateField("brokerContact", e.target.value)}
                      placeholder="Contact name or email"
                    />
                  </div>
                </div>

                <SubHeader>Insurer</SubHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Insurer / Club <span className="text-red-500">*</span></Label>
                    <Select value={formData.insurerClub} onValueChange={(v) => updateField("insurerClub", v)}>
                      <SelectTrigger><SelectValue placeholder="Select insurer / club" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select insurer / club</SelectItem>
                        {INSURERS_CLUBS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Leading Underwriter</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.leadingUnderwriter}
                      onChange={(e) => updateField("leadingUnderwriter", e.target.value)}
                      placeholder="e.g. Gard M&E, NHC"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Insurer Contact</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.insurerContact}
                      onChange={(e) => updateField("insurerContact", e.target.value)}
                      placeholder="Contact name or email"
                    />
                  </div>
                </div>
              </div>

              {/* ── 4. Workflow & Dates ──────────────────────────────────────── */}
              <div>
                <SectionHeader>Workflow &amp; Dates</SectionHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Notification to Broker</Label>
                    <Input type="date" value={formData.dateOfNotificationToBroker} onChange={(e) => updateField("dateOfNotificationToBroker", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Policy Start Date <span className="text-red-500">*</span></Label>
                    <Input type="date" value={formData.policyStartDate} onChange={(e) => updateField("policyStartDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Policy End Date <span className="text-red-500">*</span></Label>
                    <Input type="date" value={formData.policyEndDate} onChange={(e) => updateField("policyEndDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Renewal Terms</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.renewalTerms}
                      onChange={(e) => updateField("renewalTerms", e.target.value)}
                      placeholder="e.g. +3%; as expiry"
                    />
                  </div>
                </div>
              </div>

              {/* ── 5. General ───────────────────────────────────────────────── */}
              <div>
                <SectionHeader>General</SectionHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Insurance Status <span className="text-red-500">*</span></Label>
                    <Select value={formData.insuranceStatus} onValueChange={(v) => updateField("insuranceStatus", v)}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select status</SelectItem>
                        {INSURANCE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Created By</Label>
                    <Select value={formData.insuranceOwner} onValueChange={(v) => updateField("insuranceOwner", v)}>
                      <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select user</SelectItem>
                        {USERS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Remarks</Label>
                  <Textarea
                    value={formData.nextActionNote}
                    onChange={(e) => updateField("nextActionNote", e.target.value)}
                    placeholder="Add any remarks or notes..."
                    className="resize-none min-h-[80px]"
                  />
                </div>
              </div>

            </div>
            )}

            {editingId && activeOverlayTab === "Legal Review" && (
              <LegalReviewEmbedded
                moduleType="Insurance"
                moduleId={formData.policyNo}
              />
            )}

          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          {(!editingId || activeOverlayTab === "Overview") && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center shrink-0 justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="bg-white">
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px]"
                onClick={handleSave}
              >
                <Check className="w-4 h-4 mr-2" />
                {editingId ? "Update Insurance" : "Create Insurance"}
              </Button>
            </div>
          )}

        </SheetContent>
      </Sheet>
    </div>
  );
}
