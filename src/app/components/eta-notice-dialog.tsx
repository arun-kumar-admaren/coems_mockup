import React from "react";
import { AlertTriangle, Calendar, ChevronDown, ChevronUp, Eye, EyeOff, X, Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { MailEditor, MailText } from "./eta-mail-text";
import { ManualPicker } from "./eta-manual-picker";
import { cn } from "./ui/utils";
import {
  OPERATIONS_MAILBOX,
  CURRENT_USER,
  dueFixtures,
  effectiveEta,
  etaActions,
  etaText,
  findPortCall,
  fixtureOf,
  fmtDT,
  fmtDate,
  noticeFixtures,
  nowIso,
  parseDT,
  portsFor,
  renderBody,
  renderSubject,
  useEtaState,
  type EtaVoyage,
  type NoticeValues,
  type PortCall,
  type SentNotice,
} from "./eta-notice-store";

// ─── Small inputs ─────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RecipientField({
  label,
  values,
  onChange,
  invalid,
  sourced = [],
  hint,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  invalid?: boolean;
  /** Addresses that come from the fixture's Handover "ETA's to be given" (shown green). */
  sourced?: string[];
  hint?: React.ReactNode;
}) {
  const [text, setText] = React.useState("");
  const [bad, setBad] = React.useState(false);

  const add = (raw: string) => {
    const email = raw.trim().replace(/[,;]$/, "");
    if (!email) return;
    if (!EMAIL_RE.test(email)) return setBad(true);
    setBad(false);
    if (!values.includes(email)) onChange([...values, email]);
    setText("");
  };

  return (
    <div>
      <div className="mb-0.5">
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 rounded border bg-white px-1.5 py-1 min-h-8",
          invalid || bad ? "border-red-400" : "border-gray-300 focus-within:border-blue-500"
        )}
      >
        {values.map((v) => {
          const fromHandover = sourced.includes(v);
          return (
            <span
              key={v}
              title={fromHandover ? "From the fixture's Handover tab: ETA's to be given" : undefined}
              className={cn(
                "inline-flex items-center gap-1 rounded border pl-1.5 pr-0.5 py-0.5 text-[11px]",
                fromHandover ? "bg-green-50 border-green-200 text-green-800" : "bg-blue-50 border-blue-100 text-blue-700"
              )}
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className={cn("rounded p-0.5", fromHandover ? "text-green-500 hover:text-green-800" : "text-blue-400 hover:text-blue-700")}
              >
                <X className="size-3" />
              </button>
            </span>
          );
        })}
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setBad(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === ";") {
              e.preventDefault();
              add(text);
            }
          }}
          onBlur={() => add(text)}
          placeholder={values.length ? "" : "Type an address, press Enter"}
          className="flex-1 min-w-[140px] bg-transparent text-[12px] outline-none placeholder:text-gray-400"
        />
      </div>
      {bad && <p className="mt-0.5 text-[10px] text-red-600">Not a valid e-mail address</p>}
      {hint}
    </div>
  );
}

