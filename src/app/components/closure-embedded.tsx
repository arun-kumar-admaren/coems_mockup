import React, { useState } from "react";
import { Lock, CheckCircle, AlertCircle, Clock } from "lucide-react";
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

interface ClosureState {
  closureReason: string;
  closureDate: string;
  closureSummary: string;
  finalOutcomeCategory: string;
  closedBy: string;
  lessonsLearned: string;
  repeatRiskFlag: string;
  repeatRiskRemarks: string;
  recommendedPreventiveAction: string;
  closureApprovalRequired: string;
  closureApprovedBy: string;
  closureApprovedDate: string;
  internalClosureNotes: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CLOSURE_REASONS = ["Settled", "Defended", "Withdrawn", "Time-barred", "Unrecoverable", "Other"];

const FINAL_OUTCOME_CATEGORIES = [
  "Commercial Resolution",
  "Insurance Settlement",
  "Legal Defense Success",
  "Partial Recovery",
  "Full Recovery",
  "No Recovery",
  "Other",
];

const SYSTEM_USERS = [
  "Nikhil Mathew",
  "Sarah Chen",
  "James Hartley",
  "Priya Nair",
  "David Okonkwo",
  "Arun Kumar",
];

// ─── Closure seed ─────────────────────────────────────────────────────────────

function buildClosureSeed(claimId: string, claimStatus: string): ClosureState {
  const base: ClosureState = {
    closureReason: "", closureDate: "", closureSummary: "", finalOutcomeCategory: "",
    closedBy: "", lessonsLearned: "", repeatRiskFlag: "No", repeatRiskRemarks: "",
    recommendedPreventiveAction: "", closureApprovalRequired: "No",
    closureApprovedBy: "", closureApprovedDate: "", internalClosureNotes: "",
  };
  if (claimStatus !== "Close") return base;
  const seeds: Record<string, Partial<ClosureState>> = {
    "2": {
      closureReason: "Settled", closureDate: "2024-05-18",
      closureSummary: "Cargo damage claim settled with charterer's P&I Club following joint survey confirmation. Settlement agreed at USD 88,000 inclusive of surveyor fees. All supporting documents filed.",
      finalOutcomeCategory: "Insurance Settlement", closedBy: "Nikhil Mathew",
      lessonsLearned: "Pre-loading condition surveys should be mandatory for high-value cargoes.",
      repeatRiskFlag: "Yes",
      repeatRiskRemarks: "Similar cargo type handled on same route. Risk of moisture damage remains.",
      recommendedPreventiveAction: "Implement moisture-resistant lining for break-bulk cargoes on this route.",
      closureApprovalRequired: "Yes", closureApprovedBy: "Sarah Chen", closureApprovedDate: "2024-05-20",
      internalClosureNotes: "File archived in M-Files under Claims > 2024 > Settled.",
    },
    "4": {
      closureReason: "Defended", closureDate: "2024-06-30",
      closureSummary: "Freight dispute successfully defended. Charterer's claim rejected on laytime calculation discrepancy.",
      finalOutcomeCategory: "Legal Defense Success", closedBy: "David Okonkwo",
      lessonsLearned: "Ensure NOR tendering and port log documentation is filed within 24 hours.",
      repeatRiskFlag: "No",
      recommendedPreventiveAction: "Update charter party templates to include clearer laytime definitions.",
      closureApprovalRequired: "No",
      internalClosureNotes: "Defended in-house. No legal costs incurred.",
    },
  };
  return { ...base, ...(seeds[claimId] ?? {}) };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHead({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">{title}</h3>;
}

function FieldWrap({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-700">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Documents Checklist sub-tab ──────────────────────────────────────────────

interface DocItem {
  value: string;
  note: string;
}

interface DocsState {
  claimNotice: DocItem;
  damageReport: DocItem;
  pictureEvidence: DocItem;
  billOfLading: DocItem;
  surveyReport: DocItem;
  invoiceDocs: DocItem;
  confirmedComplete: string;
}

type DocKey = Exclude<keyof DocsState, "confirmedComplete">;

const DOC_ITEMS: { key: DocKey; label: string }[] = [
  { key: "claimNotice",     label: "Claim Notice Available" },
  { key: "damageReport",    label: "Damage Report Available" },
  { key: "pictureEvidence", label: "Supporting Picture Evidence Available" },
  { key: "billOfLading",    label: "Bill of Lading Available" },
  { key: "surveyReport",    label: "Survey Report Available" },
  { key: "invoiceDocs",     label: "Invoice / Cost Documents Available" },
];

const emptyItem = (): DocItem => ({ value: "", note: "" });

export function DocumentsChecklist({ isClosed }: { isClosed: boolean }) {
  const [docs, setDocs] = useState<DocsState>({
    claimNotice:     emptyItem(),
    damageReport:    emptyItem(),
    pictureEvidence: emptyItem(),
    billOfLading:    emptyItem(),
    surveyReport:    emptyItem(),
    invoiceDocs:     emptyItem(),
    confirmedComplete: "",
  });

  const setItemValue = (key: DocKey, value: string) =>
    setDocs(prev => ({ ...prev, [key]: { ...(prev[key] as DocItem), value } }));

  const setItemNote = (key: DocKey, note: string) =>
    setDocs(prev => ({ ...prev, [key]: { ...(prev[key] as DocItem), note } }));

  const allAnswered = DOC_ITEMS.every(d => (docs[d.key] as DocItem).value !== "");
  const noCount     = DOC_ITEMS.filter(d => (docs[d.key] as DocItem).value === "No").length;
  const yesCount    = DOC_ITEMS.filter(d => (docs[d.key] as DocItem).value === "Yes").length;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Documents Checklist</h3>
          {allAnswered && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              noCount === 0
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {noCount === 0 ? "All documents available" : `${noCount} missing`} · {yesCount}/{DOC_ITEMS.length} confirmed
            </span>
          )}
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-[2fr_90px_1fr] gap-3 px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          <span>Document</span>
          <span className="text-center">Available</span>
          <span>Notes</span>
        </div>

        {/* Rows */}
        <div className="space-y-1.5">
          {DOC_ITEMS.map(({ key, label }) => {
            const item = docs[key] as DocItem;
            return (
              <div
                key={key}
                className={`grid grid-cols-[2fr_90px_1fr] gap-3 items-center px-3 py-2.5 rounded-lg border transition-colors ${
                  item.value === "No"
                    ? "bg-red-50/40 border-red-100"
                    : item.value === "Yes"
                      ? "bg-green-50/40 border-green-100"
                      : "bg-gray-50/50 border-gray-100"
                }`}
              >
                <span className="text-sm text-gray-700">{label}</span>

                {/* Yes / No toggle */}
                <div className="flex gap-1 justify-center">
                  {["Yes", "No"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setItemValue(key, opt)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        item.value === opt
                          ? opt === "Yes"
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-red-500 text-white border-red-500"
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Inline notes */}
                <Input
                  value={item.note}
                  onChange={e => setItemNote(key, e.target.value)}
                  placeholder={item.value === "No" ? "Reason / explanation..." : "Add note..."}
                  className="h-7 text-xs"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Required Documents Confirmed */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Required Documents Confirmed</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Manual confirmation that the file is sufficiently complete for closure</p>
          </div>
          <div className="flex gap-1">
            {["Yes", "No"].map(opt => (
              <button
                key={opt}
                onClick={() => setDocs(prev => ({ ...prev, confirmedComplete: opt }))}
                className={`px-4 py-1.5 rounded text-xs font-medium border transition-colors ${
                  docs.confirmedComplete === opt
                    ? opt === "Yes"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {docs.confirmedComplete === "No" && (
          <p className="text-[10px] text-amber-600 mt-1.5">Closure is not hard-blocked, but confirmation is recommended before proceeding.</p>
        )}
      </div>

    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ClosureEmbeddedProps {
  claimId: string;
  claimStatus: string;
  createdDate?: string;
}

export function ClosureEmbedded({ claimId, claimStatus, createdDate }: ClosureEmbeddedProps) {
  const isClosed = claimStatus === "Close";
  const [state, setState] = useState<ClosureState>(() => buildClosureSeed(claimId, claimStatus));

  const set = (field: keyof ClosureState, value: string) =>
    setState(prev => ({ ...prev, [field]: value }));

  const mandatoryFilled = isClosed
    ? !!state.closureReason && !!state.closureDate && !!state.closureSummary
    : true;

  const closureStatusLabel = !isClosed ? "N/A" : mandatoryFilled ? "Complete" : "Incomplete";
  const closureStatusColour = !isClosed
    ? "bg-gray-50 border-gray-200 text-gray-400"
    : mandatoryFilled
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-amber-50 border-amber-200 text-amber-700";

  const dateMin = createdDate || "";

  return (
        <div className="p-6 space-y-8">

          {!isClosed && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
              <Clock className="size-4 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                Closure fields will become mandatory once the <strong>Claim Status</strong> is set to <strong>Closed</strong>. You can pre-fill this tab at any time.
              </p>
            </div>
          )}

          {/* Section 1: Closure Outcome */}
          <div>
            <SectionHead title="Closure Outcome" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">

              <FieldWrap label="Closure Reason" required={isClosed}>
                <Select value={state.closureReason || "none"} onValueChange={v => set("closureReason", v === "none" ? "" : v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent className="z-[300]">
                    <SelectItem value="none">Select reason</SelectItem>
                    {CLOSURE_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FieldWrap>

              <FieldWrap label="Closure Date" required={isClosed} hint={dateMin ? `Cannot be earlier than claim creation date (${dateMin})` : undefined}>
                <Input type="date" value={state.closureDate} min={dateMin} onChange={e => set("closureDate", e.target.value)} className="h-9 text-sm" />
              </FieldWrap>

              <FieldWrap label="Final Outcome Category">
                <Select value={state.finalOutcomeCategory || "none"} onValueChange={v => set("finalOutcomeCategory", v === "none" ? "" : v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent className="z-[300]">
                    <SelectItem value="none">Select category</SelectItem>
                    {FINAL_OUTCOME_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FieldWrap>

              <FieldWrap label="Closed By" hint="Auto-populated when claim status is set to Closed">
                <Select value={state.closedBy || "none"} onValueChange={v => set("closedBy", v === "none" ? "" : v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent className="z-[300]">
                    <SelectItem value="none">Select user</SelectItem>
                    {SYSTEM_USERS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FieldWrap>

            </div>

            <div className="mt-4">
              <FieldWrap label="Closure Summary" required={isClosed}>
                <Textarea
                  value={state.closureSummary}
                  onChange={e => set("closureSummary", e.target.value)}
                  placeholder="Final explanation of how the claim was resolved or closed..."
                  className="resize-none min-h-[90px] text-sm"
                />
              </FieldWrap>
            </div>

            <div className="mt-4">
              <FieldWrap label="Closure Status Check" hint="Automatically assessed — Complete only when all mandatory closure fields are filled">
                <div className={`flex items-center gap-2 h-9 px-3 rounded-md border text-sm font-medium ${closureStatusColour}`}>
                  {closureStatusLabel === "Complete"   && <CheckCircle className="size-3.5" />}
                  {closureStatusLabel === "Incomplete" && <AlertCircle className="size-3.5" />}
                  {closureStatusLabel === "N/A"        && <Lock className="size-3.5" />}
                  {closureStatusLabel}
                  {closureStatusLabel === "Incomplete" && (
                    <span className="text-xs font-normal ml-1">
                      — missing: {[
                        !state.closureReason  && "Closure Reason",
                        !state.closureDate    && "Closure Date",
                        !state.closureSummary && "Closure Summary",
                      ].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
              </FieldWrap>
            </div>
          </div>

          {/* Section 2: Learning & Risk */}
          <div>
            <SectionHead title="Learning &amp; Risk" />
            <div className="space-y-4">
              <FieldWrap label="Lessons Learned">
                <Textarea value={state.lessonsLearned} onChange={e => set("lessonsLearned", e.target.value)} placeholder="Business, operational, or legal learning from this claim..." className="resize-none min-h-[80px] text-sm" />
              </FieldWrap>
              <div className="grid grid-cols-2 gap-x-6">
                <FieldWrap label="Repeat Risk Flag">
                  <Select value={state.repeatRiskFlag} onValueChange={v => set("repeatRiskFlag", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[300]">
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWrap>
              </div>
              {state.repeatRiskFlag === "Yes" && (
                <FieldWrap label="Repeat Risk Remarks" required hint="Required when Repeat Risk Flag is Yes">
                  <Textarea value={state.repeatRiskRemarks} onChange={e => set("repeatRiskRemarks", e.target.value)} placeholder="Describe the nature of the repeat risk and potential exposure..." className="resize-none min-h-[80px] text-sm" />
                </FieldWrap>
              )}
              <FieldWrap label="Recommended Preventive Action">
                <Textarea value={state.recommendedPreventiveAction} onChange={e => set("recommendedPreventiveAction", e.target.value)} placeholder="Suggested operational or legal steps to prevent recurrence..." className="resize-none min-h-[80px] text-sm" />
              </FieldWrap>
            </div>
          </div>

          {/* Section 3: Governance */}
          <div>
            <SectionHead title="Governance" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-6">
                <FieldWrap label="Closure Approval Required">
                  <Select value={state.closureApprovalRequired} onValueChange={v => {
                    set("closureApprovalRequired", v);
                    if (v === "No") { set("closureApprovedBy", ""); set("closureApprovedDate", ""); }
                  }}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[300]">
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWrap>
              </div>
              {state.closureApprovalRequired === "Yes" && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pl-4 border-l-2 border-blue-100">
                  <FieldWrap label="Closure Approved By" required>
                    <Select value={state.closureApprovedBy || "none"} onValueChange={v => set("closureApprovedBy", v === "none" ? "" : v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select approver" /></SelectTrigger>
                      <SelectContent className="z-[300]">
                        <SelectItem value="none">Select approver</SelectItem>
                        {SYSTEM_USERS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FieldWrap>
                  <FieldWrap label="Closure Approved Date" required>
                    <Input type="date" value={state.closureApprovedDate} min={dateMin} onChange={e => set("closureApprovedDate", e.target.value)} className="h-9 text-sm" />
                  </FieldWrap>
                </div>
              )}
              <FieldWrap label="Internal Closure Notes" hint="Internal-only; not shared externally">
                <Textarea value={state.internalClosureNotes} onChange={e => set("internalClosureNotes", e.target.value)} placeholder="Internal handling notes, file references, follow-up reminders..." className="resize-none min-h-[80px] text-sm" />
              </FieldWrap>
            </div>
          </div>

        </div>
  );
}
