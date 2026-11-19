import { PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, GripVertical, Plus, Settings as SettingsIcon, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Field, inputCls } from "./fixture-report-ui";
import {
  AggOp, Col, ColType, DatePart, PivotSpec, Row,
  aggLabel, aggregate, fmtNum, gk, groupBy, isDateType, keyLabel, partName, sortedKeys, splitField,
} from "./fixture-report-data";

/*
 * Pivot Table tab of a Fixture Report.
 *  - COEMS-14199 (create): "Add New" opens the "Add New Pivot Table" overlay; fields are dragged into Filters, Columns, Rows and Values.
 *  - COEMS-14368 (edit): side panel with the report's pivot tables, first one selected by default, Settings (gear) opens "Edit Pivot Table".
 *  - Date columns in Filters / Rows / Columns carry a Year / Month dropdown; Values entries carry an aggregation dropdown.
 */

type Types = Record<string, ColType>;
type ZoneKey = "filters" | "cols" | "rows" | "values";

const AGGS: AggOp[] = ["Sum", "Count", "Average"];
const PARTS: DatePart[] = ["Year", "Month"];
/** Number columns may be summed or averaged; every other column can only be counted. */
const aggOptions = (types: Types, field: string): AggOp[] => (types[field] === "num" ? AGGS : ["Count"]);
const defaultAgg = (types: Types, field: string): AggOp => (types[field] === "num" ? "Sum" : "Count");
const baseOf = (types: Types, f: string) => splitField(f, types)[0];
const partOf = (types: Types, f: string) => splitField(f, types)[1];

/* ------------------------------------------------------------------ builder state */
let uidSeq = 1;
interface Item { uid: number; field: string; agg?: AggOp }
type Zones = Record<ZoneKey, Item[]>;
const emptyZones = (): Zones => ({ filters: [], cols: [], rows: [], values: [] });
const fromSpec = (p: PivotSpec): Zones => ({
  filters: p.filters.map((f) => ({ uid: uidSeq++, field: f })),
  cols: p.cols.map((f) => ({ uid: uidSeq++, field: f })),
  rows: p.rows.map((f) => ({ uid: uidSeq++, field: f })),
  values: p.values.map((v) => ({ uid: uidSeq++, field: v.field, agg: v.agg })),
});
const toSpec = (name: string, z: Zones): Omit<PivotSpec, "id"> => ({
  name,
  filters: z.filters.map((i) => i.field),
  rows: z.rows.map((i) => i.field),
  cols: z.cols.map((i) => i.field),
  values: z.values.map((i) => ({ field: i.field, agg: i.agg! })),
});

type Src = { kind: "list"; field: string } | { kind: "zone"; zone: ZoneKey; uid: number };

const ZONE_TITLE: Record<ZoneKey, string> = { filters: "Filters", cols: "Columns", rows: "Rows", values: "Values" };
const itemLabel = (zone: ZoneKey, it: Item) => (zone === "values" ? `${it.field} (${it.agg})` : it.field);

