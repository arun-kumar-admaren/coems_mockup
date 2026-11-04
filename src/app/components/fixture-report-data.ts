// Data and helpers for the New Fixture Report mockup (COEMS Version 2.0).
// The sample rows come from the Fixture List "Export All" on bctesting (fixtures booked 2021-2022).
// Exchange rates below are sample values, not system rates.
// Popup fields (PO, 2026-11-04 round 2 + columns): Report Name, Based on, Date Range, Convert to, Select required columns. All offices and all fixture
// statuses are always included; every fixture is converted at its own conversion date.

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
  currency: string;
  columns: string[] | null; // "Select required columns": the table columns the user wants; null = all (default)
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

// Sample EUR to USD rates by month (not system rates). The real report uses each fixture's own conversion rate and date.
const EUR_USD_BY_MONTH: Record<string, number> = {
  "2021-01": 1.2171, "2021-02": 1.2098, "2021-03": 1.1899, "2021-04": 1.1964, "2021-05": 1.2147, "2021-06": 1.2053,
  "2021-07": 1.1822, "2021-08": 1.1771, "2021-09": 1.1774, "2021-10": 1.1601, "2021-11": 1.1414, "2021-12": 1.1304,
  "2022-01": 1.1314, "2022-02": 1.1342, "2022-03": 1.1019, "2022-04": 1.0819, "2022-05": 1.0572, "2022-06": 1.0564,
  "2022-07": 1.0179, "2022-08": 1.0128, "2022-09": 0.9904, "2022-10": 0.98, "2022-11": 1.0201, "2022-12": 1.0577,
  "2023-01": 1.077, "2023-02": 1.0715, "2023-03": 1.0706, "2023-04": 1.0968, "2023-05": 1.0868, "2023-06": 1.084,
  "2023-07": 1.106, "2023-08": 1.0909, "2023-09": 1.0684, "2023-10": 1.0563, "2023-11": 1.0813, "2023-12": 1.09,
};
function eurUsdOn(dateIso: string): number {
  const months = Object.keys(EUR_USD_BY_MONTH);
  const m = dateIso.slice(0, 7);
  return EUR_USD_BY_MONTH[m] ?? EUR_USD_BY_MONTH[m < months[0] ? months[0] : months[months.length - 1]];
}
/** The conversion date a fixture carries. The export has no such column, so the mockup uses the booking date (else the created date). */
function conversionDate(r: Row): string | null {
  return (r["BOOKING DATE"] as string | null) || (((r["CREATED ON"] as string | null) || "").slice(0, 10) || null);
}
function convertAmount(amount: number, from: string, to: string, onDate: string | null): number | null {
  if (typeof amount !== "number") return null;
  if (from === to) return Math.round(amount * 100) / 100;
  if (!onDate) return null;
  const rate = eurUsdOn(onDate);
  if (from === "Euro" && to === "US Dollar") return Math.round(amount * rate * 100) / 100;
  if (from === "US Dollar" && to === "Euro") return Math.round((amount / rate) * 100) / 100;
  return null;
}

export const ADDED_COLS: Col[] = [
  { name: "CONVERTED GROSS FREIGHT", type: "num", added: true },
  { name: "CONVERTED MANAGEMENT FEE", type: "num", added: true },
];

/** Left out of the table for now: they hold several comma separated values in one cell, which charts and pivots cannot use. */
export const LEFT_OUT_COLS = ["PORT OF LOADING", "PORT OF DISCHARGE", "COMMISSIONS"];

/* ---------- dates: month and year come from the date column itself (like Excel's date grouping), not from extra columns ---------- */
export type DatePart = "Month" | "Year";
export const DATE_PARTS: DatePart[] = ["Month", "Year"];
export const isDateType = (t: ColType | undefined) => t === "date" || t === "datetime";
export const partName = (col: string, part: DatePart) => `${col} (${part})`;
/** "BOOKING DATE (Month)" gives ["BOOKING DATE", "Month"]; a plain column gives [column, null]. `types` must hold the table columns. */
export function splitField(field: string, types: Record<string, ColType>): [string, DatePart | null] {
  for (const part of DATE_PARTS) {
    const suffix = ` (${part})`;
    if (field.endsWith(suffix) && isDateType(types[field.slice(0, -suffix.length)])) return [field.slice(0, -suffix.length), part];
  }
  return [field, null];
}
/** Hidden helper fields (one Month and one Year per date column) that charts and pivots group by. They are never table columns. */
export function dateFieldCols(cols: Col[]): Col[] {
  const out: Col[] = [];
  cols.forEach((c) => { if (isDateType(c.type)) DATE_PARTS.forEach((p) => out.push({ name: partName(c.name, p), type: "text" })); });
  return out;
}

