/**
 * Finanças públicas — DADOS FICTÍCIOS de demonstração.
 * Valores, séries e classificações são inventados; não reproduzem execução
 * orçamentária real de nenhum ente federativo.
 */
import type { DespesaFuncao, ReceitaOrigem, SerieMensal } from './types';
import { makeRng } from './seed';

const rng = makeRng(99123);

export const despesasPorFuncao: DespesaFuncao[] = [
  ['Saúde', 96_400_000],
  ['Educação', 88_200_000],
  ['Urbanismo', 42_600_000],
  ['Administração', 31_800_000],
  ['Assistência Social', 18_400_000],
  ['Transporte', 16_900_000],
  ['Saneamento', 12_300_000],
  ['Cultura', 6_800_000],
  ['Meio Ambiente', 5_400_000],
  ['Desporto e Lazer', 4_200_000],
  ['Agricultura', 3_600_000],
  ['Segurança Pública', 2_900_000],
].map(([funcao, empenhado]) => {
  const valor = Number(empenhado);
  return {
    funcao: String(funcao),
    empenhado: valor,
    liquidado: Math.round(valor * (0.78 + rng.next() * 0.16)),
    pago: Math.round(valor * (0.7 + rng.next() * 0.18)),
  } satisfies DespesaFuncao;
});

export const receitasPorOrigem: ReceitaOrigem[] = [
  ['Transferências constitucionais (FPM/ICMS/ITR)', 168_500_000],
  ['Arrecadação própria (impostos, taxas, contribuições)', 62_400_000],
  ['Royalties e participações governamentais', 84_900_000],
  ['Convênios e transferências voluntárias', 21_600_000],
  ['Receita patrimonial', 9_300_000],
  ['Outras receitas correntes', 12_800_000],
].map(([origem, previsto]) => {
  const valor = Number(previsto);
  return {
    origem: String(origem),
    previsto: valor,
    arrecadado: Math.round(valor * (0.72 + rng.next() * 0.26)),
  } satisfies ReceitaOrigem;
});

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const serieMensal: SerieMensal[] = MESES.map((mes) => {
  const sazonal = 1 + Math.sin((MESES.indexOf(mes) / 12) * Math.PI * 2) * 0.12;
  return {
    mes,
    receita: Math.round(29_000_000 * sazonal * (0.92 + rng.next() * 0.16)),
    despesa: Math.round(26_500_000 * sazonal * (0.88 + rng.next() * 0.2)),
  } satisfies SerieMensal;
});

export const FINANCAS_RESUMO = {
  receitaPrevista: receitasPorOrigem.reduce((s, r) => s + r.previsto, 0),
  receitaArrecadada: receitasPorOrigem.reduce((s, r) => s + r.arrecadado, 0),
  despesaEmpenhada: despesasPorFuncao.reduce((s, d) => s + d.empenhado, 0),
  despesaLiquidada: despesasPorFuncao.reduce((s, d) => s + d.liquidado, 0),
  despesaPaga: despesasPorFuncao.reduce((s, d) => s + d.pago, 0),
};

export const ANOS_FINANCAS = [2024, 2025, 2026] as const;
