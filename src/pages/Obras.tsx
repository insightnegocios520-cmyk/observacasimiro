/** Obras — acompanhamento de execução física e financeira. */
import { useMemo, useState } from 'react';
import { OBRAS_RESUMO, obras } from '@/data';
import type { Obra } from '@/data';
import { matchSelect, matchText, uniqueValues } from '@/lib/filters';
import { formatBRL, formatBRLCompact, formatDate, formatNumber, formatPercent } from '@/lib/format';
import { ChipFilter, FilterPanel, ResultsCount, SearchInput, SelectFilter, useFilterParams } from '@/components/filters/Filters';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/primitives';
import { Badge, DemoNotice, EmptyState, KeyValueGrid, PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/ui/primitives';
import { IconHardHat, IconPin } from '@/components/ui/icons';

const STATUS_OPCOES = [
  { value: 'todas', label: 'Todas as situações' },
  { value: 'em execução', label: 'Em execução' },
  { value: 'paralisada', label: 'Paralisada' },
  { value: 'concluída', label: 'Concluída' },
  { value: 'licitada', label: 'Licitada' },
];

export default function Obras() {
  const { get, set, clear } = useFilterParams();
  const [selecionada, setSelecionada] = useState<Obra | null>(null);

  const q = get('q');
  const secretaria = get('secretaria', 'todas');
  const status = get('status', 'todas');
  const bairro = get('bairro', 'todos');

  const secretariaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as secretarias' }, ...uniqueValues(obras.map((o) => o.secretaria))],
    [],
  );
  const bairroOpcoes = useMemo(
    () => [{ value: 'todos', label: 'Todos os bairros' }, ...uniqueValues(obras.map((o) => o.bairro))],
    [],
  );

  const filtradas = useMemo(
    () =>
      obras.filter(
        (obra) =>
          matchText(q, obra.nome, obra.descricao, obra.bairro, obra.empresa, obra.secretaria) &&
          matchSelect(obra.secretaria, secretaria) &&
          matchSelect(obra.status, status) &&
          matchSelect(obra.bairro, bairro),
      ),
    [q, secretaria, status, bairro],
  );

  const ativos = [q !== '', secretaria !== 'todas', status !== 'todas', bairro !== 'todos'].filter(Boolean).length;
  const valorFiltrado = filtradas.reduce((total, obra) => total + obra.valorContratado, 0);
  const pagoFiltrado = filtradas.reduce((total, obra) => total + obra.valorPago, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Infraestrutura"
        title="Obras"
        description="Obras municipais com empresa responsável, bairro, valores contratado e pago, percentual de execução e prazo previsto. Compare o avanço físico com o avanço financeiro."
        icon={<IconHardHat size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Obras, empresas e percentuais são fictícios. Para fiscalizar uma obra real, consulte o painel de obras do
          município e o contrato correspondente na fonte oficial.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Obras cadastradas" value={formatNumber(OBRAS_RESUMO.total)} hint={`${OBRAS_RESUMO.emExecucao} em execução`} tone="brand" />
        <StatCard label="Paralisadas" value={formatNumber(OBRAS_RESUMO.paralisadas)} hint="Exigem acompanhamento" tone="danger" />
        <StatCard label="Valor contratado" value={formatBRLCompact(OBRAS_RESUMO.valorContratado)} hint={`Pago ${formatBRLCompact(OBRAS_RESUMO.valorPago)}`} tone="info" />
        <StatCard label="Concluídas" value={formatNumber(OBRAS_RESUMO.concluidas)} hint="Entrega registrada na base fictícia" tone="success" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'secretaria', 'status', 'bairro'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Obra, bairro, empresa…" />
          <SelectFilter id="obra-secretaria" label="Secretaria" value={secretaria} onChange={(value) => set('secretaria', value)} options={secretariaOpcoes} />
          <SelectFilter id="obra-bairro" label="Bairro" value={bairro} onChange={(value) => set('bairro', value)} options={bairroOpcoes} />
          <ChipFilter label="Situação" options={STATUS_OPCOES} value={status} onChange={(value) => set('status', value)} />
        </FilterPanel>

        <div className="lg:col-span-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <ResultsCount shown={filtradas.length} total={obras.length} label="obras" />
            <p className="text-[11px] text-slate-600">
              Filtro atual: <strong className="text-slate-900 tabular">{formatBRLCompact(valorFiltrado)}</strong> contratados
              · <strong className="text-slate-900 tabular">{formatBRLCompact(pagoFiltrado)}</strong> pagos
            </p>
          </div>

          {filtradas.length === 0 ? (
            <SectionCard title="Nenhuma obra encontrada">
              <EmptyState
                title="Sem resultados para este recorte"
                description="Tente outro bairro, outra secretaria ou limpe os filtros aplicados."
                action={
                  <button
                    type="button"
                    onClick={() => clear(['q', 'secretaria', 'status', 'bairro'])}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                  >
                    Limpar filtros
                  </button>
                }
                icon={<IconHardHat size={22} />}
              />
            </SectionCard>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {filtradas.map((obra) => (
                <button
                  key={obra.id}
                  type="button"
                  onClick={() => setSelecionada(obra)}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <StatusBadge status={obra.status} />
                    <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{obra.secretaria}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-slate-900">{obra.nome}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <IconPin size={12} /> {obra.bairro}
                  </p>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-slate-500">
                      <span>Execução física</span>
                      <span className="tabular text-slate-800">{formatPercent(obra.percentualExecucao, 0)}</span>
                    </div>
                    <ProgressBar
                      value={obra.percentualExecucao}
                      tone={obra.status === 'paralisada' ? 'danger' : obra.status === 'concluída' ? 'success' : 'brand'}
                    />
                  </div>
                  <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-2.5">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Contratado</p>
                      <p className="text-[12px] font-semibold text-slate-900 tabular">{formatBRLCompact(obra.valorContratado)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Pago</p>
                      <p className="text-[12px] font-semibold text-slate-900 tabular">{formatBRLCompact(obra.valorPago)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={selecionada !== null}
        onClose={() => setSelecionada(null)}
        title={selecionada?.nome ?? 'Obra'}
        subtitle={selecionada ? `${selecionada.bairro} · ${selecionada.secretaria}` : undefined}
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
            <p className="text-[13px] leading-relaxed text-slate-700">{selecionada.descricao}</p>
            <KeyValueGrid
              items={[
                { label: 'Empresa responsável', value: selecionada.empresa },
                { label: 'Bairro', value: selecionada.bairro },
                { label: 'Valor contratado', value: formatBRL(selecionada.valorContratado) },
                { label: 'Valor pago', value: formatBRL(selecionada.valorPago) },
                { label: 'Início', value: formatDate(selecionada.inicio) },
                { label: 'Previsão de fim', value: formatDate(selecionada.previsaoFim) },
                { label: 'Situação', value: <StatusBadge status={selecionada.status} /> },
              ]}
            />
            <div>
              <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-600">
                <span>Execução física</span>
                <span className="tabular text-slate-900">{formatPercent(selecionada.percentualExecucao, 1)}</span>
              </div>
              <ProgressBar
                value={selecionada.percentualExecucao}
                tone={selecionada.status === 'paralisada' ? 'danger' : selecionada.status === 'concluída' ? 'success' : 'brand'}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge tone="neutral">
                Pago sobre contratado: {formatPercent((selecionada.valorPago / selecionada.valorContratado) * 100, 0)}
              </Badge>
              <Badge tone="info">Bairro: {selecionada.bairro}</Badge>
            </div>
            <p className="rounded-lg bg-slate-50 p-2.5 text-[11px] leading-relaxed text-slate-500">
              Diferenças entre execução física e financeira não são, por si, irregularidade: podem refletir medições,
              retenções técnicas ou cronograma de desembolso.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
