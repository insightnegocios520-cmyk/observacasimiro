/** Utilitários de formatação pt-BR e classes CSS. */

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const brlSemCentavos = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inteiro = new Intl.NumberFormat('pt-BR');

export function formatBRL(value: number, options: { decimals?: boolean } = {}): string {
  if (!Number.isFinite(value)) return 'R$ 0,00';
  return options.decimals === false ? brlSemCentavos.format(value) : brl.format(value);
}

/** Valor compacto para KPIs: R$ 1,2 mi / R$ 840 mil. */
export function formatBRLCompact(value: number): string {
  if (!Number.isFinite(value)) return 'R$ 0';
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1).replace('.', ',')} bi`;
  if (abs >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')} mi`;
  if (abs >= 1_000) return `R$ ${Math.round(value / 1_000)} mil`;
  return brlSemCentavos.format(value);
}

export function formatNumber(value: number): string {
  return Number.isFinite(value) ? inteiro.format(value) : '0';
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

/** "2026-09-18" → "18/09/2026" (sem deslocamento de fuso). */
export function formatDate(iso: string): string {
  if (!iso || iso.length < 10) return '—';
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatDateLong(iso: string): string {
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  if (!iso || iso.length < 10) return '—';
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${Number(dia)} de ${meses[Number(mes) - 1] ?? ''} de ${ano}`;
}

/** Remove acentos e normaliza para busca insensível a maiúsculas. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(value: string, max = 120): string {
  return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}

/** Gera um CSV a partir de cabeçalho + linhas já formatadas. */
export function toCSV(headers: string[], rows: Array<Array<string | number>>): string {
  const escape = (cell: string | number) => {
    const text = String(cell ?? '');
    return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.map(escape).join(';'), ...rows.map((row) => row.map(escape).join(';'))].join('\r\n');
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([`\uFEFF${content}`], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
