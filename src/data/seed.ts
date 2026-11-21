/**
 * Gerador pseudoaleatório determinístico.
 *
 * Usado apenas para produzir a massa de DADOS FICTÍCIOS de demonstração.
 * Sendo determinístico, o conteúdo do painel é idêntico a cada build/visita,
 * o que mantém a interface estável e testável.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  next: () => number;
  int: (min: number, max: number) => number;
  pick: <T>(items: readonly T[]) => T;
  chance: (probability: number) => boolean;
  money: (min: number, max: number) => number;
  date: (startYear: number, startMonth: number, maxDayOffset: number) => string;
}

export function makeRng(seed: number): Rng {
  const next = mulberry32(seed);
  return {
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    pick: <T,>(items: readonly T[]): T => items[Math.floor(next() * items.length)] as T,
    chance: (probability) => next() < probability,
    money: (min, max) => Math.round((min + next() * (max - min)) / 100) * 100,
    date: (startYear, startMonth, maxDayOffset) => {
      const base = new Date(Date.UTC(startYear, startMonth, 1));
      base.setUTCDate(base.getUTCDate() + Math.floor(next() * maxDayOffset));
      return base.toISOString().slice(0, 10);
    },
  };
}

/** Bairros/locais usados como referência textual (fictícios para efeito de dados). */
export const BAIRROS = [
  'Centro',
  'Barra de São João',
  'Rio das Ostras (limite)',
  'Professor Souza',
  'Barra Nova',
  'Casimiro de Abreu (sede)',
  'Vila Verde',
  'Jardim Primavera',
  'Morro Azul',
  'Praia Seca',
  'Lagoa Feia',
  'Alto da Serra',
] as const;

export const SECRETARIAS = [
  'Saúde',
  'Educação',
  'Obras e Serviços Públicos',
  'Fazenda',
  'Administração',
  'Meio Ambiente',
  'Assistência Social',
  'Agricultura e Pesca',
  'Turismo, Cultura e Esporte',
  'Governo e Planejamento',
] as const;

export type SecretariaNome = (typeof SECRETARIAS)[number];

export const ANOS = [2024, 2025, 2026] as const;

export function anoDe(iso: string): number {
  return Number(iso.slice(0, 4));
}

/** Soma meses a uma data ISO (YYYY-MM-DD) sem depender de fuso local. */
export function addMonths(iso: string, months: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

/** CNPJ com raiz inválida (00) — sinaliza claramente que o documento é fictício. */
export function cnpjFicticio(rng: Rng): string {
  const bloco = () => String(rng.int(100, 999));
  return `00.${bloco()}.${bloco()}/0001-${String(rng.int(10, 99))}`;
}
