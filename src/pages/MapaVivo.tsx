/** OBSERVA MAPA VIVO — visão territorial fictícia de obras, saúde, educação e serviços. */
import { useMemo, useState } from 'react';
import { CAMADAS_MAPA, MAPA_RESUMO, mapaPontos } from '@/data';
import type { MapaPonto } from '@/data';
import { matchText } from '@/lib/filters';
import { ChipFilter, ResultsCount, SearchInput, useFilterParams } from '@/components/filters/Filters';
import { Badge, Callout, DemoNotice, KeyValueGrid, PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/ui/primitives';
import { IconLayers, IconMap, IconPin } from '@/components/ui/icons';

const CAMADA_OPCOES = [
  { value: 'todas', label: 'Todas as camadas' },
  ...CAMADAS_MAPA.map((camada) => ({ value: camada.value, label: camada.label })),
];

function corDaCamada(camada: string): string {
  return CAMADAS_MAPA.find((item) => item.value === camada)?.cor ?? '#0d9488';
}

export default function MapaVivo() {
  const { get, set, clear } = useFilterParams();
  const [selecionado, setSelecionado] = useState<MapaPonto | null>(null);

  const q = get('q');
  const camada = get('camada', 'todas');

  const filtrados = useMemo(
    () =>
      mapaPontos.filter(
        (ponto) =>
          matchText(q, ponto.nome, ponto.bairro, ponto.categoria, ponto.detalhe) &&
          (camada === 'todas' || ponto.camada === camada),
      ),
    [q, camada],
  );

  const ativos = [q !== '', camada !== 'todas'].filter(Boolean).length;
  const porCamada = CAMADAS_MAPA.map((item) => ({
    ...item,
    total: mapaPontos.filter((ponto) => ponto.camada === item.value).length,
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Território"
        title="OBSERVA MAPA VIVO"
        description="Pontos georreferenciados de obras, unidades de saúde, escolas e serviços. As posições são ilustrativas nesta versão; a integração prevista usa PostGIS com coordenadas oficiais."
        icon={<IconMap size={22} />}
      />

      <div className="mb-4 space-y-2.5">
        <DemoNotice>
          Mapa ilustrativo com posições fictícias dentro de uma área genérica — não é um mapa geográfico real de
          Casimiro de Abreu.
        </DemoNotice>
        <Callout tone="info" title="Por que mapa vivo" icon={<IconLayers size={18} />}>
          Cruzar território e gasto revela padrões que tabelas escondem: obra paralisada em bairro sem escola, unidade
          de saúde em reforma há muito tempo, serviço concentrado em uma região.
        </Callout>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Pontos no mapa" value={String(MAPA_RESUMO.total)} hint="Base fictícia" tone="brand" />
        <StatCard label="Obras" value={String(MAPA_RESUMO.obras)} hint="Canteiros mapeados" tone="warning" />
        <StatCard label="Saúde" value={String(MAPA_RESUMO.saude)} hint="Unidades" tone="danger" />
        <StatCard label="Educação" value={String(MAPA_RESUMO.educacao)} hint="Escolas" tone="info" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <FilterPanel activeCount={ativos} onClear={() => clear(['q', 'camada'])}>
            <SearchInput value={q} onChange={(value) => set('q', value)} placeholder="Ponto, bairro, categoria…" />
            <ChipFilter label="Camadas" options={CAMADA_OPCOES} value={camada} onChange={(value) => set('camada', value)} />
          </FilterPanel>

          <SectionCard
            title="Território"
            description="Toque em um ponto para ver o detalhe"
            action={<ResultsCount shown={filtrados.length} total={mapaPontos.length} label="pontos" />}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#eef6f4]">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
                <defs>
                  <pattern id="grade" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#cbd5e1" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grade)" />
                <path d="M0 62 C 18 58, 28 68, 44 64 S 70 52, 100 58" fill="none" stroke="#93c5fd" strokeWidth="1.6" />
                <path d="M0 30 C 20 26, 34 34, 52 30 S 78 20, 100 26" fill="none" stroke="#a5b4fc" strokeWidth="1.1" />
                <path d="M12 0 L 22 100" fill="none" stroke="#d6d3d1" strokeWidth="0.8" />
                <path d="M64 0 L 58 100" fill="none" stroke="#d6d3d1" strokeWidth="0.8" />
              </svg>
              {filtrados.map((ponto) => (
                <button
                  key={ponto.id}
                  type="button"
                  onClick={() => setSelecionado(ponto)}
                  aria-label={`${ponto.nome} — ${ponto.bairro}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white transition hover:scale-125 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-400"
                  style={{
                    left: `${ponto.x}%`,
                    top: `${ponto.y}%`,
                    width: selecionado?.id === ponto.id ? 16 : 12,
                    height: selecionado?.id === ponto.id ? 16 : 12,
                    backgroundColor: corDaCamada(ponto.camada),
                    boxShadow: '0 1px 4px rgba(15,23,42,0.35)',
                  }}
                  title={ponto.nome}
                />
              ))}
              <span className="pointer-events-none absolute bottom-1.5 left-2 text-[9px] font-medium text-slate-500">
                Posições ilustrativas · sem escala real
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              {porCamada.map((item) => (
                <span key={item.value} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.cor }} />
                  {item.label} ({item.total})
                </span>
              ))}
            </div>

            {selecionado ? (
              <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">{selecionado.nome}</p>
                    <p className="text-[11px] text-slate-500">
                      {selecionado.categoria} · {selecionado.bairro}
                    </p>
                  </div>
                  <StatusBadge status={selecionado.status} />
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600">{selecionado.detalhe}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <a
                    href={selecionado.href}
                    className="rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-brand-700"
                  >
                    Ver seção relacionada
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelecionado(null)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-slate-400"
                  >
                    Fechar detalhe
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500">
                Nenhum ponto selecionado. Toque em um marcador colorido para ver nome, bairro, situação e descrição.
              </p>
            )}
          </SectionCard>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <SectionCard title="Pontos visíveis" description="Lista sincronizada com os filtros">
            {filtrados.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-3 text-[12px] text-slate-500">
                Nenhum ponto corresponde ao filtro. Limpe a busca ou selecione outra camada.
              </p>
            ) : (
              <ul className="max-h-[520px] space-y-1.5 overflow-y-auto pr-1">
                {filtrados.map((ponto) => (
                  <li key={ponto.id}>
                    <button
                      type="button"
                      onClick={() => setSelecionado(ponto)}
                      className={`w-full rounded-lg border p-2.5 text-left transition ${
                        selecionado?.id === ponto.id
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-slate-200 bg-white hover:border-brand-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: corDaCamada(ponto.camada) }} />
                          <span className="truncate text-[12px] font-semibold text-slate-900">{ponto.nome}</span>
                        </span>
                        <Badge tone="neutral">{ponto.camada}</Badge>
                      </div>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-slate-500">
                        <IconPin size={11} /> {ponto.bairro}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {selecionado ? (
            <SectionCard title="Detalhe do ponto" description={selecionado.bairro}>
              <KeyValueGrid
                items={[
                  { label: 'Nome', value: selecionado.nome },
                  { label: 'Camada', value: selecionado.camada },
                  { label: 'Categoria', value: selecionado.categoria },
                  { label: 'Bairro', value: selecionado.bairro },
                  { label: 'Situação', value: <StatusBadge status={selecionado.status} /> },
                  { label: 'Posição', value: `x ${selecionado.x}% · y ${selecionado.y}%` },
                ]}
              />
            </SectionCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
