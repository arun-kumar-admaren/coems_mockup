import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Field, NativeSelect, inputCls } from "./fixture-report-ui";
import { Basis, BASIS_LABEL, CURRENCIES, ReportParams, loadFixtureData, todayIso } from "./fixture-report-data";

const EMPTY = (): ReportParams => ({
  name: "", basis: "booking", from: "", to: "", offices: null, currency: "US Dollar", convDate: todayIso(), inclCP: false,
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  initial?: ReportParams;
  onSubmit: (p: ReportParams) => void;
}

/** Add New / Edit Fixture Report popup (fields agreed with the PO, 2026-11-04). */
export function FixtureReportDialog({ open, onOpenChange, mode, initial, onSubmit }: Props) {
  const [p, setP] = useState<ReportParams>(initial ?? EMPTY());
  const [offices, setOffices] = useState<string[]>([]);

  useEffect(() => { loadFixtureData().then((d) => setOffices(d.offices)); }, []);
  useEffect(() => { if (open) setP(initial ?? EMPTY()); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof ReportParams>(k: K, v: ReportParams[K]) => setP((s) => ({ ...s, [k]: v }));
  const selected = p.offices ?? offices;
  const toggleOffice = (o: string) => {
    const cur = new Set(selected);
    if (cur.has(o)) cur.delete(o); else cur.add(o);
    set("offices", cur.size === offices.length ? null : Array.from(cur));
  };
  const rangeOk = !!p.from && !!p.to && p.from <= p.to;
  const valid = p.name.trim().length > 0 && rangeOk && !!p.convDate && selected.length > 0;
  const officeText = p.offices === null ? `All ${offices.length} offices` : `${p.offices.length} of ${offices.length} offices`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Fixture Report" : "Edit Fixture Report"}</DialogTitle>
          <DialogDescription>
            A table is generated with every column of the Fixture List Export All for the date range you choose. You then build your own charts and pivot tables from it.
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

          <Field label="Offices" hint="Filters on FIXED BY">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className={`${inputCls} flex items-center justify-between text-left`}>
                  <span>{officeText}</span>
                  <ChevronDown className="size-4 text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="z-[300] max-h-72 w-72 overflow-auto p-2">
                <label className="flex items-center gap-2 border-b border-gray-100 px-1 py-1.5 text-sm">
                  <Checkbox checked={p.offices === null} onCheckedChange={(c) => set("offices", c ? null : [])} />
                  Select all
                </label>
                {offices.map((o) => (
                  <label key={o} className="flex items-center gap-2 px-1 py-1.5 text-sm">
                    <Checkbox checked={selected.includes(o)} onCheckedChange={() => toggleOffice(o)} />
                    {o}
                  </label>
                ))}
              </PopoverContent>
            </Popover>
          </Field>

          <Field label="Convert to (currency)" required hint="Used for the two converted amount columns">
            <NativeSelect ariaLabel="Convert to" value={p.currency} onChange={(v) => set("currency", v)} options={CURRENCIES} />
          </Field>

          <Field label="Conversion Date" required hint="Date of the exchange rate. Sample rate in this mockup: 1 Euro = 1.17 US Dollar">
            <input type="date" className={inputCls} value={p.convDate} onChange={(e) => set("convDate", e.target.value)} />
          </Field>

          <label className="flex items-center gap-2 self-end pb-1 text-sm text-gray-800">
            <Checkbox checked={p.inclCP} onCheckedChange={(c) => set("inclCP", !!c)} />
            Include Cancelled and Postponed fixtures
          </label>
        </div>

        {p.from && p.to && !rangeOk && <p className="text-xs text-red-600">The start date must not be after the end date.</p>}

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