function EtaField({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [text, setText] = React.useState(fmtDT(value));
  React.useEffect(() => setText(fmtDT(value)), [value]);
  const commit = () => {
    const iso = parseDT(text);
    if (iso) onChange(iso);
    else setText(fmtDT(value));
  };
  return (
    <div className="flex items-center gap-1 rounded border border-gray-300 bg-white px-2 h-8 focus-within:border-blue-500">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        placeholder="DD/MM/YYYY HH:MM"
        className="flex-1 min-w-0 bg-transparent text-[12px] outline-none"
      />
      <Calendar className="size-3.5 text-gray-500 shrink-0" />
    </div>
  );
}

// ─── Rows ─────────────────────────────────────────────────────────────────────

interface Row {
  key: number;
  /** The port call this e-mail is for (rows can belong to different calls when notices are created manually). */
  portCallId: string;
  fixtureIds: string[];
  to: string[];
  etaIso: string;
  includeTime: boolean;
  remark: string;
  subject: string;
  subjectEdited: boolean;
  /** The operator edited the e-mail text: it is kept as typed and no longer follows the template, date or remark. */
  body: string;
  bodyEdited: boolean;
  showPreview: boolean;
  status?: "sending" | "sent" | "failed";
  failReason?: string;
  error?: string;
}

let rowCounter = 0;

/** To is filled automatically with the addresses in the fixtures' Handover tab → "ETA's to be given". */
const buildRow = (voyage: EtaVoyage, portCallId: string, fixtureIds: string[], etaIso: string, showPreview = true): Row => ({
  key: ++rowCounter,
  portCallId,
  fixtureIds,
  to: Array.from(new Set(fixtureIds.flatMap((id) => fixtureOf(voyage, id)?.etaEmails ?? []))),
  etaIso,
  includeTime: false,
  remark: "",
  subject: "",
  subjectEdited: false,
  body: "",
  bodyEdited: false,
  showPreview,
});

export function EtaNoticeDialog({
  portCallId,
  unsaved,
  onClose,
  fixtureIds,
  manual = false,
}: {
  portCallId: string;
  unsaved: boolean;
  onClose: () => void;
  /**
   * Show only these fixtures' e-mails, whatever their Frequency (used from the "ETA notices" list and the manual
   * creator in the voyage header); a single one opens already previewed.
   */
  fixtureIds?: string[];
  /**
   * Manual creation ("New ETA notice" in the voyage header): the ports of each fixture are ticked in a panel on the
   * left (fixtures have a chevron, no checkbox), the e-mails (one per fixture + port) appear on the right as they are ticked.
   */
  manual?: boolean;
}) {
  const st = useEtaState();
  const found = findPortCall(portCallId);
  // The system builds one e-mail (row) per fixture of this port call; nothing has to be chosen.
  const [rows, setRows] = React.useState<Row[]>(() => {
    if (!found) return [];
    const eta = effectiveEta(found.portCall, st) ?? "";
    if (manual) return [];
    if (fixtureIds) {
      return found.voyage.fixtures
        .filter((fx) => fixtureIds.includes(fx.id))
        .map((fx) => buildRow(found.voyage, found.portCall.id, [fx.id], eta));
    }
    return noticeFixtures(found.voyage, found.portCall).map((fx) => buildRow(found.voyage, found.portCall.id, [fx.id], eta));
  });
  const [showAllLog, setShowAllLog] = React.useState(false);
  const [openLog, setOpenLog] = React.useState<string | null>(null);

  if (!found) return null;
  const { voyage, portCall: pc } = found;
  const systemEta = effectiveEta(pc, st) ?? "";
  const savedEntered = !!st.saved[pc.id]?.arrival;
  // the signatory is the signed-in user, no designation
  const signatory = { name: CURRENT_USER };
  // each row has its own port call (they only differ for manually created notices)
  const pcOf = (r: Row): PortCall => findPortCall(r.portCallId)?.portCall ?? pc;
  const etaOf = (r: Row) => effectiveEta(pcOf(r), st) ?? "";
  const multiPort = new Set(rows.map((r) => r.portCallId)).size > 1;

  // Manual mode: the ticks in the left panel create and remove the e-mails on the right
  const pairKey = (pcId: string, fxId: string) => `${pcId}|${fxId}`;
  const selectedPairs = new Set(rows.map((r) => pairKey(r.portCallId, r.fixtureIds[0])));
  const isLocked = (r: Row) => r.status === "sent" || r.status === "sending";
  const rowFor = (pcId: string, fxId: string) => buildRow(voyage, pcId, [fxId], effectiveEta(findPortCall(pcId)!.portCall, st) ?? "");
  // Fixtures have no checkbox: ticking a port creates its e-mail, unticking removes it (a sent one stays).
  const togglePair = (pcId: string, fxId: string) => {
    const existing = rows.find((r) => r.portCallId === pcId && r.fixtureIds[0] === fxId);
    if (existing) {
      if (!isLocked(existing)) setRows((rs) => rs.filter((r) => r.key !== existing.key));
    } else {
      setRows((rs) => [...rs, rowFor(pcId, fxId)]);
    }
  };
  // The client of a row = the Account of its fixture(s)
  const clientOf = (r: Row) =>
    Array.from(new Set(r.fixtureIds.map((id) => fixtureOf(voyage, id)?.account).filter(Boolean) as string[])).join(", ");

  const valuesFor = (r: Row): NoticeValues => ({
    vessel: voyage.vessel,
    voyage: voyage.number,
    port: pcOf(r).port,
    eta: etaText(r.etaIso, r.includeTime, pcOf(r).timeZone),
    fixture: r.fixtureIds.join(", "),
    loadPort: portsFor(voyage, r.fixtureIds, "Loading"),
    dischargePort: portsFor(voyage, r.fixtureIds, "Discharging"),
    client: clientOf(r),
    remark: r.remark.trim(),
    signatory: signatory.name,
  });
  const autoSubject = (r: Row) => renderSubject(st.template.subject, valuesFor(r));
  const subjectOf = (r: Row) => (r.subjectEdited ? r.subject : autoSubject(r));
  const bodyOf = (r: Row) => (r.bodyEdited ? r.body : renderBody(st.template.body, valuesFor(r)));

  const patch = (key: number, p: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...p } : r)));

  // Recipients come from the fixtures' Handover tab → "ETA's to be given" (several addresses per fixture)
  const handoverOf = (ids: string[]) =>
    Array.from(new Set(ids.flatMap((id) => fixtureOf(voyage, id)?.etaEmails ?? [])));

  // Fixtures whose notice is due today get a "Due today" badge on their row
  const isDueRow = (r: Row) => dueFixtures(voyage, pcOf(r), st).some((f) => r.fixtureIds.includes(f.id));

  // every e-mail is sent; a row without a recipient is left out (and flagged) until an address is added
  const selectable = rows.filter((r) => r.status !== "sent" && r.status !== "sending" && r.to.length > 0);
  const sending = rows.some((r) => r.status === "sending");

  const send = () => {
    if (unsaved || selectable.length === 0) return;
    const targets = selectable.map((r) => ({ ...r }));
    setRows((rs) => rs.map((r) => (targets.some((t) => t.key === r.key) ? { ...r, status: "sending", failReason: undefined } : r)));
    targets.forEach((t, i) => {
      window.setTimeout(() => {
        const failed = t.to.some((a) => a.toLowerCase().includes("fail"));
        const reason = failed ? "Mailbox unavailable (550 5.1.1 recipient rejected)" : undefined;
        etaActions.addNotice({
          id: `n-${Date.now()}-${t.key}`,
          portCallId: t.portCallId,
          voyage: voyage.number,
          vessel: voyage.vessel,
          port: pcOf(t).port,
          sentAt: nowIso(),
          sentBy: signatory.name,
          customer: clientOf(t) || "—",
          fixtureIds: t.fixtureIds,
          to: t.to,
          etaTold: t.etaIso,
          systemEta: etaOf(t),
          includeTime: t.includeTime,
          timeZone: pcOf(t).timeZone,
          remark: t.remark.trim(),
          subject: subjectOf(t),
          body: bodyOf(t),
          status: failed ? "Failed" : "Sent",
          failReason: reason,
        });
        patch(t.key, { status: failed ? "failed" : "sent", failReason: reason });
      }, 700 + i * 500);
    });
  };

  const logPorts = new Set([...(manual ? [] : [pc.id]), ...rows.map((r) => r.portCallId)]);
  const log = st.sent.filter((n) => logPorts.has(n.portCallId));
  const shownLog = showAllLog ? log : log.slice(0, 3);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn("w-[96vw] p-0 gap-0 overflow-hidden flex flex-col max-h-[92vh] z-[301]", manual ? "sm:max-w-[1240px] h-[88vh]" : "sm:max-w-[1000px]")}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-gray-900">
            {manual ? "New ETA notice" : multiPort ? "ETA notices" : <>ETA notice · {pc.port}</>}
            <span className="text-[12px] font-normal text-gray-500">
              {voyage.vessel} · {voyage.number}
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">Send ETA notices to clients for {pc.port}</DialogDescription>
          <div className={cn("mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-gray-700", (multiPort || manual) && "hidden")}>
            <span>
              Expected ETA: <b className="text-gray-900">{fmtDT(systemEta) || "—"}</b>{" "}
              <span className="text-gray-500">{pc.timeZone}</span>{" "}
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{savedEntered ? "entered" : "computed"}</span>
            </span>
            {pc.kind === "canal" && <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">Canal transit</span>}
          </div>
        </div>

        {/* Body (manual mode: fixtures / ports panel on the left, the e-mails on the right) */}
        <div className="flex flex-1 min-h-0">
          {manual && (
            <aside className="w-[310px] shrink-0 overflow-hidden border-r border-gray-200 bg-white">
              <ManualPicker
                voyage={voyage}
                selectedPairs={selectedPairs}
                onTogglePair={togglePair}
              />
            </aside>
          )}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#fafafa]">
          {unsaved && (
            <div className="flex items-start gap-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <span>
                You have unsaved date changes in the report. Close this dialog and click <b>Confirm &amp; Update</b> first. The notice carries the saved
                Expected ETA, so Send stays off until then.
              </span>
            </div>
          )}

          {/* The system builds one e-mail per fixture; nothing has to be chosen */}
          <p className="text-[12px] text-gray-600">
            {rows.length > 0
              ? "One e-mail per fixture, each to the addresses in that fixture's Handover tab (ETA's to be given). A row without an address is not sent."
              : manual
              ? "Tick the ports to notify in the list on the left. One e-mail per fixture and port appears here."
              : `No fixture loads or discharges at ${pc.port}, so there is no ETA notice for it.`}
          </p>

          {rows.map((r) => {
            const locked = r.status === "sent" || r.status === "sending";
            const rowPc = pcOf(r);
            const mismatch = r.etaIso !== etaOf(r);
            return (
              <div key={r.key} className={cn("rounded border bg-white", r.status === "sent" ? "border-green-300" : r.status === "failed" ? "border-red-300" : "border-gray-200")}>
                {/* Row header */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-2">
                  <span className="text-[13px] font-semibold text-gray-900">{r.fixtureIds.join(", ") || "No fixture"}</span>
                  {/* fixture number · frequency · due */}
                  {r.fixtureIds.map((id) => {
                    const fx = fixtureOf(voyage, id);
                    return fx ? (
                      <span
                        key={id}
                        className={cn("rounded px-1.5 py-0.5 text-[10px]", fx.frequency === "Daily" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500")}
                      >
                        Frequency: {fx.frequency}
                      </span>
                    ) : null;
                  })}
                  {isDueRow(r) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800" title="Frequency Daily and no notice sent today">
                      <span className="size-1.5 rounded-full bg-amber-500" /> Due today
                    </span>
                  )}
                  {/* what the fixture does at this port, e.g. "Discharging at Emden" */}
                  <span className="text-[13px] text-gray-900">
                    {rowPc.fixtures.find((f) => f.fixtureId === r.fixtureIds[0])?.operation ?? "Notice"} at {rowPc.port}
                  </span>
                  {!locked && r.to.length === 0 && (
                    <span className="rounded bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-medium text-red-700">No recipient</span>
                  )}
                  {r.status === "sending" && (
                    <span className="flex items-center gap-1 text-[11px] text-gray-600">
                      <Loader2 className="size-3.5 animate-spin" /> Sending…
                    </span>
                  )}
                  {r.status === "sent" && <span className="rounded bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Sent</span>}
                  {r.status === "failed" && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800" title={r.failReason}>
                      Failed — {r.failReason}
                    </span>
                  )}
                  <div className="ml-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => patch(r.key, { showPreview: !r.showPreview })}
                      title={r.showPreview ? "Collapse the e-mail" : "Show the e-mail"}
                      aria-label={r.showPreview ? "Collapse the e-mail" : "Show the e-mail"}
                      aria-expanded={r.showPreview}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {r.showPreview ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  </div>
                </div>

                <fieldset disabled={locked} className="grid grid-cols-2 gap-x-5 gap-y-3 p-3">
                  <div className="col-span-2">
                    <RecipientField
                      label="To"
                      values={r.to}
                      onChange={(v) => patch(r.key, { to: v, error: undefined })}
                      invalid={!!r.error}
                      sourced={handoverOf(r.fixtureIds)}
                      hint={(() => {
                        const empty = r.fixtureIds.filter((id) => (fixtureOf(voyage, id)?.etaEmails.length ?? 0) === 0);
                        return (
                          <>
                            {r.to.some((a) => handoverOf(r.fixtureIds).includes(a)) && (
                              <p className="mt-0.5 text-[10px] text-green-700">Green = from the fixture's Handover tab, ETA's to be given. You can still add or remove addresses.</p>
                            )}
                            {empty.length > 0 && (
                              <p className="mt-0.5 text-[10px] text-amber-700">
                                {empty.join(", ")} has no e-mail in ETA's to be given. Add one here or in its Handover tab.
                              </p>
                            )}
                          </>
                        );
                      })()}
                    />
                  </div>

                  <div>
                    <div className="mb-0.5 flex items-center justify-between text-[10px] text-gray-500">
                      <span>ETA told to this client ({rowPc.timeZone})</span>
                      {mismatch && (
                        <button type="button" onClick={() => patch(r.key, { etaIso: etaOf(r) })} className="text-blue-600 hover:underline">
                          Reset to Expected ETA
                        </button>
                      )}
                    </div>
                    <EtaField value={r.etaIso} onChange={(iso) => patch(r.key, { etaIso: iso })} />
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5">
                      <label className="flex items-center gap-1.5 text-[11px] text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={r.includeTime} onChange={(e) => patch(r.key, { includeTime: e.target.checked })} className="size-3.5 accent-blue-600" />
                        Include time (port time)
                      </label>
                      {mismatch && <span className="text-[10px] text-amber-700">Differs from the system Expected ETA</span>}
                    </div>
                  </div>

                  <div>
                    <div className="mb-0.5 text-[10px] text-gray-500">Remark</div>
                    <input
                      value={r.remark}
                      onChange={(e) => patch(r.key, { remark: e.target.value })}
                      placeholder="e.g. position, wind, weather, delay"
                      className="h-8 w-full rounded border border-gray-300 bg-white px-2 text-[12px] outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="mb-0.5 flex items-center justify-between text-[10px] text-gray-500">
                      <span>Subject</span>
                      {r.subjectEdited && (
                        <button type="button" onClick={() => patch(r.key, { subjectEdited: false })} className="text-blue-600 hover:underline">
                          Reset to template
                        </button>
                      )}
                    </div>
                    <input
                      value={subjectOf(r)}
                      onChange={(e) => patch(r.key, { subject: e.target.value, subjectEdited: true })}
                      className="h-8 w-full rounded border border-gray-300 bg-white px-2 text-[12px] outline-none focus:border-blue-500"
                    />
                  </div>
                </fieldset>

                {r.error && <p className="px-3 pb-2 -mt-1 text-[11px] text-red-600">{r.error}</p>}

                {r.showPreview && (
                  <div className="mx-3 mb-3 rounded border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] text-gray-500">
                      From: {OPERATIONS_MAILBOX} · To: {r.to.join(", ") || "—"}
                    </div>
                    <div className="mt-1 text-[12px] font-semibold text-gray-900 underline">{subjectOf(r)}</div>
                    <div className="mt-2 mb-0.5 flex items-center justify-between text-[10px] text-gray-500">
                      <span>E-mail text</span>
                      {r.bodyEdited && !locked && (
                        <button type="button" onClick={() => patch(r.key, { bodyEdited: false })} className="text-blue-600 hover:underline">
                          Reset to template
                        </button>
                      )}
                    </div>
                    <MailEditor value={bodyOf(r)} readOnly={locked} onChange={(text) => patch(r.key, { body: text, bodyEdited: true })} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Sent log */}
          <div className="rounded border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
              <span className="text-[12px] font-semibold text-gray-900">{multiPort || manual ? "Sent notices for these ports" : <>Sent notices for {pc.port}</>}</span>
              {log.length > 3 && (
                <button type="button" onClick={() => setShowAllLog((v) => !v)} className="text-[11px] text-blue-600 hover:underline">
                  {showAllLog ? "Show fewer" : `Show all (${log.length})`}
                </button>
              )}
            </div>
            {log.length === 0 ? (
              <div className="px-3 py-3 text-[12px] text-gray-400">No notice has been sent for this port call yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {shownLog.map((n) => (
                  <div key={n.id} className="px-3 py-2 text-[11px] text-gray-700">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
                      <span className="text-gray-900 font-medium">{fmtDT(n.sentAt.slice(0, 16))}</span>
                      <span>{n.sentBy}</span>
                      <span className="font-medium">{n.customer}</span>
                      <span className="text-gray-500">{n.fixtureIds.length ? n.fixtureIds.join(", ") : "no fixture chosen"}</span>
                      <span className="text-gray-500">To: {n.to.join(", ")}</span>
                      <span>ETA told: {fmtDate(n.etaTold.slice(0, 10))}{n.includeTime ? ` ${n.etaTold.slice(11, 16)}` : ""}</span>
                      <span className={cn("rounded px-1.5 py-0.5 font-medium", n.status === "Sent" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>{n.status}</span>
                      <button
                        type="button"
                        onClick={() => setOpenLog(openLog === n.id ? null : n.id)}
                        title={openLog === n.id ? "Hide the e-mail" : "View the e-mail"}
                        aria-label={openLog === n.id ? "Hide the e-mail" : "View the e-mail"}
                        className="ml-auto rounded p-1 text-blue-600 hover:bg-blue-50"
                      >
                        {openLog === n.id ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {n.failReason && <div className="mt-0.5 text-red-600">{n.failReason}</div>}
                    {openLog === n.id && (
                      <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-2">
                        <div className="text-[11px] font-semibold text-gray-900 underline">{n.subject}</div>
                        <MailText text={n.body} className="mt-1.5 whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-gray-800" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 bg-white px-6 py-3">
          <span className="text-[12px] text-gray-700">
            Signatory: <b className="font-semibold text-gray-900">{CURRENT_USER}</b>
          </span>
          <div className="ml-auto flex items-center gap-2">
            {/* Cancel only before something was sent; afterwards the X in the corner closes the dialog */}
            {!rows.some((r) => r.status === "sent") && (
              <button type="button" onClick={onClose} className="h-8 rounded border border-gray-300 bg-white px-4 text-[12px] font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={send}
              disabled={unsaved || selectable.length === 0 || sending}
              className="h-8 rounded bg-green-600 px-4 text-[12px] font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Send ({selectable.length})
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Read-only view of a notice that was already sent ─────────────────────────

export function SentNoticeDialog({ notice, onClose }: { notice: SentNotice; onClose: () => void }) {
  const eta = `${fmtDate(notice.etaTold.slice(0, 10))}${notice.includeTime ? ` ${notice.etaTold.slice(11, 16)}` : ""}`;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[760px] w-[96vw] p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh] z-[301]"
      >
        <div className="px-6 pt-5 pb-3 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-gray-900">
            ETA notice · {notice.port}
            <span className="text-[12px] font-normal text-gray-500">
              {notice.vessel} · {notice.voyage}
            </span>
            <span className={cn("ml-2 rounded px-2 py-0.5 text-[11px] font-medium", notice.status === "Sent" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
              {notice.status}
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">An ETA notice that was already sent</DialogDescription>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-[12px] text-gray-700">
            <span>Date: <b className="text-gray-900">{fmtDT(notice.sentAt.slice(0, 16))}</b> by {notice.sentBy}</span>
            <span>Fixture: <b className="text-gray-900">{notice.fixtureIds.join(", ") || "—"}</b></span>
            <span className="col-span-2">To: <b className="text-gray-900">{notice.to.join(", ")}</b></span>
            <span>ETA told: <b className="text-gray-900">{eta}</b> <span className="text-gray-500">{notice.timeZone}</span></span>
            {notice.remark && <span>Remark: <b className="text-gray-900">{notice.remark}</b></span>}
            {notice.failReason && <span className="col-span-2 text-red-600">{notice.failReason}</span>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#fafafa] px-6 py-4">
          <div className="rounded border border-gray-200 bg-white p-4">
            <div className="text-[13px] font-semibold text-gray-900 underline">{notice.subject}</div>
            <MailText text={notice.body} className="mt-3 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-gray-800" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
