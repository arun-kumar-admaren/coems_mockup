import { PointerEvent as ReactPointerEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, GripVertical, Plus, RefreshCw, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Field, NativeSelect, inputCls } from "./fixture-report-ui";
import { FixtureReportDialog } from "./fixture-report-dialog";
import { BarView, PieView, StackView } from "./fixture-report-charts";
import {
  AggOp, BASIS_LABEL, ChartSpec, Col, DatePart, LEFT_OUT_COLS, Loaded, ReportRecord, Row,
  aggLabel, barData, buildTable, colTypes, comp, dateFieldCols, fmtCell, fmtNum, isDateType, loadFixtureData, partName, pieData, splitField, stackData,
} from "./fixture-report-data";
import { PivotTab } from "./fixture-report-pivot";

type Tab = "reports" | "charts" | "pivot";
const KEY_COLUMNS = ["NUMBER", "FIXTURE STATUS", "BOOKING DATE", "ACCOUNT", "CURRENCY", "GROSS FREIGHT", "CONVERTED GROSS FREIGHT"];

interface Props { report: ReportRecord; onPatch: (patch: Partial<ReportRecord>) => void }

export function FixtureReport({ report, onPatch }: Props) {
  const params = report.params!;
  const [data, setData] = useState<Loaded | null>(null);
  const [tab, setTab] = useState<Tab>("reports");
  const [editOpen, setEditOpen] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => { loadFixtureData().then(setData); }, []);
  // Charts and pivots also get a Month and a Year field for every date column (never shown as table columns)
  const types = useMemo(() => (data ? colTypes([...data.cols, ...dateFieldCols(data.cols)]) : {}), [data]);
  const table = useMemo(() => (data ? buildTable(data.rows, params) : null), [data, params, tick]);
  // "Select required columns": only these columns are in the table and can be used by charts and pivots
  const cols = useMemo(() => (data ? (params.columns ? data.cols.filter((c) => params.columns!.includes(c.name)) : data.cols) : []), [data, params.columns]);
  // Table columns the existing charts and pivots use (a date's Month/Year field counts as its date column)
  const used = useMemo(() => {
    const s = new Set<string>();
    const add = (f?: string) => { if (f) s.add(splitField(f, types)[0]); };
    report.charts.forEach((c) => { add(c.x); add(c.y); add(c.stack); add(c.cat); add(c.val); });
    report.pivots.forEach((p) => { [...p.filters, ...p.rows, ...p.cols].forEach(add); p.values.forEach((v) => add(v.field)); });
    return Array.from(s);
  }, [report.charts, report.pivots, types]);

  if (!data || !table) return <div className="p-8 text-sm text-gray-500">Generating the table…</div>;

  const has = (name: string) => cols.some((c) => c.name === name);
  const cg = table.rows.reduce((a, r) => a + ((r["CONVERTED GROSS FREIGHT"] as number) || 0), 0);
  const cm = table.rows.reduce((a, r) => a + ((r["CONVERTED MANAGEMENT FEE"] as number) || 0), 0);
  const cur = params.currency === "Euro" ? "EUR" : "USD";

  return (
    <div className="flex h-full flex-col bg-[#f8f9fa]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{report.name}</h2>
          <p className="text-xs text-gray-500">
            {BASIS_LABEL[params.basis]}: {fmtCell("date", params.from)} to {fmtCell("date", params.to)} · converted to {params.currency} at each fixture's own conversion date
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-white" onClick={() => setTick((t) => t + 1)} title="Refresh">
            <RefreshCw className="size-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-9 bg-white" onClick={() => setEditOpen(true)} title="Edit the report fields">
            <SettingsIcon className="size-4" />
          </Button>
          <Button size="sm" className="h-9 bg-[#111827] text-white hover:bg-[#1f2937]" disabled title="Not part of the mockup">Share</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-6 py-3">
        <Stat label="Fixtures in this report" value={fmtNum(table.rows.length)} />
        {has("CONVERTED GROSS FREIGHT") && <Stat label="Converted Gross Freight" value={`${cur} ${comp(cg)}`} />}
        {has("CONVERTED MANAGEMENT FEE") && <Stat label="Converted Management Fee" value={`${cur} ${comp(cm)}`} />}
      </div>

      <div className="border-b border-gray-200 px-6">
        <div className="flex items-center gap-6">
          {([["reports", "Reports"], ["charts", "Charts"], ["pivot", "Pivot Table"]] as [Tab, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`border-b-2 py-3 text-sm font-medium ${tab === id ? "border-[#ffd700] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === "reports" && <ReportsTab cols={cols} exportTotal={data.cols.filter((c) => !c.added).length + LEFT_OUT_COLS.length} rows={table.rows} hidden={report.hidden} onHidden={(h) => onPatch({ hidden: h })} basisMissing={params.basis === "laycan" ? table.missing : 0} />}
        {tab === "charts" && <ChartsTab types={types} cols={cols} allRows={data.rows} rows={table.rows} charts={report.charts} onCharts={(c) => onPatch({ charts: c })} />}
        {tab === "pivot" && <PivotTab types={types} cols={cols} rows={table.rows} pivots={report.pivots} onChange={(pivots) => onPatch({ pivots })} />}
      </div>

      <FixtureReportDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        initial={params}
        lockedCols={used}
        onSubmit={(p) => onPatch({ params: p, name: p.name })}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[190px] rounded-lg border border-gray-200 bg-white px-4 py-2.5">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- Reports tab */
// Column widths work like the COEMS listing pages: drag the grip at a header's right edge; the width belongs to
// the column (kept when hidden/shown), applies to header and every cell, never changes other columns, is saved
// automatically (here: in this browser, one set for the page) and unresized columns keep their default width.
const MIN_COL_W = 70;
const MAX_DEFAULT_W = 300;
const WIDTHS_KEY = "coems-fixture-report-col-widths";
function loadWidths(): Record<string, number> {
  try {
    const v = JSON.parse(localStorage.getItem(WIDTHS_KEY) || "{}");
    return v && typeof v === "object" ? v : {};
  } catch { return {}; }
}

function ReportsTab({ cols, exportTotal, rows, hidden, onHidden, basisMissing }: { cols: Col[]; exportTotal: number; rows: Row[]; hidden: string[]; onHidden: (h: string[]) => void; basisMissing: number }) {
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [widths, setWidths] = useState<Record<string, number>>(loadWidths);
  const widthsRef = useRef(widths);
  const drag = useRef<{ name: string; x: number; w: number } | null>(null);
  const per = 25;
  const pages = Math.max(1, Math.ceil(rows.length / per));
  const p = Math.min(page, pages - 1);
  const visible = cols.filter((c) => !hidden.includes(c.name));
  const slice = rows.slice(p * per, p * per + per);
  const toggle = (name: string) => onHidden(hidden.includes(name) ? hidden.filter((h) => h !== name) : [...hidden, name]);
  const leftOut = LEFT_OUT_COLS.map((n) => n.toLowerCase());
  const leftOutSentence = `${leftOut.slice(0, -1).join(", ")} and ${leftOut[leftOut.length - 1]}`;
  const leftOutText = leftOutSentence.charAt(0).toUpperCase() + leftOutSentence.slice(1);

  // Default width = what the header and the longest of the first rows need (capped, so long text is cut off with "…" until widened)
  const defaults = useMemo(() => {
    const out: Record<string, number> = {};
    const sample = rows.slice(0, 300);
    for (const c of cols) {
      let body = 0;
      for (const r of sample) body = Math.max(body, fmtCell(c.type, r[c.name]).length);
      out[c.name] = Math.min(MAX_DEFAULT_W, Math.max(MIN_COL_W, Math.round(Math.max(c.name.length * 8, body * 7.2) + 40)));
    }
    return out;
  }, [cols, rows]);
  const widthOf = (c: Col) => widths[c.name] ?? defaults[c.name] ?? 120;
  const tableWidth = visible.reduce((s, c) => s + widthOf(c), 0);

  const startResize = (e: ReactPointerEvent<HTMLDivElement>, c: Col) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { name: c.name, x: e.clientX, w: widthOf(c) };
    document.body.style.userSelect = "none";
  };
  const moveResize = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const w = Math.max(MIN_COL_W, Math.round(d.w + e.clientX - d.x));
    if (widthsRef.current[d.name] === w) return;
    widthsRef.current = { ...widthsRef.current, [d.name]: w };
    setWidths(widthsRef.current);
  };
  const endResize = () => {
    if (!drag.current) return;
    drag.current = null;
    document.body.style.userSelect = "";
    try { localStorage.setItem(WIDTHS_KEY, JSON.stringify(widthsRef.current)); } catch { /* storage unavailable: width just isn't remembered */ }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          One row per fixture: {cols.filter((c) => !c.added).length} of the {exportTotal} Fixture List Export All columns{cols.some((c) => c.added) && <>, plus the ones marked <span className="rounded bg-amber-100 px-1 text-[10px] text-gray-800">new</span></>}. {leftOutText} are left out for now: they hold several comma separated values in one cell. Charts and pivots can only use the columns selected for this report (the gear above changes them); a date column can be grouped by month or year.
          {basisMissing > 0 && ` ${basisMissing} fixtures have no laycan and are left out.`}
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-white">
              Columns ({visible.length} of {cols.length}) <ChevronDown className="size-4 text-gray-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="max-h-96 w-80 overflow-auto p-3">
            <div className="mb-2 flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={() => onHidden([])}>Show all</Button>
              <Button variant="outline" size="sm" className="h-8" onClick={() => onHidden(cols.map((c) => c.name).filter((n) => !KEY_COLUMNS.includes(n)))}>Key columns only</Button>
            </div>
            <input className={`${inputCls} mb-2`} placeholder="Search columns" value={q} onChange={(e) => setQ(e.target.value)} />
            {cols.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).map((c) => (
              <label key={c.name} className="flex items-center gap-2 py-1 text-xs text-gray-800">
                <Checkbox checked={!hidden.includes(c.name)} onCheckedChange={() => toggle(c.name)} />
                {c.name}
                {c.added && <span className="rounded bg-amber-100 px-1 text-[10px]">new</span>}
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No fixtures match these fields.</div>
      ) : (
        <>
          {/* Fills the screen below the header (the 430px is the header, stats, tabs and paging above/below), never shorter than 320px */}
          <div className="overflow-auto rounded-lg border border-gray-200 bg-white" style={{ maxHeight: "max(320px, calc(100vh - 430px))" }}>
            <table className="border-collapse text-left" style={{ width: tableWidth, tableLayout: "fixed" }}>
              <colgroup>
                {visible.map((c) => <col key={c.name} style={{ width: widthOf(c) }} />)}
              </colgroup>
              <thead>
                <tr className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                  {visible.map((c) => (
                    <th key={c.name} className={`sticky top-0 z-[1] border-b border-gray-200 py-3 pl-3 pr-5 ${c.added ? "bg-amber-50 text-gray-800" : "bg-[#f8f9fa]"} ${c.type === "num" ? "text-right" : ""}`} title={c.added ? `${c.name} (new column, not in the export)` : c.name}>
                      <span className="block truncate">{c.name}</span>
                      <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize column ${c.name}`}
                        title="Drag to resize"
                        className="group/grip absolute right-0 top-0 flex h-full w-4 cursor-col-resize touch-none select-none items-center justify-center"
                        onPointerDown={(e) => startResize(e, c)}
                        onPointerMove={moveResize}
                        onPointerUp={endResize}
                        onPointerCancel={endResize}
                      >
                        <GripVertical className="size-3.5 text-gray-300 group-hover/grip:text-blue-500" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px] text-gray-700">
                {slice.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {visible.map((c) => {
                      const s = fmtCell(c.type, r[c.name]);
                      return <td key={c.name} title={s || undefined} className={`truncate px-3 py-2.5 ${c.type === "num" ? "text-right tabular-nums" : ""}`}>{s}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-end gap-3 text-sm text-gray-600">
            <span>{p * per + 1} – {p * per + slice.length} of {rows.length}</span>
            <Button variant="outline" size="sm" className="h-8 bg-white" disabled={p === 0} onClick={() => setPage(p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 bg-white" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Charts tab */
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((i) => i.id)) + 1;
const TYPE_LABEL = { bar: "Bar Chart", stacked: "Stacked Bar Chart", pie: "Pie Chart" } as const;

function ChartsTab({ types, cols, allRows, rows, charts, onCharts }: { types: Record<string, Col["type"]>; cols: Col[]; allRows: Row[]; rows: Row[]; charts: ChartSpec[]; onCharts: (c: ChartSpec[]) => void }) {
  const [creating, setCreating] = useState<ChartSpec["type"] | null>(null);
  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-3">
        <span className="text-xs text-gray-500">Charts are built from the table columns, as in the Port Call Evaluation Report.</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 gap-1.5 bg-[#111827] text-white hover:bg-[#1f2937]"><Plus className="size-4" /> Create New</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(TYPE_LABEL) as ChartSpec["type"][]).map((t) => (
              <DropdownMenuItem key={t} onSelect={() => setCreating(t)}>{TYPE_LABEL[t]}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {charts.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No charts created yet. Click "Create New" to generate your first chart.</div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">No fixtures match these fields.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {charts.map((c) => (
            <ChartCard key={c.id} c={c} types={types} allRows={allRows} rows={rows} onDelete={() => onCharts(charts.filter((x) => x.id !== c.id))} />
          ))}
        </div>
      )}

      {creating && (
        <ChartDialog type={creating} cols={cols} types={types} onClose={() => setCreating(null)} onCreate={(spec) => { onCharts([{ ...spec, id: nextId(charts) }, ...charts]); setCreating(null); }} />
      )}
    </div>
  );
}

function ChartCard({ c, types, allRows, rows, onDelete }: { c: ChartSpec; types: Record<string, Col["type"]>; allRows: Row[]; rows: Row[]; onDelete: () => void }) {
  const [asTable, setAsTable] = useState(false);
  let settings = "";
  let warn = "";
  let chart: ReactNode = null;
  let table: ReactNode = null;

  if (c.type === "bar") {
    const d = barData(types, rows, c);
    settings = `X Axis: ${c.x}  |  Y Axis: ${c.y}  |  Aggregation: ${c.agg}`;
    chart = <BarView data={d} seriesName={aggLabel(c.y!, c.agg)} />;
    table = <SimpleTable head={[c.x!, aggLabel(c.y!, c.agg)]} body={d.map((x) => [x.name, fmtNum(x.value)])} />;
  } else if (c.type === "stacked") {
    const s = stackData(types, allRows, rows, c);
    settings = `X Axis: ${c.x}  |  Y Axis: ${c.y}  |  Aggregation: ${c.agg}  |  Stack By: ${c.stack}  |  Display In: ${c.pct ? "Percentage" : "Values"}`;
    if (s.folded) warn = `Stack By has more than 6 values; the smallest ${s.folded} are shown together as Others (mockup behaviour).`;
    chart = <StackView data={s.data} series={s.series} percent={!!c.pct} />;
    table = <SimpleTable head={[c.x!, ...s.series.map((x) => x.name)]} body={s.data.map((r) => [String(r.name), ...s.series.map((x) => fmtNum(Number(r[x.name]) || 0))])} />;
  } else {
    const p = pieData(types, allRows, rows, c);
    const total = p.slices.reduce((a, x) => a + x.value, 0);
    settings = `Category (Slice By): ${c.cat}  |  Value: ${c.val}  |  Aggregation: ${c.agg}`;
    if (p.folded) warn = `This pie has ${p.groups} categories. Pies read best with 6 or fewer, so everything after the 5th is shown as Others (mockup behaviour).`;
    chart = <PieView slices={p.slices} measure={aggLabel(c.val!, c.agg)} />;
    table = <SimpleTable head={[c.cat!, aggLabel(c.val!, c.agg), "Share"]} body={p.slices.map((x) => [x.name, fmtNum(x.value), `${((x.value / total) * 100).toFixed(1)}%`])} />;
  }

  return (
    <section className={`min-w-0 rounded-lg border border-gray-200 bg-white p-4 ${c.type !== "pie" ? "xl:col-span-2" : ""}`}>
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{TYPE_LABEL[c.type]}: {c.name}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => setAsTable((v) => !v)}>{asTable ? "Chart" : "Table"}</Button>
          <Button variant="outline" size="sm" className="h-8" onClick={onDelete} title="Delete this chart"><Trash2 className="size-4" /></Button>
        </div>
      </header>
      <p className="mb-2 mt-1 text-xs text-gray-400">{settings}</p>
      {warn && <p className="mb-2 text-xs text-orange-600">{warn}</p>}
      {asTable ? table : chart}
    </section>
  );
}

function SimpleTable({ head, body }: { head: string[]; body: string[][] }) {
  return (
    <div className="max-h-80 overflow-auto rounded-md border border-gray-200">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-gray-500">
            {head.map((h, i) => <th key={i} className={`sticky top-0 whitespace-nowrap border-b border-gray-200 bg-[#f8f9fa] px-3 py-2 ${i ? "text-right" : ""}`}>{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {body.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={`whitespace-nowrap px-3 py-1.5 ${j ? "text-right tabular-nums" : ""}`}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function aggOptions(types: Record<string, Col["type"]>, col: string): AggOp[] {
  return types[col] === "num" ? ["Count", "Sum", "Average"] : ["Count"];
}

/** Column picker for fields charts and pivots group by. A date column is detected automatically and gets a second
 *  select to group it by month or year (like Excel), so no month/year columns are needed in the table. */
function FieldPicker({ value, onChange, cols, types, allowNone, noneLabel, ariaLabel }: {
  value: string; onChange: (v: string) => void; cols: Col[]; types: Record<string, Col["type"]>;
  allowNone?: boolean; noneLabel?: string; ariaLabel?: string;
}) {
  const [base, part] = splitField(value, types);
  const isDate = isDateType(types[base]);
  const names = cols.map((c) => c.name);
  const options = allowNone ? [{ value: "", label: noneLabel ?? "(none)" }, ...names] : names;
  return (
    <div className={isDate ? "grid grid-cols-[1fr_120px] gap-2" : ""}>
      <NativeSelect ariaLabel={ariaLabel} value={base} onChange={(b) => onChange(isDateType(types[b]) ? partName(b, part ?? "Month") : b)} options={options} />
      {isDate && (
        <NativeSelect
          ariaLabel={`${ariaLabel ?? "Field"} date grouping`}
          value={part ?? "Day"}
          onChange={(g) => onChange(g === "Day" ? base : partName(base, g as DatePart))}
          options={[{ value: "Month", label: "By month" }, { value: "Year", label: "By year" }, { value: "Day", label: "By day" }]}
        />
      )}
    </div>
  );
}

function ChartDialog({ type, cols, types, onClose, onCreate }: { type: ChartSpec["type"]; cols: Col[]; types: Record<string, Col["type"]>; onClose: () => void; onCreate: (s: ChartSpec) => void }) {
  const names = cols.map((c) => c.name);
  // Preferred starting choices, falling back to the first selected column when the report does not have them
  const dflt = (pref: string) => (names.includes(splitField(pref, types)[0]) ? pref : names[0]);
  const [name, setName] = useState("");
  const [x, setX] = useState(dflt("BOOKING DATE (Month)"));
  const [y, setY] = useState(dflt("NUMBER"));
  const [stack, setStack] = useState(dflt("CURRENCY"));
  const [cat, setCat] = useState(dflt("CARGO TYPE"));
  const [val, setVal] = useState(dflt("NUMBER"));
  const [agg, setAgg] = useState<AggOp>("Count");
  const [pct, setPct] = useState(false);
  const [err, setErr] = useState("");

  const measure = type === "pie" ? val : y;
  const opts = aggOptions(types, measure);
  const curAgg = opts.includes(agg) ? agg : "Count";

  const submit = () => {
    if (!name.trim()) { setErr("Chart Name is required."); return; }
    const base = { id: 0, type, name: name.trim(), agg: curAgg } as ChartSpec;
    if (type === "pie") onCreate({ ...base, cat, val });
    else onCreate({ ...base, x, y, ...(type === "stacked" ? { stack, pct } : {}) });
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add {TYPE_LABEL[type]}</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <Field label="Chart Name" required><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
          {type === "pie" ? (
            <>
              <Field label="Category (Slice By)" required><FieldPicker ariaLabel="Category" value={cat} onChange={setCat} cols={cols} types={types} /></Field>
              <Field label="Value" required><NativeSelect value={val} onChange={setVal} options={names} /></Field>
            </>
          ) : (
            <>
              <Field label="X Axis" required><FieldPicker ariaLabel="X Axis" value={x} onChange={setX} cols={cols} types={types} /></Field>
              <Field label="Y Axis" required><NativeSelect value={y} onChange={setY} options={names} /></Field>
            </>
          )}
          <Field label="Aggregation" required><NativeSelect value={curAgg} onChange={(v) => setAgg(v as AggOp)} options={opts} /></Field>
          {type === "stacked" && (
            <>
              <Field label="Stack By" required><FieldPicker ariaLabel="Stack By" value={stack} onChange={setStack} cols={cols} types={types} /></Field>
              <Field label="Display In">
                <div className="flex gap-4 text-sm text-gray-800">
                  <label className="flex items-center gap-1.5"><input type="radio" checked={!pct} onChange={() => setPct(false)} /> Values</label>
                  <label className="flex items-center gap-1.5"><input type="radio" checked={pct} onChange={() => setPct(true)} /> Percentage</label>
                </div>
              </Field>
            </>
          )}
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#111827] text-white hover:bg-[#1f2937]" onClick={submit}>Create Chart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
