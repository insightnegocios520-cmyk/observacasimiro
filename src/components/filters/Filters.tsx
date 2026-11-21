/** Filtros reutilizáveis sincronizados com a URL (?q=, ?status=, ?ano=...). */
import { useCallback, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/format';
import { IconFilter, IconSearch, IconX } from '@/components/ui/icons';
import type { Option } from '@/lib/filters';

export function useFilterParams() {
  const [params, setParams] = useSearchParams();

  const get = useCallback((key: string, fallback = '') => params.get(key) ?? fallback, [params]);

  const set = useCallback(
    (key: string, value: string) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (!value || value === 'todas' || value === 'todos') next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const clear = useCallback(
    (keys: string[]) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          for (const key of keys) next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  return { params, get, set, clear };
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Pesquisar por objeto, número, fornecedor…',
  label = 'Pesquisar registros',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <IconSearch size={16} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Limpar pesquisa"
        >
          <IconX size={14} />
        </button>
      ) : null}
    </div>
  );
}

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  id,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  id: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1 block text-[11px] font-medium text-slate-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-lg border border-slate-300 bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22m5 9 7 7 7-7%22/></svg>')] bg-[length:16px] bg-[right_0.6rem_center] bg-no-repeat py-2 pl-2.5 pr-8 text-[13px] text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ChipFilter({
  options,
  value,
  onChange,
  label,
}: {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium text-slate-600">{label}</p>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 no-scrollbar" role="group" aria-label={label}>
        {options.map((option) => {
          const active = value === option.value || (!value && option.value === 'todos');
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-medium transition',
                active
                  ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FilterPanel({
  children,
  activeCount,
  onClear,
  className,
}: {
  children: ReactNode;
  activeCount: number;
  onClear: () => void;
  className?: string;
}) {
  return (
    <section
      aria-label="Filtros"
      className={cn('rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4', className)}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
          <IconFilter size={14} />
          Pesquisa e filtros
        </span>
        {activeCount > 0 ? (
          <span className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
            {activeCount}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="ml-auto rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 transition enabled:hover:bg-slate-100 enabled:hover:text-slate-800 disabled:opacity-40"
        >
          Limpar filtros
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function ResultsCount({ shown, total, label = 'registros' }: { shown: number; total: number; label?: string }) {
  return (
    <p className="text-[12px] text-slate-600" role="status" aria-live="polite">
      <strong className="font-semibold text-slate-900 tabular">{shown}</strong> de{' '}
      <span className="tabular">{total}</span> {label}
    </p>
  );
}
