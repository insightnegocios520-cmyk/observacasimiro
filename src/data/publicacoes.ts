/**
 * Publicações oficiais — DADOS FICTÍCIOS de demonstração.
 * Nenhum ato administrativo aqui descrito foi publicado.
 */
import type { Publicacao, TipoPublicacao } from './types';
import { makeRng } from './seed';

const rng = makeRng(5150);

const ORGAOS = [
  'Gabinete do Prefeito',
  'Secretaria de Saúde',
  'Secretaria de Educação',
  'Secretaria de Obras e Serviços Públicos',
  'Secretaria de Fazenda',
  'Secretaria de Administração',
  'Secretaria de Meio Ambiente',
];

const MODELOS: Array<{ tipo: TipoPublicacao; titulo: (n: string) => string; resumo: string }> = [
  {
    tipo: 'Decreto',
    titulo: (n) => `Decreto nº ${n} — abre crédito adicional suplementar`,
    resumo:
      'Abre crédito adicional suplementar no orçamento vigente para reforço de dotação da função Saúde, com indicação de recursos para anulação parcial de dotações.',
  },
  {
    tipo: 'Portaria',
    titulo: (n) => `Portaria nº ${n} — designa comissão de fiscalização de contrato`,
    resumo:
      'Designa servidores para compor a comissão de fiscalização e acompanhamento da execução de contrato administrativo, com vigência pelo período da contratação.',
  },
  {
    tipo: 'Lei',
    titulo: (n) => `Lei nº ${n} — institui programa municipal de apoio`,
    resumo:
      'Institui programa municipal de apoio a famílias em situação de vulnerabilidade, com critérios de elegibilidade e dotação orçamentária própria.',
  },
  {
    tipo: 'Edital',
    titulo: (n) => `Edital nº ${n} — chamamento público para credenciamento`,
    resumo:
      'Torna público o chamamento para credenciamento de interessados em prestar serviços à rede municipal, com prazo de apresentação de documentos.',
  },
  {
    tipo: 'Extrato de contrato',
    titulo: (n) => `Extrato de contrato nº ${n} — resumo para publicação`,
    resumo:
      'Extrato com objeto, valor, vigência, dotação orçamentária e fundamento legal da contratação, para publicação no diário oficial.',
  },
  {
    tipo: 'Nomeação',
    titulo: (n) => `Ato de nomeação nº ${n} — cargo em comissão`,
    resumo:
      'Nomeia titular para cargo em comissão de direção, com efeitos a contar da data de publicação.',
  },
  {
    tipo: 'Resolução',
    titulo: (n) => `Resolução nº ${n} — regulamenta procedimento interno`,
    resumo:
      'Regulamenta procedimento interno de tramitação de demandas e define prazos de resposta aos setores envolvidos.',
  },
];

export const publicacoes: Publicacao[] = Array.from({ length: 42 }, (_, i) => {
  const modelo = rng.pick(MODELOS);
  const ano = rng.pick([2024, 2025, 2026] as const);
  const mes = ano === 2026 ? rng.int(0, 8) : rng.int(0, 11);
  const numero = String(rng.int(1, 480)).padStart(3, '0');

  return {
    id: `pub-${i + 1}`,
    tipo: modelo.tipo,
    numero: `${numero}/${ano}`,
    data: rng.date(ano, mes, 27),
    titulo: modelo.titulo(numero),
    resumo: modelo.resumo,
    orgao: rng.pick(ORGAOS),
  } satisfies Publicacao;
}).sort((a, b) => b.data.localeCompare(a.data));

export const TIPOS_PUBLICACAO: TipoPublicacao[] = [
  'Decreto',
  'Portaria',
  'Lei',
  'Edital',
  'Extrato de contrato',
  'Nomeação',
  'Resolução',
];
