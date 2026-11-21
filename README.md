# OBSERVA · Transparência e fiscalização pública de Casimiro de Abreu/RJ

Plataforma web progressiva (PWA) para acompanhar **dinheiro público, contratos, licitações, obras, saúde,
educação, serviços municipais, publicações oficiais e alertas** de Casimiro de Abreu, com prioridade de uso
em celulares Android.

> ## ⚠️ Esta é uma demonstração com DADOS FICTÍCIOS
>
> Todos os números, nomes de fornecedores, unidades, escolas, obras, alertas e publicações exibidos nesta
> versão foram **gerados artificialmente** para demonstrar a interface. **Nenhum dado é real.**
>
> - **Nenhuma integração externa está ativa.** Não há chamada a portais oficiais, APIs públicas ou banco de dados.
> - **Nenhuma conclusão de irregularidade é emitida.** Alertas são sinais objetivos gerados por regras, para
>   conferência documental — nunca um veredito sobre pessoas ou empresas.
> - **Nenhuma chave de API é usada ou exposta.** O aplicativo não possui credenciais.
> - Não use esta base para publicações, denúncias ou qualquer afirmação factual sobre o município.

---

## 1. O que já funciona nesta entrega

| Área | Estado |
| --- | --- |
| Navegação entre as 15 seções + busca + 404 | ✅ Funcional |
| Pesquisa global com resultados agrupados por seção | ✅ Funcional (índice local) |
| Filtros por texto, secretaria, status, categoria, ano e faixa de valor | ✅ Funcional (estado na URL) |
| Tabelas com detalhe em modal | ✅ Funcional |
| Exportação CSV dos conjuntos demonstrativos | ✅ Funcional |
| Gráficos (barras, linha, rosca, barra empilhada) | ✅ Funcional (SVG próprio, sem dependência) |
| PWA: manifest, service worker, ícones, atalhos | ✅ Instalável em Android |
| Assistente "OBSERVA AI" | ⚠️ Modo demonstração local, por regras — **sem provedor de IA** |
| Mapa territorial | ⚠️ Diagrama esquemático em SVG — **sem tiles/mapas reais** |
| Backend, banco de dados, APIs | ⛔ Não implementados (ver Roadmap) |

---

## 2. Stack

- **Vite 7** + **React 19** + **TypeScript** (modo `strict`, sem `any` na camada de dados)
- **React Router 7** (`BrowserRouter`, rotas em `src/App.tsx`)
- **Tailwind CSS v4** (design tokens em `src/index.css`)
- **Node.js** apenas como servidor estático de produção (`server.js`, sem dependências)
- **Zero bibliotecas de UI, gráficos, ícones ou estado** — componentes próprios, para manter o bundle
  enxuto (≈125 kB gzip) e o comportamento previsível em aparelhos modestos

O projeto foi escrito para ser portado para **Next.js** com o mínimo de atrito: páginas, componentes e a
camada de dados não dependem de APIs exclusivas do Vite. Ver seção 9.

---

## 3. Como rodar

```bash
npm install       # instala dependências
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # checagem de tipos + build de produção em dist/
npm start         # serve dist/ em http://0.0.0.0:3000 (respeita $PORT)
npm run typecheck # apenas tsc --noEmit
```

Requisitos: Node 20+ (build validado em Node 24).

---

## 4. Estrutura de arquivos

