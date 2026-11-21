/** Educação — escolas municipais, matrículas e indicadores. */
import { useMemo } from 'react';
import { escolas, indicadoresEducacao } from '@/data';
import { matchSelect, matchText, uniqueValues } from '@/lib/filters';
import { formatNumber, formatPercent } from '@/lib/format';
import { FilterPanel, ResultsCount, SearchInput, SelectFilter, useFilterParams } from '@/components/filters/Filters';
import { Badge, DemoNotice, EmptyState, PageHeader, SectionCard, StatCard } from '@/components/ui/primitives';
import { IconCap, IconPin } from '@/components/ui/icons';

export default function Educacao() {
  const { get, set, clear } = useFilterParams();
  const q = get('q');
  const bairro = get('bairro', 'todos');
  const etapa = get('etapa', 'todas');

  const bairroOpcoes = useMemo(
    () => [{ value: 'todos', label: 'Todos os bairros' }, ...uniqueValues(escolas.map((e) => e.bairro))],
    [],
  );
  const etapaOpcoes = useMemo(
    () => [{ value: 'todas', label: 'Todas as etapas' }, ...uniqueValues(escolas.map((e) => e.etapas))],
    [],
  );

  const filtradas = useMemo(
    () =>
      escolas.filter(
        (escola) =>
          matchText(q, escola.nome, escola.bairro, escola.etapas) &&
          matchSelect(escola.bairro, bairro) &&
          matchSelect(escola.etapas, etapa),
      ),
    [q, bairro, etapa],
  );

  const ativos = [q !== '', bairro !== 'todos', etapa !== 'todas'].filter(Boolean).length;
  const matriculas = filtradas.reduce((total, escola) => total + escola.matriculas, 0);
  const turmas = filtradas.reduce((total, escola) => total + escola.turmas, 0);
  const mediaAlunosTurma = turmas > 0 ? matriculas / turmas : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Rede municipal"
        title="Educação"
        description="Escolas municipais com bairro, etapa de ensino, matrículas, turmas, infraestrutura declarada e um IDEB fictício usado apenas para testar a interface."
        icon={<IconCap size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Nomes de escolas, matrículas e índices são fictícios. O IDEB exibido é gerado para demonstração e não
          corresponde a nenhuma escola real.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Escolas" value={formatNumber(escolas.length)} hint="Rede municipal fictícia" tone="brand" />
        <StatCard label="Matrículas" value={formatNumber(matriculas)} hint="Somando o filtro atual" tone="info" />
        <StatCard label="Turmas" value={formatNumber(turmas)} hint={`${formatNumber(mediaAlunosTurma)} alunos por turma`} tone="success" />
        <StatCard
          label="Bairros atendidos"
          value={formatNumber(new Set(escolas.map((e) => e.bairro)).size)}
          hint="Bairros com escola na base fictícia"
          tone="warning"
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'bairro', 'etapa'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Escola ou bairro…" />
          <SelectFilter id="edu-bairro" label="Bairro" value={bairro} onChange={(value) => set('bairro', value)} options={bairroOpcoes} />
          <SelectFilter id="edu-etapa" label="Etapa de ensino" value={etapa} onChange={(value) => set('etapa', value)} options={etapaOpcoes} />
        </FilterPanel>

        <div className="space-y-3 lg:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <ResultsCount shown={filtradas.length} total={escolas.length} label="escolas" />
          </div>

          {filtradas.length === 0 ? (
            <SectionCard title="Nenhuma escola encontrada">
              <EmptyState
                title="Sem resultados para este recorte"
                description="Ajuste a busca, o bairro ou a etapa de ensino."
                action={
                  <button
                    type="button"
                    onClick={() => clear(['q', 'bairro', 'etapa'])}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                  >
                    Limpar filtros
                  </button>
                }
                icon={<IconCap size={22} />}
              />
            </SectionCard>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {filtradas.map((escola) => (
                <article key={escola.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Badge tone="brand">{escola.etapas}</Badge>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      IDEB fictício {escola.idebFicticio === null ? '—' : escola.idebFicticio.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="mt-2 text-[13px] font-semibold leading-snug text-slate-900">{escola.nome}</h3>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <IconPin size={12} /> {escola.bairro}
                  </p>
                  <dl className="mt-2.5 grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2 text-[11px]">
                    <div>
                      <dt className="text-slate-500">Matrículas</dt>
                      <dd className="font-semibold text-slate-900 tabular">{formatNumber(escola.matriculas)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Turmas</dt>
                      <dd className="font-semibold text-slate-900 tabular">{formatNumber(escola.turmas)}</dd>
                    </div>
                  </dl>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {escola.infraestrutura.length > 0 ? (
                      escola.infraestrutura.map((item) => (
                        <span key={item} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400">Infraestrutura não declarada nesta base fictícia</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <SectionCard title="Indicadores de educação" description="Referências fictícias para leitura do setor">
            <ul className="space-y-2.5">
              {indicadoresEducacao.map((indicador) => (
                <li key={indicador.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[12px] font-semibold text-slate-900">{indicador.nome}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-brand-700 tabular">
                        {formatNumber(indicador.valor)}{' '}
                        <span className="text-[10px] font-medium text-slate-500">{indicador.unidade}</span>
                      </span>
                      <Badge tone={indicador.tendencia === 'alta' ? 'success' : indicador.tendencia === 'baixa' ? 'danger' : 'neutral'}>
                        tendência {indicador.tendencia}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{indicador.descricao}</p>
                  {indicador.meta !== null ? (
                    <p className="mt-1 text-[10px] font-medium text-slate-500">
                      Meta fictícia: {formatNumber(indicador.meta)} {indicador.unidade} ·{' '}
                      {formatPercent((indicador.valor / indicador.meta) * 100, 0)} da meta
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
