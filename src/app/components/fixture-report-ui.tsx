import { ReactNode } from "react";

export const inputCls =
  "h-9 w-full rounded-md border border-gray-300 bg-white px-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#ffd700] disabled:bg-gray-100 disabled:text-gray-500";

export function Field({ label, required, hint, children, className }: { label: string; required?: boolean; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 text-xs text-gray-600 ${className ?? ""}`}>
      <span>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
    </div>
  );
}

export function NativeSelect({
  value, onChange, options, ariaLabel, className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <select aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} ${className ?? ""}`}>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}
