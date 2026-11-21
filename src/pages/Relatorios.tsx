/** Relatórios — exportação dos conjuntos de dados demonstrativos em CSV. */
import { useMemo, useState } from 'react';
import {
  alertas,
  contratos,
  licitacoes,
  obras,
  publicacoes,
  servicos,
  unidadesSaude,
  escolas,
} from '@/data';
import { formatNumber } from '@/lib/format';
import { Badge, Callout, DemoNotice, PageHeader, SectionCard, StatCard } from '@/components/ui/primitives';
import { IconChart, IconDownload, IconFile } from '@/components/ui/icons';
import { downloadFile, toCSV } from '@/lib/format';

type Relatorio = {
  id: string;
  nome: string;
  descricao: string;
  registros: number;
  colunas: string[];
  linhas: () => Array<Array<string | number>>;
};

const RELATORIOS: Relatorio[] = [
  {
    id: 'contratos',
    nome: 'Contratos administrativos',
    descricao: 'Objeto, fornecedor, valores, vigência, status e aditivos.',
    registros: contratos.length,
    colunas: ['Número', 'Objeto', 'Fornecedor', 'Secretaria', 'Categoria', 'Valor (R$)', 'Assinatura', 'Vigência fim', 'Status', 'Aditivos'],
    linhas: () =>
      contratos.map((c) => [c.numero, c.objeto, c.fornecedor, c.secretaria, c.categoria, c.valor, c.dataAssinatura, c.vigenciaFim, c.status, c.aditivos]),
  },
  {
    id: 'licitacoes',
    nome: 'Licitações',
    descricao: 'Processos, modalidade, valor estimado, participantes e situação.',
    registros: licitacoes.length,
    colunas: ['Número', 'Objeto', 'Modalidade', 'Secretaria', 'Valor estimado (R$)', 'Abertura', 'Status', 'Participantes', 'Contratos gerados'],
    linhas: () =>
      licitacoes.map((l) => [l.numero, l.objeto, l.modalidade, l.secretaria, l.valorEstimado, l.dataAbertura, l.status, l.participantes, l.contratosGerados]),
  },
  {
    id: 'obras',
    nome: 'Obras municipais',
    descricao: 'Execução física, valores contratado e pago, prazos e bairro.',
    registros: obras.length,
    colunas: ['Obra', 'Secretaria', 'Bairro', 'Empresa', 'Valor contratado (R$)', 'Valor pago (R$)', '% execução', 'Status', 'Início', 'Previsão fim'],
    linhas: () =>
      obras.map((o) => [o.nome, o.secretaria, o.bairro, o.empresa, o.valorContratado, o.valorPago, o.percentualExecucao, o.status, o.inicio, o.previsaoFim]),
  },
  {
    id: 'alertas',
    nome: 'Alertas por regra',
    descricao: 'Sinais gerados por critérios objetivos, com severidade e status.',
    registros: alertas.length,
    colunas: ['Título', 'Categoria', 'Severidade', 'Entidade', 'Data', 'Status', 'Critério'],
    linhas: () => alertas.map((a) => [a.titulo, a.categoria, a.severidade, a.entidade, a.data, a.status, a.criterio]),
  },
  {
    id: 'publicacoes',
    nome: 'Publicações oficiais',
    descricao: 'Atos, decretos, portarias, editais e resultados.',
    registros: publicacoes.length,
    colunas: ['Tipo', 'Número', 'Data', 'Título', 'Órgão', 'Resumo'],
    linhas: () => publicacoes.map((p) => [p.tipo, p.numero, p.data, p.titulo, p.orgao, p.resumo]),
  },
  {
    id: 'saude',
    nome: 'Unidades de saúde',
    descricao: 'Tipo, bairro, equipes, atendimentos e situação.',
    registros: unidadesSaude.length,
    colunas: ['Unidade', 'Tipo', 'Bairro', 'Equipes', 'Atendimentos/mês', 'Status'],
    linhas: () => unidadesSaude.map((u) => [u.nome, u.tipo, u.bairro, u.equipes, u.atendimentosMes, u.status]),
  },
  {
    id: 'educacao',
    nome: 'Escolas municipais',
    descricao: 'Bairro, etapa, matrículas, turmas e IDEB fictício.',
    registros: escolas.length,
    colunas: ['Escola', 'Bairro', 'Etapa', 'Matrículas', 'Turmas', 'IDEB (fictício)'],
    linhas: () => escolas.map((e) => [e.nome, e.bairro, e.etapas, e.matriculas, e.turmas, e.idebFicticio]),
  },
  {
    id: 'servicos',
    nome: 'Serviços municipais',
    descricao: 'Canal, prazo, volume mensal e situação do serviço.',
    registros: servicos.length,
    colunas: ['Serviço', 'Categoria', 'Secretaria', 'Canal', 'Prazo (dias)', 'Atendimentos/mês', 'Status'],
    linhas: () => servicos.map((s) => [s.nome, s.categoria, s.secretaria, s.canal, s.prazoDias, s.atendimentosMes, s.status]),
  },
];

