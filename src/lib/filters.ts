/** Filtros e ordenação reutilizáveis — usados por todas as listas do OBSERVA. */
import { normalize } from './format';

export interface Option {
  value: string;
  label: string;
}

export const FAIXAS_VALOR: Option[] = [
  { value: 'todas', label: 'Qualquer valor' },
  { value: 'ate-100k', label: 'Até R$ 100 mil' },
  { value: '100k-500k', label: 'R$ 100 mil a R$ 500 mil' },
  { value: '500k-1m', label: 'R$ 500 mil a R$ 1 mi' },
  { value: 'acima-1m', label: 'Acima de R$ 1 mi' },
];

export function faixaValorOptions(): Option[] {
  return FAIXAS_VALOR;
}

export function matchFaixa(valor: number, faixa: string): boolean {
  switch (faixa) {
    case 'ate-100k':
      return valor <= 100_000;
    case '100k-500k':
      return valor > 100_000 && valor <= 500_000;
    case '500k-1m':
      return valor > 500_000 && valor <= 1_000_000;
    case 'acima-1m':
      return valor > 1_000_000;
    default:
      return true;
  }
}

/** Busca textual tolerante a acentos em vários campos. */
export function matchText(query: string, ...fields: Array<string | number | null | undefined>): boolean {
  const needle = normalize(query);
  if (!needle) return true;
  const haystack = normalize(fields.filter((f) => f !== null && f !== undefined).join(' '));
  return needle.split(/\s+/).every((term) => haystack.includes(term));
}

export function matchSelect(value: string, selected: string): boolean {
  return !selected || selected === 'todas' || selected === 'todos' || value === selected;
}

export function uniqueValues(values: Array<string | number>): Option[] {
  return [...new Set(values.map(String))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((value) => ({ value, label: value }));
}

export function uniqueYears(dates: string[]): Option[] {
  const years = [...new Set(dates.map((d) => d.slice(0, 4)))].sort((a, b) => Number(b) - Number(a));
  return years.map((year) => ({ value: year, label: year }));
}

export function countBy<T>(items: T[], key: (item: T) => string): Array<{ label: string; value: number }> {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function sumBy<T>(items: T[], key: (item: T) => number): number {
  return items.reduce((total, item) => total + key(item), 0);
}
