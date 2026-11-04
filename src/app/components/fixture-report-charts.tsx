import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { comp, fmtNum } from "./fixture-report-data";

const short = (v: string) => (v.length > 16 ? v.slice(0, 15) + "…" : v);
const AXIS = { fontSize: 11, fill: "#6b7280" };

function Scroll({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: Math.max(640, n * 28 + 90), height: 300 }}>{children}</div>
    </div>
  );
}

export function BarView({ data, seriesName }: { data: { name: string; value: number }[]; seriesName: string }) {
  const many = data.length > 12;
  return (
    <Scroll n={data.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: many ? 8 : 0 }}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 10 }} interval={0} angle={many ? -45 : 0} textAnchor={many ? "end" : "middle"} height={many ? 86 : 30} tickFormatter={short} stroke="#d1d5db" />
          <YAxis tick={AXIS} tickFormatter={comp} width={58} stroke="#d1d5db" />
          <Tooltip formatter={(v: number) => [fmtNum(v), seriesName]} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="value" name={seriesName} fill="#2a78d6" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </Scroll>
  );
}

export function StackView({
  data, series, percent,
}: {
  data: Record<string, string | number>[];
  series: { name: string; color: string }[];
  percent: boolean;
}) {
  const many = data.length > 12;
  const shown = percent
    ? data.map((row) => {
        const total = series.reduce((a, s) => a + Math.max(Number(row[s.name]) || 0, 0), 0);
        const o: Record<string, string | number> = { name: row.name };
        series.forEach((s) => { o[s.name] = total ? (Math.max(Number(row[s.name]) || 0, 0) / total) * 100 : 0; });
        return o;
      })
    : data;
  return (
    <Scroll n={data.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={shown} margin={{ top: 12, right: 12, left: 4, bottom: many ? 8 : 0 }}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 10 }} interval={0} angle={many ? -45 : 0} textAnchor={many ? "end" : "middle"} height={many ? 86 : 30} tickFormatter={short} stroke="#d1d5db" />
          <YAxis tick={AXIS} tickFormatter={percent ? (v: number) => `${v}%` : comp} width={58} domain={percent ? [0, 100] : undefined} stroke="#d1d5db" />
          <Tooltip formatter={(v: number, n: string) => [percent ? `${v.toFixed(1)}%` : fmtNum(v), n]} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} verticalAlign="top" height={28} />
          {series.map((s, i) => (
            <Bar key={s.name} dataKey={s.name} stackId="a" fill={s.color} maxBarSize={24} isAnimationActive={false} radius={i === series.length - 1 ? [4, 4, 0, 0] : undefined} stroke="#ffffff" strokeWidth={1} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Scroll>
  );
}

export function PieView({ slices, measure }: { slices: { name: string; value: number; color: string }[]; measure: string }) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (!(total > 0)) return <div className="py-8 text-center text-sm text-gray-400">No data for this selection</div>;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <PieChart width={170} height={170}>
        <Pie data={slices} dataKey="value" nameKey="name" cx={85} cy={85} outerRadius={80} stroke="#ffffff" strokeWidth={2} isAnimationActive={false}>
          {slices.map((s, i) => <Cell key={i} fill={s.color} />)}
        </Pie>
        <Tooltip formatter={(v: number, n: string) => [`${fmtNum(v)} (${((v / total) * 100).toFixed(1)}%)`, n]} />
      </PieChart>
      <ul className="min-w-[200px] flex-1 text-xs" aria-label={measure}>
        {slices.map((s, i) => (
          <li key={i} className="grid grid-cols-[12px_1fr_auto_auto] items-center gap-2 py-0.5 text-gray-600">
            <span className="inline-block size-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="break-words text-gray-900">{s.name}</span>
            <span className="tabular-nums text-gray-900">{fmtNum(s.value)}</span>
            <span className="w-9 text-right tabular-nums text-gray-400">{((s.value / total) * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
