import React from "react";
import { Calendar, Mail, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { cn } from "./ui/utils";
import { useVersion } from "../version-context";
import {
  canNotify,
  dueFixtures,
  etaActions,
  findPortCall,
  fmtDT,
  parseDT,
  portDays,
  useEtaState,
} from "./eta-notice-store";
import { EtaNoticeDialog } from "./eta-notice-dialog";

// ─── Date box (text input in DD/MM/YY HH:MM, like COEMS) ──────────────────────

function DateBox({
  label,
  value,
  placeholder,
  onChange,
  readOnly,
}: {
  label: string;
  value: string; // ISO or ""
  placeholder?: string;
  onChange?: (iso: string) => void;
  readOnly?: boolean;
}) {
  const [text, setText] = React.useState(fmtDT(value));
  React.useEffect(() => setText(fmtDT(value)), [value]);

  const commit = () => {
    if (readOnly || !onChange) return;
    if (!text.trim()) return onChange("");
    const iso = parseDT(text);
    if (iso) onChange(iso);
    else setText(fmtDT(value)); // invalid → revert
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="text-right text-[10px] text-gray-400 mb-0.5">{label}</div>
      <div
        className={cn(
          "flex items-center gap-1 border rounded h-8 px-2 text-[12px]",
          readOnly ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300 focus-within:border-blue-500"
        )}
      >
        <input
          value={text}
          readOnly={readOnly}
          placeholder={placeholder || "DD/MM/YY HH:MM"}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none text-right placeholder:text-gray-400",
            readOnly ? "text-gray-600" : "text-gray-900"
          )}
        />
        <Calendar className="size-3.5 text-gray-500 shrink-0" />
      </div>
    </div>
  );
}

function SectionBar({ title, right, children }: { title: string; right?: React.ReactNode; children?: React.ReactNode }) {
  return (
    // title on the left, what is passed as children (the ETA notice button) in the middle, the figure on the right
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-gray-200 pb-1.5 mb-2 mt-4">
      <span className="text-[12px] font-semibold text-gray-900">{title}</span>
      <div className="justify-self-center">{children}</div>
      <span className="justify-self-end text-[11px] text-gray-500">{right}</span>
    </div>
  );
}

// ─── Report ───────────────────────────────────────────────────────────────────

