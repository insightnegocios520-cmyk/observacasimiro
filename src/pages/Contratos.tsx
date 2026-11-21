/** Contratos — lista filtrável com detalhe em modal e exportação CSV. */
import { useMemo, useState } from 'react';
import { CATEGORIAS_CONTRATO, contratos } from '@/data';
import type { Contrato } from '@/data';
import { faixaValorOptions, matchFaixa, matchSelect, matchText, uniqueValues, uniqueYears } from '@/lib/filters';
import { downloadFile, formatBRL, formatBRLCompact, formatDate, formatNumber, formatPercent, toCSV } from '@/lib/format';
import {
  ChipFilter,
  FilterPanel,
  ResultsCount,
  SearchInput,
  SelectFilter,
  useFilterParams,
} from '@/components/filters/Filters';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import {
  Badge,
  DemoNotice,
  EmptyState,
  KeyValueGrid,
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from '@/components/ui/primitives';
import { IconDownload, IconFile } from '@/components/ui/icons';

const STATUS_OPCOES = [
  { value: 'todas', label: 'Todos os status' },
  { value: 'vigente', label: 'Vigente' },
  { value: 'aditado', label: 'Com aditivo' },
  { value: 'suspenso', label: 'Suspenso' },
  { value: 'encerrado', label: 'Encerrado' },
];

export default function Contratos() {
  const { get, set, clear } = useFilterParams();
  const [selecionado, setSelecionado] = useState<Contrato | null>(null);

  const q = get('q');
  const secretaria = get('secretaria', 'todas');
  const status = get('status', 'todas');
  const categoria = get('categoria', 'todas');
  const faixa = get('faixa', 'todas');
  const ano = get('ano');

  const secretariaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as secretarias' }, ...uniqueValues(contratos.map((c) => c.secretaria))],
    [],
  );
  const categoriaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as categorias' }, ...uniqueValues(CATEGORIAS_CONTRATO)],
    [],
  );
  const anoOpcoes = useMemo(
    () => [{ value: '', label: 'Todos os anos' }, ...uniqueYears(contratos.map((c) => c.dataAssinatura))],
    [],
  );

  const filtrados = useMemo(
    () =>
      contratos.filter(
        (contrato) =>
          matchText(q, contrato.numero, contrato.objeto, contrato.fornecedor, contrato.secretaria, contrato.categoria) &&
          matchSelect(contrato.secretaria, secretaria) &&
          matchSelect(contrato.status, status) &&
          matchSelect(contrato.categoria, categoria) &&
          matchFaixa(contrato.valor, faixa) &&
          (!ano || contrato.dataAssinatura.startsWith(ano)),
      ),
    [q, secretaria, status, categoria, faixa, ano],
  );

  const ativos = [q !== '', secretaria !== 'todas', status !== 'todas', categoria !== 'todas', faixa !== 'todas', ano !== ''].filter(Boolean).length;
  const valorFiltrado = filtrados.reduce((total, contrato) => total + contrato.valor, 0);
  const comAditivo = contratos.filter((contrato) => contrato.aditivos > 0).length;

  const colunas: Column<Contrato>[] = [
    {
      key: 'numero',
      header: 'Contrato',
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{row.numero}</p>
          <p className="text-[11px] text-slate-500">{row.modalidade}</p>
        </div>
      ),
    },
    {
      key: 'objeto',
      header: 'Objeto',
      render: (row) => <span className="line-clamp-2 max-w-xs text-slate-700">{row.objeto}</span>,
    },
    {
      key: 'fornecedor',
      header: 'Fornecedor',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-slate-800">{row.fornecedor}</p>
          <p className="text-[11px] text-slate-400">{row.cnpjFicticio}</p>
        </div>
      ),
    },
    {
      key: 'secretaria',
      header: 'Secretaria',
      render: (row) => <span className="text-slate-700">{row.secretaria}</span>,
    },
    {
      key: 'valor',
      header: 'Valor',
      align: 'right',
      render: (row) => <span className="font-medium tabular text-slate-900">{formatBRL(row.valor)}</span>,
    },
    {
      key: 'vigencia',
      header: 'Vigência',
      align: 'right',
      render: (row) => <span className="whitespace-nowrap tabular text-slate-600">{formatDate(row.vigenciaFim)}</span>,
    },
    {
      key: 'status',
      header: 'Situação',
      render: (row) => (
        <div className="flex flex-col items-start gap-1">
          <StatusBadge status={row.status} />
          {row.aditivos > 0 ? <Badge tone="info">+{row.aditivos} aditivo(s)</Badge> : null}
        </div>
      ),
    },
  ];

  const exportar = () => {
    const csv = toCSV(
      ['Número', 'Objeto', 'Fornecedor', 'CNPJ (fictício)', 'Secretaria', 'Categoria', 'Modalidade', 'Valor (R$)', 'Assinatura', 'Vigência fim', 'Status', 'Aditivos', 'Percentual aditivo'],
      filtrados.map((c) => [
        c.numero,
        c.objeto,
        c.fornecedor,
        c.cnpjFicticio,
        c.secretaria,
        c.categoria,
        c.modalidade,
        c.valor,
        c.dataAssinatura,
        c.vigenciaFim,
        c.status,
        c.aditivos,
        c.percentualAditivo,
      ]),
    );
    downloadFile('observa-contratos-ficticios.csv', csv, 'text/csv;charset=utf-8');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Compras públicas"
        title="Contratos"
        description="Contratos administrativos com objeto, fornecedor, valor, vigência e aditivos. Use os filtros para recortar por secretaria, categoria, faixa de valor ou ano de assinatura."
        icon={<IconFile size={22} />}
        actions={
          <button
            type="button"
            onClick={exportar}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <IconDownload size={15} /> Exportar {filtrados.length} registro(s)
          </button>
        }
      />

      <div className="mb-4">
        <DemoNotice>
          Empresas, CNPJs e valores são <strong>fictícios</strong> e gerados para testar a interface. Os CNPJs usam raiz
          inválida (00) justamente para não confundir com empresas reais.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Contratos na base" value={formatNumber(contratos.length)} hint="Base fictícia completa" />
        <StatCard label="Resultado do filtro" value={formatNumber(filtrados.length)} hint={`${formatBRLCompact(valorFiltrado)} em valor`} tone="info" />
        <StatCard label="Vigentes" value={formatNumber(contratos.filter((c) => c.status === 'vigente').length)} hint="Contratos ativos" tone="success" />
        <StatCard label="Com aditivo" value={formatNumber(comAditivo)} hint="Alterações contratuais" tone="warning" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'secretaria', 'status', 'categoria', 'faixa', 'ano'])} className="lg:col-span-1">
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Objeto, número, fornecedor…" />
          <SelectFilter id="contrato-secretaria" label="Secretaria" value={secretaria} onChange={(value) => set('secretaria', value)} options={secretariaOpcoes} />
          <SelectFilter id="contrato-status" label="Status" value={status} onChange={(value) => set('status', value)} options={STATUS_OPCOES} />
          <SelectFilter id="contrato-categoria" label="Categoria" value={categoria} onChange={(value) => set('categoria', value)} options={categoriaOpcoes} />
          <SelectFilter id="contrato-faixa" label="Faixa de valor" value={faixa} onChange={(value) => set('faixa', value)} options={faixaValorOptions()} />
          <SelectFilter id="contrato-ano" label="Ano de assinatura" value={ano} onChange={(value) => set('ano', value)} options={anoOpcoes} />
        </FilterPanel>

        <SectionCard
          title="Contratos administrativos"
          description="Toque em um registro para ver todos os campos"
          className="lg:col-span-3"
          action={<ResultsCount shown={filtrados.length} total={contratos.length} label="contratos" />}
        >
          <DataTable
            rows={filtrados}
            columns={colunas}
            getRowKey={(row) => row.id}
            onRowClick={(row) => setSelecionado(row)}
            caption="Lista de contratos administrativos fictícios"
            emptyTitle="Nenhum contrato encontrado"
            emptyDescription="Tente outro termo ou limpe os filtros aplicados."
            emptyAction={
              <button
                type="button"
                onClick={() => clear(['q', 'secretaria', 'status', 'categoria', 'faixa', 'ano'])}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
              >
                Limpar filtros
              </button>
            }
            renderMobile={(row) => (
              <button
                type="button"
                onClick={() => setSelecionado(row)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-brand-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12px] font-semibold text-slate-900">{row.numero}</span>
                  <StatusBadge status={row.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-700">{row.objeto}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="min-w-0 truncate">{row.fornecedor}</span>
                  <span className="shrink-0 font-semibold text-slate-900 tabular">{formatBRLCompact(row.valor)}</span>
                </div>
              </button>
            )}
          />
        </SectionCard>
      </div>

      <Modal
        open={selecionado !== null}
        onClose={() => setSelecionado(null)}
        title={selecionado ? `Contrato ${selecionado.numero}` : 'Contrato'}
        subtitle={selecionado ? `${selecionado.secretaria} · ${selecionado.categoria}` : undefined}
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">Registro fictício</span>
            <button
              type="button"
              onClick={() => setSelecionado(null)}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-slate-800"
            >
              Fechar
            </button>
          </div>
        }
      >
        {selecionado ? (
          <div className="space-y-3">
            <p className="text-[13px] leading-relaxed text-slate-700">{selecionado.objeto}</p>
            <KeyValueGrid
              items={[
                { label: 'Fornecedor', value: selecionado.fornecedor },
                { label: 'CNPJ (fictício)', value: selecionado.cnpjFicticio },
                { label: 'Modalidade', value: selecionado.modalidade },
                { label: 'Categoria', value: selecionado.categoria },
                { label: 'Valor do contrato', value: formatBRL(selecionado.valor) },
                { label: 'Aditivos', value: `${selecionado.aditivos} · ${formatPercent(selecionado.percentualAditivo, 1)} do valor` },
                { label: 'Assinatura', value: formatDate(selecionado.dataAssinatura) },
                { label: 'Vigência final', value: formatDate(selecionado.vigenciaFim) },
                { label: 'Licitação vinculada', value: selecionado.licitacaoId ?? 'Não vinculada nesta base' },
                { label: 'Situação', value: <StatusBadge status={selecionado.status} /> },
              ]}
            />
            {selecionado.percentualAditivo > 20 ? (
              <EmptyState
                title="Aditivo acima de 20% do valor original"
                description="Este é apenas um padrão para conferência documental: verifique a justificativa, a base legal e o objeto alterado antes de qualquer conclusão."
                icon={<IconFile size={22} />}
              />
            ) : null}
            <p className="rounded-lg bg-slate-50 p-2.5 text-[11px] leading-relaxed text-slate-500">
              OBSERVA não classifica contratos como irregulares. A plataforma organiza dados públicos para que qualquer
              cidadão possa conferir documentos na fonte oficial.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
