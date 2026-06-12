import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Users } from "lucide-react";
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

type PartyType = "Surveyor / Expert" | "Lawyer" | "Correspondent" | "Adjuster" | "Engineer";

interface ExternalPartyEntry {
  id: string;
  type: PartyType;
  data: Record<string, string>;
}

// ─── Defaults per type ────────────────────────────────────────────────────────

const DEFAULTS: Record<PartyType, Record<string, string>> = {
  "Surveyor / Expert": {
    surveyorName: "",
    surveyorCompany: "",
    appointmentDate: "",
    attendanceDate: "",
    reportReceivedDate: "",
    status: "To Be Appointed",
    referenceNo: "",
    remarks: "",
  },
  "Lawyer": {
    lawyerAppointed: "No",
    lawyerName: "",
    lawFirm: "",
    appointmentDate: "",
    status: "Not Required",
    reference: "",
    remarks: "",
  },
  "Correspondent": {
    correspondentAppointed: "No",
    correspondentName: "",
    correspondentCompany: "",
    appointmentDate: "",
    status: "Not Required",
    reference: "",
    remarks: "",
  },
  "Adjuster": {
    adjusterAppointed: "No",
    adjusterName: "",
    adjusterCompany: "",
    appointmentDate: "",
    status: "Not Required",
    reference: "",
    remarks: "",
  },
  "Engineer": {
    engineerRefNo: "",
    responsibleEngineer: "",
    status: "Not Required",
    remarks: "",
  },
};

// ─── Style maps ───────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<PartyType, string> = {
  "Surveyor / Expert": "bg-violet-100 text-violet-700",
  "Lawyer":            "bg-blue-100 text-blue-700",
  "Correspondent":     "bg-teal-100 text-teal-700",
  "Adjuster":          "bg-amber-100 text-amber-700",
  "Engineer":          "bg-indigo-100 text-indigo-700",
};

const STATUS_STYLES: Record<string, string> = {
  "Not Required":       "bg-gray-100 text-gray-500",
  "To Be Appointed":    "bg-yellow-100 text-yellow-700",
  "Requested":          "bg-yellow-100 text-yellow-700",
  "Appointed":          "bg-blue-100 text-blue-700",
  "Active":             "bg-blue-100 text-blue-700",
  "Attending":          "bg-blue-100 text-blue-700",
  "Reviewing":          "bg-orange-100 text-orange-700",
  "Report Pending":     "bg-orange-100 text-orange-700",
  "Attended":           "bg-green-100 text-green-700",
  "Advised":            "bg-green-100 text-green-700",
  "Report Received":    "bg-green-100 text-green-700",
  "Response Received":  "bg-green-100 text-green-700",
  "Closed":             "bg-gray-200 text-gray-600",
};

const PARTY_OPTIONS: PartyType[] = [
  "Surveyor / Expert",
  "Lawyer",
  "Correspondent",
  "Adjuster",
  "Engineer",
];

