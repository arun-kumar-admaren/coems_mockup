// Data and helpers for the New Fixture Report mockup (COEMS Version 2.0).
// The sample rows come from the Fixture List "Export All" on bctesting (fixtures booked 2021-2022).
// Exchange rates below are sample values, not system rates.

export type ColType = "text" | "num" | "date" | "datetime";
export interface Col { name: string; type: ColType; added?: boolean }
export type Cell = string | number | null;
export type Row = Record<string, Cell>;
export type Basis = "booking" | "created" | "laycan";
export type AggOp = "Count" | "Sum" | "Average";

export interface ReportParams {
  name: string;
  basis: Basis;
  from: string; // yyyy-mm-dd
  to: string;   // yyyy-mm-dd
  offices: string[] | null; // null = all offices
  currency: string;
  convDate: string;
  inclCP: boolean; // include Cancelled and Postponed fixtures
}

export interface ChartSpec {
  id: number;
  type: "bar" | "stacked" | "pie";
  name: string;
  x?: string; y?: string; agg: AggOp;
  stack?: string; pct?: boolean;
  cat?: string; val?: string;
}

export interface PivotSpec {
  id: number;
  name: string;
  rows: string;
  cols: string;
  fcol: string;
  fval: string;
  values: [string, AggOp][];
}

export interface ReportRecord {
  id: number;
  name: string;
  type: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  params?: ReportParams;
  charts: ChartSpec[];
  pivots: PivotSpec[];
  pivotSel: number;
  hidden: string[];
}

export const BASIS_LABEL: Record<Basis, string> = { booking: "Booking Date", created: "Created Date", laycan: "Laycan Start" };
export const CURRENCIES = ["US Dollar", "Euro"];
const RATES_TO_USD: Record<string, number> = { "US Dollar": 1, Euro: 1.17 };

export const ADDED_COLS: Col[] = [
  { name: "CONVERTED GROSS FREIGHT", type: "num", added: true },
  { name: "CONVERTED MANAGEMENT FEE", type: "num", added: true },
  { name: "REPORT MONTH", type: "text", added: true },
  { name: "REPORT YEAR", type: "text", added: true },
];

export interface Loaded { cols: Col[]; rows: Row[]; offices: string[] }
let cache: Promise<Loaded> | null = null;
export function loadFixtureData(): Promise<Loaded> {
  if (!cache) {
    cache = import("../data/fixture-export-sample.json").then((m: any) => {
      const d = m.default ?? m;
      const base: Col[] = d.cols.map((c: [string, ColType]) => ({ name: c[0], type: c[1], added: c[0] === "LAYCAN START" || c[0] === "LAYCAN END" }));
      const rows: Row[] = d.rows.map((r: Cell[]) => {
        const o: Row = {};
        base.forEach((c, i) => { o[c.name] = r[i]; });
        return o;
      });
      const offices = Array.from(new Set(rows.map((r) => (r["FIXED BY"] as string) || "(Blank)"))).sort();
      return { cols: [...base, ...ADDED_COLS], rows, offices };
    });
  }
  return cache;
}

