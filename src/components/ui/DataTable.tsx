/** Tabela responsiva: tabela real em telas ≥ md e cards no celular. */
import type { ReactNode } from 'react';
import { cn } from '@/lib/format';
import { EmptyState } from './primitives';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  renderMobile?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  caption?: string;
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
  renderMobile,
  emptyTitle,
  emptyDescription,
  emptyAction,
  caption,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'whitespace-nowrap px-2 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-slate-100 last:border-0',
                  onRowClick && 'cursor-pointer transition hover:bg-brand-50/50',
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-2 py-2.5 align-top text-[13px] text-slate-700',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderMobile ? (
        <ul className="space-y-2 md:hidden">
          {rows.map((row) => (
            <li key={getRowKey(row)}>{renderMobile(row)}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
