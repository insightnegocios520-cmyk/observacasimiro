/**
 * Obras públicas — DADOS FICTÍCIOS de demonstração.
 * As posições do mapa são esquemáticas (x/y em %), não coordenadas reais.
 */
import type { Obra, StatusObra } from './types';
import { BAIRROS, SECRETARIAS, addMonths, makeRng } from './seed';

const rng = makeRng(771205);

const NOMES = [
  'Reforma da UBS do Centro',
  'Pavimentação da Rua das Acácias',
  'Construção de creche municipal',
  'Drenagem e pavimentação do bairro Vila Verde',
  'Reforma da Escola Municipal Boa Esperança',
  'Construção de quadra poliesportiva',
  'Recuperação de estrada vicinal',
  'Ampliação do Hospital Municipal',
  'Reforma da praça central',
  'Implantação de rede de esgoto',
  'Construção de ponte sobre o rio',
  'Reforma do mercado municipal',
  'Construção de unidade de saúde da família',
  'Requalificação da orla',
  'Construção de centro de convivência',
  'Implantação de ciclovia',
  'Reforma do ginásio municipal',
  'Construção de casa de farinha comunitária',
  'Recuperação de calçamento do centro histórico',
  'Implantação de poço artesiano',
  'Construção de praça com academia popular',
  'Reforma da sede da assistência social',
];

const EMPRESAS = [
  'Construtora Vale Verde Ltda. (fictícia)',
  'Engenharia Costeira S.A. (fictícia)',
  'Serviços Integrados Maré (fictícia)',
  'Edifica Serra Mar (fictícia)',
  'Obras e Terraplenagem Litoral (fictícia)',
];

const DESCRICOES = [
  'Intervenção prevista no plano plurianual, com execução por etapas.',
  'Obra cadastrada em contrato de repasse, sujeita a medição mensal.',
  'Serviço contínuo com cronograma físico-financeiro de 12 meses.',
  'Intervenção emergencial após vistoria da defesa civil.',
];

const STATUS: StatusObra[] = ['em execução', 'em execução', 'em execução', 'concluída', 'paralisada', 'planejamento'];

export const obras: Obra[] = Array.from({ length: 24 }, (_, i) => {
  const status = rng.pick(STATUS);
  const valorContratado = rng.money(180_000, 6_500_000);
  const percentualExecucao =
    status === 'concluída' ? 100 : status === 'planejamento' ? 0 : status === 'paralisada' ? rng.int(8, 62) : rng.int(15, 94);
  const inicio = rng.date(rng.pick([2024, 2025] as const), rng.int(0, 11), 27);

  return {
    id: `ob-${i + 1}`,
    nome: NOMES[i] ?? `Obra municipal ${i + 1}`,
    descricao: rng.pick(DESCRICOES),
    secretaria: rng.chance(0.62) ? 'Obras e Serviços Públicos' : rng.pick(SECRETARIAS),
    bairro: rng.pick(BAIRROS),
    empresa: rng.pick(EMPRESAS),
    valorContratado,
    valorPago: Math.round((valorContratado * percentualExecucao) / 100),
    percentualExecucao,
    status,
    inicio,
    previsaoFim: addMonths(inicio, rng.int(6, 30)),
    mapa: { x: rng.int(12, 88), y: rng.int(14, 86) },
  } satisfies Obra;
});

export const OBRAS_RESUMO = {
  total: obras.length,
  emExecucao: obras.filter((o) => o.status === 'em execução').length,
  paralisadas: obras.filter((o) => o.status === 'paralisada').length,
  concluidas: obras.filter((o) => o.status === 'concluída').length,
  valorContratado: obras.reduce((s, o) => s + o.valorContratado, 0),
  valorPago: obras.reduce((s, o) => s + o.valorPago, 0),
};
