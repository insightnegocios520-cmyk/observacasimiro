/**
 * Contratos e licitações — DADOS FICTÍCIOS de demonstração.
 * Nenhum registro corresponde a um processo administrativo real.
 */
import type { Contrato, Licitacao, ModalidadeLicitacao, StatusContrato, StatusLicitacao } from './types';
import { ANOS, SECRETARIAS, addMonths, cnpjFicticio, makeRng } from './seed';

const rng = makeRng(20260214);

const FORNECEDORES = [
  'Construtora Vale Verde Ltda. (fictícia)',
  'Comercial Serra Azul EIRELI (fictícia)',
  'Transportes Litoral Norte Ltda. (fictícia)',
  'Instituto Educar Brasil (fictício)',
  'Tecnologia Pública Consultoria (fictícia)',
  'Distribuidora Rio Claro Ltda. (fictícia)',
  'Serviços Integrados Maré (fictícia)',
  'Farmácia Vale do Ostras Ltda. (fictícia)',
  'Cooperativa Agro Serra Mar (fictícia)',
  'Editora e Gráfica Horizonte (fictícia)',
  'Clínica Vida Plena Ltda. (fictícia)',
  'Engenharia Costeira S.A. (fictícia)',
  'Sinal Verde Semáforos Ltda. (fictícia)',
  'Alimenta Bem Refeições Coletivas (fictícia)',
];

const OBJETOS: Record<string, string[]> = {
  'Medicamentos e insumos': [
    'Aquisição de medicamentos da atenção básica',
    'Aquisição de insumos para curativos e material hospitalar',
    'Aquisição de testes rápidos para vigilância em saúde',
  ],
  'Obras e pavimentação': [
    'Pavimentação asfáltica e drenagem de vias urbanas',
    'Reforma da praça central e mobiliário urbano',
    'Construção de unidade de saúde da família',
    'Recuperação de ponte em estrada vicinal',
  ],
  'Locação de veículos': [
    'Locação de veículos para a rede municipal de saúde',
    'Locação de ônibus para transporte escolar',
    'Locação de máquinas pesadas para manutenção de vias',
  ],
  'Alimentação escolar': [
    'Aquisição de gêneros alimentícios para a merenda escolar',
    'Fornecimento de hortifrútis da agricultura familiar',
  ],
  'Limpeza urbana': [
    'Coleta de resíduos sólidos domiciliares',
    'Varrição e conservação de logradouros públicos',
  ],
  'Tecnologia da informação': [
    'Locação de sistema de gestão pública integrado',
    'Aquisição de computadores para laboratórios escolares',
    'Serviço de link de internet dedicado',
  ],
  'Material de escritório': [
    'Aquisição de material de expediente e papelaria',
    'Aquisição de mobiliário para repartições municipais',
  ],
  'Serviços de saúde': [
    'Contratação de plantão médico hospitalar',
    'Serviço de exames laboratoriais de apoio diagnóstico',
    'Serviço de fisioterapia ambulatorial',
  ],
  'Transporte escolar': [
    'Transporte escolar de alunos da zona rural',
    'Transporte de pacientes para tratamento fora do domicílio',
  ],
  'Iluminação pública': [
    'Manutenção da rede de iluminação pública',
    'Aquisição e instalação de luminárias LED',
  ],
  'Eventos e cultura': [
    'Produção de eventos culturais do calendário municipal',
    'Contratação de atrações para festa tradicional',
  ],
  'Mobiliário urbano': [
    'Aquisição de abrigos de ônibus e lixeiras',
    'Aquisição de parques infantis para praças',
  ],
};

const CATEGORIAS = Object.keys(OBJETOS);

const MODALIDADES: ModalidadeLicitacao[] = [
  'Pregão Eletrônico',
  'Concorrência',
  'Tomada de Preços',
  'Dispensa',
  'Inexigibilidade',
  'Credenciamento',
];

