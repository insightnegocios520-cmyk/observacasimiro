/** Dinheiro Público — receitas, despesas por função e série mensal. */
import { useMemo } from 'react';
import { FINANCAS_RESUMO, despesasPorFuncao, receitasPorOrigem, serieMensal } from '@/data';
import type { DespesaFuncao, ReceitaOrigem } from '@/data';
import { ChipFilter, FilterPanel, ResultsCount, useFilterParams } from '@/components/filters/Filters';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { BarChart, LineChart } from '@/components/ui/charts';
import { Badge, Callout, DemoNotice, PageHeader, SectionCard, StatCard } from '@/components/ui/primitives';
import { IconDownload, IconWallet } from '@/components/ui/icons';
import { downloadFile, formatBRL, formatBRLCompact, formatPercent, toCSV } from '@/lib/format';

type Estagio = 'empenhado' | 'liquidado' | 'pago';

const VISOES = [
  { value: 'despesas', label: 'Despesas por função' },
  { value: 'receitas', label: 'Receitas por origem' },
  { value: 'serie', label: 'Série mensal' },
];

const ESTAGIOS = [
  { value: 'empenhado', label: 'Empenhado' },
  { value: 'liquidado', label: 'Liquidado' },
  { value: 'pago', label: 'Pago' },
];

const ESTAGIO_LABEL: Record<Estagio, string> = {
  empenhado: 'Empenhado',
  liquidado: 'Liquidado',
  pago: 'Pago',
};