export interface Loaded { cols: Col[]; rows: Row[] }
let cache: Promise<Loaded> | null = null;
export function loadFixtureData(): Promise<Loaded> {
  if (!cache) {
    cache = import("../data/fixture-export-sample.json").then((m: any) => {
      const d = m.default ?? m;
      const all: Col[] = d.cols.map((c: [string, ColType]) => ({ name: c[0], type: c[1], added: c[0] === "LAYCAN START" || c[0] === "LAYCAN END" }));
      const rows: Row[] = d.rows.map((r: Cell[]) => {
        const o: Row = {};
        all.forEach((c, i) => { o[c.name] = r[i]; });
        return o;
      });
      const base = all.filter((c) => !LEFT_OUT_COLS.includes(c.name));
      const parts = base.filter((c) => isDateType(c.type));
      rows.forEach((o) => parts.forEach((c) => {
        const v = o[c.name] as string | null;
        o[partName(c.name, "Month")] = v ? v.slice(0, 7) : null;
        o[partName(c.name, "Year")] = v ? v.slice(0, 4) : null;
      }));
      return { cols: [...base, ...ADDED_COLS], rows };
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
  for (const r of rows) {
    const d = p.basis === "booking" ? (r["BOOKING DATE"] as string | null)
      : p.basis === "created" ? (((r["CREATED ON"] as string | null) || "").slice(0, 10) || null)
      : (r["LAYCAN START"] as string | null);
    if (!d) { missing++; continue; }
    if (p.from && d < p.from) continue;
    if (p.to && d > p.to) continue;
    const o: Row = { ...r };
    // Each fixture is converted at its own conversion date, into the currency chosen in the popup
    const on = conversionDate(r);
    o["CONVERTED GROSS FREIGHT"] = convertAmount(r["GROSS FREIGHT"] as number, r["CURRENCY"] as string, p.currency, on);
    o["CONVERTED MANAGEMENT FEE"] = convertAmount(r["MANAGEMENT FEE"] as number, r["CURRENCY"] as string, p.currency, on);
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
  currency: "US Dollar",
  columns: null,
};
export const EXAMPLE_CHARTS: ChartSpec[] = [
  { id: 1, type: "bar", name: "Fixtures per month", x: "BOOKING DATE (Month)", y: "NUMBER", agg: "Count" },
  { id: 2, type: "stacked", name: "Converted Gross Freight per month, by currency", x: "BOOKING DATE (Month)", y: "CONVERTED GROSS FREIGHT", agg: "Sum", stack: "CURRENCY", pct: false },
  { id: 3, type: "pie", name: "Fixtures by cargo type", cat: "CARGO TYPE", val: "NUMBER", agg: "Count" },
  { id: 4, type: "pie", name: "Fixtures by fixture status", cat: "FIXTURE STATUS", val: "NUMBER", agg: "Count" },
];
export const EXAMPLE_PIVOTS: PivotSpec[] = [
  { id: 1, name: "Gross Freight against Converted Gross Freight, by currency", rows: "CURRENCY", cols: "", fcol: "", fval: "", values: [["NUMBER", "Count"], ["GROSS FREIGHT", "Sum"], ["CONVERTED GROSS FREIGHT", "Sum"]] },
  { id: 2, name: "Monthly overview", rows: "BOOKING DATE (Month)", cols: "", fcol: "", fval: "", values: [["NUMBER", "Count"], ["CONVERTED GROSS FREIGHT", "Sum"], ["CONVERTED MANAGEMENT FEE", "Sum"]] },
  { id: 3, name: "Fixture status by invoice status", rows: "FIXTURE STATUS", cols: "INVOICE STATUS", fcol: "", fval: "", values: [["NUMBER", "Count"]] },
];
