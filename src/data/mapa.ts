/**
 * OBSERVA MAPA VIVO — pontos do mapa esquemático.
 *
 * As coordenadas x/y são percentuais dentro de um contorno ilustrativo do
 * município. NÃO são georreferenciadas e não representam limites oficiais.
 * A versão com geometria real usará PostGIS + camadas GeoJSON.
 */
import { formatBRLCompact } from '@/lib/format';
import { obras } from './obras';
import { escolas, servicos, unidadesSaude } from './setores';
import type { MapaPonto } from './types';

export const CAMADAS_MAPA = [
  { value: 'obras', label: 'Obras', cor: '#f59e0b' },
  { value: 'saúde', label: 'Saúde', cor: '#e11d48' },
  { value: 'educação', label: 'Educação', cor: '#2563eb' },
  { value: 'serviços', label: 'Serviços', cor: '#0f766e' },
] as const;

export const mapaPontos: MapaPonto[] = [
  ...obras.map<MapaPonto>((obra) => ({
    id: obra.id,
    nome: obra.nome,
    camada: 'obras',
    categoria: 'Obra pública',
    bairro: obra.bairro,
    status: obra.status,
    detalhe: `${obra.percentualExecucao}% executado · ${formatBRLCompact(obra.valorContratado)}`,
    x: obra.mapa.x,
    y: obra.mapa.y,
    href: `/obras?q=${encodeURIComponent(obra.nome)}`,
  })),
  ...unidadesSaude.map<MapaPonto>((unidade) => ({
    id: unidade.id,
    nome: unidade.nome,
    camada: 'saúde',
    categoria: unidade.tipo,
    bairro: unidade.bairro,
    status: unidade.status,
    detalhe: `${unidade.atendimentosMes.toLocaleString('pt-BR')} atendimentos/mês`,
    x: unidade.mapa.x,
    y: unidade.mapa.y,
    href: `/saude?q=${encodeURIComponent(unidade.nome)}`,
  })),
  ...escolas.map<MapaPonto>((escola) => ({
    id: escola.id,
    nome: escola.nome,
    camada: 'educação',
    categoria: 'Escola municipal',
    bairro: escola.bairro,
    status: 'em funcionamento',
    detalhe: `${escola.matriculas} matrículas · ${escola.turmas} turmas`,
    x: escola.mapa.x,
    y: escola.mapa.y,
    href: `/educacao?q=${encodeURIComponent(escola.nome)}`,
  })),
  ...servicos.map<MapaPonto>((servico) => ({
    id: servico.id,
    nome: servico.nome,
    camada: 'serviços',
    categoria: servico.categoria,
    bairro: 'Atendimento municipal',
    status: servico.status,
    detalhe: `Prazo ${servico.prazoDias} dias · ${servico.atendimentosMes} atendimentos/mês`,
    x: servico.mapa.x,
    y: servico.mapa.y,
    href: '/servicos-municipais',
  })),
];

export const MAPA_RESUMO = {
  total: mapaPontos.length,
  obras: mapaPontos.filter((p) => p.camada === 'obras').length,
  saude: mapaPontos.filter((p) => p.camada === 'saúde').length,
  educacao: mapaPontos.filter((p) => p.camada === 'educação').length,
  servicos: mapaPontos.filter((p) => p.camada === 'serviços').length,
};
