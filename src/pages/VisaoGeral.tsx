/** Visão Geral — painel inicial do OBSERVA: indicadores, séries e atalhos. */
import { Link } from 'react-router-dom';
import {
  ALERTAS_RESUMO,
  FINANCAS_RESUMO,
  OBRAS_RESUMO,
  alertas,
  contratos,
  despesasPorFuncao,
  escolas,
  licitacoes,
  mapaPontos,
  obras,
  publicacoes,
  serieMensal,
  unidadesSaude,
} from '@/data';
import { formatBRL, formatBRLCompact, formatDate, formatNumber } from '@/lib/format';
import {
  ActionCard,
  Badge,
  Card,
  DemoNotice,
  PageHeader,
  ProgressBar,
  SectionCard,
  StatCard,
  StatusBadge,
} from '@/components/ui/primitives';
import { BarChart, LineChart } from '@/components/ui/charts';
import {
  IconAlert,
  IconBell,
  IconBuilding,
  IconCap,
  IconChart,
  IconFile,
  IconGavel,
  IconHardHat,
  IconHeart,
  IconMap,
  IconSparkles,
  IconWallet,
} from '@/components/ui/icons';

const ATALHOS = [
  { to: '/dinheiro-publico', title: 'Dinheiro Público', description: 'Receitas, despesas e execução orçamentária', icon: IconWallet },
  { to: '/contratos', title: 'Contratos', description: 'Contratos administrativos, valores e aditivos', icon: IconFile },
  { to: '/licitacoes', title: 'Licitações', description: 'Processos, modalidades e resultados', icon: IconGavel },
  { to: '/obras', title: 'Obras', description: 'Execução física, prazos e valores pagos', icon: IconHardHat },
  { to: '/mapa', title: 'Mapa Vivo', description: 'Equipamentos públicos no território', icon: IconMap },
  { to: '/ia', title: 'OBSERVA AI', description: 'Busca assistida em linguagem natural', icon: IconSparkles },
];

