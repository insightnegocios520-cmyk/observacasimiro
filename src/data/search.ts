/** Pesquisa global: varre todos os conjuntos fictícios e devolve links diretos. */
import { matchText } from '@/lib/filters';
import { alertas } from './alertas';
import { contratos, licitacoes } from './compras';
import { fontes } from './fontes';
import { obras } from './obras';
import { publicacoes } from './publicacoes';
import { escolas, secretarias, servicos, unidadesSaude } from './setores';
import type { MapaPonto } from './types';

export interface SearchResult {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  meta: string;
  href: string;
  secao: string;
}

function buildIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  for (const contrato of contratos) {
    index.push({
      id: `s-${contrato.id}`,
      tipo: 'Contrato',
      titulo: `${contrato.numero} — ${contrato.objeto}`,
      descricao: `${contrato.fornecedor} · ${contrato.secretaria}`,
      meta: `${contrato.status} · ${contrato.dataAssinatura.slice(0, 4)}`,
      href: `/contratos?q=${encodeURIComponent(contrato.numero)}`,
      secao: 'Contratos',
    });
  }

  for (const licitacao of licitacoes) {
    index.push({
      id: `s-${licitacao.id}`,
      tipo: 'Licitação',
      titulo: `${licitacao.numero} — ${licitacao.objeto}`,
      descricao: `${licitacao.modalidade} · ${licitacao.secretaria}`,
      meta: `${licitacao.status} · ${licitacao.dataAbertura.slice(0, 4)}`,
      href: `/licitacoes?q=${encodeURIComponent(licitacao.numero)}`,
      secao: 'Licitações',
    });
  }

  for (const obra of obras) {
    index.push({
      id: `s-${obra.id}`,
      tipo: 'Obra',
      titulo: obra.nome,
      descricao: `${obra.bairro} · ${obra.empresa}`,
      meta: `${obra.status} · ${obra.percentualExecucao}%`,
      href: `/obras?q=${encodeURIComponent(obra.nome)}`,
      secao: 'Obras',
    });
  }

  for (const publicacao of publicacoes) {
    index.push({
      id: `s-${publicacao.id}`,
      tipo: 'Publicação',
      titulo: publicacao.titulo,
      descricao: publicacao.resumo,
      meta: `${publicacao.orgao} · ${publicacao.data}`,
      href: `/publicacoes?q=${encodeURIComponent(publicacao.numero)}`,
      secao: 'Publicações Oficiais',
    });
  }

  for (const alerta of alertas) {
    index.push({
      id: `s-${alerta.id}`,
      tipo: 'Alerta',
      titulo: alerta.titulo,
      descricao: alerta.descricao,
      meta: `Severidade ${alerta.severidade} · ${alerta.status}`,
      href: `/alertas?q=${encodeURIComponent(alerta.titulo)}`,
      secao: 'Alertas',
    });
  }

  for (const escola of escolas) {
    index.push({
      id: `s-${escola.id}`,
      tipo: 'Escola',
      titulo: escola.nome,
      descricao: `${escola.bairro} · ${escola.etapas}`,
      meta: `${escola.matriculas} matrículas`,
      href: `/educacao?q=${encodeURIComponent(escola.nome)}`,
      secao: 'Educação',
    });
  }

  for (const unidade of unidadesSaude) {
    index.push({
      id: `s-${unidade.id}`,
      tipo: 'Unidade de saúde',
      titulo: unidade.nome,
      descricao: `${unidade.tipo} · ${unidade.bairro}`,
      meta: unidade.status,
      href: `/saude?q=${encodeURIComponent(unidade.nome)}`,
      secao: 'Saúde',
    });
  }

  for (const servico of servicos) {
    index.push({
      id: `s-${servico.id}`,
      tipo: 'Serviço',
      titulo: servico.nome,
      descricao: `${servico.categoria} · ${servico.canal}`,
      meta: `Prazo ${servico.prazoDias} dias`,
      href: `/servicos-municipais?q=${encodeURIComponent(servico.nome)}`,
      secao: 'Serviços Municipais',
    });
  }

  for (const secretaria of secretarias) {
    index.push({
      id: `s-${secretaria.id}`,
      tipo: 'Secretaria',
      titulo: `${secretaria.nome} (${secretaria.sigla})`,
      descricao: secretaria.atribuicao,
      meta: `${secretaria.servidores} servidores`,
      href: `/administracao?q=${encodeURIComponent(secretaria.nome)}`,
      secao: 'Administração',
    });
  }

  for (const fonte of fontes) {
    index.push({
      id: `s-${fonte.id}`,
      tipo: 'Fonte',
      titulo: fonte.nome,
      descricao: fonte.descricao,
      meta: `${fonte.tipo} · ${fonte.status}`,
      href: `/fontes?q=${encodeURIComponent(fonte.nome)}`,
      secao: 'Fontes',
    });
  }

  return index;
}

export const searchIndex: SearchResult[] = buildIndex();

export function searchAll(query: string, limit = 60): SearchResult[] {
  if (!query.trim()) return [];
  return searchIndex
    .filter((item) => matchText(query, item.titulo, item.descricao, item.meta, item.tipo))
    .slice(0, limit);
}

/** Sugestões para a barra de busca quando ainda não há consulta. */
export const SUGESTOES_BUSCA = [
  'pavimentação',
  'medicamentos',
  'transporte escolar',
  'pregão eletrônico',
  'UBS Centro',
  'obra paralisada',
];

export function mapaPontosParaBusca(pontos: MapaPonto[]): MapaPonto[] {
  return pontos;
}