export default function DinheiroPublico() {
  const { get, set, clear } = useFilterParams();
  const visao = get('visao', 'despesas');
  const estagio = (get('estagio', 'empenhado') as Estagio) ?? 'empenhado';

  const despesasOrdenadas = useMemo(
    () => [...despesasPorFuncao].sort((a, b) => b[estagio] - a[estagio]),
    [estagio],
  );

  const totalEstagio = despesasOrdenadas.reduce((total, item) => total + item[estagio], 0);

  const despesaColunas: Column<DespesaFuncao>[] = [
    {
      key: 'funcao',
      header: 'Função de governo',
      render: (row) => <span className="font-medium text-slate-900">{row.funcao}</span>,
    },
    {
      key: 'empenhado',
      header: 'Empenhado',
      align: 'right',
      render: (row) => <span className="tabular">{formatBRL(row.empenhado, { decimals: false })}</span>,
    },
    {
      key: 'liquidado',
      header: 'Liquidado',
      align: 'right',
      render: (row) => <span className="tabular">{formatBRL(row.liquidado, { decimals: false })}</span>,
    },
    {
      key: 'pago',
      header: 'Pago',
      align: 'right',
      render: (row) => <span className="tabular">{formatBRL(row.pago, { decimals: false })}</span>,
    },
    {
      key: 'execucao',
      header: '% pago',
      align: 'right',
      render: (row) => (
        <Badge tone={row.pago / row.empenhado > 0.8 ? 'success' : row.pago / row.empenhado > 0.5 ? 'warning' : 'neutral'}>
          {formatPercent((row.pago / row.empenhado) * 100, 0)}
        </Badge>
      ),
    },
  ];

  const receitaColunas: Column<ReceitaOrigem>[] = [
    {
      key: 'origem',
      header: 'Origem da receita',
      render: (row) => <span className="font-medium text-slate-900">{row.origem}</span>,
    },
    {
      key: 'previsto',
      header: 'Previsto',
      align: 'right',
      render: (row) => <span className="tabular">{formatBRL(row.previsto, { decimals: false })}</span>,
    },
    {
      key: 'arrecadado',
      header: 'Arrecadado',
      align: 'right',
      render: (row) => <span className="tabular">{formatBRL(row.arrecadado, { decimals: false })}</span>,
    },
    {
      key: 'variacao',
      header: 'Variação',
      align: 'right',
      render: (row) => {
        const variacao = (row.arrecadado / row.previsto - 1) * 100;
        return (
          <Badge tone={variacao >= 0 ? 'success' : 'danger'}>
            {variacao >= 0 ? '+' : ''}
            {formatPercent(variacao, 0)}
          </Badge>
        );
      },
    },
  ];

  const exportar = () => {
    if (visao === 'receitas') {
      const csv = toCSV(
        ['Origem', 'Previsto (R$)', 'Arrecadado (R$)'],
        receitasPorOrigem.map((item) => [item.origem, item.previsto, item.arrecadado]),
      );
      downloadFile('observa-receitas-ficticias.csv', csv, 'text/csv;charset=utf-8');
      return;
    }
    if (visao === 'serie') {
      const csv = toCSV(
        ['Mês', 'Receita (R$)', 'Despesa (R$)'],
        serieMensal.map((item) => [item.mes, item.receita, item.despesa]),
      );
      downloadFile('observa-serie-mensal-ficticia.csv', csv, 'text/csv;charset=utf-8');
      return;
    }
    const csv = toCSV(
      ['Função', 'Empenhado (R$)', 'Liquidado (R$)', 'Pago (R$)'],
      despesasOrdenadas.map((item) => [item.funcao, item.empenhado, item.liquidado, item.pago]),
    );
    downloadFile('observa-despesas-ficticias.csv', csv, 'text/csv;charset=utf-8');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Execução orçamentária"
        title="Dinheiro Público"
        description="Acompanhe receitas previstas e arrecadadas, despesas por função de governo e a evolução mensal. A leitura correta separa empenho, liquidação e pagamento — são etapas distintas do gasto público."
        icon={<IconWallet size={22} />}
        actions={
          <button
            type="button"
            onClick={exportar}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <IconDownload size={15} /> Exportar CSV
          </button>
        }
      />

      <div className="mb-4">
        <DemoNotice>
          Valores fictícios de demonstração. Não representam o orçamento real de Casimiro de Abreu e não devem ser
          usados em análises ou matérias jornalísticas.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label="Receita arrecadada"
          value={formatBRLCompact(FINANCAS_RESUMO.receitaArrecadada)}
          hint={`Previsto ${formatBRLCompact(FINANCAS_RESUMO.receitaPrevista)}`}
          tone="brand"
        />
        <StatCard
          label="Despesa empenhada"
          value={formatBRLCompact(FINANCAS_RESUMO.despesaEmpenhada)}
          hint="Reserva de dotação"
          tone="info"
        />
        <StatCard
          label="Despesa liquidada"
          value={formatBRLCompact(FINANCAS_RESUMO.despesaLiquidada)}
          hint="Bem entregue ou serviço prestado"
          tone="warning"
        />
        <StatCard
          label="Despesa paga"
          value={formatBRLCompact(FINANCAS_RESUMO.despesaPaga)}
          hint="Saída efetiva de recursos"
          tone="success"
        />
      </div>

      <div className="mt-3 space-y-3">
        <FilterPanel activeCount={[visao !== 'despesas', estagio !== 'empenhado'].filter(Boolean).length} onClear={() => clear(['visao', 'estagio'])}>
          <ChipFilter label="Visão" options={VISOES} value={visao} onChange={(value) => set('visao', value)} />
          {visao === 'despesas' ? (
            <ChipFilter label="Estágio da despesa" options={ESTAGIOS} value={estagio} onChange={(value) => set('estagio', value)} />
          ) : null}
        </FilterPanel>

        {visao === 'despesas' ? (
          <>
            <div className="grid gap-3 lg:grid-cols-5">
              <SectionCard
                title={`Despesa ${ESTAGIO_LABEL[estagio].toLowerCase()} por função`}
                description={`Total: ${formatBRL(totalEstagio, { decimals: false })}`}
                className="lg:col-span-2"
              >
                <BarChart
                  items={despesasOrdenadas.map((item) => ({ label: item.funcao, value: item[estagio] }))}
                  formatValue={(value) => formatBRLCompact(value)}
                  color={estagio === 'pago' ? 'sky' : estagio === 'liquidado' ? 'amber' : 'brand'}
                />
              </SectionCard>

              <SectionCard
                title="Despesas por função"
                description="Comparação entre estágios da execução"
                className="lg:col-span-3"
                action={<ResultsCount shown={despesasOrdenadas.length} total={despesasPorFuncao.length} label="funções" />}
              >
                <DataTable
                  rows={despesasOrdenadas}
                  columns={despesaColunas}
                  getRowKey={(row) => row.funcao}
                  caption="Despesas por função de governo"
                  renderMobile={(row) => (
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[13px] font-semibold text-slate-900">{row.funcao}</p>
                      <dl className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
                        <div>
                          <dt className="text-slate-500">Empenhado</dt>
                          <dd className="font-medium text-slate-800 tabular">{formatBRL(row.empenhado, { decimals: false })}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Liquidado</dt>
                          <dd className="font-medium text-slate-800 tabular">{formatBRL(row.liquidado, { decimals: false })}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Pago</dt>
                          <dd className="font-medium text-slate-800 tabular">{formatBRL(row.pago, { decimals: false })}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">% pago</dt>
                          <dd className="font-medium text-slate-800 tabular">{formatPercent((row.pago / row.empenhado) * 100, 0)}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                />
              </SectionCard>
            </div>

            <Callout tone="info" title="Como ler empenho, liquidação e pagamento">
              O <strong>empenho</strong> reserva orçamento; a <strong>liquidação</strong> confirma a entrega do bem ou a
              prestação do serviço; o <strong>pagamento</strong> é a saída financeira. Uma despesa empenhada e não paga
              pode indicar apenas andamento normal do exercício — a verificação exige documentos e prazos.
            </Callout>
          </>
        ) : null}

        {visao === 'receitas' ? (
          <div className="grid gap-3 lg:grid-cols-5">
            <SectionCard title="Composição da receita" description="Previsto x arrecadado" className="lg:col-span-2">
              <BarChart
                items={receitasPorOrigem.map((item) => ({ label: item.origem, value: item.arrecadado, hint: `Previsto ${formatBRLCompact(item.previsto)}` }))}
                formatValue={(value) => formatBRLCompact(value)}
                color="sky"
              />
            </SectionCard>
            <SectionCard
              title="Receitas por origem"
              description="Arrecadação acumulada no período demonstrativo"
              className="lg:col-span-3"
              action={<ResultsCount shown={receitasPorOrigem.length} total={receitasPorOrigem.length} label="origens" />}
            >
              <DataTable
                rows={receitasPorOrigem}
                columns={receitaColunas}
                getRowKey={(row) => row.origem}
                caption="Receitas por origem"
                renderMobile={(row) => (
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[13px] font-semibold text-slate-900">{row.origem}</p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      Arrecadado {formatBRL(row.arrecadado, { decimals: false })} de{' '}
                      {formatBRL(row.previsto, { decimals: false })}
                    </p>
                  </div>
                )}
              />
            </SectionCard>
          </div>
        ) : null}

        {visao === 'serie' ? (
          <SectionCard title="Receita e despesa mês a mês" description="Série demonstrativa do exercício">
            <LineChart
              labels={serieMensal.map((item) => item.mes)}
              series={[
                { name: 'Receita', color: '#0d9488', values: serieMensal.map((item) => item.receita) },
                { name: 'Despesa', color: '#e11d48', values: serieMensal.map((item) => item.despesa) },
              ]}
              formatValue={(value) => formatBRLCompact(value)}
            />
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-[12px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-2 py-1.5 text-left">Mês</th>
                    <th className="px-2 py-1.5 text-right">Receita</th>
                    <th className="px-2 py-1.5 text-right">Despesa</th>
                    <th className="px-2 py-1.5 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {serieMensal.map((item) => (
                    <tr key={item.mes} className="border-t border-slate-100">
                      <td className="px-2 py-1.5 font-medium text-slate-800">{item.mes}</td>
                      <td className="px-2 py-1.5 text-right tabular">{formatBRLCompact(item.receita)}</td>
                      <td className="px-2 py-1.5 text-right tabular">{formatBRLCompact(item.despesa)}</td>
                      <td className={`px-2 py-1.5 text-right font-medium tabular ${item.receita - item.despesa >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {formatBRLCompact(item.receita - item.despesa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}