// Status options per type
const STATUS_OPTIONS: Record<PartyType, string[]> = {
  "Surveyor / Expert": ["Not Required","To Be Appointed","Appointed","Attended","Report Pending","Report Received","Closed"],
  "Lawyer":            ["Not Required","Appointed","Reviewing","Advised","Active","Closed"],
  "Correspondent":     ["Not Required","Appointed","Active","Response Received","Closed"],
  "Adjuster":          ["Not Required","Appointed","Reviewing","Report Pending","Report Received","Closed"],
  "Engineer":          ["Not Required","Requested","Reviewing","Response Received","Closed"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _idCounter = 1;
function genId() { return `ep-${Date.now()}-${_idCounter++}`; }

function getDisplayName(entry: ExternalPartyEntry): string {
  const d = entry.data;
  const name =
    d.surveyorName || d.lawyerName || d.correspondentName || d.adjusterName || d.responsibleEngineer;
  return name || `Unnamed ${entry.type}`;
}

function FieldRow({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-amber-600">{hint}</p>}
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest pt-2 pb-1 border-b border-gray-100">
      {children}
    </div>
  );
}

// ─── Field renderers per party type ──────────────────────────────────────────

function SurveyorFields({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <SectionHead>Survey Details</SectionHead>

      <FieldRow label="Surveyor / Expert Name">
        <Input value={data.surveyorName} onChange={e => onChange("surveyorName", e.target.value)} placeholder="Name or firm" className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Surveyor / Expert Company">
        <Input value={data.surveyorCompany} onChange={e => onChange("surveyorCompany", e.target.value)} placeholder="Company name" className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Survey Status">
        <Select value={data.status} onValueChange={v => onChange("status", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            {STATUS_OPTIONS["Surveyor / Expert"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Survey Reference Number">
        <Input value={data.referenceNo} onChange={e => onChange("referenceNo", e.target.value)} placeholder="External survey ref" className="h-8 text-xs" />
      </FieldRow>

      <SectionHead>Dates</SectionHead>

      <FieldRow label="Survey Appointment Date">
        <Input type="date" value={data.appointmentDate} onChange={e => onChange("appointmentDate", e.target.value)} className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Survey Attendance Date">
        <Input type="date" value={data.attendanceDate} onChange={e => onChange("attendanceDate", e.target.value)} className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Survey Report Received Date">
        <Input type="date" value={data.reportReceivedDate} onChange={e => onChange("reportReceivedDate", e.target.value)} className="h-8 text-xs" />
      </FieldRow>

      <SectionHead>Notes</SectionHead>

      <div className="col-span-2">
        <FieldRow label="Survey Remarks">
          <Textarea value={data.remarks} onChange={e => onChange("remarks", e.target.value)} placeholder="Internal notes on survey outcome / expectations..." rows={2} className="resize-none text-xs" />
        </FieldRow>
      </div>
    </div>
  );
}

function LawyerFields({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const appointed = data.lawyerAppointed === "Yes";
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <SectionHead>Legal Engagement</SectionHead>

      <FieldRow label="Lawyer Appointed">
        <Select value={data.lawyerAppointed} onValueChange={v => onChange("lawyerAppointed", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Lawyer Status">
        <Select value={data.status} onValueChange={v => onChange("status", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            {STATUS_OPTIONS["Lawyer"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Lawyer Name" required={appointed} hint={!appointed && data.lawyerAppointed === "No" ? undefined : undefined}>
        <Input
          value={data.lawyerName}
          onChange={e => onChange("lawyerName", e.target.value)}
          placeholder="Full name"
          disabled={!appointed}
          className={`h-8 text-xs ${!appointed ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {!appointed && <p className="text-[10px] text-gray-400">Required when Lawyer Appointed = Yes</p>}
      </FieldRow>

      <FieldRow label="Law Firm / Legal Entity">
        <Input value={data.lawFirm} onChange={e => onChange("lawFirm", e.target.value)} placeholder="Law firm name" className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Lawyer Appointment Date" required={appointed}>
        <Input
          type="date"
          value={data.appointmentDate}
          onChange={e => onChange("appointmentDate", e.target.value)}
          disabled={!appointed}
          className={`h-8 text-xs ${!appointed ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {!appointed && <p className="text-[10px] text-gray-400">Required when Lawyer Appointed = Yes</p>}
      </FieldRow>

      <FieldRow label="Lawyer Reference">
        <Input value={data.reference} onChange={e => onChange("reference", e.target.value)} placeholder="Legal matter reference" className="h-8 text-xs" />
      </FieldRow>

      <SectionHead>Notes</SectionHead>

      <div className="col-span-2">
        <FieldRow label="Lawyer Remarks">
          <Textarea value={data.remarks} onChange={e => onChange("remarks", e.target.value)} placeholder="Internal notes on legal position / support..." rows={2} className="resize-none text-xs" />
        </FieldRow>
      </div>
    </div>
  );
}

function CorrespondentFields({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const appointed = data.correspondentAppointed === "Yes";
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <SectionHead>Correspondent Details</SectionHead>

      <FieldRow label="Correspondent Appointed">
        <Select value={data.correspondentAppointed} onValueChange={v => onChange("correspondentAppointed", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Correspondent Status">
        <Select value={data.status} onValueChange={v => onChange("status", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            {STATUS_OPTIONS["Correspondent"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Correspondent Name" required={appointed}>
        <Input
          value={data.correspondentName}
          onChange={e => onChange("correspondentName", e.target.value)}
          placeholder="Full name"
          disabled={!appointed}
          className={`h-8 text-xs ${!appointed ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {!appointed && <p className="text-[10px] text-gray-400">Required when Correspondent Appointed = Yes</p>}
      </FieldRow>

      <FieldRow label="Correspondent Company">
        <Input value={data.correspondentCompany} onChange={e => onChange("correspondentCompany", e.target.value)} placeholder="Company / club correspondent" className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Correspondent Appointment Date" required={appointed}>
        <Input
          type="date"
          value={data.appointmentDate}
          onChange={e => onChange("appointmentDate", e.target.value)}
          disabled={!appointed}
          className={`h-8 text-xs ${!appointed ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {!appointed && <p className="text-[10px] text-gray-400">Required when Correspondent Appointed = Yes</p>}
      </FieldRow>

      <FieldRow label="Correspondent Reference">
        <Input value={data.reference} onChange={e => onChange("reference", e.target.value)} placeholder="File number or external ref" className="h-8 text-xs" />
      </FieldRow>

      <SectionHead>Notes</SectionHead>

      <div className="col-span-2">
        <FieldRow label="Correspondent Remarks">
          <Textarea value={data.remarks} onChange={e => onChange("remarks", e.target.value)} placeholder="Notes on local handling / authority contact..." rows={2} className="resize-none text-xs" />
        </FieldRow>
      </div>
    </div>
  );
}

function AdjusterFields({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const appointed = data.adjusterAppointed === "Yes";
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <SectionHead>Adjuster Details</SectionHead>

      <FieldRow label="Adjuster Appointed">
        <Select value={data.adjusterAppointed} onValueChange={v => onChange("adjusterAppointed", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Adjuster Status">
        <Select value={data.status} onValueChange={v => onChange("status", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            {STATUS_OPTIONS["Adjuster"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Adjuster Name" required={appointed}>
        <Input
          value={data.adjusterName}
          onChange={e => onChange("adjusterName", e.target.value)}
          placeholder="Full name"
          disabled={!appointed}
          className={`h-8 text-xs ${!appointed ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {!appointed && <p className="text-[10px] text-gray-400">Required when Adjuster Appointed = Yes</p>}
      </FieldRow>

      <FieldRow label="Adjuster Company">
        <Input value={data.adjusterCompany} onChange={e => onChange("adjusterCompany", e.target.value)} placeholder="Adjusting firm" className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Adjuster Appointment Date" required={appointed}>
        <Input
          type="date"
          value={data.appointmentDate}
          onChange={e => onChange("appointmentDate", e.target.value)}
          disabled={!appointed}
          className={`h-8 text-xs ${!appointed ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {!appointed && <p className="text-[10px] text-gray-400">Required when Adjuster Appointed = Yes</p>}
      </FieldRow>

      <FieldRow label="Adjuster Reference">
        <Input value={data.reference} onChange={e => onChange("reference", e.target.value)} placeholder="Adjuster file number" className="h-8 text-xs" />
      </FieldRow>

      <SectionHead>Notes</SectionHead>

      <div className="col-span-2">
        <FieldRow label="Adjuster Remarks">
          <Textarea value={data.remarks} onChange={e => onChange("remarks", e.target.value)} placeholder="Operational notes on adjuster progress..." rows={2} className="resize-none text-xs" />
        </FieldRow>
      </div>
    </div>
  );
}

function EngineerFields({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <SectionHead>Engineering Details</SectionHead>

      <FieldRow label="Responsible Engineer">
        <Input value={data.responsibleEngineer} onChange={e => onChange("responsibleEngineer", e.target.value)} placeholder="Engineer name" className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Engineer Reference No">
        <Input value={data.engineerRefNo} onChange={e => onChange("engineerRefNo", e.target.value)} placeholder="Engineering module ref" className="h-8 text-xs" />
      </FieldRow>

      <FieldRow label="Engineer Status">
        <Select value={data.status} onValueChange={v => onChange("status", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[600]">
            {STATUS_OPTIONS["Engineer"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldRow>

      <SectionHead>Notes</SectionHead>

      <div className="col-span-2">
        <FieldRow label="Engineer Remarks">
          <Textarea value={data.remarks} onChange={e => onChange("remarks", e.target.value)} placeholder="Notes on technical findings / coordination..." rows={2} className="resize-none text-xs" />
        </FieldRow>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ExternalPartiesEmbeddedProps {
  claimId: string;
}

export function ExternalPartiesEmbedded({ claimId }: ExternalPartiesEmbeddedProps) {
  const [entries, setEntries] = useState<ExternalPartyEntry[]>(() => {
    // Pre-seed some data for specific claims
    const seed: Record<string, ExternalPartyEntry[]> = {
      "1": [
        {
          id: "ep-seed-1",
          type: "Surveyor / Expert",
          data: { ...DEFAULTS["Surveyor / Expert"], surveyorName: "James Hartley", surveyorCompany: "Marine Survey International", appointmentDate: "2024-02-20", status: "Report Received", referenceNo: "MSI-2024-0891", remarks: "Final survey report confirms cargo damage consistent with heavy weather." },
        },
        {
          id: "ep-seed-2",
          type: "Lawyer",
          data: { ...DEFAULTS["Lawyer"], lawyerAppointed: "Yes", lawyerName: "Sarah Chen", lawFirm: "Chen & Associates Maritime Law", appointmentDate: "2024-03-01", status: "Active", reference: "CA-2024-CLM-045", remarks: "Engaged for recovery from carrier." },
        },
      ],
      "2": [
        {
          id: "ep-seed-3",
          type: "Surveyor / Expert",
          data: { ...DEFAULTS["Surveyor / Expert"], surveyorName: "Carlos Reyes", surveyorCompany: "Lloyd's Agency Rotterdam", appointmentDate: "2024-03-05", attendanceDate: "2024-03-06", status: "Report Pending", referenceNo: "LAR-2024-0567" },
        },
      ],
      "7": [
        {
          id: "ep-seed-4",
          type: "Correspondent",
          data: { ...DEFAULTS["Correspondent"], correspondentAppointed: "Yes", correspondentName: "Erik van Dijk", correspondentCompany: "P&I Club Houston Agent", appointmentDate: "2024-02-08", status: "Active", reference: "HOU-2024-0234", remarks: "Coordinating with port authority on oil spill response." },
        },
        {
          id: "ep-seed-5",
          type: "Adjuster",
          data: { ...DEFAULTS["Adjuster"], adjusterAppointed: "Yes", adjusterName: "Michael Thompson", adjusterCompany: "Crawford & Co Marine", appointmentDate: "2024-02-10", status: "Reviewing", reference: "CCM-2024-1122" },
        },
      ],
    };
    return seed[claimId] ?? [];
  });

  const [expandedIds, setExpandedIds]   = useState<string[]>(() => {
    // First entry expanded by default if seeded
    return entries.length > 0 ? [entries[0].id] : [];
  });
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [deleteId, setDeleteId]         = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const addParty = (type: PartyType) => {
    const entry: ExternalPartyEntry = { id: genId(), type, data: { ...DEFAULTS[type] } };
    setEntries(prev => [entry, ...prev]);
    setExpandedIds(prev => [entry.id, ...prev]);
    setIsMenuOpen(false);
  };

  const removeParty = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setExpandedIds(prev => prev.filter(x => x !== id));
    setDeleteId(null);
  };

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const updateData = (id: string, key: string, value: string) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, data: { ...e.data, [key]: value } } : e));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">

      {/* ── Add External Party button ──────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(v => !v)}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="size-4" />
            Add External Party
            <ChevronDown className="size-4 text-gray-400" />
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-[200] py-1">
              {PARTY_OPTIONS.map(type => (
                <button
                  key={type}
                  onClick={() => addParty(type)}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${TYPE_STYLES[type]}`}>
                    {type.charAt(0)}
                  </span>
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 z-[199]" onClick={() => setIsMenuOpen(false)} />
        )}
      </div>

      {/* ── Entry list ────────────────────────────────────────────────────── */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-gray-400">
          <Users className="size-10 opacity-30" />
          <p className="text-sm font-medium">No external parties added yet</p>
          <p className="text-xs">Use "Add External Party" to record surveyors, lawyers, correspondents and more.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => {
            const isOpen = expandedIds.includes(entry.id);
            const displayName = getDisplayName(entry);
            const status = entry.data.status;

            return (
              <div key={entry.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">

                {/* ── Collapsed header ──────────────────────────────────── */}
                <div className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors">
                  <button
                    className="flex items-center gap-3 flex-1 text-left min-w-0"
                    onClick={() => toggleExpand(entry.id)}
                  >
                    <span className="text-gray-400 shrink-0">
                      {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </span>
                    <span className="text-xs font-mono text-gray-400 shrink-0 w-5">{String(idx + 1).padStart(2, "0")}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold shrink-0 ${TYPE_STYLES[entry.type]}`}>
                      {entry.type}
                    </span>
                    <span className="text-sm font-medium text-gray-800 truncate flex-1">{displayName}</span>
                    {status && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"}`}>
                        {status}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteId(entry.id)}
                    className="ml-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
                    title="Remove"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {/* ── Expanded form ─────────────────────────────────────── */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-5 bg-gray-50">
                    {entry.type === "Surveyor / Expert" && (
                      <SurveyorFields data={entry.data} onChange={(k, v) => updateData(entry.id, k, v)} />
                    )}
                    {entry.type === "Lawyer" && (
                      <LawyerFields data={entry.data} onChange={(k, v) => updateData(entry.id, k, v)} />
                    )}
                    {entry.type === "Correspondent" && (
                      <CorrespondentFields data={entry.data} onChange={(k, v) => updateData(entry.id, k, v)} />
                    )}
                    {entry.type === "Adjuster" && (
                      <AdjusterFields data={entry.data} onChange={(k, v) => updateData(entry.id, k, v)} />
                    )}
                    {entry.type === "Engineer" && (
                      <EngineerFields data={entry.data} onChange={(k, v) => updateData(entry.id, k, v)} />
                    )}

                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => toggleExpand(entry.id)}
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

      {/* ── Delete confirmation ────────────────────────────────────────────── */}
      {deleteId && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[400]" />
          <div className="fixed inset-0 flex items-center justify-center z-[410]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Remove External Party</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to remove this external party entry? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => removeParty(deleteId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