```
.
├── index.html                  # Shell HTML: meta tags, manifest, theme-color, OG
├── server.js                   # Servidor estático de produção (SPA fallback, headers, 0.0.0.0:$PORT)
├── vite.config.ts              # Alias @/ → src/ e plugin React
├── tsconfig.json               # TS strict; paths "@/*": ["./src/*"]
├── public/
│   ├── manifest.webmanifest    # PWA: nome, ícones, atalhos, display standalone
│   ├── sw.js                   # Service worker (network-first navegação, cache-first assets)
│   ├── apple-touch-icon.png
│   └── icons/                  # icon-192, icon-512, maskable-512, icon.svg
└── src/
    ├── main.tsx                # Bootstrap React + registro do service worker
    ├── App.tsx                 # Todas as rotas do produto
    ├── navigation.ts           # Fonte única do menu (sidebar, drawer, barra inferior, busca)
    ├── index.css               # Tokens Tailwind v4, base, utilitários (no-scrollbar, safe-area)
    │
    ├── data/                   # CAMADA DE DADOS — hoje fictícia, amanhã alimentada pela API
    │   ├── types.ts            # Tipos de domínio (Contrato, Licitacao, Obra, Fonte, Alerta…)
    │   ├── seed.ts             # RNG determinístico (mulberry32), bairros, secretarias, anos
    │   ├── compras.ts          # Contratos, licitações, modalidades, fornecedores fictícios
    │   ├── obras.ts            # Obras + OBRAS_RESUMO
    │   ├── financas.ts         # Despesas por função, receitas, série mensal, FINANCAS_RESUMO
    │   ├── setores.ts          # Saúde, educação, serviços, secretarias + indicadores
    │   ├── publicacoes.ts      # Atos oficiais fictícios
    │   ├── alertas.ts          # Alertas por regra + ALERTAS_RESUMO
    │   ├── fontes.ts           # Catálogo de fontes, FONTES_RESUMO, GLOSSARIO
    │   ├── mapa.ts             # CAMADAS_MAPA e pontos do território (x/y normalizados)
    │   ├── search.ts           # Índice de busca local e searchAll()
    │   └── index.ts            # Reexporta tudo — único ponto de importação
    │
    ├── lib/
    │   ├── format.ts           # formatBRL, formatBRLCompact, formatPercent, formatDate, toCSV…
    │   └── filters.ts          # matchText, matchSelect, matchFaixa, uniqueValues, sumBy…
    │
    ├── components/
    │   ├── layout/AppShell.tsx # Sidebar desktop, topbar com busca, drawer, barra inferior
    │   ├── ui/
    │   │   ├── primitives.tsx  # Card, SectionCard, Badge, StatusBadge, DemoBadge, Callout,
    │   │   │                   #   DemoNotice, StatCard, ProgressBar, EmptyState, PageHeader,
    │   │   │                   #   InfoRow, KeyValueGrid, ActionCard
    │   │   ├── charts.tsx      # BarChart, LineChart, DonutChart, StackedBar (SVG puro)
    │   │   ├── DataTable.tsx   # Tabela genérica: desktop em tabela, mobile em cartões
    │   │   ├── Modal.tsx       # Diálogo acessível (Esc, foco, scroll lock)
    │   │   └── icons.tsx       # ~30 ícones SVG inline, sem dependência
    │   └── filters/Filters.tsx # useFilterParams (estado na URL), SearchInput, SelectFilter,
    │                           #   ChipFilter, FilterPanel, ResultsCount
    │
    └── pages/                  # Uma página por seção do produto
        ├── VisaoGeral.tsx      ├── Servicos.tsx        ├── Alertas.tsx
        ├── DinheiroPublico.tsx ├── Administracao.tsx   ├── Relatorios.tsx
        ├── Contratos.tsx       ├── Publicacoes.tsx     ├── Fontes.tsx
        ├── Licitacoes.tsx      ├── MapaVivo.tsx        ├── Busca.tsx
        ├── Obras.tsx           ├── ObservaAI.tsx       └── NaoEncontrado.tsx
        ├── Saude.tsx
        └── Educacao.tsx
```

### Por que essa organização

1. **`data/` isolada** — as páginas nunca criam registros; só consomem. Trocar dados fictícios por dados
   reais significa substituir essa camada por `fetch` da API, sem tocar na interface.
2. **`lib/` sem JSX** — formatação e filtros são funções puras, testáveis e reutilizáveis no servidor.
3. **`components/ui/` genéricos** — nenhum componente conhece regra de negócio; recebem dados por props.
4. **`navigation.ts` como fonte única** — menu lateral, drawer mobile, barra inferior e busca leem a mesma
   estrutura, evitando links divergentes.
5. **`pages/` finas** — cada página monta filtros + resumo + lista/detalhe e delega o visual aos componentes.

---

## 5. Rotas

| Seção | Rota | Alias |
| --- | --- | --- |
| Visão Geral | `/` | — |
| Dinheiro Público | `/dinheiro-publico` | — |
| Contratos | `/contratos` | — |
| Licitações | `/licitacoes` | — |
| Obras | `/obras` | — |
| Saúde | `/saude` | — |
| Educação | `/educacao` | — |
| Serviços Municipais | `/servicos` | `/servicos-municipais` |
| Administração | `/administracao` | — |
| Publicações Oficiais | `/publicacoes` | — |
| OBSERVA MAPA VIVO | `/mapa` | `/mapa-vivo` |
| OBSERVA AI | `/ia` | `/observa-ai` |
| Alertas | `/alertas` | — |
| Relatórios | `/relatorios` | — |
| Fontes | `/fontes` | — |
| Busca | `/busca?q=` | — |
| 404 | qualquer outra | — |

---

## 6. Pesquisa e filtros

- **Busca global** (topbar e `/busca`): índice local construído a partir de contratos, licitações, obras,
  unidades de saúde, escolas, serviços, publicações, alertas e pontos do mapa. Resultados agrupados por
  seção, com link direto para o registro. Nada é enviado a servidores.