export function colTypes(cols: Col[]): Record<string, ColType> {
  const t: Record<string, ColType> = {};
  cols.forEach((c) => { t[c.name] = c.type; });
  return t;
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function todayDmy(): string {
  const d = todayIso();
  return `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
}

/** Generates the report table from the export rows and the popup fields. */
export function buildTable(rows: Row[], p: ReportParams): { rows: Row[]; missing: number } {
  const out: Row[] = [];
  let missing = 0;
  const target = RATES_TO_USD[p.currency] ?? 1;
  const officeSet = p.offices ? new Set(p.offices) : null;
  for (const r of rows) {
    const office = (r["FIXED BY"] as string) || "(Blank)";
    if (officeSet && !officeSet.has(office)) continue;
    const st = r["FIXTURE STATUS"];
    if (!p.inclCP && (st === "Cancelled" || st === "Postponed")) continue;
    const d = p.basis === "booking" ? (r["BOOKING DATE"] as string | null)
      : p.basis === "created" ? (((r["CREATED ON"] as string | null) || "").slice(0, 10) || null)
      : (r["LAYCAN START"] as string | null);
    if (!d) { missing++; continue; }
    if (p.from && d < p.from) continue;
    if (p.to && d > p.to) continue;
    const o: Row = { ...r };
    const rate = RATES_TO_USD[r["CURRENCY"] as string];
    const f = rate ? rate / target : null;
    o["CONVERTED GROSS FREIGHT"] = f == null ? null : Math.round((r["GROSS FREIGHT"] as number) * f * 100) / 100;
    o["CONVERTED MANAGEMENT FEE"] = f == null ? null : Math.round((r["MANAGEMENT FEE"] as number) * f * 100) / 100;
    o["REPORT MONTH"] = d.slice(0, 7);
    o["REPORT YEAR"] = d.slice(0, 4);
    out.push(o);
  }
  return { rows: out, missing };
}

/* ---------- formatting ---------- */
const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
export function fmtNum(v: number): string {
  return Math.abs(v) >= 1000 || Number.isInteger(v) ? nf0.format(v) : nf2.format(v);
}
export function comp(n: number): string {
  const a = Math.abs(n);
  const t = (x: number) => String(+x.toFixed(1));
  if (a >= 1e12) return t(n / 1e12) + "T";
  if (a >= 1e9) return t(n / 1e9) + "B";
  if (a >= 1e6) return t(n / 1e6) + "M";
  if (a >= 1e3) return t(n / 1e3) + "K";
  return String(+n.toFixed(1));
}
export function fmtCell(type: ColType, v: Cell): string {
  if (v == null || v === "") return "";
  const s = String(v);
  if (type === "date") return `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`;
  if (type === "datetime") return `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)} ${s.slice(11)}`;
  if (type === "num" && typeof v === "number") return Number.isInteger(v) ? nf0.format(v) : nf2.format(v);
  return s;
}

/* ---------- grouping and aggregation ---------- */
export const BLANK = "\u0000blank";
type Key = string | number;
type Types = Record<string, ColType>;

export function gk(types: Types, col: string, v: Cell): Key {
  if (v == null || v === "") return BLANK;
  return types[col] === "datetime" ? String(v).slice(0, 10) : v;
}
export function groupBy(types: Types, rows: Row[], col: string): Map<Key, Row[]> {
  const m = new Map<Key, Row[]>();
  rows.forEach((r) => {
    const k = gk(types, col, r[col]);
    const g = m.get(k);
    if (g) g.push(r); else m.set(k, [r]);
  });
  return m;
}
export function sortedKeys(types: Types, m: Map<Key, Row[]>, col: string): Key[] {
  const t = types[col];
  return Array.from(m.keys()).sort((a, b) => {
    if (a === BLANK) return 1;
    if (b === BLANK) return -1;
    if (t === "num") return (a as number) - (b as number);
    if (t === "text") return String(a).localeCompare(String(b));
    return a < b ? -1 : a > b ? 1 : 0;
  });
}
export function keyLabel(types: Types, col: string, k: Key): string {
  if (k === BLANK) return "(Blank)";
  const t = types[col];
  if (t === "date" || t === "datetime") return fmtCell("date", String(k).slice(0, 10));
  if (t === "num") return nf2.format(k as number);
  return String(k);
}
export function aggregate(rows: Row[], col: string, op: AggOp): number {
  if (op === "Count") {
    let c = 0;
    rows.forEach((r) => { if (r[col] != null && r[col] !== "") c++; });
    return c;
  }
  let sum = 0, n = 0;
  rows.forEach((r) => { const v = r[col]; if (typeof v === "number") { sum += v; n++; } });
  return op === "Sum" ? sum : n ? sum / n : 0;
}
export function aggLabel(col: string, op: AggOp): string { return `${op} of ${col}`; }

/* ---------- colours: stable per entity (validated categorical palette, then grey for Others) ---------- */
export const PALETTE = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"];
export const OTHER_COLOR = "#b9b8b0";

function entityColors(types: Types, allRows: Row[], col: string, keys: Key[]): Map<Key, string> {
  const base = new Map<Key, number>();
  Array.from(groupBy(types, allRows, col).entries()).sort((a, b) => b[1].length - a[1].length).slice(0, 5).forEach((e, i) => base.set(e[0], i));
  const used = new Set<number>();
  const out = new Map<Key, string>();
  keys.forEach((k) => { const s = base.get(k); if (s !== undefined && !used.has(s)) { out.set(k, PALETTE[s]); used.add(s); } });
  keys.forEach((k) => {
    if (out.has(k)) return;
    for (let s = 0; s < 6; s++) if (!used.has(s)) { out.set(k, PALETTE[s]); used.add(s); break; }
    if (!out.has(k)) out.set(k, PALETTE[5]);
  });
  return out;
}

/* ---------- chart view models ---------- */
export function barData(types: Types, rows: Row[], c: ChartSpec) {
  const m = groupBy(types, rows, c.x!);
  return sortedKeys(types, m, c.x!).map((k) => ({ name: keyLabel(types, c.x!, k), value: aggregate(m.get(k)!, c.y!, c.agg) }));
}
export function stackData(types: Types, allRows: Row[], rows: Row[], c: ChartSpec) {
  const xm = groupBy(types, rows, c.x!);
  const xk = sortedKeys(types, xm, c.x!);
  const sm = groupBy(types, rows, c.stack!);
  const tot = Array.from(sm.entries()).map(([key, rs]) => ({ key, total: Math.abs(aggregate(rs, c.y!, c.agg)) })).sort((a, b) => b.total - a.total);
  const keep = tot.length > 6 ? tot.slice(0, 5) : tot;
  const rest = tot.length > 6 ? tot.slice(5) : [];
  const colors = entityColors(types, allRows, c.stack!, keep.map((k) => k.key));
  const series = keep.map((k) => ({ name: keyLabel(types, c.stack!, k.key), color: colors.get(k.key)!, key: k.key as Key }));
  const restSet = new Set(rest.map((r) => r.key));
  const othersName = `Others (${rest.length})`;
  const data = xk.map((k) => {
    const rs = xm.get(k)!;
    const o: Record<string, string | number> = { name: keyLabel(types, c.x!, k) };
    series.forEach((s) => { o[s.name] = aggregate(rs.filter((r) => gk(types, c.stack!, r[c.stack!]) === s.key), c.y!, c.agg); });
    if (rest.length) o[othersName] = aggregate(rs.filter((r) => restSet.has(gk(types, c.stack!, r[c.stack!]))), c.y!, c.agg);
    return o;
  });
  if (rest.length) series.push({ name: othersName, color: OTHER_COLOR, key: "__others" });
  return { series, data, folded: rest.length };
}
export function pieData(types: Types, allRows: Row[], rows: Row[], c: ChartSpec) {
  const m = groupBy(types, rows, c.cat!);
  const g = Array.from(m.entries()).map(([key, rs]) => ({ key, value: aggregate(rs, c.val!, c.agg) })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  const keep = g.length > 6 ? g.slice(0, 5) : g;
  const rest = g.length > 6 ? g.slice(5) : [];
  const colors = entityColors(types, allRows, c.cat!, keep.map((k) => k.key));
  const slices = keep.map((x) => ({ name: keyLabel(types, c.cat!, x.key), value: x.value, color: colors.get(x.key)! }));
  if (rest.length) slices.push({ name: `Others (${rest.length})`, value: rest.reduce((a, x) => a + x.value, 0), color: OTHER_COLOR });
  return { slices, folded: rest.length, groups: g.length };
}

/* ---------- pivot view model ---------- */
export function pivotModel(types: Types, rows: Row[], p: PivotSpec) {
  const cur = p.fcol && p.fval ? rows.filter((r) => String(gk(types, p.fcol, r[p.fcol])) === p.fval) : rows;
  const rm = groupBy(types, cur, p.rows);
  const rk = sortedKeys(types, rm, p.rows);
  if (!p.cols) {
    return {
      colHead: null as string | null,
      head: p.values.map((v) => aggLabel(v[0], v[1])),
      body: rk.map((k) => ({ label: keyLabel(types, p.rows, k), cells: p.values.map((v) => fmtNum(aggregate(rm.get(k)!, v[0], v[1]))) })),
      total: p.values.map((v) => fmtNum(aggregate(cur, v[0], v[1]))),
    };
  }
  const cm = groupBy(types, cur, p.cols);
  const ck = sortedKeys(types, cm, p.cols);
  const v0 = p.values[0];
  const cell = (rs: Row[], k: Key) => fmtNum(aggregate(rs.filter((r) => gk(types, p.cols, r[p.cols]) === k), v0[0], v0[1]));
  return {
    colHead: `Column Labels: ${p.cols}`,
    head: ck.map((k) => keyLabel(types, p.cols, k)).concat([`${aggLabel(v0[0], v0[1])} (Grand Total)`]),
    body: rk.map((k) => { const rs = rm.get(k)!; return { label: keyLabel(types, p.rows, k), cells: ck.map((c) => cell(rs, c)).concat([fmtNum(aggregate(rs, v0[0], v0[1]))]) }; }),
    total: ck.map((c) => cell(cur, c)).concat([fmtNum(aggregate(cur, v0[0], v0[1]))]),
  };
}

/* ---------- examples shown in the seeded report ---------- */
export const EXAMPLE_PARAMS: ReportParams = {
  name: "Fixture report 2022",
  basis: "booking",
  from: "2022-01-01",
  to: "2022-12-31",
  offices: null,
  currency: "US Dollar",
  convDate: "2026-11-04",
  inclCP: false,
};
export const EXAMPLE_CHARTS: ChartSpec[] = [
  { id: 1, type: "bar", name: "Fixtures per month", x: "REPORT MONTH", y: "NUMBER", agg: "Count" },
  { id: 2, type: "stacked", name: "Converted Gross Freight per month, by currency", x: "REPORT MONTH", y: "CONVERTED GROSS FREIGHT", agg: "Sum", stack: "CURRENCY", pct: false },
  { id: 3, type: "pie", name: "Fixtures by cargo type", cat: "CARGO TYPE", val: "NUMBER", agg: "Count" },
  { id: 4, type: "pie", name: "Fixtures by fixture status", cat: "FIXTURE STATUS", val: "NUMBER", agg: "Count" },
];
export const EXAMPLE_PIVOTS: PivotSpec[] = [
  { id: 1, name: "Gross Freight against Converted Gross Freight, by currency", rows: "CURRENCY", cols: "", fcol: "", fval: "", values: [["NUMBER", "Count"], ["GROSS FREIGHT", "Sum"], ["CONVERTED GROSS FREIGHT", "Sum"]] },
  { id: 2, name: "Monthly overview", rows: "REPORT MONTH", cols: "", fcol: "", fval: "", values: [["NUMBER", "Count"], ["CONVERTED GROSS FREIGHT", "Sum"], ["CONVERTED MANAGEMENT FEE", "Sum"]] },
  { id: 3, name: "Fixture status by invoice status", rows: "FIXTURE STATUS", cols: "INVOICE STATUS", fcol: "", fval: "", values: [["NUMBER", "Count"]] },
];
