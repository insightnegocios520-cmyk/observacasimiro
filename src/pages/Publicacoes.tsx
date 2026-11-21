/** Publicações Oficiais — atos, decretos, portarias e editais (dados fictícios). */
import { useMemo, useState } from 'react';
import { TIPOS_PUBLICACAO, publicacoes } from '@/data';
import type { Publicacao } from '@/data';
import { matchSelect, matchText, uniqueValues, uniqueYears } from '@/lib/filters';
import { formatDate, formatDateLong } from '@/lib/format';
import {
  ChipFilter,
  FilterPanel,
  ResultsCount,
  SearchInput,
  SelectFilter,
  useFilterParams,
} from '@/components/filters/Filters';
import { Modal } from '@/components/ui/Modal';
import { Badge, Callout, DemoNotice, EmptyState, KeyValueGrid, PageHeader, SectionCard, StatCard } from '@/components/ui/primitives';
import { IconNewspaper } from '@/components/ui/icons';

const TIPO_TONE: Record<string, 'brand' | 'info' | 'success' | 'warning' | 'neutral'> = {
  Decreto: 'brand',
  Portaria: 'info',
  Edital: 'success',
  'Lei Municipal': 'warning',
  'Aviso de Licitação': 'neutral',
  'Resultado de Licitação': 'neutral',
};

export default function Publicacoes() {
  const { get, set, clear } = useFilterParams();
  const [selecionada, setSelecionada] = useState<Publicacao | null>(null);

  const q = get('q');
  const tipo = get('tipo', 'todos');
  const orgao = get('orgao', 'todos');
  const ano = get('ano');

  const tipoOpcoes = useMemo(
    () => [{ value: 'todos', label: 'Todos os tipos' }, ...uniqueValues(TIPOS_PUBLICACAO)],
    [],
  );
  const orgaoOpcoes = useMemo(
    () => [{ value: 'todos', label: 'Todos os órgãos' }, ...uniqueValues(publicacoes.map((p) => p.orgao))],
    [],
  );
  const anoOpcoes = useMemo(
    () => [{ value: '', label: 'Todos os anos' }, ...uniqueYears(publicacoes.map((p) => p.data))],
    [],
  );

  const filtradas = useMemo(
    () =>
      publicacoes
        .filter(
          (publicacao) =>
            matchText(q, publicacao.titulo, publicacao.resumo, publicacao.numero, publicacao.orgao, publicacao.tipo) &&
            matchSelect(publicacao.tipo, tipo) &&
            matchSelect(publicacao.orgao, orgao) &&
            (!ano || publicacao.data.startsWith(ano)),
        )
        .sort((a, b) => (a.data < b.data ? 1 : -1)),
    [q, tipo, orgao, ano],
  );

  const ativos = [q !== '', tipo !== 'todos', orgao !== 'todos', ano !== ''].filter(Boolean).length;

  return (
    <div>
      <PageHeader
        eyebrow="Diário oficial"
        title="Publicações Oficiais"
        description="Atos administrativos, decretos, portarias, editais e resultados de licitação. Publicação oficial é onde o ato passa a existir juridicamente — é a fonte primária da fiscalização."
        icon={<IconNewspaper size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Textos, números e datas são fictícios e <strong>não foram publicados</strong>. Nenhum ato aqui descrito tem
          validade legal.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Publicações na base" value={String(publicacoes.length)} hint="Base fictícia" tone="brand" />
        <StatCard label="Resultado do filtro" value={String(filtradas.length)} hint="Documentos exibidos" tone="info" />
        <StatCard label="Decretos" value={String(publicacoes.filter((p) => p.tipo === 'Decreto').length)} hint="Atos do Executivo" tone="warning" />
        <StatCard label="Editais" value={String(publicacoes.filter((p) => p.tipo === 'Edital').length)} hint="Chamamentos públicos" tone="success" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-4">
        <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'tipo', 'orgao', 'ano'])}>
          <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Título, número, órgão…" />
          <SelectFilter id="pub-tipo" label="Tipo de ato" value={tipo} onChange={(value) => set('tipo', value)} options={tipoOpcoes} />
          <SelectFilter id="pub-orgao" label="Órgão" value={orgao} onChange={(value) => set('orgao', value)} options={orgaoOpcoes} />
          <SelectFilter id="pub-ano" label="Ano" value={ano} onChange={(value) => set('ano', value)} options={anoOpcoes} />
          <ChipFilter
            label="Atalhos"
            options={[
              { value: 'todos', label: 'Tudo' },
              { value: 'Decreto', label: 'Decretos' },
              { value: 'Edital', label: 'Editais' },
            ]}
            value={tipo}
            onChange={(value) => set('tipo', value)}
          />
        </FilterPanel>

        <div className="lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <ResultsCount shown={filtradas.length} total={publicacoes.length} label="publicações" />
            <span className="text-[11px] text-slate-500">Mais recentes primeiro</span>
          </div>

          {filtradas.length === 0 ? (
            <SectionCard title="Nenhuma publicação encontrada">
              <EmptyState
                title="Sem resultados para este recorte"
                description="Tente outro tipo de ato, outro órgão ou limpe os filtros."
                action={
                  <button
                    type="button"
                    onClick={() => clear(['q', 'tipo', 'orgao', 'ano'])}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                  >
                    Limpar filtros
                  </button>
                }
                icon={<IconNewspaper size={22} />}
              />
            </SectionCard>
          ) : (
            <ul className="space-y-2.5">
              {filtradas.map((publicacao) => (
                <li key={publicacao.id}>
                  <button
                    type="button"
                    onClick={() => setSelecionada(publicacao)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:border-brand-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={TIPO_TONE[publicacao.tipo] ?? 'neutral'}>{publicacao.tipo}</Badge>
                      <span className="text-[11px] font-medium text-slate-500">{publicacao.numero}</span>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-[11px] text-slate-500">{formatDate(publicacao.data)}</span>
                    </div>
                    <h3 className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-900">{publicacao.titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-slate-600">{publicacao.resumo}</p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-wide text-slate-400">{publicacao.orgao}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3">
            <Callout tone="warning" title="Como usar publicações na fiscalização">
              Guarde o número e a data do ato. Compare o que foi publicado com o contrato assinado e com o pagamento
              registrado. Divergência entre objeto publicado e objeto contratado é um ponto objetivo de conferência.
            </Callout>
          </div>
        </div>
      </div>

      <Modal
        open={selecionada !== null}
        onClose={() => setSelecionada(null)}
        title={selecionada?.titulo ?? 'Publicação'}
        subtitle={selecionada ? `${selecionada.tipo} · ${selecionada.numero}` : undefined}
        size="md"
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">Documento fictício</span>
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
            <KeyValueGrid
              items={[
                { label: 'Tipo', value: selecionada.tipo },
                { label: 'Número', value: selecionada.numero },
                { label: 'Órgão', value: selecionada.orgao },
                { label: 'Data', value: formatDateLong(selecionada.data) },
              ]}
            />
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Resumo do ato</p>
              <p className="text-[13px] leading-relaxed text-slate-700">{selecionada.resumo}</p>
            </div>
            <p className="rounded-lg bg-slate-50 p-2.5 text-[11px] leading-relaxed text-slate-500">
              Texto demonstrativo. O documento íntegro e assinado deve ser obtido no diário oficial do município.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
