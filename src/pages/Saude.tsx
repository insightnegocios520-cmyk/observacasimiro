/** Saúde — unidades de atendimento e indicadores do setor. */
import { useMemo } from 'react';
import { indicadoresSaude, unidadesSaude } from '@/data';
import { matchSelect, matchText, uniqueValues } from '@/lib/filters';
import { formatNumber, formatPercent } from '@/lib/format';
import { FilterPanel, ResultsCount, SearchInput, SelectFilter, useFilterParams } from '@/components/filters/Filters';
import { Badge, DemoNotice, EmptyState, PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/ui/primitives';
import { IconHeart, IconPin } from '@/components/ui/icons';

const TIPOS_OPCOES = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'UBS', label: 'UBS' },
  { value: 'Hospital', label: 'Hospital' },
  { value: 'CAPS', label: 'CAPS' },
  { value: 'CEO', label: 'CEO' },
  { value: 'Vigilância em Saúde', label: 'Vigilância em Saúde' },
];

export default function Saude() {
  const { get, set, clear } = useFilterParams();
  const q = get('q');
  const tipo = get('tipo', 'todos');
  const bairro = get('bairro', 'todos');

  const bairroOpcoes = useMemo(
    () => [{ value: 'todos', label: 'Todos os bairros' }, ...uniqueValues(unidadesSaude.map((u) => u.bairro))],
    [],
  );

  const filtradas = useMemo(
    () =>
      unidadesSaude.filter(
        (unidade) =>
          matchText(q, unidade.nome, unidade.bairro, unidade.tipo) &&
          matchSelect(unidade.tipo, tipo) &&
          matchSelect(unidade.bairro, bairro),
      ),
    [q, tipo, bairro],
  );

  const ativos = [q !== '', tipo !== 'todos', bairro !== 'todos'].filter(Boolean).length;
  const atendimentos = filtradas.reduce((total, unidade) => total + unidade.atendimentosMes, 0);
  const equipes = filtradas.reduce((total, unidade) => total + unidade.equipes, 0);
  const emFuncionamento = unidadesSaude.filter((u) => u.status === 'em funcionamento').length;

  return (
    <div>
      <PageHeader
        eyebrow="Serviços de saúde"
        title="Saúde"
        description="Unidades municipais de saúde com tipo, bairro, equipes e atendimentos mensais, além de indicadores do setor. Quantidade de equipe e atendimentos ajuda a comparar cobertura entre bairros."
        icon={<IconHeart size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Unidades, equipes e indicadores são fictícios. Nenhum dado assistencial real é exibido nesta versão.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Unidades cadastradas" value={formatNumber(unidadesSaude.length)} hint={`${emFuncionamento} em funcionamento`} tone="brand" />
        <StatCard label="Atendimentos/mês" value={formatNumber(atendimentos)} hint="Somando o filtro atual" tone="info" />
        <StatCard label="Equipes" value={formatNumber(equipes)} hint="Equipes vinculadas às unidades filtradas" tone="success" />
        <StatCard
          label="Cobertura de bairros"
          value={formatNumber(new Set(unidadesSaude.map((u) => u.bairro)).size)}
          hint="Bairros com alguma unidade na base fictícia"
          tone="warning"
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'tipo', 'bairro'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Unidade ou bairro…" />
          <SelectFilter id="saude-tipo" label="Tipo de unidade" value={tipo} onChange={(value) => set('tipo', value)} options={TIPOS_OPCOES} />
          <SelectFilter id="saude-bairro" label="Bairro" value={bairro} onChange={(value) => set('bairro', value)} options={bairroOpcoes} />
        </FilterPanel>

        <div className="space-y-3 lg:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <ResultsCount shown={filtradas.length} total={unidadesSaude.length} label="unidades" />
          </div>

          {filtradas.length === 0 ? (
            <SectionCard title="Nenhuma unidade encontrada">
              <EmptyState
                title="Sem resultados para este recorte"
                description="Tente outro bairro, outro tipo de unidade ou limpe os filtros."
                action={
                  <button
                    type="button"
                    onClick={() => clear(['q', 'tipo', 'bairro'])}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                  >
                    Limpar filtros
                  </button>
                }
                icon={<IconHeart size={22} />}
              />
            </SectionCard>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {filtradas.map((unidade) => (
                <article key={unidade.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Badge tone="brand">{unidade.tipo}</Badge>
                    <StatusBadge status={unidade.status} />
                  </div>
                  <h3 className="mt-2 text-[13px] font-semibold leading-snug text-slate-900">{unidade.nome}</h3>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <IconPin size={12} /> {unidade.bairro}
                  </p>
                  <dl className="mt-2.5 grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2 text-[11px]">
                    <div>
                      <dt className="text-slate-500">Equipes</dt>
                      <dd className="font-semibold text-slate-900 tabular">{formatNumber(unidade.equipes)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Atendimentos/mês</dt>
                      <dd className="font-semibold text-slate-900 tabular">{formatNumber(unidade.atendimentosMes)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}

          <SectionCard title="Indicadores de saúde" description="Referências fictícias para leitura do setor">
            <ul className="space-y-2.5">
              {indicadoresSaude.map((indicador) => (
                <li key={indicador.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[12px] font-semibold text-slate-900">{indicador.nome}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-brand-700 tabular">
                        {formatNumber(indicador.valor)} <span className="text-[10px] font-medium text-slate-500">{indicador.unidade}</span>
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
