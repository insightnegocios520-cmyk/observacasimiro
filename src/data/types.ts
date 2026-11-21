/**
 * Tipos compartilhados da camada de dados do OBSERVA.
 *
 * IMPORTANTE: todos os registros que satisfazem estes tipos, nesta versão,
 * são DADOS FICTÍCIOS gerados para demonstração de interface. Quando a
 * integração real existir (ver README → Roadmap), estes mesmos tipos devem ser
 * produzidos pela API FastAPI a partir de PostgreSQL/PostGIS.
 */

export type StatusContrato = 'vigente' | 'encerrado' | 'aditado' | 'suspenso';

export type ModalidadeLicitacao =
  | 'Pregão Eletrônico'
  | 'Concorrência'
  | 'Tomada de Preços'
  | 'Dispensa'
  | 'Inexigibilidade'
  | 'Credenciamento';

export type StatusLicitacao = 'publicada' | 'em andamento' | 'homologada' | 'deserta' | 'revogada';

export type StatusObra = 'planejamento' | 'em execução' | 'paralisada' | 'concluída';

export type SeveridadeAlerta = 'alta' | 'média' | 'baixa';

export type StatusAlerta = 'aberto' | 'em verificação' | 'encerrado';

export type TipoPublicacao =
  | 'Decreto'
  | 'Portaria'
  | 'Lei'
  | 'Edital'
  | 'Extrato de contrato'
  | 'Nomeação'
  | 'Resolução';

export interface Contrato {
  id: string;
  numero: string;
  objeto: string;
  fornecedor: string;
  cnpjFicticio: string;
  secretaria: string;
  categoria: string;
  modalidade: ModalidadeLicitacao;
  licitacaoId: string | null;
  valor: number;
  dataAssinatura: string;
  vigenciaFim: string;
  status: StatusContrato;
  aditivos: number;
  percentualAditivo: number;
}

export interface Licitacao {
  id: string;
  numero: string;
  objeto: string;
  modalidade: ModalidadeLicitacao;
  secretaria: string;
  valorEstimado: number;
  dataAbertura: string;
  status: StatusLicitacao;
  participantes: number;
  contratosGerados: number;
}

export interface Obra {
  id: string;
  nome: string;
  descricao: string;
  secretaria: string;
  bairro: string;
  empresa: string;
  valorContratado: number;
  valorPago: number;
  percentualExecucao: number;
  status: StatusObra;
  inicio: string;
  previsaoFim: string;
  mapa: { x: number; y: number };
}

export interface UnidadeSaude {
  id: string;
  nome: string;
  tipo: 'UBS' | 'Hospital' | 'CAPS' | 'Vigilância em Saúde' | 'CEO';
  bairro: string;
  equipes: number;
  atendimentosMes: number;
  status: 'em funcionamento' | 'reforma' | 'ampliação';
  mapa: { x: number; y: number };
}

export interface Escola {
  id: string;
  nome: string;
  bairro: string;
  etapas: string;
  matriculas: number;
  turmas: number;
  idebFicticio: number | null;
  infraestrutura: string[];
  mapa: { x: number; y: number };
}

export interface ServicoMunicipal {
  id: string;
  nome: string;
  categoria: string;
  secretaria: string;
  prazoDias: number;
  atendimentosMes: number;
  canal: string;
  status: 'operando' | 'parcial' | 'em implantação';
  mapa: { x: number; y: number };
}

export interface Publicacao {
  id: string;
  tipo: TipoPublicacao;
  numero: string;
  data: string;
  titulo: string;
  resumo: string;
  orgao: string;
}

export interface Alerta {
  id: string;
  titulo: string;
  descricao: string;
  severidade: SeveridadeAlerta;
  categoria: string;
  entidade: string;
  data: string;
  status: StatusAlerta;
  criterio: string;
}

export interface Secretaria {
  id: string;
  nome: string;
  sigla: string;
  responsavelFicticio: string;
  orcamentoAnual: number;
  servidores: number;
  contratosAtivos: number;
  atribuicao: string;
}

export interface Fonte {
  id: string;
  nome: string;
  tipo: 'Portal' | 'API' | 'Dados abertos' | 'Diário oficial' | 'Base estatística';
  url: string;
  descricao: string;
  status: 'planejado' | 'não conectado' | 'em avaliação';
  formato: string;
  periodicidade: string;
}

export interface DespesaFuncao {
  funcao: string;
  empenhado: number;
  liquidado: number;
  pago: number;
}

export interface ReceitaOrigem {
  origem: string;
  previsto: number;
  arrecadado: number;
}

export interface SerieMensal {
  mes: string;
  receita: number;
  despesa: number;
}

export interface Indicador {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  meta: number | null;
  tendencia: 'alta' | 'baixa' | 'estável';
  descricao: string;
}

export interface MapaPonto {
  id: string;
  nome: string;
  camada: 'obras' | 'saúde' | 'educação' | 'serviços';
  categoria: string;
  bairro: string;
  status: string;
  detalhe: string;
  x: number;
  y: number;
  href: string;
}
