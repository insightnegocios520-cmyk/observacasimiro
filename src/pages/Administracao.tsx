/** Administração — estrutura administrativa, orçamento e pessoal por secretaria. */
import { useMemo } from 'react';
import { secretarias } from '@/data';
import { matchText, uniqueValues } from '@/lib/filters';
import { formatBRL, formatBRLCompact, formatNumber, formatPercent } from '@/lib/format';
import { FilterPanel, ResultsCount, SearchInput, SelectFilter, useFilterParams } from '@/components/filters/Filters';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { BarChart } from '@/components/ui/charts';
import type { Secretaria } from '@/data';
import { Callout, DemoNotice, PageHeader, SectionCard, StatCard } from '@/components/ui/primitives';
import { IconBuilding } from '@/components/ui/icons';

export default function Administracao() {
  const { get, set, clear } = useFilterParams();
  const q = get('q');
  const sigla = get('sigla', 'todas');

  const siglaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as secretarias' }, ...uniqueValues(secretarias.map((s) => `${s.sigla} — ${s.nome}`))],
    [],
  );

  const filtradas = useMemo(
    () =>
      secretarias.filter((secretaria) => {
        const combinaTexto = matchText(q, secretaria.nome, secretaria.sigla, secretaria.atribuicao, secretaria.responsavelFicticio);
        if (!combinaTexto) return false;
        if (sigla === 'todas') return true;
        return `${secretaria.sigla} — ${secretaria.nome}` === sigla;
      }),
    [q, sigla],
  );

  const orcamentoTotal = secretarias.reduce((total, s) => total + s.orcamentoAnual, 0);
  const servidoresTotal = secretarias.reduce((total, s) => total + s.servidores, 0);
  const contratosTotal = secretarias.reduce((total, s) => total + s.contratosAtivos, 0);
  const orcamentoFiltrado = filtradas.reduce((total, s) => total + s.orcamentoAnual, 0);

  const colunas: Column<Secretaria>[] = [
    {
      key: 'secretaria',
      header: 'Secretaria',
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{row.sigla}</p>
          <p className="text-[11px] text-slate-500">{row.nome}</p>
        </div>
      ),
    },
    {
      key: 'responsavel',
      header: 'Responsável (fictício)',
      render: (row) => <span className="text-slate-700">{row.responsavelFicticio}</span>,
    },
    {
      key: 'orcamento',
      header: 'Orçamento anual',
      align: 'right',
      render: (row) => <span className="font-medium tabular text-slate-900">{formatBRL(row.orcamentoAnual, { decimals: false })}</span>,
    },
    {
      key: 'participacao',
      header: '% do orçamento',
      align: 'right',
      render: (row) => (
        <span className="tabular text-slate-700">{formatPercent((row.orcamentoAnual / orcamentoTotal) * 100, 1)}</span>
      ),
    },
    {
      key: 'servidores',
      header: 'Servidores',
      align: 'right',
      render: (row) => <span className="tabular text-slate-700">{formatNumber(row.servidores)}</span>,
    },
    {
      key: 'contratos',
      header: 'Contratos ativos',
      align: 'right',
      render: (row) => <span className="tabular text-slate-700">{formatNumber(row.contratosAtivos)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Estrutura de governo"
        title="Administração"
        description="Secretarias municipais, atribuições, orçamento anual e quadro de pessoal. Entender quem executa cada política pública é o primeiro passo para cobrar resultados."
        icon={<IconBuilding size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Estrutura, responsáveis, orçamentos e efetivos são fictícios. Os nomes de responsáveis são inventados e não
          correspondem a pessoas reais.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Secretarias" value={formatNumber(secretarias.length)} hint="Estrutura fictícia" tone="brand" />
        <StatCard label="Orçamento somado" value={formatBRLCompact(orcamentoTotal)} hint="Soma das secretarias" tone="info" />
        <StatCard label="Servidores" value={formatNumber(servidoresTotal)} hint="Quadro fictício declarado" tone="success" />
        <StatCard label="Contratos ativos" value={formatNumber(contratosTotal)} hint="Somando todas as pastas" tone="warning" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={[q !== '', sigla !== 'todas'].filter(Boolean).length} onClear={() => clear(['q', 'sigla'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Secretaria, sigla, atribuição…" />
          <SelectFilter id="adm-sigla" label="Secretaria" value={sigla} onChange={(value) => set('sigla', value)} options={siglaOpcoes} />
          <div className="rounded-lg bg-brand-50 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">Orçamento filtrado</p>
            <p className="mt-0.5 text-[15px] font-bold text-brand-900 tabular">{formatBRLCompact(orcamentoFiltrado)}</p>
            <p className="text-[10px] text-brand-700/80">
              {formatPercent((orcamentoFiltrado / orcamentoTotal) * 100, 1)} do total das secretarias
            </p>
          </div>
        </FilterPanel>

        <SectionCard
          title="Secretarias e orçamento"
          description="Comparação entre pastas"
          className="lg:col-span-3"
          action={<ResultsCount shown={filtradas.length} total={secretarias.length} label="secretarias" />}
        >
          <BarChart
            items={filtradas.map((secretaria) => ({ label: secretaria.sigla, value: secretaria.orcamentoAnual, hint: secretaria.nome }))}
            formatValue={(value) => formatBRLCompact(value)}
            color="brand"
          />
          <div className="mt-4">
            <DataTable
              rows={filtradas}
              columns={colunas}
              getRowKey={(row) => row.id}
              caption="Secretarias municipais fictícias"
              emptyTitle="Nenhuma secretaria encontrada"
              emptyDescription="Ajuste a busca ou selecione outra secretaria."
              emptyAction={
                <button
                  type="button"
                  onClick={() => clear(['q', 'sigla'])}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                >
                  Limpar filtros
                </button>
              }
              renderMobile={(row) => (
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">{row.sigla}</p>
                      <p className="text-[11px] text-slate-500">{row.nome}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-slate-900 tabular">
                      {formatBRLCompact(row.orcamentoAnual)}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600">{row.atribuicao}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {formatNumber(row.servidores)} servidores · {row.contratosAtivos} contratos ativos
                  </p>
                </div>
              )}
            />
          </div>
        </SectionCard>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {filtradas.map((secretaria) => (
          <article key={secretaria.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                {secretaria.sigla}
              </span>
              <span className="text-[11px] font-semibold text-slate-900 tabular">{formatBRLCompact(secretaria.orcamentoAnual)}</span>
            </div>
            <h3 className="mt-1.5 text-[13px] font-semibold text-slate-900">{secretaria.nome}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{secretaria.atribuicao}</p>
            <p className="mt-2 text-[10px] text-slate-400">Responsável fictício: {secretaria.responsavelFicticio}</p>
          </article>
        ))}
      </div>

      <div className="mt-3">
        <Callout tone="info" title="Sobre os nomes de responsáveis">
          Nesta versão de demonstração os responsáveis são nomes inventados. Em produção, o campo deve vir do portal de
          transparência oficial, com data de nomeação e ato de designação.
        </Callout>
      </div>
    </div>
  );
}
