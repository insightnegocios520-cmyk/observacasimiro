/**
 * Alertas — PONTOS DE ATENÇÃO para verificação humana. DADOS FICTÍCIOS.
 *
 * Regra de produto: um alerta NUNCA é conclusão de irregularidade. Ele apenas
 * indica um padrão que merece checagem documental. Todo alerta carrega o
 * critério objetivo que o gerou e o status do acompanhamento.
 */
import type { Alerta } from './types';

export const alertas: Alerta[] = [
  {
    id: 'al-01',
    titulo: 'Contrato com aditivo acima de 25% do valor original',
    descricao:
      'O contrato CT 014/2025 recebeu dois termos aditivos que somam 31% do valor inicial. O percentual está dentro dos limites legais em algumas hipóteses, mas exige verificação da justificativa técnica e da base legal utilizada.',
    severidade: 'alta',
    categoria: 'Aditivos contratuais',
    entidade: 'Secretaria de Obras e Serviços Públicos',
    data: '2026-09-18',
    status: 'aberto',
    criterio: 'Soma de aditivos superior a 25% do valor original do contrato.',
  },
  {
    id: 'al-02',
    titulo: 'Obra paralisada com mais de 40% pago',
    descricao:
      'A obra "Reforma da Escola Municipal Boa Esperança" está marcada como paralisada e possui 46% do valor contratado registrado como pago. Recomenda-se conferir as medições e o cronograma físico-financeiro.',
    severidade: 'alta',
    categoria: 'Obras',
    entidade: 'Secretaria de Educação',
    data: '2026-09-11',
    status: 'em verificação',
    criterio: 'Status "paralisada" com percentual pago superior a 40%.',
  },
  {
    id: 'al-03',
    titulo: 'Fornecedor com contratos em várias secretarias',
    descricao:
      'Um mesmo fornecedor fictício aparece em contratos de quatro secretarias diferentes no mesmo exercício. Não é irregular por si, mas facilita conferir se houve fracionamento de objeto.',
    severidade: 'média',
    categoria: 'Concentração de fornecedores',
    entidade: 'Secretarias diversas',
    data: '2026-08-30',
    status: 'aberto',
    criterio: 'Mesmo fornecedor em 3 ou mais secretarias no mesmo ano.',
  },
  {
    id: 'al-04',
    titulo: 'Licitação com apenas um participante',
    descricao:
      'Três processos de pregão eletrônico registraram um único participante. Vale checar a publicidade do edital e o prazo de divulgação.',
    severidade: 'média',
    categoria: 'Competitividade',
    entidade: 'Secretaria de Saúde',
    data: '2026-08-22',
    status: 'aberto',
    criterio: 'Processo homologado com apenas 1 participante.',
  },
  {
    id: 'al-05',
    titulo: 'Publicação de extrato fora do prazo de referência',
    descricao:
      'Extratos de contrato aparecem publicados mais de 20 dias após a assinatura. A conferência do prazo legal de publicação deve ser feita no caso concreto.',
    severidade: 'baixa',
    categoria: 'Publicações oficiais',
    entidade: 'Secretaria de Administração',
    data: '2026-08-14',
    status: 'encerrado',
    criterio: 'Intervalo entre assinatura e publicação superior a 20 dias.',
  },
  {
    id: 'al-06',
    titulo: 'Dotação da saúde com execução abaixo do mínimo constitucional',
    descricao:
      'A execução empenhada da função Saúde está em 71,6% da dotação anual no acumulado. O acompanhamento deve considerar o exercício completo antes de qualquer conclusão.',
    severidade: 'média',
    categoria: 'Orçamento',
    entidade: 'Secretaria de Saúde',
    data: '2026-08-05',
    status: 'em verificação',
    criterio: 'Execução da função Saúde abaixo de 75% no acumulado do exercício.',
  },
  {
    id: 'al-07',
    titulo: 'Obra concluída sem registro de pagamento final',
    descricao:
      'Duas obras constam como 100% executadas, mas com valor pago inferior ao contratado. Pode ser apenas atraso de lançamento contábil.',
    severidade: 'baixa',
    categoria: 'Obras',
    entidade: 'Secretaria de Obras e Serviços Públicos',
    data: '2026-07-29',
    status: 'aberto',
    criterio: 'Status "concluída" com valor pago menor que o valor contratado.',
  },
  {
    id: 'al-08',
    titulo: 'Dispensa de licitação recorrente para o mesmo objeto',
    descricao:
      'Compras por dispensa do mesmo tipo de objeto se repetem no exercício. É necessário verificar se a soma configura fracionamento vedado.',
    severidade: 'alta',
    categoria: 'Licitações',
    entidade: 'Secretaria de Administração',
    data: '2026-07-21',
    status: 'aberto',
    criterio: 'Mais de 2 dispensas do mesmo objeto no mesmo exercício.',
  },
  {
    id: 'al-09',
    titulo: 'Escola com infraestrutura incompleta declarada',
    descricao:
      'Uma unidade escolar não registra refeitório nem acessibilidade no cadastro demonstrativo. A checagem deve ser feita in loco e no censo oficial.',
    severidade: 'baixa',
    categoria: 'Educação',
    entidade: 'Secretaria de Educação',
    data: '2026-07-08',
    status: 'aberto',
    criterio: 'Unidade escolar sem itens mínimos de infraestrutura no cadastro.',
  },
  {
    id: 'al-10',
    titulo: 'Vigência contratual vencida com status "vigente"',
    descricao:
      'Um contrato aparece como vigente com data final anterior à data de referência do painel. Pode indicar atraso de atualização do cadastro.',
    severidade: 'média',
    categoria: 'Contratos',
    entidade: 'Secretaria de Turismo, Cultura e Esporte',
    data: '2026-06-30',
    status: 'encerrado',
    criterio: 'Data de vigência final anterior à data de referência com status "vigente".',
  },
  {
    id: 'al-11',
    titulo: 'Serviço municipal com prazo médio acima do pactuado',
    descricao:
      'O serviço de poda de árvores registra prazo médio de 15 dias, enquanto o tempo de resposta esperado é de 7 dias.',
    severidade: 'baixa',
    categoria: 'Serviços municipais',
    entidade: 'Secretaria de Meio Ambiente',
    data: '2026-06-18',
    status: 'em verificação',
    criterio: 'Prazo médio de atendimento superior ao dobro do pactuado.',
  },
  {
    id: 'al-12',
    titulo: 'Concentração de contratos no fim do exercício',
    descricao:
      'Há concentração de assinaturas no último trimestre do exercício demonstrativo. O padrão pede verificação de planejamento das contratações.',
    severidade: 'média',
    categoria: 'Contratos',
    entidade: 'Secretaria de Fazenda',
    data: '2026-06-02',
    status: 'aberto',
    criterio: 'Mais de 35% dos contratos assinados no último trimestre.',
  },
];

export const ALERTAS_RESUMO = {
  total: alertas.length,
  alta: alertas.filter((a) => a.severidade === 'alta').length,
  media: alertas.filter((a) => a.severidade === 'média').length,
  baixa: alertas.filter((a) => a.severidade === 'baixa').length,
  abertos: alertas.filter((a) => a.status === 'aberto').length,
};
