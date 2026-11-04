import { useState } from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { FixtureReport } from "./fixture-report";
import { FixtureReportDialog } from "./fixture-report-dialog";
import { EXAMPLE_CHARTS, EXAMPLE_PARAMS, EXAMPLE_PIVOTS, ReportParams, ReportRecord, todayDmy } from "./fixture-report-data";

const USER = "Tester Admaren";

const SEED: ReportRecord[] = [
  { id: 331, name: "Fixture report 2022", type: "Fixture Report", createdBy: USER, createdOn: "03/11/2026", modifiedBy: USER, modifiedOn: "03/11/2026", params: EXAMPLE_PARAMS, charts: EXAMPLE_CHARTS, pivots: EXAMPLE_PIVOTS, pivotSel: 2, hidden: [] },
  { id: 43, name: "test", type: "Budget Plan", createdBy: USER, createdOn: "20/08/2026", modifiedBy: USER, modifiedOn: "20/08/2026", charts: [], pivots: [], pivotSel: 0, hidden: [] },
  { id: 26, name: "Neethu testing2", type: "Budget Plan", createdBy: USER, createdOn: "03/02/2026", modifiedBy: USER, modifiedOn: "03/02/2026", charts: [], pivots: [], pivotSel: 0, hidden: [] },
  { id: 25, name: "Testing neethu", type: "Fleet Plan", createdBy: USER, createdOn: "03/02/2026", modifiedBy: USER, modifiedOn: "03/02/2026", charts: [], pivots: [], pivotSel: 0, hidden: [] },
];

/**
 * Reports module (COEMS Version 2.0). Replaces the old "Fixture Reports" menu:
 * users create a Fixture Report here and build their own charts and pivot tables from its table.
 */
export function Reports() {
  const [reports, setReports] = useState<ReportRecord[]>(SEED);
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [active, setActive] = useState<"list" | number>("list");
  const [creating, setCreating] = useState(false);
  const [owner, setOwner] = useState<"Mine" | "Others">("Mine");
  const [archived, setArchived] = useState(false);
  const [q, setQ] = useState("");

  const visible = reports.filter((r) => owner === "Mine" && !archived && (r.name + r.type).toLowerCase().includes(q.toLowerCase()));
  const open = (id: number) => { setOpenIds((o) => (o.includes(id) ? o : [...o, id])); setActive(id); };
  const close = (id: number) => { setOpenIds((o) => o.filter((x) => x !== id)); if (active === id) setActive("list"); };
  const patch = (id: number, p: Partial<ReportRecord>) => setReports((rs) => rs.map((r) => (r.id === id ? { ...r, ...p, modifiedBy: USER, modifiedOn: todayDmy() } : r)));
  const create = (p: ReportParams) => {
    const id = Math.max(0, ...reports.map((r) => r.id)) + 1;
    const rec: ReportRecord = { id, name: p.name, type: "Fixture Report", createdBy: USER, createdOn: todayDmy(), modifiedBy: USER, modifiedOn: todayDmy(), params: p, charts: [], pivots: [], pivotSel: 0, hidden: [] };
    setReports((rs) => [rec, ...rs]);
    open(id);
  };
  const current = typeof active === "number" ? reports.find((r) => r.id === active) : undefined;

  return (
    <div className="flex h-full w-full flex-col bg-[#f8f9fa]">
      {/* report tabs */}
      <div className="flex items-end gap-1 overflow-x-auto border-b border-gray-200 bg-[#f8f9fa] px-6 pt-3">
        <button onClick={() => setActive("list")} className={`border-b-2 px-4 py-2.5 text-sm font-medium ${active === "list" ? "border-[#ffd700] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>All Reports</button>
        {openIds.map((id) => {
          const r = reports.find((x) => x.id === id);
          if (!r) return null;
          return (
            <div key={id} className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm ${active === id ? "border-[#ffd700] font-medium text-gray-900" : "border-transparent text-gray-500"}`}>
              <button onClick={() => setActive(id)} className="max-w-[200px] truncate">{r.name}</button>
              <button onClick={() => close(id)} className="rounded p-0.5 hover:bg-gray-200" aria-label={`Close ${r.name}`}><X className="size-3.5" /></button>
            </div>
          );
        })}
      </div>

      {current && current.params ? (
        <div className="min-h-0 flex-1"><FixtureReport key={current.id} report={current} onPatch={(p) => patch(current.id, p)} /></div>
      ) : (
        <>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-gray-400" />
              <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="h-9 border-gray-200 bg-white pl-9 text-sm focus-visible:ring-1 focus-visible:ring-[#ffd700]" />
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white text-sm">
                {(["Mine", "Others"] as const).map((o) => (
                  <button key={o} onClick={() => setOwner(o)} className={`px-3 py-1.5 ${owner === o ? "bg-gray-100 font-medium text-gray-900" : "text-gray-600"}`}>{o}</button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600"><Switch checked={archived} onCheckedChange={setArchived} /> Archived</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="h-9 gap-1.5 bg-[#111827] px-4 text-white hover:bg-[#1f2937]"><Plus className="size-4" /> Create <ChevronDown className="size-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem disabled>New Fleet Plan</DropdownMenuItem>
                  <DropdownMenuItem disabled>New Budget Report</DropdownMenuItem>
                  <DropdownMenuItem disabled>New Port Call Evaluation Report</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCreating(true)} className="font-medium">
                    New Fixture Report <span className="ml-auto rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600">new</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1 overflow-auto border-y border-gray-200 bg-white">
            <table className="w-full min-w-max border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#f8f9fa] text-[11px] font-medium uppercase tracking-wider text-gray-500">
                  {["ID", "Name", "Type", "Created By", "Created On", "Modified By", "Modified On"].map((h) => <th key={h} className="whitespace-nowrap px-6 py-4">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px] text-gray-700">
                {visible.map((r) => {
                  const clickable = !!r.params;
                  return (
                    <tr key={r.id} onClick={clickable ? () => open(r.id) : undefined} title={clickable ? undefined : "Only Fixture Reports are part of this mockup"} className={`${clickable ? "cursor-pointer hover:bg-gray-50" : "cursor-default text-gray-500"}`}>
                      <td className="whitespace-nowrap px-6 py-3.5">{r.id}</td>
                      <td className="whitespace-nowrap px-6 py-3.5 font-medium text-[#111827]">{r.name}</td>
                      <td className="whitespace-nowrap px-6 py-3.5">{r.type}</td>
                      <td className="whitespace-nowrap px-6 py-3.5">{r.createdBy}</td>
                      <td className="whitespace-nowrap px-6 py-3.5">{r.createdOn}</td>
                      <td className="whitespace-nowrap px-6 py-3.5">{r.modifiedBy}</td>
                      <td className="whitespace-nowrap px-6 py-3.5">{r.modifiedOn}</td>
                    </tr>
                  );
                })}
                {visible.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-2 text-xs text-gray-500">Found {visible.length} records</div>
        </>
      )}

      <FixtureReportDialog open={creating} onOpenChange={setCreating} mode="create" onSubmit={create} />
    </div>
  );
}
