/**
 * Saúde, Educação, Serviços Municipais e Administração — DADOS FICTÍCIOS.
 * Indicadores, contagens e nomes de unidades são inventados para demonstração.
 */
import type { Escola, Indicador, Secretaria, ServicoMunicipal, UnidadeSaude } from './types';
import { BAIRROS, makeRng } from './seed';

const rng = makeRng(424242);

/* ---------------------------------- Saúde --------------------------------- */

const TIPOS_SAUDE: UnidadeSaude['tipo'][] = ['UBS', 'UBS', 'UBS', 'Hospital', 'CAPS', 'Vigilância em Saúde', 'CEO'];
const STATUS_SAUDE: UnidadeSaude['status'][] = ['em funcionamento', 'em funcionamento', 'em funcionamento', 'reforma', 'ampliação'];

const NOMES_UBS = [
  'UBS Centro',
  'UBS Barra de São João',
  'UBS Vila Verde',
  'UBS Professor Souza',
  'UBS Barra Nova',
  'UBS Morro Azul',
  'UBS Jardim Primavera',
  'UBS Praia Seca',
  'UBS Alto da Serra',
  'UBS Lagoa Feia',
];

export const unidadesSaude: UnidadeSaude[] = Array.from({ length: 14 }, (_, i) => {
  const tipo = i < 10 ? 'UBS' : rng.pick(TIPOS_SAUDE);
  return {
    id: `sa-${i + 1}`,
    nome: NOMES_UBS[i] ?? (tipo === 'Hospital' ? 'Hospital Municipal — unidade sede' : `Unidade de saúde ${i + 1}`),
    tipo,
    bairro: rng.pick(BAIRROS),
    equipes: tipo === 'UBS' ? rng.int(1, 4) : 0,
    atendimentosMes: rng.int(420, 9_800),
    status: rng.pick(STATUS_SAUDE),
    mapa: { x: rng.int(14, 86), y: rng.int(16, 84) },
  } satisfies UnidadeSaude;
});

export const indicadoresSaude: Indicador[] = [
  {
    id: 'ind-s1',
    nome: 'Cobertura da atenção básica',
    valor: 82.4,
    unidade: '%',
    meta: 90,
    tendencia: 'alta',
    descricao: 'Percentual estimado da população coberta por equipes de saúde da família.',
  },
  {
    id: 'ind-s2',
    nome: 'Atendimentos ambulatoriais no mês',
    valor: 27_480,
    unidade: 'atendimentos',
    meta: null,
    tendencia: 'estável',
    descricao: 'Somatório de atendimentos registrados nas unidades municipais.',
  },
  {
    id: 'ind-s3',
    nome: 'Cobertura vacinal infantil',
    valor: 76.1,
    unidade: '%',
    meta: 95,
    tendencia: 'baixa',
    descricao: 'Cobertura estimada do calendário básico em crianças de até 2 anos.',
  },
  {
    id: 'ind-s4',
    nome: 'Tempo médio de espera por consulta especializada',
    valor: 48,
    unidade: 'dias',
    meta: 30,
    tendencia: 'baixa',
    descricao: 'Espera média entre solicitação e realização da consulta.',
  },
  {
    id: 'ind-s5',
    nome: 'Execução do orçamento da saúde',
    valor: 71.6,
    unidade: '%',
    meta: 100,
    tendencia: 'alta',
    descricao: 'Relação entre despesa empenhada e dotação anual da função Saúde.',
  },
  {
    id: 'ind-s6',
    nome: 'Equipes de saúde da família ativas',
    valor: 11,
    unidade: 'equipes',
    meta: 14,
    tendencia: 'estável',
    descricao: 'Equipes cadastradas e em funcionamento no município.',
  },
];

/* -------------------------------- Educação -------------------------------- */

const NOMES_ESCOLAS = [
  'Escola Municipal Boa Esperança',
  'Escola Municipal Professora Alda Marins',
  'Escola Municipal Rio Verde',
  'Escola Municipal São Sebastião',
  'Escola Municipal Monteiro Lobato',
  'Escola Municipal Vila Nova',
  'Escola Municipal Professora Celina Rocha',
  'Escola Municipal Caminho do Mar',
  'Escola Municipal Pequeno Príncipe',
  'Escola Municipal Serra Azul',
  'Escola Municipal Raízes do Vale',
  'Escola Municipal Dona Zulmira',
  'Escola Municipal Antônio Cardoso',
  'Escola Municipal Jardim das Acácias',
  'Escola Municipal Professora Neusa Freitas',
  'Escola Municipal Sol Nascente',
];

const ETAPAS = [
  'Educação Infantil e Ensino Fundamental I',
  'Ensino Fundamental I',
  'Ensino Fundamental I e II',
  'Educação Infantil',
  'Ensino Fundamental II',
];

const INFRA = [
  'Quadra coberta',
  'Biblioteca',
  'Laboratório de informática',
  'Refeitório',
  'Acessibilidade',
  'Sala de recursos',
  'Pátio coberto',
  'Horta escolar',
];