export default function VisaoGeral() {
  const contratosVigentes = contratos.filter((c) => c.status === 'vigente');
  const valorVigente = contratosVigentes.reduce((total, c) => total + c.valor, 0);
  const despesasTop = [...despesasPorFuncao]
    .sort((a, b) => b.empenhado - a.empenhado)
    .slice(0, 7)
    .map((d) => ({ label: d.funcao, value: d.empenhado }));
  const alertasRecentes = [...alertas]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 4);
  const ultimasPublicacoes = [...publicacoes]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Painel do município"
        title="Visão Geral"
        description="Um retrato organizado das finanças, compras, obras e políticas públicas de Casimiro de Abreu/RJ. Esta versão é demonstrativa: todos os registros são fictícios e nenhuma base oficial está conectada."
        icon={<IconChart size={22} />}
        actions={
          <>
            <Link
              to="/relatorios"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              <IconChart size={15} /> Abrir relatórios
            </Link>
            <Link
              to="/fontes"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
            >
              Fontes e metodologia
            </Link>
          </>
        }
      />

      <div className="mb-4">
        <DemoNotice>
          Os números desta tela foram <strong>gerados artificialmente</strong> para validar a interface. Eles não
          descrevem a prefeitura, não vêm de portal público e não devem ser citados como informação real.
        </DemoNotice>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label="Receita arrecadada"
          value={formatBRLCompact(FINANCAS_RESUMO.receitaArrecadada)}
          hint={`Previsto ${formatBRLCompact(FINANCAS_RESUMO.receitaPrevista)}`}
          icon={<IconWallet size={16} />}
          tone="brand"
        />
        <StatCard
          label="Despesa paga"
          value={formatBRLCompact(FINANCAS_RESUMO.despesaPaga)}
          hint={`Empenhado ${formatBRLCompact(FINANCAS_RESUMO.despesaEmpenhada)}`}
          icon={<IconChart size={16} />}
          tone="info"
        />
        <StatCard
          label="Contratos vigentes"
          value={formatNumber(contratosVigentes.length)}
          hint={`${formatBRLCompact(valorVigente)} em valor`}
          icon={<IconFile size={16} />}
          tone="success"
        />
        <StatCard
          label="Obras em execução"
          value={formatNumber(OBRAS_RESUMO.emExecucao)}
          hint={`${OBRAS_RESUMO.paralisadas} paralisada(s)`}
          icon={<IconHardHat size={16} />}
          tone="warning"
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <SectionCard
          title="Despesa empenhada por função"
          description="Maiores funções de governo na base demonstrativa"
          className="lg:col-span-2"
          action={
            <Link to="/dinheiro-publico" className="text-[11px] font-semibold text-brand-700 hover:underline">
              Ver detalhes
            </Link>
          }
        >
          <BarChart items={despesasTop} formatValue={(value) => formatBRLCompact(value)} />
        </SectionCard>

        <div className="space-y-3">
          <SectionCard title="Pontos de atenção" description="Padrões que pedem checagem humana">
            <ul className="space-y-2.5">
              {alertasRecentes.map((alerta) => (
                <li key={alerta.id} className="rounded-lg border border-slate-100 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link to="/alertas" className="text-[12px] font-semibold text-slate-900 hover:text-brand-700">
                      {alerta.titulo}
                    </Link>
                    <StatusBadge status={alerta.severidade} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {alerta.categoria} · {formatDate(alerta.data)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
              <span className="text-[11px] text-slate-600">
                <strong className="font-semibold text-slate-900">{ALERTAS_RESUMO.abertos}</strong> abertos de{' '}
                {ALERTAS_RESUMO.total}
              </span>
              <Link to="/alertas" className="text-[11px] font-semibold text-brand-700 hover:underline">
                Ver todos
              </Link>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
              Alertas são indicativos de padrão a verificar — não são conclusão de irregularidade.
            </p>
          </SectionCard>

          <SectionCard title="Cobertura territorial" description="Equipamentos mapeados (fictícios)">
            <ul className="space-y-2 text-[12px] text-slate-700">
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <IconHeart size={14} className="text-rose-500" /> Unidades de saúde
                </span>
                <strong className="tabular">{unidadesSaude.length}</strong>
              </li>
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <IconCap size={14} className="text-sky-600" /> Escolas municipais
                </span>
                <strong className="tabular">{escolas.length}</strong>
              </li>
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <IconHardHat size={14} className="text-amber-500" /> Obras
                </span>
                <strong className="tabular">{obras.length}</strong>
              </li>
              <li className="flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <IconMap size={14} className="text-teal-600" /> Total no mapa
                </span>
                <strong className="tabular">{mapaPontos.length}</strong>
              </li>
            </ul>
            <Link
              to="/mapa"
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
            >
              Abrir OBSERVA Mapa Vivo
            </Link>
          </SectionCard>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <SectionCard
          title="Receita e despesa no ano"
          description="Série mensal demonstrativa"
          className="lg:col-span-2"
        >
          <LineChart
            labels={serieMensal.map((item) => item.mes)}
            series={[
              { name: 'Receita', color: '#0d9488', values: serieMensal.map((item) => item.receita) },
              { name: 'Despesa', color: '#e11d48', values: serieMensal.map((item) => item.despesa) },
            ]}
            formatValue={(value) => formatBRLCompact(value)}
          />
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-3">
            <div>
              <p className="text-slate-500">Empenhado</p>
              <p className="font-semibold text-slate-900 tabular">{formatBRL(FINANCAS_RESUMO.despesaEmpenhada, { decimals: false })}</p>
            </div>
            <div>
              <p className="text-slate-500">Liquidado</p>
              <p className="font-semibold text-slate-900 tabular">{formatBRL(FINANCAS_RESUMO.despesaLiquidada, { decimals: false })}</p>
            </div>
            <div>
              <p className="text-slate-500">Pago</p>
              <p className="font-semibold text-slate-900 tabular">{formatBRL(FINANCAS_RESUMO.despesaPaga, { decimals: false })}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Últimas publicações" description="Atos oficiais fictícios" action={<Link to="/publicacoes" className="text-[11px] font-semibold text-brand-700 hover:underline">Ver todas</Link>}>
          <ul className="space-y-2.5">
            {ultimasPublicacoes.map((publicacao) => (
              <li key={publicacao.id} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-1.5">
                  <Badge tone="brand">{publicacao.tipo}</Badge>
                  <span className="text-[10px] text-slate-400">{formatDate(publicacao.data)}</span>
                </div>
                <p className="mt-1 text-[12px] font-medium leading-snug text-slate-800">{publicacao.titulo}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <SectionCard title="Atalhos" description="Navegue pelas seções do OBSERVA" className="lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {ATALHOS.map((atalho) => (
              <ActionCard key={atalho.to} {...atalho} LinkComponent={Link} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Situação das obras" description={`${obras.length} obras na base fictícia`}>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">Execução média</span>
                <span className="font-semibold text-slate-900 tabular">
                  {Math.round(obras.reduce((total, obra) => total + obra.percentualExecucao, 0) / obras.length)}%
                </span>
              </div>
              <ProgressBar
                value={obras.reduce((total, obra) => total + obra.percentualExecucao, 0) / obras.length}
                label="Execução média das obras"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-500">Contratado</p>
                <p className="font-semibold text-slate-900 tabular">{formatBRLCompact(OBRAS_RESUMO.valorContratado)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-500">Pago</p>
                <p className="font-semibold text-slate-900 tabular">{formatBRLCompact(OBRAS_RESUMO.valorPago)}</p>
              </div>
            </div>
            <Card className="border-dashed bg-slate-50/60 p-2.5">
              <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-600">
                <IconAlert size={14} className="mt-0.5 shrink-0 text-amber-600" />
                Diferenças entre valor pago e execução física são apenas sinalizações para conferência documental.
              </p>
            </Card>
          </div>
        </SectionCard>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <ActionCard to="/saude" title="Saúde" description={`${unidadesSaude.length} unidades e indicadores`} icon={IconHeart} LinkComponent={Link} />
        <ActionCard to="/educacao" title="Educação" description={`${escolas.length} escolas e matrículas`} icon={IconCap} LinkComponent={Link} />
        <ActionCard to="/administracao" title="Administração" description={`${licitacoes.length} processos licitatórios`} icon={IconBuilding} LinkComponent={Link} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
        <IconBell size={15} className="text-brand-700" />
        <span>
          Receba os pontos de atenção no celular: instale o OBSERVA pela opção “Adicionar à tela inicial” do Chrome
          Android.
        </span>
      </div>
    </div>
  );
}
