/** Serviços Municipais — catálogo de serviços, canais e prazos. */
import { useMemo } from 'react';
import { servicos } from '@/data';
import type { ServicoMunicipal } from '@/data';
import { matchSelect, matchText, uniqueValues } from '@/lib/filters';
import { formatNumber } from '@/lib/format';
import { FilterPanel, ResultsCount, SearchInput, SelectFilter, useFilterParams } from '@/components/filters/Filters';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Badge, DemoNotice, PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/ui/primitives';
import { IconWrench } from '@/components/ui/icons';

const STATUS_OPCOES = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'operando', label: 'Operando' },
  { value: 'parcial', label: 'Parcial' },
  { value: 'suspenso', label: 'Suspenso' },
];

export default function Servicos() {
  const { get, set, clear } = useFilterParams();
  const q = get('q');
  const categoria = get('categoria', 'todas');
  const status = get('status', 'todos');

  const categoriaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as categorias' }, ...uniqueValues(servicos.map((s) => s.categoria))],
    [],
  );

  const filtrados = useMemo(
    () =>
      servicos.filter(
        (servico) =>
          matchText(q, servico.nome, servico.categoria, servico.secretaria, servico.canal) &&
          matchSelect(servico.categoria, categoria) &&
          matchSelect(servico.status, status),
      ),
    [q, categoria, status],
  );

  const ativos = [q !== '', categoria !== 'todas', status !== 'todos'].filter(Boolean).length;
  const atendimentos = filtrados.reduce((total, servico) => total + servico.atendimentosMes, 0);
  const prazoMedio = filtrados.length > 0 ? filtrados.reduce((total, s) => total + s.prazoDias, 0) / filtrados.length : 0;

  const colunas: Column<ServicoMunicipal>[] = [
    {
      key: 'nome',
      header: 'Serviço',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.nome}</p>
          <p className="text-[11px] text-slate-500">{row.categoria}</p>
        </div>
      ),
    },
    {
      key: 'secretaria',
      header: 'Responsável',
      render: (row) => <span className="text-slate-700">{row.secretaria}</span>,
    },
    {
      key: 'canal',
      header: 'Canal',
      render: (row) => <span className="text-slate-700">{row.canal}</span>,
    },
    {
      key: 'prazoDias',
      header: 'Prazo',
      align: 'right',
      render: (row) => <span className="tabular text-slate-700">{row.prazoDias} dias</span>,
    },
    {
      key: 'atendimentosMes',
      header: 'Atendimentos/mês',
      align: 'right',
      render: (row) => <span className="tabular text-slate-700">{formatNumber(row.atendimentosMes)}</span>,
    },
    {
      key: 'status',
      header: 'Situação',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Atendimento ao cidadão"
        title="Serviços Municipais"
        description="Catálogo de serviços prestados pela prefeitura com canal de atendimento, prazo estimado e volume mensal. Use a busca para localizar rapidamente o serviço que você precisa."
        icon={<IconWrench size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Catálogo, prazos e volumes são fictícios. Para solicitar um serviço real, procure os canais oficiais da
          Prefeitura de Casimiro de Abreu.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Serviços catalogados" value={formatNumber(servicos.length)} hint="Base fictícia" tone="brand" />
        <StatCard label="Resultado do filtro" value={formatNumber(filtrados.length)} hint="Serviços exibidos" tone="info" />
        <StatCard label="Atendimentos/mês" value={formatNumber(atendimentos)} hint="Somando o filtro atual" tone="success" />
        <StatCard label="Prazo médio" value={`${formatNumber(prazoMedio)} dias`} hint="Média dos serviços filtrados" tone="warning" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'categoria', 'status'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Serviço, canal, secretaria…" />
          <SelectFilter id="serv-categoria" label="Categoria" value={categoria} onChange={(value) => set('categoria', value)} options={categoriaOpcoes} />
          <SelectFilter id="serv-status" label="Status" value={status} onChange={(value) => set('status', value)} options={STATUS_OPCOES} />
        </FilterPanel>

        <SectionCard
          title="Catálogo de serviços"
          description="Canal, prazo e volume mensal declarados"
          className="lg:col-span-3"
          action={<ResultsCount shown={filtrados.length} total={servicos.length} label="serviços" />}
        >
          <DataTable
            rows={filtrados}
            columns={colunas}
            getRowKey={(row) => row.id}
            caption="Catálogo de serviços municipais fictícios"
            emptyTitle="Nenhum serviço encontrado"
            emptyDescription="Tente outro termo ou limpe os filtros aplicados."
            emptyAction={
              <button
                type="button"
                onClick={() => clear(['q', 'categoria', 'status'])}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
              >
                Limpar filtros
              </button>
            }
            renderMobile={(row) => (
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-slate-900">{row.nome}</p>
                  <StatusBadge status={row.status} />
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">{row.categoria} · {row.secretaria}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="neutral">{row.canal}</Badge>
                  <Badge tone="info">{row.prazoDias} dias</Badge>
                  <Badge tone="neutral">{formatNumber(row.atendimentosMes)}/mês</Badge>
                </div>
              </div>
            )}
          />
        </SectionCard>
      </div>
    </div>
  );
}
