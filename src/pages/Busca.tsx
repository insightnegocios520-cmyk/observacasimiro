/** Busca global — resultados agrupados por seção a partir do índice local. */
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SUGESTOES_BUSCA, searchAll } from '@/data';
import type { SearchResult } from '@/data';
import { Badge, Callout, DemoNotice, EmptyState, PageHeader, SectionCard } from '@/components/ui/primitives';
import { IconSearch } from '@/components/ui/icons';

export default function Busca() {
  const [params, setParams] = useSearchParams();
  const termo = params.get('q') ?? '';
  const [rascunho, setRascunho] = useState(termo);

  useEffect(() => {
    setRascunho(termo);
  }, [termo]);

  const resultados = useMemo(() => (termo.trim().length >= 2 ? searchAll(termo) : []), [termo]);

  const grupos = useMemo(() => {
    const mapa = new Map<string, SearchResult[]>();
    for (const resultado of resultados) {
      const lista = mapa.get(resultado.secao) ?? [];
      lista.push(resultado);
      mapa.set(resultado.secao, lista);
    }
    return [...mapa.entries()];
  }, [resultados]);

  return (
    <div>
      <PageHeader
        eyebrow="Pesquisa"
        title="Busca"
        description="Procure por contratos, licitações, obras, unidades de saúde, escolas, serviços, publicações, alertas e pontos do mapa. A busca roda no dispositivo, sobre os dados fictícios do aplicativo."
        icon={<IconSearch size={22} />}
      />

      <div className="mb-4">
        <DemoNotice>
          Resultados extraídos da base fictícia de demonstração. Nenhuma consulta é enviada a servidores externos.
        </DemoNotice>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setParams(rascunho.trim() ? { q: rascunho.trim() } : {});
        }}
        className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        <label htmlFor="busca-global" className="text-[11px] font-semibold text-slate-700">
          Termo de busca
        </label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id="busca-global"
            value={rascunho}
            onChange={(event) => setRascunho(event.target.value)}
            placeholder="Ex.: pavimentação, UBS, merenda, aditivo…"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-brand-700"
          >
            <IconSearch size={15} /> Buscar
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUGESTOES_BUSCA.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => {
                setRascunho(sugestao);
                setParams({ q: sugestao });
              }}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
            >
              {sugestao}
            </button>
          ))}
        </div>
      </form>

      <div className="mt-3">
        {termo.trim().length < 2 ? (
          <SectionCard title="Digite ao menos 2 caracteres" description="A busca percorre todas as seções da plataforma">
            <p className="rounded-lg bg-slate-50 p-3 text-[12px] leading-relaxed text-slate-600">
              Use termos curtos e específicos: nome de bairro, tipo de serviço, número de contrato ou assunto da
              publicação. Os resultados são agrupados por seção e levam direto ao registro.
            </p>
          </SectionCard>
        ) : resultados.length === 0 ? (
          <SectionCard title={`Nenhum resultado para "${termo}"`}>
            <EmptyState
              title="Nada encontrado na base fictícia"
              description="Tente um termo mais genérico, verifique a grafia ou explore as seções pelo menu."
              icon={<IconSearch size={22} />}
            />
          </SectionCard>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-slate-600">
                <strong className="text-slate-900">{resultados.length}</strong> resultado(s) para "{termo}"
              </p>
              <Badge tone="neutral">{grupos.length} seção(ões)</Badge>
            </div>

            {grupos.map(([secao, itens]) => (
              <SectionCard key={secao} title={secao} description={`${itens.length} resultado(s)`}>
                <ul className="space-y-1.5">
                  {itens.map((item, indice) => (
                    <li key={`${item.href}-${indice}`}>
                      <Link
                        to={item.href}
                        className="block rounded-lg border border-slate-200 bg-white p-2.5 transition hover:border-brand-300 hover:bg-brand-50/40"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[12px] font-semibold text-slate-900">{item.titulo}</p>
                          <Badge tone="brand">{item.tipo}</Badge>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-600">{item.descricao}</p>
                        {item.meta ? <p className="mt-0.5 text-[10px] text-slate-400">{item.meta}</p> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            ))}

            <Callout tone="info" title="Busca local, sem servidor">
              O índice é construído no carregamento da página a partir dos dados fictícios. Nenhum termo pesquisado é
              registrado ou enviado para terceiros.
            </Callout>
          </div>
        )}
      </div>
    </div>
  );
}
