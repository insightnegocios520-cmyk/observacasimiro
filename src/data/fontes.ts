/**
 * Fontes de dados — catálogo de referência.
 *
 * Os endereços abaixo são portais públicos oficiais usados como REFERÊNCIA de
 * onde os dados deverão vir no futuro. NENHUMA integração está ativa nesta
 * versão: o campo `status` deixa isso explícito na interface.
 */
import type { Fonte } from './types';

export const fontes: Fonte[] = [
  {
    id: 'fo-01',
    nome: 'Portal da Transparência Municipal',
    tipo: 'Portal',
    url: 'https://casimirodeabreu.rj.gov.br',
    descricao:
      'Origem prevista de despesas, receitas, contratos, licitações e diário oficial do município. A extração depende de autorização e de padronização do portal.',
    status: 'planejado',
    formato: 'HTML / PDF',
    periodicidade: 'Mensal (a confirmar)',
  },
  {
    id: 'fo-02',
    nome: 'PNCP — Portal Nacional de Contratações Públicas',
    tipo: 'API',
    url: 'https://www.gov.br/pncp/pt-br',
    descricao:
      'Base nacional de contratações públicas com API de consulta. Prevista como fonte primária de licitações e contratos.',
    status: 'planejado',
    formato: 'JSON (API REST)',
    periodicidade: 'Contínua',
  },
  {
    id: 'fo-03',
    nome: 'TCE-RJ — Tribunal de Contas do Estado do Rio de Janeiro',
    tipo: 'Dados abertos',
    url: 'https://www.tce.rj.gov.br',
    descricao:
      'Prestação de contas municipal e relatórios de auditoria. Útil para conferência independente dos números do executivo.',
    status: 'em avaliação',
    formato: 'HTML / planilhas',
    periodicidade: 'Anual',
  },
  {
    id: 'fo-04',
    nome: 'Portal da Transparência Federal',
    tipo: 'API',
    url: 'https://portaldatransparencia.gov.br',
    descricao:
      'Transferências voluntárias da União, convênios e repasses federais ao município.',
    status: 'planejado',
    formato: 'JSON (API REST)',
    periodicidade: 'Contínua',
  },
  {
    id: 'fo-05',
    nome: 'IBGE — Instituto Brasileiro de Geografia e Estatística',
    tipo: 'Base estatística',
    url: 'https://www.ibge.gov.br',
    descricao:
      'População, malha territorial e indicadores socioeconômicos usados como denominadores dos painéis.',
    status: 'planejado',
    formato: 'API / CSV',
    periodicidade: 'Anual',
  },
  {
    id: 'fo-06',
    nome: 'INEP — Censo Escolar e IDEB',
    tipo: 'Base estatística',
    url: 'https://www.gov.br/inep',
    descricao:
      'Matrículas, infraestrutura escolar e resultados educacionais oficiais para substituir os valores ilustrativos.',
    status: 'planejado',
    formato: 'CSV / microdados',
    periodicidade: 'Anual',
  },
  {
    id: 'fo-07',
    nome: 'DATASUS / CNES',
    tipo: 'Base estatística',
    url: 'https://datasus.saude.gov.br',
    descricao:
      'Estabelecimentos de saúde, equipes credenciadas e produção ambulatorial do município.',
    status: 'planejado',
    formato: 'CSV / DBC',
    periodicidade: 'Mensal',
  },
  {
    id: 'fo-08',
    nome: 'Dados Abertos RJ',
    tipo: 'Dados abertos',
    url: 'https://dadosabertos.rj.gov.br',
    descricao: 'Conjuntos de dados estaduais complementares, incluindo segurança e infraestrutura.',
    status: 'em avaliação',
    formato: 'CSV / JSON',
    periodicidade: 'Variável',
  },
  {
    id: 'fo-09',
    nome: 'Diário Oficial do Estado do RJ',
    tipo: 'Diário oficial',
    url: 'https://www.ioerj.com.br',
    descricao: 'Publicações estaduais que afetam o município, atos e nomeações regionais.',
    status: 'não conectado',
    formato: 'PDF',
    periodicidade: 'Diária',
  },
  {
    id: 'fo-10',
    nome: 'Geo serviços estaduais (IDE-RJ)',
    tipo: 'API',
    url: 'https://www.iderj.rj.gov.br',
    descricao:
      'Base cartográfica para o mapa georreferenciado. Previsto consumo via WMS/WFS e armazenamento em PostgreSQL/PostGIS.',
    status: 'planejado',
    formato: 'WMS / WFS / GeoJSON',
    periodicidade: 'Sob demanda',
  },
];

export const FONTES_RESUMO = {
  total: fontes.length,
  conectadas: fontes.filter((f) => f.status === 'não conectado').length,
  planejadas: fontes.filter((f) => f.status === 'planejado').length,
  emAvaliacao: fontes.filter((f) => f.status === 'em avaliação').length,
};

export const GLOSSARIO: Array<{ termo: string; definicao: string }> = [
  {
    termo: 'Empenho',
    definicao:
      'Reserva de dotação orçamentária para uma despesa autorizada. Indica intenção de gasto, não pagamento efetivo.',
  },
  {
    termo: 'Liquidação',
    definicao:
      'Etapa em que o ente confirma que o bem foi entregue ou o serviço foi prestado, conforme o contrato.',
  },
  {
    termo: 'Pagamento',
    definicao: 'Saída efetiva de recursos financeiros para o credor após a liquidação.',
  },
  {
    termo: 'Termo aditivo',
    definicao:
      'Instrumento que altera um contrato já assinado (prazo, valor ou objeto), sempre com justificativa e base legal.',
  },
  {
    termo: 'Dispensa de licitação',
    definicao:
      'Contratação sem licitação em hipóteses previstas em lei. O enquadramento deve ser verificado caso a caso.',
  },
  {
    termo: 'Fracionamento',
    definicao:
      'Divisão artificial de uma contratação para usar modalidade mais simples. É vedado quando há intenção de burlar a licitação.',
  },
  {
    termo: 'Ponto de atenção',
    definicao:
      'Padrão que merece verificação documental humana. Não é conclusão de irregularidade nem juízo sobre conduta de agentes.',
  },
];
