/** Licitações — processos de compra, modalidade, participantes e resultado. */
import { useMemo, useState } from 'react';
import { MODALIDADES_LICITACAO, licitacoes } from '@/data';
import type { Licitacao } from '@/data';
import { matchSelect, matchText, uniqueValues, uniqueYears } from '@/lib/filters';
import { formatBRL, formatBRLCompact, formatDate, formatNumber } from '@/lib/format';
import {
  FilterPanel,
  ResultsCount,
  SearchInput,
  SelectFilter,
  useFilterParams,
} from '@/components/filters/Filters';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { DemoNotice, KeyValueGrid, PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/ui/primitives';
import { IconGavel } from '@/components/ui/icons';

const STATUS_OPCOES = [
  { value: 'todas', label: 'Todos os status' },
  { value: 'aberta', label: 'Aberta' },
  { value: 'em andamento', label: 'Em andamento' },
  { value: 'homologada', label: 'Homologada' },
  { value: 'deserta', label: 'Deserta' },
  { value: 'revogada', label: 'Revogada' },
];

export default function Licitacoes() {
  const { get, set, clear } = useFilterParams();
  const [selecionada, setSelecionada] = useState<Licitacao | null>(null);

  const q = get('q');
  const modalidade = get('modalidade', 'todas');
  const status = get('status', 'todas');
  const secretaria = get('secretaria', 'todas');
  const ano = get('ano');

  const secretariaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as secretarias' }, ...uniqueValues(licitacoes.map((l) => l.secretaria))],
    [],
  );
  const modalidadeOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as modalidades' }, ...uniqueValues(MODALIDADES_LICITACAO)],
    [],
  );
  const anoOpcoes = useMemo(
    () => [{ value: '', label: 'Todos os anos' }, ...uniqueYears(licitacoes.map((l) => l.dataAbertura))],
    [],
  );

  const filtradas = useMemo(
    () =>
      licitacoes.filter(
        (item) =>
          matchText(q, item.numero, item.objeto, item.secretaria, item.modalidade) &&
          matchSelect(item.modalidade, modalidade) &&
          matchSelect(item.status, status) &&
          matchSelect(item.secretaria, secretaria) &&
          (!ano || item.dataAbertura.startsWith(ano)),
      ),
    [q, modalidade, status, secretaria, ano],
  );

  const ativos = [q !== '', modalidade !== 'todas', status !== 'todas', secretaria !== 'todas', ano !== ''].filter(Boolean).length;
  const valorEstimado = filtradas.reduce((total, item) => total + item.valorEstimado, 0);
  const contratosGerados = filtradas.reduce((total, item) => total + item.contratosGerados, 0);

  const colunas: Column<Licitacao>[] = [
    {
      key: 'numero',
      header: 'Processo',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.numero}</p>
          <p className="text-[11px] text-slate-500">{row.modalidade}</p>
        </div>
      ),
    },
    {
      key: 'objeto',
      header: 'Objeto',
      render: (row) => <span className="line-clamp-2 max-w-sm text-slate-700">{row.objeto}</span>,
    },
    {
      key: 'secretaria',
      header: 'Secretaria',
      render: (row) => <span className="text-slate-700">{row.secretaria}</span>,
    },
    {
      key: 'valorEstimado',
      header: 'Valor estimado',
      align: 'right',
      render: (row) => <span className="font-medium tabular text-slate-900">{formatBRL(row.valorEstimado)}</span>,
    },
    {
      key: 'dataAbertura',
      header: 'Abertura',
      align: 'right',
      render: (row) => <span className="whitespace-nowrap tabular text-slate-600">{formatDate(row.dataAbertura)}</span>,
    },
    {
      key: 'participantes',
      header: 'Participantes',
      align: 'right',
      render: (row) => <span className="tabular text-slate-700">{row.participantes}</span>,
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
        eyebrow="Compras públicas"
        title="Licitações"
        description="Processos licitatórios com modalidade, valor estimado, número de participantes e contratos gerados. A ausência de participantes ou a repetição de fornecedores são pistas para conferência — nunca prova de irregularidade."
        icon={<IconGavel size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Processos, valores e contagens são fictícios. Nenhuma licitação real de Casimiro de Abreu está representada
          nesta versão.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Processos na base" value={formatNumber(licitacoes.length)} hint="Base fictícia" />
        <StatCard label="Resultado do filtro" value={formatNumber(filtradas.length)} hint={`${formatBRLCompact(valorEstimado)} estimados`} tone="info" />
        <StatCard label="Homologadas" value={formatNumber(licitacoes.filter((l) => l.status === 'homologada').length)} hint="Com contrato gerado" tone="success" />
        <StatCard label="Contratos gerados" value={formatNumber(contratosGerados)} hint="Somando o filtro atual" tone="warning" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'modalidade', 'status', 'secretaria', 'ano'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Número, objeto, secretaria…" />
          <SelectFilter id="lic-modalidade" label="Modalidade" value={modalidade} onChange={(value) => set('modalidade', value)} options={modalidadeOpcoes} />
          <SelectFilter id="lic-status" label="Status" value={status} onChange={(value) => set('status', value)} options={STATUS_OPCOES} />
          <SelectFilter id="lic-secretaria" label="Secretaria" value={secretaria} onChange={(value) => set('secretaria', value)} options={secretariaOpcoes} />
          <SelectFilter id="lic-ano" label="Ano de abertura" value={ano} onChange={(value) => set('ano', value)} options={anoOpcoes} />
        </FilterPanel>

        <SectionCard
          title="Processos licitatórios"
          description="Toque em um processo para ver o detalhe"
          className="lg:col-span-3"
          action={<ResultsCount shown={filtradas.length} total={licitacoes.length} label="processos" />}
        >
          <DataTable
            rows={filtradas}
            columns={colunas}
            getRowKey={(row) => row.id}
            onRowClick={(row) => setSelecionada(row)}
            caption="Processos licitatórios fictícios"
            emptyTitle="Nenhum processo encontrado"
            emptyDescription="Ajuste a busca ou limpe os filtros para ver todos os processos."
            emptyAction={
              <button
                type="button"
                onClick={() => clear(['q', 'modalidade', 'status', 'secretaria', 'ano'])}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
              >
                Limpar filtros
              </button>
            }
            renderMobile={(row) => (
              <button
                type="button"
                onClick={() => setSelecionada(row)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-brand-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12px] font-semibold text-slate-900">{row.numero}</span>
                  <StatusBadge status={row.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-700">{row.objeto}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{row.modalidade}</span>
                  <span className="font-semibold text-slate-900 tabular">{formatBRLCompact(row.valorEstimado)}</span>
                </div>
              </button>
            )}
          />
        </SectionCard>
      </div>

      <Modal
        open={selecionada !== null}
        onClose={() => setSelecionada(null)}
        title={selecionada ? `Processo ${selecionada.numero}` : 'Licitação'}
        subtitle={selecionada?.modalidade}
        size="md"
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">Registro fictício</span>
            <button
              type="button"
              onClick={() => setSelecionada(null)}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-slate-800"
            >
              Fechar
            </button>
          </div>
        }
      >
        {selecionada ? (
          <div className="space-y-3">
            <p className="text-[13px] leading-relaxed text-slate-700">{selecionada.objeto}</p>
            <KeyValueGrid
              items={[
                { label: 'Secretaria', value: selecionada.secretaria },
                { label: 'Modalidade', value: selecionada.modalidade },
                { label: 'Valor estimado', value: formatBRL(selecionada.valorEstimado) },
                { label: 'Data de abertura', value: formatDate(selecionada.dataAbertura) },
                { label: 'Participantes', value: formatNumber(selecionada.participantes) },
                { label: 'Contratos gerados', value: formatNumber(selecionada.contratosGerados) },
                { label: 'Situação', value: <StatusBadge status={selecionada.status} /> },
              ]}
            />
            {selecionada.participantes <= 1 ? (
              <p className="rounded-lg bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-900">
                Processo com apenas {selecionada.participantes} participante(s) na base fictícia. Poucos participantes
                podem ser legítimos (mercado restrito), mas merecem conferência do edital e da justificativa de preço.
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