export function ArrivalDepartureReport({ portCallId, onClose }: { portCallId: string; onClose: () => void }) {
  const isV2 = useVersion() === "2.0";
  const st = useEtaState();
  const found = findPortCall(portCallId);

  const saved = st.saved[portCallId] ?? {};
  const [draftArr, setDraftArr] = React.useState(saved.arrival ?? "");
  const [draftDep, setDraftDep] = React.useState(saved.departure ?? "");
  const [noticeOpen, setNoticeOpen] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);
  const [delay, setDelay] = React.useState("");
  const [remarks, setRemarks] = React.useState(found?.portCall.remarks ?? "");

  if (!found) return null;
  const { voyage, portCall: pc } = found;

  const dirty = draftArr !== (saved.arrival ?? "") || draftDep !== (saved.departure ?? "");
  const showNotice = isV2 && canNotify(voyage, pc);
  const due = showNotice ? dueFixtures(voyage, pc, st) : [];

  const confirm = () => {
    etaActions.saveExpected(pc.id, { arrival: draftArr || undefined, departure: draftDep || undefined });
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2500);
  };

  const budgetedDays = portDays(pc.budgeted.arrival, pc.budgeted.departure);
  const expectedDays = portDays(draftArr || pc.computed.arrival, draftDep || pc.computed.departure);
  const actualDays = portDays(pc.actual.arrival, pc.actual.departure);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[620px] p-0 gap-0 overflow-hidden flex flex-col max-h-[88vh]"
      >
        <div className="px-6 pt-5 pb-3 text-center">
          <DialogTitle className="text-[17px] font-medium text-gray-800 leading-tight">Arrival and Departure Report</DialogTitle>
          <DialogDescription className="sr-only">Arrival and departure report for {pc.port}</DialogDescription>
        </div>
        <div className="px-6 pb-2 flex items-center justify-between text-[12px] text-gray-700 border-b border-dashed border-gray-300">
          <span>
            Port Name : <span className="text-gray-900">{pc.port}</span>
          </span>
          <span>
            Time Zone : <span className="text-gray-900">{pc.timeZone}</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {/* Budgeted */}
          <SectionBar title="Budgeted" right={<>Budgeted Port Days <b className="text-gray-900">{budgetedDays ?? "None"}</b></>} />
          <div className="flex gap-3">
            <DateBox label="Arrival" value={pc.budgeted.arrival ?? ""} readOnly />
            <DateBox label="Berth" value="" readOnly />
            <DateBox label="Departure" value={pc.budgeted.departure ?? ""} readOnly />
          </div>

          {/* Expected — the ETA notice entry sits in this header row */}
          <SectionBar title="Expected" right={<>Estimated Port Days <b className="text-gray-900">{expectedDays ?? "None"}</b></>}>
            {showNotice && (
              <button
                type="button"
                onClick={() => setNoticeOpen(true)}
                title="Send an ETA notice"
                className="inline-flex items-center gap-1.5 rounded border border-blue-600 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Mail className="size-3.5" />
                ETA notice
                {due.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-800">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Due
                  </span>
                )}
              </button>
            )}
          </SectionBar>
          <div className="flex gap-3">
            <DateBox label="Arrival" value={draftArr} placeholder={fmtDT(pc.computed.arrival)} onChange={setDraftArr} readOnly={!!pc.actual.arrival} />
            <DateBox label="Berth" value="" readOnly />
            <DateBox label="Departure" value={draftDep} placeholder={fmtDT(pc.computed.departure)} onChange={setDraftDep} readOnly={!!pc.actual.departure} />
          </div>
          {!pc.actual.arrival && !pc.startOnly && (
            <p className="mt-1 text-[10px] text-gray-400">Grey = computed by COEMS. Type a date to override it.</p>
          )}

          {/* Actual */}
          <SectionBar title="Actual" right={<>Actual Port Days <b className="text-gray-900">{actualDays ?? "None"}</b></>} />
          <div className="flex gap-3">
            <DateBox label="Arrival" value={pc.actual.arrival ?? ""} readOnly />
            <DateBox label="Berth" value={pc.actual.berth ?? ""} readOnly />
            <DateBox label="Departure" value={pc.actual.departure ?? ""} readOnly />
          </div>

          <div className="mt-4">
            <label className="block text-[10px] text-gray-400 mb-0.5">Reason of Delay</label>
            <select
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              className="w-full h-8 rounded border border-gray-300 bg-white px-2 text-[12px] text-gray-800"
            >
              <option value="" />
              <option>Weather</option>
              <option>Berth congestion</option>
              <option>Vessel technical issues</option>
              <option>Awaiting cargo readiness</option>
            </select>
          </div>
          <div className="mt-3">
            <label className="block text-[10px] text-gray-400 mb-0.5">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-[12px] text-gray-800 resize-none"
            />
          </div>

          <SectionBar title="Fuel Readings" />
          <table className="w-full text-[11px] text-center border border-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th rowSpan={2} className="border border-gray-200 py-1 font-medium">Fuel Qty</th>
                <th colSpan={2} className="border border-gray-200 py-1 font-medium">Arrival</th>
                <th colSpan={2} className="border border-gray-200 py-1 font-medium">Departure</th>
                <th rowSpan={2} className="border border-gray-200 py-1 font-medium">Consumption</th>
              </tr>
              <tr>
                <th className="border border-gray-200 py-1 font-medium">Estimated</th>
                <th className="border border-gray-200 py-1 font-medium">Actual</th>
                <th className="border border-gray-200 py-1 font-medium">Estimated</th>
                <th className="border border-gray-200 py-1 font-medium">Actual</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="border border-gray-200 py-1 text-left px-2">VLSFO</td><td className="border border-gray-200 text-gray-400">487.7</td><td className="border border-gray-200">-</td><td className="border border-gray-200 text-gray-400">487.7</td><td className="border border-gray-200">-</td><td className="border border-gray-200">0 mt</td></tr>
              <tr><td className="border border-gray-200 py-1 text-left px-2">MGO</td><td className="border border-gray-200 text-gray-400">116.5</td><td className="border border-gray-200">-</td><td className="border border-gray-200 text-gray-400">115.3</td><td className="border border-gray-200">-</td><td className="border border-gray-200">1.25 mt</td></tr>
            </tbody>
          </table>

          <SectionBar title="Bunker Details" />
          <table className="w-full text-[11px] text-center border border-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {["Fuel", "Qty (mt)", "Rate", "Date", "Delivery Charge", "Cost"].map((h) => (
                  <th key={h} className="border border-gray-200 py-1 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {["VLSFO", "MGO"].map((f) => (
                <tr key={f}><td className="border border-gray-200 py-1 text-left px-2">{f}</td><td className="border border-gray-200">0</td><td className="border border-gray-200">0</td><td className="border border-gray-200">{fmtDT(pc.computed.arrival).slice(0, 10)}</td><td className="border border-gray-200">0</td><td className="border border-gray-200">0</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 bg-white">
          {justSaved && (
            <span className="flex items-center gap-1 text-[12px] text-green-700">
              <Check className="size-3.5" /> Saved
            </span>
          )}
          {dirty && !justSaved && <span className="text-[11px] text-amber-700">Unsaved date changes</span>}
          <button
            type="button"
            onClick={confirm}
            className="rounded bg-[#ffd700] hover:bg-[#e6c200] px-4 py-1.5 text-[12px] font-medium text-black shadow-sm"
          >
            Confirm &amp; Update
          </button>
        </div>

        {/* Second dialog — rendered inside this dialog's tree so Radix stacks the layers */}
        {noticeOpen && <div className="absolute inset-0 z-10 bg-black/40" />}
        {noticeOpen && <EtaNoticeDialog portCallId={pc.id} onClose={() => setNoticeOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
