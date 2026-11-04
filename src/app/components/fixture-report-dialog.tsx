import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Field, NativeSelect, inputCls } from "./fixture-report-ui";
import { Basis, BASIS_LABEL, CURRENCIES, Col, ReportParams, loadFixtureData } from "./fixture-report-data";

const EMPTY = (): ReportParams => ({ name: "", basis: "booking", from: "", to: "", currency: "US Dollar", columns: null });

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  initial?: ReportParams;
  /** Table columns that existing charts or pivot tables use: they cannot be deselected while those exist. */
  lockedCols?: string[];
  onSubmit: (p: ReportParams) => void;
}

/** Add New / Edit Fixture Report popup (fields agreed with the PO, 2026-11-04: no Offices, Conversion Date or status checkbox; plus Select required columns). */
export function FixtureReportDialog({ open, onOpenChange, mode, initial, lockedCols, onSubmit }: Props) {
  const [p, setP] = useState<ReportParams>(initial ?? EMPTY());
  const [all, setAll] = useState<Col[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { loadFixtureData().then((d) => setAll(d.cols)); }, []);
  useEffect(() => { if (open) { setP(initial ?? EMPTY()); setQ(""); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof ReportParams>(k: K, v: ReportParams[K]) => setP((s) => ({ ...s, [k]: v }));
  const names = all.map((c) => c.name);
  const selected = p.columns ?? names;
  const setSelected = (list: string[]) => set("columns", list.length === names.length ? null : list); // everything selected = default (null)
  const toggle = (n: string) => setSelected(selected.includes(n) ? selected.filter((x) => x !== n) : names.filter((x) => x === n || selected.includes(x)));
  const locked = lockedCols ?? [];
  const blocked = locked.filter((c) => !selected.includes(c));
  const columnText = names.length === 0 ? "Loading…" : p.columns === null ? `All ${names.length} columns` : `${selected.length} of ${names.length} columns`;

  const rangeOk = !!p.from && !!p.to && p.from <= p.to;
  const valid = p.name.trim().length > 0 && rangeOk && selected.length > 0 && blocked.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Fixture Report" : "Edit Fixture Report"}</DialogTitle>
          <DialogDescription>
            A table is generated with the Fixture List columns you select (all by default) for every office and fixture status in the date range you choose. You then build your own charts and pivot tables from it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Report Name" required className="sm:col-span-2">
            <input className={inputCls} value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Fixtures 2022" autoFocus />
          </Field>

          <Field label="Based on" required hint="The date the Date Range applies to">
            <NativeSelect ariaLabel="Based on" value={p.basis} onChange={(v) => set("basis", v as Basis)} options={(Object.keys(BASIS_LABEL) as Basis[]).map((b) => ({ value: b, label: BASIS_LABEL[b] }))} />
          </Field>

          <Field label="Date Range" required hint={p.basis === "laycan" ? "Fixtures with no laycan are left out" : "Both dates are included"}>
            <div className="flex items-center gap-2">
              <input type="date" aria-label="From" className={inputCls} value={p.from} onChange={(e) => set("from", e.target.value)} />
              <span className="text-gray-400">to</span>
              <input type="date" aria-label="To" className={inputCls} value={p.to} min={p.from || undefined} onChange={(e) => set("to", e.target.value)} />
            </div>
          </Field>

          <Field label="Convert to (currency)" required hint="The two converted amount columns show this currency, each fixture at its own conversion date">
            <NativeSelect ariaLabel="Convert to" value={p.currency} onChange={(v) => set("currency", v)} options={CURRENCIES} />
          </Field>

          <Field label="Select required columns" required hint="The columns the table will have. Charts and pivot tables can only use these." className="sm:col-span-2">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" aria-label="Select required columns" className={`${inputCls} flex items-center justify-between text-left`}>
                  <span>{columnText}</span>
                  <ChevronDown className="size-4 text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="z-[300] max-h-80 w-[420px] max-w-[90vw] overflow-auto p-2">
                <div className="mb-2 flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => set("columns", null)}>Select all</Button>
                  <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => set("columns", [])}>Clear all</Button>
                </div>
                <input className={`${inputCls} mb-2`} placeholder="Search columns" value={q} onChange={(e) => setQ(e.target.value)} />
                {all.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).map((c) => (
                  <label key={c.name} className="flex items-center gap-2 px-1 py-1.5 text-sm text-gray-800">
                    <Checkbox checked={selected.includes(c.name)} onCheckedChange={() => toggle(c.name)} />
                    {c.name}
                    {c.added && <span className="rounded bg-amber-100 px-1 text-[10px]">new</span>}
                    {locked.includes(c.name) && <span className="ml-auto text-[10px] text-gray-400">used by a chart or pivot</span>}
                  </label>
                ))}
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        {p.from && p.to && !rangeOk && <p className="text-xs text-red-600">The start date must not be after the end date.</p>}
        {names.length > 0 && selected.length === 0 && <p className="text-xs text-red-600">Select at least one column.</p>}
        {blocked.length > 0 && (
          <p className="text-xs text-red-600">
            Charts or pivot tables of this report use {blocked.join(", ")}. Keep {blocked.length > 1 ? "these columns" : "this column"} selected, or delete those charts and pivot tables first.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!valid}
            className="bg-[#111827] text-white hover:bg-[#1f2937]"
            onClick={() => { onSubmit({ ...p, name: p.name.trim() }); onOpenChange(false); }}
          >
            {mode === "create" ? "Create Report" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