export const escolas: Escola[] = Array.from({ length: 16 }, (_, i) => ({
  id: `es-${i + 1}`,
  nome: NOMES_ESCOLAS[i] ?? `Escola Municipal ${i + 1}`,
  bairro: rng.pick(BAIRROS),
  etapas: rng.pick(ETAPAS),
  matriculas: rng.int(120, 940),
  turmas: rng.int(5, 26),
  idebFicticio: Number((rng.next() * 3 + 4.2).toFixed(1)),
  infraestrutura: INFRA.filter(() => rng.chance(0.5)),
  mapa: { x: rng.int(12, 88), y: rng.int(14, 86) },
}));

export const indicadoresEducacao: Indicador[] = [
  {
    id: 'ind-e1',
    nome: 'Matrículas na rede municipal',
    valor: escolas.reduce((s, e) => s + e.matriculas, 0),
    unidade: 'alunos',
    meta: null,
    tendencia: 'estável',
    descricao: 'Total de matrículas registradas nas escolas municipais listadas.',
  },
  {
    id: 'ind-e2',
    nome: 'Turmas em funcionamento',
    valor: escolas.reduce((s, e) => s + e.turmas, 0),
    unidade: 'turmas',
    meta: null,
    tendencia: 'estável',
    descricao: 'Somatório de turmas por escola.',
  },
  {
    id: 'ind-e3',
    nome: 'Escolas com quadra coberta',
    valor: escolas.filter((e) => e.infraestrutura.includes('Quadra coberta')).length,
    unidade: 'escolas',
    meta: escolas.length,
    tendencia: 'alta',
    descricao: 'Unidades escolares com quadra coberta cadastrada.',
  },
  {
    id: 'ind-e4',
    nome: 'IDEB médio (valor ilustrativo)',
    valor: Number((escolas.reduce((s, e) => s + (e.idebFicticio ?? 0), 0) / escolas.length).toFixed(1)),
    unidade: 'pontos',
    meta: 6,
    tendencia: 'alta',
    descricao: 'Média dos valores ilustrativos por escola — não corresponde a resultado oficial.',
  },
  {
    id: 'ind-e5',
    nome: 'Execução do orçamento da educação',
    valor: 68.3,
    unidade: '%',
    meta: 100,
    tendencia: 'alta',
    descricao: 'Relação entre despesa empenhada e dotação anual da função Educação.',
  },
  {
    id: 'ind-e6',
    nome: 'Escolas com acessibilidade registrada',
    valor: escolas.filter((e) => e.infraestrutura.includes('Acessibilidade')).length,
    unidade: 'escolas',
    meta: escolas.length,
    tendencia: 'estável',
    descricao: 'Unidades que declararam recursos de acessibilidade.',
  },
];

/* --------------------------- Serviços municipais -------------------------- */

const SERVICOS: Array<Omit<ServicoMunicipal, 'id' | 'mapa'>> = [
  {
    nome: 'Coleta de resíduos domiciliares',
    categoria: 'Limpeza urbana',
    secretaria: 'Obras e Serviços Públicos',
    prazoDias: 2,
    atendimentosMes: 1_840,
    canal: 'Ouvidoria 156',
    status: 'operando',
  },
  {
    nome: 'Iluminação pública',
    categoria: 'Infraestrutura',
    secretaria: 'Obras e Serviços Públicos',
    prazoDias: 5,
    atendimentosMes: 312,
    canal: 'Ouvidoria 156',
    status: 'operando',
  },
  {
    nome: 'Tapa-buracos e conservação de vias',
    categoria: 'Infraestrutura',
    secretaria: 'Obras e Serviços Públicos',
    prazoDias: 10,
    atendimentosMes: 226,
    canal: 'Presencial',
    status: 'parcial',
  },
  {
    nome: 'Transporte escolar',
    categoria: 'Mobilidade',
    secretaria: 'Educação',
    prazoDias: 1,
    atendimentosMes: 4_120,
    canal: 'Escola',
    status: 'operando',
  },
  {
    nome: 'Transporte sanitário eletivo',
    categoria: 'Saúde',
    secretaria: 'Saúde',
    prazoDias: 3,
    atendimentosMes: 640,
    canal: 'Unidade de saúde',
    status: 'operando',
  },
  {
    nome: 'Poda de árvores',
    categoria: 'Meio ambiente',
    secretaria: 'Meio Ambiente',
    prazoDias: 15,
    atendimentosMes: 96,
    canal: 'Ouvidoria 156',
    status: 'parcial',
  },
  {
    nome: 'Limpeza de bueiros e drenagem',
    categoria: 'Saneamento',
    secretaria: 'Obras e Serviços Públicos',
    prazoDias: 12,
    atendimentosMes: 74,
    canal: 'Ouvidoria 156',
    status: 'operando',
  },
  {
    nome: 'Emissão de alvará e licença',
    categoria: 'Administração',
    secretaria: 'Fazenda',
    prazoDias: 20,
    atendimentosMes: 118,
    canal: 'Portal do contribuinte',
    status: 'operando',
  },
  {
    nome: 'Castração e controle de zoonoses',
    categoria: 'Saúde',
    secretaria: 'Saúde',
    prazoDias: 30,
    atendimentosMes: 52,
    canal: 'Agendamento',
    status: 'em implantação',
  },
  {
    nome: 'Manutenção de praças e jardins',
    categoria: 'Limpeza urbana',
    secretaria: 'Obras e Serviços Públicos',
    prazoDias: 7,
    atendimentosMes: 143,
    canal: 'Ouvidoria 156',
    status: 'operando',
  },
  {
    nome: 'Apoio à agricultura familiar',
    categoria: 'Desenvolvimento rural',
    secretaria: 'Agricultura e Pesca',
    prazoDias: 25,
    atendimentosMes: 38,
    canal: 'Presencial',
    status: 'parcial',
  },
  {
    nome: 'Ouvidoria municipal',
    categoria: 'Controle social',
    secretaria: 'Governo e Planejamento',
    prazoDias: 20,
    atendimentosMes: 205,
    canal: 'Formulário online',
    status: 'operando',
  },
];

