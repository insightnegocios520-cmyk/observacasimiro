/** Alertas — pontos de atenção gerados por regras, nunca conclusões de irregularidade. */
import { useMemo } from 'react';
import { ALERTAS_RESUMO, alertas } from '@/data';
import { matchSelect, matchText, uniqueValues } from '@/lib/filters';
import { formatDate, formatNumber } from '@/lib/format';
import { ChipFilter, FilterPanel, ResultsCount, SearchInput, SelectFilter, useFilterParams } from '@/components/filters/Filters';
import { Badge, Callout, DemoNotice, EmptyState, PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/ui/primitives';
import { IconAlert, IconBell } from '@/components/ui/icons';

const SEVERIDADE_OPCOES = [
  { value: 'todas', label: 'Todas' },
  { value: 'alta', label: 'Alta' },
  { value: 'média', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

const STATUS_OPCOES = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'aberto', label: 'Aberto' },
  { value: 'em verificação', label: 'Em verificação' },
  { value: 'encerrado', label: 'Encerrado' },
];

const SEVERIDADE_TONE: Record<string, 'danger' | 'warning' | 'info'> = {
  alta: 'danger',
  média: 'warning',
  baixa: 'info',
};

export default function Alertas() {
  const { get, set, clear } = useFilterParams();
  const q = get('q');
  const severidade = get('severidade', 'todas');
  const status = get('status', 'todos');
  const categoria = get('categoria', 'todas');

  const categoriaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as categorias' }, ...uniqueValues(alertas.map((a) => a.categoria))],
    [],
  );

  const filtrados = useMemo(
    () =>
      alertas.filter(
        (alerta) =>
          matchText(q, alerta.titulo, alerta.descricao, alerta.entidade, alerta.categoria, alerta.criterio) &&
          matchSelect(alerta.severidade, severidade) &&
          matchSelect(alerta.status, status) &&
          matchSelect(alerta.categoria, categoria),
      ),
    [q, severidade, status, categoria],
  );

  const ativos = [q !== '', severidade !== 'todas', status !== 'todos', categoria !== 'todas'].filter(Boolean).length;

  return (
    <div>
      <PageHeader
        eyebrow="Sinais para conferência"
        title="Alertas"
        description="Alertas são calculados por regras objetivas sobre os dados (por exemplo: aditivo acima de um limite, obra paralisada com pagamento elevado). Eles indicam onde olhar — nunca afirmam irregularidade."
        icon={<IconBell size={22} />}
      />

      <div className="mb-4 space-y-2.5">
        <DemoNotice>
          Os alertas abaixo são gerados sobre dados fictícios e servem apenas para demonstrar o mecanismo de
          monitoramento.
        </DemoNotice>
        <Callout tone="warning" title="Um alerta não é uma acusação" icon={<IconAlert size={18} />}>
          OBSERVA não conclui automaticamente que houve irregularidade. Todo alerta exige leitura do contrato, do
          processo e da publicação oficial, com contraditório garantido aos envolvidos.
        </Callout>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Alertas gerados" value={formatNumber(ALERTAS_RESUMO.total)} hint="Regras sobre a base fictícia" tone="brand" />
        <StatCard label="Severidade alta" value={formatNumber(ALERTAS_RESUMO.alta)} hint="Prioridade de leitura" tone="danger" />
        <StatCard label="Em aberto" value={formatNumber(ALERTAS_RESUMO.abertos)} hint="Ainda sem verificação" tone="warning" />
        <StatCard label="Encerrados" value={formatNumber(alertas.filter((a) => a.status === 'encerrado').length)} hint="Verificação concluída" tone="success" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'severidade', 'status', 'categoria'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Entidade, assunto, critério…" />
          <ChipFilter label="Severidade" options={SEVERIDADE_OPCOES} value={severidade} onChange={(value) => set('severidade', value)} />
          <SelectFilter id="alerta-status" label="Status" value={status} onChange={(value) => set('status', value)} options={STATUS_OPCOES} />
          <SelectFilter id="alerta-categoria" label="Categoria" value={categoria} onChange={(value) => set('categoria', value)} options={categoriaOpcoes} />
        </FilterPanel>

        <div className="lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <ResultsCount shown={filtrados.length} total={alertas.length} label="alertas" />
          </div>

          {filtrados.length === 0 ? (
            <SectionCard title="Nenhum alerta encontrado">
              <EmptyState
                title="Sem alertas para este recorte"
                description="Ajuste a severidade, o status ou limpe os filtros."
                action={
                  <button
                    type="button"
                    onClick={() => clear(['q', 'severidade', 'status', 'categoria'])}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                  >
                    Limpar filtros
                  </button>
                }
                icon={<IconBell size={22} />}
              />
            </SectionCard>
          ) : (
            <ul className="space-y-2.5">
              {filtrados.map((alerta) => (
                <li
                  key={alerta.id}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={SEVERIDADE_TONE[alerta.severidade] ?? 'neutral'}>severidade {alerta.severidade}</Badge>
                    <Badge tone="neutral">{alerta.categoria}</Badge>
                    <StatusBadge status={alerta.status} />
                    <span className="ml-auto text-[11px] text-slate-400">{formatDate(alerta.data)}</span>
                  </div>
                  <h3 className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-900">{alerta.titulo}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{alerta.descricao}</p>
                  <div className="mt-2 rounded-lg bg-slate-50 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Critério objetivo aplicado</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{alerta.criterio}</p>
                  </div>
                  <p className="mt-1.5 text-[10px] uppercase tracking-wide text-slate-400">Entidade: {alerta.entidade}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
