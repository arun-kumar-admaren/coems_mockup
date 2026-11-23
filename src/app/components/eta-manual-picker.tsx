import React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "./ui/utils";
import { etaAt8, fmtDT, operationLabel, type EtaVoyage, type PortCall } from "./eta-notice-store";

/**
 * Left panel of the manual "New ETA notice" dialog, one list: every fixture of the voyage, each with a chevron that
 * collapses / expands its loading / discharge ports the vessel has not reached yet (expanded by default). Fixtures have
 * no checkbox: the operator ticks the ports, any number of them across several fixtures. The e-mails appear on the
 * right as ports are ticked.
 * Any fixture can be picked, also one whose Frequency is None, because the operator asks for it explicitly.
 */
export function ManualPicker({
  voyage,
  selectedPairs,
  onTogglePair,
}: {
  voyage: EtaVoyage;
  /** Set of "portCallId|fixtureId" that already have an e-mail on the right. */
  selectedPairs: Set<string>;
  onTogglePair: (portCallId: string, fixtureId: string) => void;
}) {
  const key = (pcId: string, fxId: string) => `${pcId}|${fxId}`;
  // fixtures whose ports are collapsed; every fixture starts expanded
  const [collapsed, setCollapsed] = React.useState<string[]>([]);
  const toggleOpen = (fxId: string) => setCollapsed((c) => (c.includes(fxId) ? c.filter((x) => x !== fxId) : [...c, fxId]));

  /** A fixture's ports of loading / discharge the vessel has not reached yet. */
  const portsOf = (fixtureId: string): { pc: PortCall; operation: string }[] =>
    voyage.portCalls
      .filter((p) => !p.startOnly && !p.actual.arrival && p.fixtures.some((f) => f.fixtureId === fixtureId))
      .map((p) => ({ pc: p, operation: operationLabel(p, fixtureId) }));

  const box = (on: boolean) => (
    <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border", on ? "bg-blue-600 border-blue-600" : "border-gray-300")}>
      {on && <Check className="size-3 text-white" />}
    </span>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-3 py-2.5">
        <div className="text-[12px] font-semibold text-gray-900">Fixtures and ports</div>
        <div className="text-[11px] text-gray-500">
          Tick the ports to notify. {selectedPairs.size} port{selectedPairs.size === 1 ? "" : "s"} ticked.
        </div>
      </div>

      <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
        {voyage.fixtures.map((fx) => {
          const ports = portsOf(fx.id);
          const disabled = ports.length === 0;
          const open = !collapsed.includes(fx.id);
          return (
            <div key={fx.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggleOpen(fx.id)}
                aria-expanded={!disabled && open}
                title={disabled ? undefined : open ? "Collapse the ports" : "Show the ports"}
                className={cn("flex w-full items-start gap-3 px-3 py-2.5 text-left", disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50")}
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-gray-500">
                  {disabled ? null : open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-gray-900">{fx.id}</span>
                  <span className="block text-[11px] text-gray-500">
                    {disabled
                      ? "No loading or discharge port left to reach"
                      : `${ports.length} port${ports.length > 1 ? "s" : ""} left · ${
                          fx.etaEmails.length ? `${fx.etaEmails.length} address${fx.etaEmails.length > 1 ? "es" : ""} in Handover` : "no address in Handover"
                        }`}
                  </span>
                  <span className={cn("mt-1 inline-block rounded px-1.5 py-0.5 text-[10px]", fx.frequency === "Daily" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500")}>
                    Frequency: {fx.frequency}
                  </span>
                </span>
              </button>

              {!disabled && open && (
                <div className="mx-3 mb-3 ml-10 rounded border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-600">Ports of {fx.id}</div>
                  <div className="divide-y divide-gray-100">
                    {ports.map(({ pc, operation }) => (
                      <button key={pc.id} type="button" onClick={() => onTogglePair(pc.id, fx.id)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50">
                        {box(selectedPairs.has(key(pc.id, fx.id)))}
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] text-gray-900">
                            {pc.port} <span className="text-[11px] text-gray-500">· {operation}</span>
                          </span>
                          <span className="block text-[11px] text-gray-500">ETA {fmtDT(etaAt8(pc))}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