- **Filtros por página**: `useFilterParams()` mantém o estado em `?q=&secretaria=&status=&ano=&valor=…`,
  o que torna toda combinação de filtro **compartilhável por link** e compatível com o botão "voltar".
- **Faixas de valor** pré-definidas em `FAIXAS_VALOR` (`lib/filters.ts`), aplicadas com `matchFaixa`.
- **Exportação CSV** respeita o recorte filtrado quando a página oferece o botão.

---

## 7. PWA e uso em Android

- `manifest.webmanifest`: `display: standalone`, `start_url: /`, ícones 192/512 + maskable, atalhos para
  Contratos, Mapa e Alertas.
- `sw.js`: pré-cache do app shell, *network-first* para navegação e *cache-first* para assets com hash —
  permite abrir o app instalado sem conexão, exibindo os dados fictícios já empacotados.
- Layout *mobile-first*: barra inferior com 5 destinos, drawer para as demais seções, tabelas que viram
  cartões em telas pequenas, `safe-area-inset` respeitada em aparelhos com notch.
- Alvos de toque ≥ 40 px e contraste AA nos textos principais.

---

## 8. Limites explícitos desta versão

| Não implementado | Por quê |
| --- | --- |
| Dados reais | Nenhuma fonte pública foi integrada; exigiria ETL, cache e validação |
| Backend / banco | Escopo desta entrega é o frontend navegável |
| Autenticação / contas | Não há dado pessoal nem área restrita nesta fase |
| IA generativa | O "OBSERVA AI" responde por regras locais e diz isso em cada resposta |
| Mapas reais (tiles, geocodificação) | O mapa é um diagrama esquemático com coordenadas normalizadas |
| PDF de relatórios | Requer geração no servidor; hoje só CSV |
| Notificações push | Depende de backend e de serviço de push |

Alertas exibem sempre o **critério objetivo** que os gerou e um aviso de que não constituem conclusão de
irregularidade.

---

## 9. Roadmap de integração (próximas fases)

**Fase 1 — Backend de leitura**
1. `FastAPI` com rotas `/contratos`, `/licitacoes`, `/obras`, `/despesas`, `/receitas`, `/publicacoes`,
   `/alertas`, `/fontes`, `/mapa`, todas com paginação, filtros e `ETag`.
2. `PostgreSQL` + `PostGIS`: `obras.geom`, `equipamentos.geom`, `bairros.geom`; índices GIST e views
   materializadas para os resumos (`FINANCAS_RESUMO`, `OBRAS_RESUMO`…).
3. Modelos Pydantic espelhando `src/data/types.ts` — os nomes de campo foram escolhidos para serem
   reutilizáveis como contrato da API.

**Fase 2 — Ingestão de fontes públicas**
4. Conectores com agendamento (Celery/APScheduler) para portais de transparência, diário oficial e dados
   abertos; cada registro guarda `fonte_url`, `coletado_em` e hash do documento.
5. Página **Fontes** passa a exibir última sincronização, latência e link do registro original; o status
   `conectado` só aparece quando o conector estiver de fato operando.

**Fase 3 — Inteligência e alertas**
6. Regras de alerta versionadas (`criterio`, `versao_regra`, `evidencias[]`), com explicação e link para
   os documentos que dispararam o sinal.
7. "OBSERVA AI" passa a usar RAG sobre os documentos indexados, com citação obrigatória da fonte e
   proibição explícita de afirmar irregularidade.

**Fase 4 — Migração de frontend (opcional)**
8. Mover `pages/` para o App Router do Next.js (RSC + streaming), mantendo `components/` e `lib/` intactos.
9. `data/` vira camada de acesso (`server-only`), com `fetch` tipado e cache revalidado.

Nenhuma dessas fases está ativa hoje: o repositório contém apenas o frontend demonstrativo descrito acima.

---

## 10. Convenções de código

- TypeScript `strict`; tipos de domínio centralizados em `src/data/types.ts`.
- Datas em ISO (`YYYY-MM-DD`) na camada de dados; formatação apenas na borda (`lib/format.ts`).
- Valores monetários em número (reais), nunca string; formatação com `formatBRL`.
- Nomes de domínio em português (contrato, licitação, obra) para manter aderência ao vocabulário público.
- Nenhum segredo, `.env` ou chave no repositório; nenhuma requisição de rede em runtime.
- Acessibilidade: `aria-label` em controles, foco visível, `Esc` fecha modais, textos alternativos nos ícones
  decorativos (`aria-hidden`).

---

## 11. Aviso legal

Esta plataforma é um **protótipo independente de demonstração**. Não possui vínculo com a Prefeitura de
Casimiro de Abreu. Os dados exibidos são fictícios e não representam a realidade do município. Qualquer
análise sobre gastos públicos deve ser feita a partir dos documentos oficiais e dos canais institucionais
competentes.