export const servicos: ServicoMunicipal[] = SERVICOS.map((s, i) => ({
  ...s,
  id: `sv-${i + 1}`,
  mapa: { x: rng.int(14, 86), y: rng.int(16, 84) },
}));

/* ------------------------------ Administração ----------------------------- */

const SECRETARIAS_INFO: Array<Omit<Secretaria, 'id' | 'orcamentoAnual' | 'servidores' | 'contratosAtivos'>> = [
  {
    nome: 'Saúde',
    sigla: 'SMS',
    responsavelFicticio: 'Titular fictício — SMS',
    atribuicao: 'Atenção básica, vigilância em saúde, assistência ambulatorial e hospitalar.',
  },
  {
    nome: 'Educação',
    sigla: 'SME',
    responsavelFicticio: 'Titular fictício — SME',
    atribuicao: 'Educação infantil e ensino fundamental, transporte e alimentação escolar.',
  },
  {
    nome: 'Obras e Serviços Públicos',
    sigla: 'SOSP',
    responsavelFicticio: 'Titular fictício — SOSP',
    atribuicao: 'Pavimentação, drenagem, iluminação, limpeza urbana e manutenção predial.',
  },
  {
    nome: 'Fazenda',
    sigla: 'SEMFAZ',
    responsavelFicticio: 'Titular fictício — SEMFAZ',
    atribuicao: 'Arrecadação, execução orçamentária, licitações e contabilidade.',
  },
  {
    nome: 'Administração',
    sigla: 'SEMAD',
    responsavelFicticio: 'Titular fictício — SEMAD',
    atribuicao: 'Gestão de pessoal, patrimônio, frota e serviços administrativos.',
  },
  {
    nome: 'Meio Ambiente',
    sigla: 'SMMA',
    responsavelFicticio: 'Titular fictício — SMMA',
    atribuicao: 'Licenciamento ambiental, fiscalização e educação ambiental.',
  },
  {
    nome: 'Assistência Social',
    sigla: 'SMAS',
    responsavelFicticio: 'Titular fictício — SMAS',
    atribuicao: 'Proteção social básica e especial, CRAS e benefícios eventuais.',
  },
  {
    nome: 'Agricultura e Pesca',
    sigla: 'SMAP',
    responsavelFicticio: 'Titular fictício — SMAP',
    atribuicao: 'Apoio ao produtor rural, pesca artesanal e feiras livres.',
  },
  {
    nome: 'Turismo, Cultura e Esporte',
    sigla: 'SMTC',
    responsavelFicticio: 'Titular fictício — SMTC',
    atribuicao: 'Eventos, patrimônio cultural, bibliotecas e atividades esportivas.',
  },
  {
    nome: 'Governo e Planejamento',
    sigla: 'SEGOV',
    responsavelFicticio: 'Titular fictício — SEGOV',
    atribuicao: 'Articulação institucional, planejamento estratégico e ouvidoria.',
  },
];

export const secretarias: Secretaria[] = SECRETARIAS_INFO.map((s, i) => ({
  ...s,
  id: `sec-${i + 1}`,
  orcamentoAnual: rng.money(4_200_000, 96_000_000),
  servidores: rng.int(38, 1_240),
  contratosAtivos: rng.int(3, 42),
}));

export const ADMINISTRACAO_RESUMO = {
  secretarias: secretarias.length,
  servidores: secretarias.reduce((s, x) => s + x.servidores, 0),
  orcamento: secretarias.reduce((s, x) => s + x.orcamentoAnual, 0),
  contratosAtivos: secretarias.reduce((s, x) => s + x.contratosAtivos, 0),
};