const STATUS_LICITACAO: StatusLicitacao[] = [
  'homologada',
  'homologada',
  'homologada',
  'em andamento',
  'publicada',
  'deserta',
  'revogada',
];

const STATUS_CONTRATO: StatusContrato[] = [
  'vigente',
  'vigente',
  'vigente',
  'encerrado',
  'aditado',
  'suspenso',
];

function objetoAleatorio(): { categoria: string; objeto: string } {
  const categoria = rng.pick(CATEGORIAS);
  return { categoria, objeto: rng.pick(OBJETOS[categoria] as string[]) };
}

function anoAberto(ano: number): { mes: number; dias: number } {
  // 2026 está em curso: mantém datas até o mês corrente para evitar datas futuras.
  const mesMax = ano === 2026 ? 8 : 11;
  return { mes: rng.int(0, mesMax), dias: 27 };
}

export const licitacoes: Licitacao[] = Array.from({ length: 36 }, (_, i) => {
  const ano = rng.pick(ANOS);
  const { mes, dias } = anoAberto(ano);
  const { categoria, objeto } = objetoAleatorio();
  const modalidade = categoria === 'Serviços de saúde' && rng.chance(0.4) ? 'Credenciamento' : rng.pick(MODALIDADES);
  const seq = i + 1;
  return {
    id: `lic-${seq}`,
    numero: `${modalidade === 'Pregão Eletrônico' ? 'PE' : modalidade === 'Concorrência' ? 'CC' : modalidade === 'Dispensa' ? 'DP' : 'LC'} ${String(seq).padStart(3, '0')}/${ano}`,
    objeto,
    modalidade,
    secretaria: rng.pick(SECRETARIAS),
    valorEstimado: rng.money(45_000, 4_200_000),
    dataAbertura: rng.date(ano, mes, dias),
    status: rng.pick(STATUS_LICITACAO),
    participantes: rng.int(1, 11),
    contratosGerados: 0,
  } satisfies Licitacao;
});

export const contratos: Contrato[] = Array.from({ length: 58 }, (_, i) => {
  const ano = rng.pick(ANOS);
  const { mes, dias } = anoAberto(ano);
  const { categoria, objeto } = objetoAleatorio();
  const secretaria = rng.pick(SECRETARIAS);
  const licitacao = rng.chance(0.72)
    ? (licitacoes.find((l) => l.secretaria === secretaria) ?? rng.pick(licitacoes))
    : null;
  const dataAssinatura = rng.date(ano, mes, dias);
  const aditivos = rng.chance(0.32) ? rng.int(1, 3) : 0;
  const status: StatusContrato = aditivos > 0 ? (rng.chance(0.6) ? 'aditado' : rng.pick(STATUS_CONTRATO)) : rng.pick(STATUS_CONTRATO);

  return {
    id: `ct-${i + 1}`,
    numero: `CT ${String(i + 1).padStart(3, '0')}/${ano}`,
    objeto,
    fornecedor: rng.pick(FORNECEDORES),
    cnpjFicticio: cnpjFicticio(rng),
    secretaria,
    categoria,
    modalidade: licitacao ? licitacao.modalidade : rng.pick(MODALIDADES),
    licitacaoId: licitacao ? licitacao.id : null,
    valor: rng.money(18_000, 3_400_000),
    dataAssinatura,
    vigenciaFim: addMonths(dataAssinatura, rng.int(6, 24)),
    status,
    aditivos,
    percentualAditivo: aditivos > 0 ? rng.int(4, 32) : 0,
  } satisfies Contrato;
}).sort((a, b) => b.dataAssinatura.localeCompare(a.dataAssinatura));

// Conta quantos contratos cada licitação gerou (para o detalhe da licitação).
for (const licitacao of licitacoes) {
  licitacao.contratosGerados = contratos.filter((c) => c.licitacaoId === licitacao.id).length;
}

export const MODALIDADES_LICITACAO = MODALIDADES;
export const CATEGORIAS_CONTRATO = CATEGORIAS;
export const FORNECEDORES_FICTICIOS = FORNECEDORES;