/* ------------------------------------------------------------------ builder overlay (Add / Edit) */
function PivotDialog({ mode, initial, cols, types, onClose, onSubmit }: {
  mode: "add" | "edit"; initial?: PivotSpec; cols: Col[]; types: Types; onClose: () => void; onSubmit: (s: Omit<PivotSpec, "id">) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [zones, setZones] = useState<Zones>(() => (initial ? fromSpec(initial) : emptyZones()));
  const [q, setQ] = useState("");
  const [ghost, setGhost] = useState<{ x: number; y: number; label: string } | null>(null);
  const [over, setOver] = useState<{ zone: ZoneKey; index: number } | null>(null);
  const [dragUid, setDragUid] = useState(-1);
  const drag = useRef<{ src: Src; sx: number; sy: number; active: boolean; label: string } | null>(null);

  const valuesErr = zones.values.length === 0 ? "At least one Value field is required" : "";
  const groupErr = zones.rows.length + zones.cols.length === 0 ? "At least one field must be added to Rows or Columns." : "";
  const valid = name.trim().length > 0 && !valuesErr && !groupErr;

  /** Which zone is under the pointer, and the position in it (among the items that are not being dragged). */
  const hit = (x: number, y: number): { zone: ZoneKey; index: number } | null => {
    const zoneEl = document.elementsFromPoint(x, y).find((el) => (el as HTMLElement).dataset?.zone) as HTMLElement | undefined;
    if (!zoneEl) return null;
    const skip = drag.current?.src.kind === "zone" ? drag.current.src.uid : -1;
    const items = Array.from(zoneEl.querySelectorAll<HTMLElement>("[data-uid]")).filter((el) => Number(el.dataset.uid) !== skip);
    let index = items.length;
    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) { index = i; break; }
    }
    return { zone: zoneEl.dataset.zone as ZoneKey, index };
  };

  const applyDrop = (src: Src, zone: ZoneKey, index: number) => setZones((prev) => {
    const z: Zones = { filters: [...prev.filters], cols: [...prev.cols], rows: [...prev.rows], values: [...prev.values] };
    let item: Item;
    if (src.kind === "zone") {
      const i = z[src.zone].findIndex((x) => x.uid === src.uid);
      if (i < 0) return prev;
      item = z[src.zone].splice(i, 1)[0];
    } else item = { uid: uidSeq++, field: src.field };
    const base = baseOf(types, item.field);
    if (zone === "values") {
      const agg = item.agg && aggOptions(types, base).includes(item.agg) ? item.agg : defaultAgg(types, base);
      if (z.values.some((x) => x.field === base && x.agg === agg)) return prev;
      item = { uid: item.uid, field: base, agg };
    } else {
      // a column is in one of Filters / Rows / Columns only; a date column starts grouped by Year
      (["filters", "rows", "cols"] as ZoneKey[]).forEach((k) => { z[k] = z[k].filter((x) => baseOf(types, x.field) !== base); });
      item = { uid: item.uid, field: isDateType(types[base]) ? partName(base, partOf(types, item.field) ?? "Year") : base };
    }
    z[zone].splice(Math.min(index, z[zone].length), 0, item);
    return z;
  });

  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!d.active && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 4) {
      d.active = true;
      setDragUid(d.src.kind === "zone" ? d.src.uid : -1);
    }
    if (d.active) { setGhost({ x: e.clientX, y: e.clientY, label: d.label }); setOver(hit(e.clientX, e.clientY)); }
  };
  // The window listeners must stay the same functions for the whole drag (the component re-renders while dragging),
  // so they call the latest handlers through refs.
  const moveRef = useRef<(e: PointerEvent) => void>(() => {});
  const upRef = useRef<(e: PointerEvent) => void>(() => {});
  moveRef.current = onMove;
  upRef.current = (e) => onUp(e);
  const stableMove = useRef((e: PointerEvent) => moveRef.current(e)).current;
  const stableUp = useRef((e: PointerEvent) => upRef.current(e)).current;
  function onUp(e: PointerEvent) {
    window.removeEventListener("pointermove", stableMove);
    window.removeEventListener("pointerup", stableUp);
    const d = drag.current;
    drag.current = null;
    if (d?.active) {
      const h = hit(e.clientX, e.clientY);
      if (h) applyDrop(d.src, h.zone, h.index);
      else if (d.src.kind === "zone") { // dragged out of the zones: remove the field
        const s = d.src;
        setZones((prev) => ({ ...prev, [s.zone]: prev[s.zone].filter((x) => x.uid !== s.uid) }));
      }
    }
    setGhost(null); setOver(null); setDragUid(-1);
  }
  const startDrag = (e: ReactPointerEvent, src: Src, label: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    drag.current = { src, sx: e.clientX, sy: e.clientY, active: false, label };
    window.addEventListener("pointermove", stableMove);
    window.addEventListener("pointerup", stableUp);
  };
  useEffect(() => () => { window.removeEventListener("pointermove", stableMove); window.removeEventListener("pointerup", stableUp); }, [stableMove, stableUp]);

  const change = (zone: ZoneKey, uid: number, patch: Partial<Item>) =>
    setZones((prev) => ({ ...prev, [zone]: prev[zone].map((x) => (x.uid === uid ? { ...x, ...patch } : x)) }));
  const remove = (zone: ZoneKey, uid: number) => setZones((prev) => ({ ...prev, [zone]: prev[zone].filter((x) => x.uid !== uid) }));

  const zoneBox = (zone: ZoneKey, error: string) => {
    const items = zones[zone];
    const active = over?.zone === zone;
    let n = 0;
    const line = <div className="my-0.5 h-0.5 rounded bg-blue-500" />;
    return (
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium text-gray-700">{ZONE_TITLE[zone]}{zone === "values" && <span className="text-red-500"> *</span>}</div>
        <div data-zone={zone} className={`min-h-[96px] rounded-md border-2 border-dashed p-1.5 ${active ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"}`}>
          {items.length === 0 && <div className="py-7 text-center text-[11px] text-gray-400">Drop fields here</div>}
          {items.map((it) => {
            const dragged = it.uid === dragUid;
            const showLine = active && !dragged && over!.index === n;
            if (!dragged) n++;
            const base = baseOf(types, it.field);
            const options: string[] = zone === "values" ? aggOptions(types, base) : isDateType(types[base]) ? PARTS : [];
            return (
              <div key={it.uid}>
                {showLine && line}
                <div
                  data-uid={it.uid}
                  onPointerDown={(e) => startDrag(e, { kind: "zone", zone, uid: it.uid }, itemLabel(zone, it))}
                  className={`mb-1 flex cursor-grab touch-none select-none items-center gap-1.5 rounded border border-gray-300 bg-white px-1.5 py-1.5 text-xs text-gray-800 shadow-sm ${dragged ? "opacity-40" : ""}`}
                >
                  <GripVertical className="size-3.5 shrink-0 text-gray-400" />
                  <span className="min-w-0 flex-1 truncate" title={itemLabel(zone, it)}>{itemLabel(zone, it)}</span>
                  {options.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" aria-label={zone === "values" ? `Aggregation of ${it.field}` : `Date grouping of ${base}`} onPointerDown={(e) => e.stopPropagation()} className="rounded p-0.5 hover:bg-gray-100">
                          <ChevronDown className="size-4 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-[300]">
                        {options.map((o) => (
                          <DropdownMenuItem
                            key={o}
                            onSelect={() => (zone === "values" ? change(zone, it.uid, { agg: o as AggOp }) : change(zone, it.uid, { field: partName(base, o as DatePart) }))}
                          >
                            {o}{(zone === "values" ? it.agg === o : partOf(types, it.field) === o) ? "  ✓" : ""}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <button type="button" aria-label={`Remove ${it.field}`} onPointerDown={(e) => e.stopPropagation()} onClick={() => remove(zone, it.uid)} className="rounded p-0.5 hover:bg-gray-100">
                    <X className="size-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
            );
          })}
          {active && over!.index >= n && line}
        </div>
        {error && <p className="text-[11px] text-red-600">{error}</p>}
      </div>
    );
  };

  const list = cols.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-4xl">
        <DialogHeader><DialogTitle>{mode === "add" ? "Add New Pivot Table" : "Edit Pivot Table"}</DialogTitle></DialogHeader>
        <Field label="Pivot Table Name" required>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </Field>
        <div className="text-xs text-gray-600">Drag and drop Fields to add to report.</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col gap-1.5">
            <input className={inputCls} placeholder="Search fields" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="max-h-[330px] overflow-auto rounded-md border border-gray-200 bg-white p-1.5">
              {list.map((c) => (
                <div
                  key={c.name}
                  onPointerDown={(e) => startDrag(e, { kind: "list", field: c.name }, c.name)}
                  className="mb-1 flex cursor-grab touch-none select-none items-center gap-1.5 rounded border border-gray-200 bg-white px-1.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
                >
                  <GripVertical className="size-3.5 shrink-0 text-gray-400" />
                  <span className="min-w-0 flex-1 truncate" title={c.name}>{c.name}</span>
                  {c.added && <span className="rounded bg-amber-100 px-1 text-[10px]">new</span>}
                </div>
              ))}
              {list.length === 0 && <div className="py-4 text-center text-xs text-gray-400">No field found</div>}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {zoneBox("filters", "")}
            {zoneBox("cols", "")}
            {zoneBox("rows", groupErr)}
            {zoneBox("values", valuesErr)}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!valid} className="bg-[#111827] text-white hover:bg-[#1f2937]" onClick={() => onSubmit(toSpec(name.trim(), zones))}>
            {mode === "add" ? "Add" : "Update"}
          </Button>
        </DialogFooter>
        {ghost && createPortal(
          <div style={{ position: "fixed", left: ghost.x + 12, top: ghost.y + 12 }} className="pointer-events-none z-[1000] max-w-[260px] truncate rounded border border-blue-300 bg-white px-2 py-1 text-xs text-gray-800 shadow-lg">
            {ghost.label}
          </div>,
          document.body,
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ pivot output */
interface Node { path: string; label: string; rows: Row[]; kids: Node[] }

function tree(types: Types, rows: Row[], fields: string[], path = ""): Node[] {
  if (!fields.length) return [];
  const m = groupBy(types, rows, fields[0]);
  return sortedKeys(types, m, fields[0]).map((k) => {
    const rs = m.get(k)!;
    const p = `${path}/${String(k)}`;
    return { path: p, label: keyLabel(types, fields[0], k), rows: rs, kids: tree(types, rs, fields.slice(1), p) };
  });
}
const leafNodes = (nodes: Node[]): Node[] => nodes.flatMap((n) => (n.kids.length ? leafNodes(n.kids) : [n]));
const leafCount = (n: Node): number => (n.kids.length ? n.kids.reduce((a, c) => a + leafCount(c), 0) : 1);
function levelsOf(nodes: Node[], depth: number, k: number, out: { label: string; span: number }[][]) {
  nodes.forEach((n) => {
    (out[depth] = out[depth] || []).push({ label: n.label, span: leafCount(n) * k });
    levelsOf(n.kids, depth + 1, k, out);
  });
}
function flatten(nodes: Node[], collapsed: Set<string>, level: number, out: { node: Node; level: number }[]) {
  nodes.forEach((n) => {
    out.push({ node: n, level });
    if (n.kids.length && !collapsed.has(n.path)) flatten(n.kids, collapsed, level + 1, out);
  });
}
const parentPaths = (nodes: Node[]): string[] => nodes.flatMap((n) => (n.kids.length ? [n.path, ...parentPaths(n.kids)] : []));

function PivotOutput({ types, rows, spec, collapsed, onToggle }: { types: Types; rows: Row[]; spec: PivotSpec; collapsed: Set<string>; onToggle: (path: string) => void }) {
  const vals = spec.values;
  const k = vals.length;
  const m = spec.cols.length;
  const rowTree = useMemo(() => tree(types, rows, spec.rows), [types, rows, spec.rows]);
  const colTree = useMemo(() => tree(types, rows, spec.cols), [types, rows, spec.cols]);
  const leafSets = useMemo(() => leafNodes(colTree).map((n) => new Set(n.rows)), [colTree]);
  const flat = useMemo(() => { const o: { node: Node; level: number }[] = []; flatten(rowTree, collapsed, 0, o); return o; }, [rowTree, collapsed]);
  const levels = useMemo(() => { const o: { label: string; span: number }[][] = []; levelsOf(colTree, 0, k, o); return o; }, [colTree, k]);

  /** Every value cell of one row: for each column group the value fields side by side, then the grand total of the row. */
  const cellsFor = (rs: Row[]): string[] => {
    const out: string[] = [];
    if (m > 0) leafSets.forEach((ls) => { const sub = rs.filter((r) => ls.has(r)); vals.forEach((v) => out.push(fmtNum(aggregate(sub, v.field, v.agg)))); });
    vals.forEach((v) => out.push(fmtNum(aggregate(rs, v.field, v.agg))));
    return out;
  };
  const th = "h-8 whitespace-nowrap border-b border-gray-200 bg-[#f8f9fa] px-3 text-[11px] uppercase tracking-wider text-gray-500";
  const rowNames = spec.rows.length ? spec.rows.join(" › ") : "Row Labels";
  const corner = (
    <th rowSpan={m + (m > 0 && k > 1 ? 1 : 0) || 1} className={`${th} sticky left-0 z-[2] min-w-[200px] text-left`} style={{ top: 0 }}>
      Row Labels
      <div className="text-[10px] normal-case tracking-normal text-gray-400">{rowNames !== "Row Labels" ? rowNames : ""}{m > 0 && k === 1 ? ` · ${aggLabel(vals[0].field, vals[0].agg)}` : ""}</div>
    </th>
  );
  const valueHead = (keyPrefix: string) => vals.map((v, i) => <th key={`${keyPrefix}${i}`} className={`${th} text-right`} style={{ top: m * 32 }}>{aggLabel(v.field, v.agg)}</th>);

  return (
    <div className="max-h-[max(360px,calc(100vh-430px))] overflow-auto rounded-md border border-gray-200">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          {m === 0 ? (
            <tr>{corner}{vals.map((v, i) => <th key={i} className={`${th} sticky text-right`} style={{ top: 0 }}>{aggLabel(v.field, v.agg)}</th>)}</tr>
          ) : (
            <>
              {levels.map((lv, li) => (
                <tr key={li}>
                  {li === 0 && corner}
                  {lv.map((c, i) => <th key={i} colSpan={c.span} className={`${th} sticky text-center`} style={{ top: li * 32 }}>{c.label}</th>)}
                  {li === 0 && <th colSpan={k} rowSpan={m} className={`${th} sticky text-center`} style={{ top: 0 }}>Grand Total</th>}
                </tr>
              ))}
              {k > 1 && <tr>{leafSets.flatMap((_, i) => valueHead(`l${i}-`))}{valueHead("t")}</tr>}
            </>
          )}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {flat.map(({ node, level }) => {
            const parent = node.kids.length > 0;
            return (
              <tr key={node.path} className={parent ? "bg-gray-50 font-medium" : "bg-white"}>
                <td className="sticky left-0 whitespace-nowrap bg-inherit py-1.5 pr-3" style={{ paddingLeft: 12 + level * 18 }}>
                  {parent ? (
                    <button type="button" onClick={() => onToggle(node.path)} aria-label={`${collapsed.has(node.path) ? "Expand" : "Collapse"} ${node.label}`} className="mr-1 inline-flex size-4 items-center justify-center rounded hover:bg-gray-200">
                      {collapsed.has(node.path) ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </button>
                  ) : <span className="mr-1 inline-block size-4" />}
                  {node.label}
                </td>
                {cellsFor(node.rows).map((c, i) => <td key={i} className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums">{c}</td>)}
              </tr>
            );
          })}
          <tr className="bg-gray-100 font-semibold">
            <td className="sticky left-0 bg-gray-100 px-3 py-1.5">Grand Total</td>
            {cellsFor(rows).map((c, i) => <td key={i} className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums">{c}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ filter of a pivot filter field */
function FilterPicker({ field, options, selected, onChange }: { field: string; options: { key: string; label: string }[]; selected: string[] | undefined; onChange: (v: string[] | undefined) => void }) {
  const [q, setQ] = useState("");
  const all = options.map((o) => o.key);
  const on = (key: string) => !selected || selected.includes(key);
  const toggle = (key: string) => {
    const cur = selected ?? all;
    const next = cur.includes(key) ? cur.filter((x) => x !== key) : all.filter((x) => x === key || cur.includes(x));
    onChange(next.length === all.length ? undefined : next);
  };
  const allOn = !selected || selected.length === all.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-white text-xs" aria-label={`Filter ${field}`}>
          {field}: <span className="font-medium">{selected ? `${selected.length} of ${all.length}` : "All"}</span> <ChevronDown className="size-3.5 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="z-[300] max-h-80 w-72 overflow-auto p-2">
        <input className={`${inputCls} mb-2`} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="flex items-center gap-2 px-1 py-1.5 text-sm text-gray-800">
          <Checkbox checked={allOn} onCheckedChange={() => onChange(allOn ? [] : undefined)} /> Select All
        </label>
        {options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())).map((o) => (
          <label key={o.key} className="flex items-center gap-2 px-1 py-1.5 text-sm text-gray-800">
            <Checkbox checked={on(o.key)} onCheckedChange={() => toggle(o.key)} /> {o.label}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ the tab */
export function PivotTab({ types, cols, rows, pivots, onChange }: {
  types: Types; cols: Col[]; rows: Row[]; pivots: PivotSpec[]; onChange: (p: PivotSpec[]) => void;
}) {
  const [selId, setSelId] = useState<number | null>(() => pivots[0]?.id ?? null); // the first pivot table is selected when the tab opens
  const [dlg, setDlg] = useState<null | "add" | "edit">(null);
  const [askDelete, setAskDelete] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [fsel, setFsel] = useState<Record<string, string[] | undefined>>({});
  const cur = pivots.find((p) => p.id === selId) ?? pivots[0];

  const pick = (id: number) => { setSelId(id); setCollapsed(new Set()); };
  const filtered = useMemo(() => {
    if (!cur) return rows;
    return rows.filter((r) => cur.filters.every((f) => { const s = fsel[`${cur.id}|${f}`]; return !s || s.includes(String(gk(types, f, r[f]))); }));
  }, [rows, cur, fsel, types]);
  const rowTreeForPaths = useMemo(() => (cur ? tree(types, filtered, cur.rows) : []), [cur, filtered, types]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
      <div>
        <Button size="sm" className="mb-2 h-9 w-full gap-1.5 bg-[#111827] text-white hover:bg-[#1f2937]" onClick={() => setDlg("add")}><Plus className="size-4" /> Add New</Button>
        <div className="flex max-h-[max(280px,calc(100vh-430px))] flex-col gap-0.5 overflow-auto rounded-lg border border-gray-200 bg-white p-1.5">
          {pivots.length === 0 && <div className="px-2 py-3 text-xs text-gray-400">No pivot tables yet</div>}
          {pivots.map((p) => (
            <button key={p.id} onClick={() => pick(p.id)} className={`rounded-md px-2 py-2 text-left text-[13px] ${cur?.id === p.id ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}>{p.name}</button>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4">
        {!cur ? (
          <div className="py-10 text-center text-sm text-gray-400">No pivot data found. Click "Add New" to create a pivot table.</div>
        ) : (
          <>
            <header className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{cur.name}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8" onClick={() => setDlg("edit")} title="Edit this pivot table" aria-label="Pivot table settings"><SettingsIcon className="size-4" /></Button>
                <Button variant="outline" size="sm" className="h-8" onClick={() => setAskDelete(true)} title="Delete this pivot table" aria-label="Delete this pivot table"><Trash2 className="size-4" /></Button>
              </div>
            </header>
            <p className="mb-2 mt-1 text-xs text-gray-400">
              Rows: {cur.rows.join(", ") || "(none)"}  |  Columns: {cur.cols.join(", ") || "(none)"}  |  Values: {cur.values.map((v) => aggLabel(v.field, v.agg)).join(", ")}
            </p>
            {cur.filters.length > 0 && (
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Filters</span>
                {cur.filters.map((f) => {
                  const m = groupBy(types, rows, f);
                  const options = sortedKeys(types, m, f).map((key) => ({ key: String(key), label: keyLabel(types, f, key) }));
                  return <FilterPicker key={f} field={f} options={options} selected={fsel[`${cur.id}|${f}`]} onChange={(v) => setFsel((s) => ({ ...s, [`${cur.id}|${f}`]: v }))} />;
                })}
              </div>
            )}
            {cur.rows.length > 1 && (
              <div className="mb-2 flex gap-3 text-xs">
                <button className="text-blue-600 hover:underline" onClick={() => setCollapsed(new Set())}>Expand all</button>
                <button className="text-blue-600 hover:underline" onClick={() => setCollapsed(new Set(parentPaths(rowTreeForPaths)))}>Collapse all</button>
              </div>
            )}
            {rows.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No fixtures match these fields.</div>
            ) : (
              <PivotOutput
                types={types}
                rows={filtered}
                spec={cur}
                collapsed={collapsed}
                onToggle={(path) => setCollapsed((s) => { const n = new Set(s); if (n.has(path)) n.delete(path); else n.add(path); return n; })}
              />
            )}
          </>
        )}
      </div>

      {dlg === "add" && (
        <PivotDialog
          mode="add" cols={cols} types={types} onClose={() => setDlg(null)}
          onSubmit={(s) => { const id = Math.max(0, ...pivots.map((p) => p.id)) + 1; onChange([...pivots, { ...s, id }]); pick(id); setDlg(null); }}
        />
      )}
      {dlg === "edit" && cur && (
        <PivotDialog
          mode="edit" initial={cur} cols={cols} types={types} onClose={() => setDlg(null)}
          onSubmit={(s) => { onChange(pivots.map((p) => (p.id === cur.id ? { ...s, id: cur.id } : p))); setCollapsed(new Set()); setDlg(null); }}
        />
      )}
      <Dialog open={askDelete} onOpenChange={setAskDelete}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Are you sure you want to delete this pivot table?</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAskDelete(false)}>No</Button>
            <Button
              className="bg-[#b91c1c] text-white hover:bg-[#991b1b]"
              onClick={() => { const rest = pivots.filter((p) => p.id !== cur?.id); onChange(rest); setSelId(rest[0]?.id ?? null); setAskDelete(false); }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
