/**
 * OBSERVA AI — assistente em modo demonstração local.
 *
 * Não há provedor de IA conectado nesta versão. As respostas são produzidas por
 * regras determinísticas sobre os DADOS FICTÍCIOS do próprio bundle, e a
 * interface deixa isso explícito em todos os pontos.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ALERTAS_RESUMO, FINANCAS_RESUMO, OBRAS_RESUMO, contratos, obras } from '@/data';
import { formatBRL, formatBRLCompact } from '@/lib/format';
import { Badge, Callout, Card, DemoNotice, PageHeader, SectionCard } from '@/components/ui/primitives';
import { IconArrowLeft, IconSparkles } from '@/components/ui/icons';

type Resposta = {
  pergunta: string;
  resposta: string;
  base: string;
  links: Array<{ href: string; label: string }>;
};

const SUGESTOES = [
  'Quanto a prefeitura gastou e pagou?',
  'Quantas obras estão paralisadas?',
  'Quais contratos têm aditivo?',
  'Quais alertas de severidade alta existem?',
  'Quem são os maiores fornecedores fictícios?',
];

function responder(pergunta: string): Resposta {
  const texto = pergunta.toLowerCase();

  if (texto.includes('paralisad') || texto.includes('obra')) {
    const paralisadas = obras.filter((obra) => obra.status === 'paralisada');
    return {
      pergunta,
      resposta:
        paralisadas.length === 0
          ? 'Nenhuma obra aparece como paralisada nesta base fictícia.'
          : `A base fictícia tem ${paralisadas.length} obra(s) paralisada(s), somando ${formatBRL(
              paralisadas.reduce((total, obra) => total + obra.valorContratado, 0),
              { decimals: false },
            )} em valor contratado. Veja a lista completa na seção Obras, filtrando por situação "Paralisada".`,
      base: 'Dados fictícios de obras do bundle de demonstração.',
      links: [{ href: '/obras', label: 'Abrir Obras' }],
    };
  }

  if (texto.includes('aditivo') || texto.includes('contrato')) {
    const comAditivo = contratos.filter((contrato) => contrato.aditivos > 0);
    const maior = [...comAditivo].sort((a, b) => b.percentualAditivo - a.percentualAditivo)[0];
    return {
      pergunta,
      resposta: `${comAditivo.length} de ${contratos.length} contratos fictícios possuem aditivo. O maior percentual é ${maior ? maior.percentualAditivo.toFixed(1) : '0'}% no contrato ${maior?.numero ?? '—'}. Aditivo não é irregularidade: depende de justificativa, base legal e limites.`,
      base: 'Dados fictícios de contratos do bundle de demonstração.',
      links: [{ href: '/contratos', label: 'Abrir Contratos' }],
    };
  }

  if (texto.includes('alerta') || texto.includes('irregular')) {
    return {
      pergunta,
      resposta: `Existem ${ALERTAS_RESUMO.total} alertas fictícios gerados por regras, sendo ${ALERTAS_RESUMO.alta} de severidade alta e ${ALERTAS_RESUMO.abertos} em aberto. Alertas apontam onde olhar; não são conclusão de irregularidade.`,
      base: 'Regras determinísticas aplicadas à base fictícia de alertas.',
      links: [{ href: '/alertas', label: 'Abrir Alertas' }],
    };
  }

  if (texto.includes('fornecedor') || texto.includes('empresa')) {
    const mapa = new Map<string, number>();
    for (const contrato of contratos) {
      mapa.set(contrato.fornecedor, (mapa.get(contrato.fornecedor) ?? 0) + contrato.valor);
    }
    const ranking = [...mapa.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return {
      pergunta,
      resposta: `Ranking fictício por valor contratado: ${ranking
        .map(([nome, valor], indice) => `${indice + 1}) ${nome} — ${formatBRLCompact(valor)}`)
        .join('; ')}. Concentração de contratos em poucos fornecedores é um sinal para conferência, não uma conclusão.`,
      base: 'Soma dos contratos fictícios por fornecedor.',
      links: [{ href: '/contratos', label: 'Abrir Contratos' }],
    };
  }

  if (texto.includes('gasto') || texto.includes('dinheiro') || texto.includes('orçamento') || texto.includes('despesa')) {
    return {
      pergunta,
      resposta: `Na base fictícia, a despesa empenhada é ${formatBRL(FINANCAS_RESUMO.despesaEmpenhada, { decimals: false })}, a liquidada ${formatBRL(
        FINANCAS_RESUMO.despesaLiquidada,
        { decimals: false },
      )} e a paga ${formatBRL(FINANCAS_RESUMO.despesaPaga, { decimals: false })}. A receita arrecadada é ${formatBRL(
        FINANCAS_RESUMO.receitaArrecadada,
        { decimals: false },
      )}.`,
      base: 'Resumo fictício de finanças do bundle de demonstração.',
      links: [{ href: '/dinheiro-publico', label: 'Abrir Dinheiro Público' }],
    };
  }

  if (texto.includes('obra') || texto.includes('execu')) {
    return {
      pergunta,
      resposta: `A base fictícia registra ${OBRAS_RESUMO.total} obras: ${OBRAS_RESUMO.emExecucao} em execução, ${OBRAS_RESUMO.paralisadas} paralisadas e ${OBRAS_RESUMO.concluidas} concluídas, com ${formatBRLCompact(
        OBRAS_RESUMO.valorContratado,
      )} contratados.`,
      base: 'Resumo fictício de obras.',
      links: [{ href: '/obras', label: 'Abrir Obras' }],
    };
  }

  return {
    pergunta,
    resposta: `Não encontrei uma regra local para "${pergunta}". Nesta versão de demonstração o assistente responde apenas sobre gastos, obras, contratos, fornecedores e alertas da base fictícia. Nenhum modelo de linguagem externo está conectado.`,
    base: 'Modo demonstração local, sem provedor de IA.',
    links: [
      { href: '/fontes', label: 'Ver fontes e roadmap' },
      { href: '/contratos', label: 'Explorar contratos' },
    ],
  };
}

export default function ObservaAI() {
  const [pergunta, setPergunta] = useState('');
  const [historico, setHistorico] = useState<Resposta[]>([]);

  const exemplos = useMemo(() => SUGESTOES, []);

  const enviar = (texto: string) => {
    const limpo = texto.trim();
    if (!limpo) return;
    setHistorico((atual) => [responder(limpo), ...atual].slice(0, 6));
    setPergunta('');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Assistente cívico"
        title="OBSERVA AI"
        description="Um assistente para traduzir os dados da plataforma em linguagem simples. Nesta entrega ele funciona em modo demonstração local: responde por regras sobre os dados fictícios, sem provedor de IA conectado."
        icon={<IconSparkles size={22} />}
      />

      <div className="mb-4 space-y-2.5">
        <DemoNotice>
          Modo demonstração local: as respostas vêm de regras determinísticas sobre os dados fictícios do próprio app.
          Nenhuma API de IA está conectada e nenhuma pergunta é enviada para fora do navegador.
        </DemoNotice>
        <Callout tone="warning" title="O assistente não conclui irregularidade">
          As respostas resumem números e apontam onde conferir. Elas nunca afirmam que alguém cometeu irregularidade e
          não substituem análise documental.
        </Callout>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Card className="p-3.5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                enviar(pergunta);
              }}
              className="space-y-2"
            >
              <label htmlFor="observa-ai-pergunta" className="text-[11px] font-semibold text-slate-700">
                Faça uma pergunta sobre os dados da plataforma
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="observa-ai-pergunta"
                  value={pergunta}
                  onChange={(event) => setPergunta(event.target.value)}
                  placeholder="Ex.: quais obras estão paralisadas?"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-brand-700"
                >
                  <IconSparkles size={15} /> Perguntar
                </button>
              </div>
            </form>

            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Perguntas de exemplo</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {exemplos.map((exemplo) => (
                  <button
                    key={exemplo}
                    type="button"
                    onClick={() => enviar(exemplo)}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    {exemplo}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {historico.length === 0 ? (
            <SectionCard title="Conversa" description="As respostas aparecem aqui">
              <p className="rounded-lg bg-slate-50 p-3 text-[12px] leading-relaxed text-slate-500">
                Nenhuma pergunta ainda. Toque em um exemplo acima ou escreva a sua. O assistente consulta apenas a base
                fictícia carregada no aplicativo.
              </p>
            </SectionCard>
          ) : (
            <div className="space-y-2.5">
              {historico.map((item, indice) => (
                <Card key={`${item.pergunta}-${indice}`} className="p-3.5">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 rounded-md bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Você
                    </span>
                    <p className="text-[12px] font-medium text-slate-800">{item.pergunta}</p>
                  </div>
                  <div className="mt-2 flex items-start gap-2 border-t border-slate-100 pt-2">
                    <span className="mt-0.5 rounded-md bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Observa
                    </span>
                    <div>
                      <p className="text-[12px] leading-relaxed text-slate-700">{item.resposta}</p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                        <Badge tone="neutral">modo local</Badge>
                        {item.base}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {item.links.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 transition hover:bg-brand-100"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <SectionCard title="O que o assistente pode fazer" description="Limites explícitos desta versão">
            <ul className="space-y-2 text-[11px] leading-relaxed text-slate-600">
              <li>• Somar valores e contar registros da base fictícia.</li>
              <li>• Explicar conceitos como empenho, liquidação e aditivo.</li>
              <li>• Indicar qual seção da plataforma abre o detalhe.</li>
              <li>• Listar sinais (alertas) com o critério aplicado.</li>
            </ul>
            <div className="mt-2.5 rounded-lg bg-rose-50 p-2.5 text-[11px] leading-relaxed text-rose-900">
              <strong>Não faz:</strong> afirmar irregularidade, apontar culpados, prever resultados ou responder sobre
              dados reais — nada disso está disponível nesta entrega.
            </div>
          </SectionCard>

          <SectionCard title="Roadmap da integração" description="Previsto, ainda não ativo">
            <ol className="space-y-1.5 text-[11px] leading-relaxed text-slate-600">
              <li>1. API FastAPI com consultas somente leitura sobre PostgreSQL.</li>
              <li>2. Camada de recuperação de contexto com citação obrigatória da fonte.</li>
              <li>3. Provedor de IA configurado por variável de ambiente no servidor.</li>
              <li>4. Registro de cada resposta com fontes e data de consulta.</li>
            </ol>
            <p className="mt-2 text-[10px] text-slate-400">
              Nenhuma chave de API é usada no frontend. Ver{' '}
              <Link to="/fontes" className="font-semibold text-brand-700 underline">
                Fontes
              </Link>
              .
            </p>
          </SectionCard>

          <Card className="p-3.5">
            <p className="text-[11px] font-semibold text-slate-800">Transparência do assistente</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              Cada resposta informa a base usada. Se a pergunta sair do escopo, o assistente diz que não sabe — em vez
              de inventar.
            </p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline"
            >
              <IconArrowLeft size={13} /> Voltar para a visão geral
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
