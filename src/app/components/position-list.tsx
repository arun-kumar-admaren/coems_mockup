import React from "react";
import { Mail } from "lucide-react";
import { cn } from "./ui/utils";
import { ArrivalDepartureReport } from "./arrival-departure-report";
import { ETA_VOYAGES, cardDates, dueFixtures, fmtCard, nextPortCall, useEtaState, type PortCall } from "./eta-notice-store";

// Version 2.0 mockup of the Chartering → Position List (kanban): one column per vessel,
// port-call cards in voyage order. Clicking a card opens the Arrival and Departure Report,
// where the ETA notice is sent.

export function PositionList() {
  const st = useEtaState();
  const [openId, setOpenId] = React.useState<string | null>(null);

  const renderCard = (voyageNumber: string, pc: PortCall) => {
    const voyage = ETA_VOYAGES.find((v) => v.number === voyageNumber)!;
    const dates = cardDates(pc, st);
    const due = dueFixtures(voyage, pc, st);
    const isNext = nextPortCall(voyage)?.id === pc.id;
    const visited = !!pc.actual.departure;
    return (
      <button
        key={pc.id}
        type="button"
        onClick={() => setOpenId(pc.id)}
        title="Open the Arrival and Departure Report"
        className={cn(
          "block w-full rounded border p-2 text-left transition-shadow hover:shadow-md",
          visited ? "bg-gray-100 border-gray-200" : "bg-white",
          isNext ? "border-2 border-[#ffd700]" : !visited && "border-gray-300"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[12px] font-medium text-gray-900">{pc.port}</div>
            <div className="text-[10px] text-gray-400">{pc.kind === "canal" ? "CANAL" : pc.locode}</div>
          </div>
          <div className="shrink-0 text-right text-[10px] leading-4 text-gray-700">
            {pc.startOnly ? (
              <div>ATS - {fmtCard(pc.actual.departure)}</div>
            ) : (
              <>
                {dates.arrival && (
                  <div className="hover:underline">
                    {dates.arrival.label} - {fmtCard(dates.arrival.value)}
                  </div>
                )}
                {dates.departure && (
                  <div className="hover:underline">
                    {dates.departure.label} - {fmtCard(dates.departure.value)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-gray-500">
          <span>PIC</span>
          <span className="rounded bg-gray-700 px-1 text-[9px] font-semibold text-white" title={voyage.operationInCharge}>
            {voyage.operationInCharge.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
          {due.length > 0 && (
            <span
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
              title={`ETA notice due today: ${due.map((f) => f.id).join(", ")}`}
            >
              <Mail className="size-3" /> Due
            </span>
          )}
          <span className="ml-auto text-[10px]">
            {pc.fixtures.length > 0 ? (
              <span className="rounded border border-gray-300 bg-white px-1.5 py-px text-gray-700">Fix. {pc.fixtures.length}</span>
            ) : (
              <span className="text-gray-300">Fix. 0</span>
            )}
          </span>
        </div>
        {pc.remarks && <div className="mt-1.5 truncate rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">{pc.remarks}</div>}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#f0f0f0]">
      <div className="flex items-center gap-6 border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-[15px] font-semibold text-gray-900">
          Position List <span className="align-top text-[8px] font-bold uppercase tracking-wider text-blue-500">Beta</span>
        </h1>
        <div className="flex items-center gap-4 text-[12px] text-gray-600">
          {["Preplanning", "Finalized", "Active", "Completed"].map((s) => (
            <label key={s} className="flex items-center gap-1.5">
              <input type="checkbox" defaultChecked={s === "Preplanning" || s === "Active"} className="size-3.5 accent-blue-600" />
              {s}
            </label>
          ))}
        </div>
        <span className="ml-auto text-[11px] text-gray-500">Click a port call to open its Arrival and Departure Report.</span>
      </div>

      <div className="flex flex-1 gap-3 overflow-x-auto overflow-y-hidden p-4">
        {ETA_VOYAGES.map((v) => (
          <div key={v.number} className="flex w-[300px] shrink-0 flex-col rounded border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-3 py-2">
              <div className="text-[12px] font-semibold text-gray-900">{v.vessel}</div>
              <div className="text-[10px] text-gray-500">
                {v.number} · {v.status}
              </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto bg-[#f6f6f6] p-2">{v.portCalls.map((pc) => renderCard(v.number, pc))}</div>
          </div>
        ))}
      </div>

      {openId && <ArrivalDepartureReport portCallId={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
