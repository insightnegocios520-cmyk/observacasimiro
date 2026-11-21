/** Gráficos leves em SVG/CSS, sem dependências externas. Mobile-first. */
import { cn } from '@/lib/format';

export interface BarItem {
  label: string;
  value: number;
  hint?: string;
}

export function BarChart({
  items,
  formatValue,
  color = 'brand',
  emptyLabel = 'Sem dados para exibir.',
}: {
  items: BarItem[];
  formatValue: (value: number) => string;
  color?: 'brand' | 'amber' | 'sky' | 'rose';
  emptyLabel?: string;
}) {
  if (items.length === 0) return <p className="py-6 text-center text-xs text-slate-500">{emptyLabel}</p>;
  const max = Math.max(...items.map((item) => item.value), 1);
  const fill =
    color === 'amber' ? 'bg-amber-500' : color === 'sky' ? 'bg-sky-500' : color === 'rose' ? 'bg-rose-500' : 'bg-brand-600';

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-[12px] text-slate-700" title={item.label}>
              {item.label}
            </span>
            <span className="shrink-0 text-[12px] font-semibold text-slate-900 tabular">{formatValue(item.value)}</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn('h-full rounded-full', fill)}
              style={{ width: `${Math.max(2, (item.value / max) * 100)}%` }}
            />
          </div>
          {item.hint ? <p className="mt-0.5 text-[10px] text-slate-400">{item.hint}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export interface LineSeries {
  name: string;
  color: string;
  values: number[];
}

export function LineChart({
  labels,
  series,
  formatValue,
}: {
  labels: string[];
  series: LineSeries[];
  formatValue: (value: number) => string;
}) {
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const count = Math.max(labels.length, 2);
  const toPoints = (values: number[]) =>
    values
      .map((value, index) => {
        const x = (index / (count - 1)) * 100;
        const y = 100 - (value / max) * 100;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

  return (
    <div>
      <ul className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <div className="flex h-36 w-14 shrink-0 flex-col justify-between text-right text-[10px] text-slate-400 tabular">
          <span>{formatValue(max)}</span>
          <span>{formatValue(max * 0.5)}</span>
          <span>{formatValue(0)}</span>
        </div>
        <div className="relative h-36 flex-1">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
            role="img"
            aria-label={`Série temporal: ${series.map((s) => s.name).join(', ')}`}
          >
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {series.map((s) => (
              <g key={s.name}>
                <polygon
                  points={`0,100 ${toPoints(s.values)} 100,100`}
                  fill={s.color}
                  opacity="0.08"
                />
                <polyline
                  points={toPoints(s.values)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="mt-1 flex justify-between pl-16 text-[10px] text-slate-400">
        {labels.map((label, index) => (
          <span key={`${label}-${index}`} className={index % 2 === 1 ? 'hidden sm:inline' : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface DonutItem {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  items,
  formatValue,
  centerLabel,
  centerValue,
}: {
  items: DonutItem[];
  formatValue: (value: number) => string;
  centerLabel: string;
  centerValue: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={centerLabel}>
          <circle cx="21" cy="21" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="6" />
          {items.map((item) => {
            const length = (item.value / total) * circumference;
            const dash = `${length} ${circumference - length}`;
            const circle = (
              <circle
                key={item.label}
                cx="21"
                cy="21"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="6"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-wide text-slate-400">{centerLabel}</span>
          <span className="text-sm font-semibold text-slate-900 tabular">{centerValue}</span>
        </div>
      </div>
      <ul className="w-full space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[12px]">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="min-w-0 flex-1 truncate text-slate-600" title={item.label}>
              {item.label}
            </span>
            <span className="shrink-0 font-medium text-slate-900 tabular">{formatValue(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Barra de composição empilhada (uma linha) — útil para status de obras. */
export function StackedBar({
  segments,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="h-full"
            style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="size-2 rounded-full" style={{ backgroundColor: segment.color }} />
            {segment.label}
            <span className="font-semibold text-slate-900 tabular">{segment.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
