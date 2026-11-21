/** Fontes — origem dos dados, status real de cada integração e glossário. */
import { useMemo } from 'react';
import { FONTES_RESUMO, GLOSSARIO, fontes } from '@/data';
import { matchText, uniqueValues } from '@/lib/filters';
import { ChipFilter, ResultsCount, SearchInput, useFilterParams } from '@/components/filters/Filters';
import { Badge, Callout, DemoNotice, PageHeader, SectionCard, StatCard } from '@/components/ui/primitives';
import { IconExternal, IconLayers, IconLink, IconShield } from '@/components/ui/icons';

const STATUS_OPCOES = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'planejado', label: 'Planejado' },
  { value: 'em avaliação', label: 'Em avaliação' },
  { value: 'não conectado', label: 'Não conectado' },
];

const TONE: Record<string, 'neutral' | 'warning' | 'info' | 'success' | 'danger'> = {
  planejado: 'neutral',
  'em avaliação': 'warning',
  'não conectado': 'danger',
  conectado: 'success',
};

export default function Fontes() {
  const { get, set, clear } = useFilterParams();
  const q = get('q');
  const status = get('status', 'todos');

  const tipos = useMemo(() => uniqueValues(fontes.map((f) => f.tipo)), []);

  const filtradas = useMemo(
    () =>
      fontes.filter(
        (fonte) => matchText(q, fonte.nome, fonte.descricao, fonte.tipo, fonte.periodicidade) && (status === 'todos' || fonte.status === status),
      ),
    [q, status],
  );

  const conectadas = FONTES_RESUMO.conectadas;

  return (
    <div>
      <PageHeader
        eyebrow="Metodologia"
        title="Fontes"
        description="De onde cada dado deverá vir, em que formato e com qual periodicidade. Nesta versão nenhuma integração está ativa: todo o conteúdo é fictício e gerado no próprio aplicativo."
        icon={<IconLink size={22} />}
      />

      <div className="mb-4 space-y-2.5">
        <DemoNotice>
          <strong>Nenhuma fonte externa está conectada.</strong> Os endereços abaixo são referências de onde os dados
          reais deverão ser buscados no futuro — não são chamadas feitas por este aplicativo.
        </DemoNotice>
        <Callout tone="danger" title="Status honesto das integrações" icon={<IconShield size={18} />}>
          Integrações conectadas nesta versão: <strong>{conectadas}</strong>. Tudo o que você vê no OBSERVA hoje vem de
          dados fictícios determinísticos do bundle, não de portais oficiais.
        </Callout>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Fontes mapeadas" value={String(FONTES_RESUMO.total)} hint="Catálogo de referência" tone="brand" />
        <StatCard label="Conectadas" value={String(conectadas)} hint="Integrações ativas hoje" tone="danger" />
        <StatCard label="Planejadas" value={String(FONTES_RESUMO.planejadas)} hint="Sem implementação" tone="warning" />
        <StatCard label="Em avaliação" value={String(FONTES_RESUMO.emAvaliacao)} hint="Estudo de viabilidade" tone="info" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Buscar fonte, tipo, periodicidade…" />
            <div className="mt-2">
              <ChipFilter label="Status" options={STATUS_OPCOES} value={status} onChange={(value) => set('status', value)} />
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
              <ResultsCount shown={filtradas.length} total={fontes.length} label="fontes" />
              <button
                type="button"
                onClick={() => clear(['q', 'status'])}
                className="text-[11px] font-semibold text-brand-700 hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          </div>

          <ul className="space-y-2.5">
            {filtradas.map((fonte) => (
              <li key={fonte.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone={TONE[fonte.status] ?? 'neutral'}>{fonte.status}</Badge>
                  <Badge tone="brand">{fonte.tipo}</Badge>
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-400">{fonte.formato}</span>
                </div>
                <h3 className="mt-1.5 text-[13px] font-semibold text-slate-900">{fonte.nome}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{fonte.descricao}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5">
                    <IconLayers size={11} /> {fonte.periodicidade}
                  </span>
                  <span className="inline-flex min-w-0 items-center gap-1 truncate rounded-md bg-slate-100 px-1.5 py-0.5">
                    <IconExternal size={11} /> {fonte.url}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {filtradas.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-4 text-center text-[12px] text-slate-500">
              Nenhuma fonte corresponde ao filtro aplicado.
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          <SectionCard title="Tipos de fonte" description="Categorias mapeadas">
            <div className="flex flex-wrap gap-1.5">
              {tipos.map((tipo) => (
                <Badge key={tipo.value} tone="neutral">
                  {tipo.label}
                </Badge>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Glossário" description="Termos usados na plataforma">
            <dl className="space-y-2.5">
              {GLOSSARIO.map((item) => (
                <div key={item.termo}>
                  <dt className="text-[12px] font-semibold text-slate-900">{item.termo}</dt>
                  <dd className="text-[11px] leading-relaxed text-slate-600">{item.definicao}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <Callout tone="info" title="Compromisso de transparência">
            Quando uma integração for ativada, esta página deverá mostrar a data da última sincronização e o link direto
            do registro na fonte original. Enquanto isso não existir, o status continua "não conectado".
          </Callout>
        </div>
      </div>
    </div>
  );
}