export default function Relatorios() {
  const [gerado, setGerado] = useState<string | null>(null);

  const totalRegistros = useMemo(() => RELATORIOS.reduce((total, relatorio) => total + relatorio.registros, 0), []);

  const exportar = (relatorio: Relatorio) => {
    const csv = toCSV(relatorio.colunas, relatorio.linhas());
    downloadFile(`observa-${relatorio.id}-ficticio.csv`, csv, 'text/csv;charset=utf-8');
    setGerado(relatorio.nome);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Transparência ativa"
        title="Relatórios"
        description="Baixe os conjuntos de dados da demonstração em CSV para abrir no Excel, LibreOffice ou Google Sheets. Cada arquivo inclui apenas dados fictícios e o aviso de origem."
        icon={<IconChart size={22} />}
      />

      <div className="mb-4 space-y-2.5">
        <DemoNotice>
          Todos os arquivos exportados contêm dados fictícios de demonstração. Não use em publicações ou denúncias.
        </DemoNotice>
        {gerado ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-[12px] font-medium text-emerald-900">
            Arquivo gerado: <strong>{gerado}</strong> — verifique a pasta de downloads do seu dispositivo.
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Conjuntos disponíveis" value={formatNumber(RELATORIOS.length)} hint="CSV, um por área" tone="brand" />
        <StatCard label="Registros somados" value={formatNumber(totalRegistros)} hint="Base fictícia total" tone="info" />
        <StatCard label="Formato" value="CSV" hint="Compatível com planilhas" tone="success" />
        <StatCard label="PDF" value="Em breve" hint="Requer geração no servidor" tone="warning" />
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {RELATORIOS.map((relatorio) => (
          <article key={relatorio.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <IconFile size={16} />
              </span>
              <Badge tone="neutral">{formatNumber(relatorio.registros)} registros</Badge>
            </div>
            <h3 className="mt-2 text-[13px] font-semibold text-slate-900">{relatorio.nome}</h3>
            <p className="mt-1 flex-1 text-[11px] leading-relaxed text-slate-600">{relatorio.descricao}</p>
            <p className="mt-2 text-[10px] text-slate-400">{relatorio.colunas.length} colunas · separador ponto e vírgula</p>
            <button
              type="button"
              onClick={() => exportar(relatorio)}
              className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              <IconDownload size={14} /> Baixar CSV
            </button>
          </article>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <SectionCard title="Como ler os relatórios" description="Boas práticas de análise">
          <ul className="space-y-2 text-[11px] leading-relaxed text-slate-600">
            <li>• Confira sempre a data de extração e a fonte antes de comparar números.</li>
            <li>• Empenho não é pagamento: compare estágios separadamente.</li>
            <li>• Valor contratado não é valor executado: use o percentual físico.</li>
            <li>• Concentração de fornecedor é sinal para conferir, não prova de irregularidade.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Formatos previstos" description="O que ainda não existe nesta entrega">
          <ul className="space-y-2 text-[11px] leading-relaxed text-slate-600">
            <li>
              <Badge tone="success">Disponível</Badge> CSV dos conjuntos demonstrativos.
            </li>
            <li>
              <Badge tone="warning">Planejado</Badge> PDF de resumo executivo com gráficos.
            </li>
            <li>
              <Badge tone="warning">Planejado</Badge> API JSON pública com filtros e paginação.
            </li>
            <li>
              <Badge tone="warning">Planejado</Badge> Agendamento de relatório por e-mail.
            </li>
          </ul>
          <Callout tone="info" title="Sem simulação de recursos">
            Nada acima está ativo. A interface apenas informa o que será construído sobre FastAPI e PostgreSQL.
          </Callout>
        </SectionCard>
      </div>
    </div>
  );
}
