/** Configuração única de navegação — usada pela sidebar, drawer e busca. */
import type { ComponentType } from 'react';
import {
  IconBell,
  IconBuilding,
  IconCap,
  IconChart,
  IconFile,
  IconGavel,
  IconHardHat,
  IconHeart,
  IconHome,
  IconLink,
  IconMap,
  IconNewspaper,
  IconSparkles,
  IconWallet,
  IconWrench,
} from '@/components/ui/icons';

export interface NavItem {
  to: string;
  label: string;
  short: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Painel',
    items: [
      {
        to: '/',
        label: 'Visão Geral',
        short: 'Visão Geral',
        description: 'Resumo do município e atalhos',
        icon: IconHome,
      },
      {
        to: '/dinheiro-publico',
        label: 'Dinheiro Público',
        short: 'Dinheiro',
        description: 'Receitas, despesas e execução',
        icon: IconWallet,
      },
    ],
  },
  {
    title: 'Compras e obras',
    items: [
      {
        to: '/contratos',
        label: 'Contratos',
        short: 'Contratos',
        description: 'Contratos administrativos e aditivos',
        icon: IconFile,
      },
      {
        to: '/licitacoes',
        label: 'Licitações',
        short: 'Licitações',
        description: 'Processos licitatórios e dispensas',
        icon: IconGavel,
      },
      {
        to: '/obras',
        label: 'Obras',
        short: 'Obras',
        description: 'Execução física e prazos',
        icon: IconHardHat,
      },
    ],
  },
  {
    title: 'Políticas públicas',
    items: [
      {
        to: '/saude',
        label: 'Saúde',
        short: 'Saúde',
        description: 'Unidades e indicadores',
        icon: IconHeart,
      },
      {
        to: '/educacao',
        label: 'Educação',
        short: 'Educação',
        description: 'Escolas, vagas e indicadores',
        icon: IconCap,
      },
      {
        to: '/servicos',
        label: 'Serviços Municipais',
        short: 'Serviços',
        description: 'Atendimentos e cobertura',
        icon: IconWrench,
      },
      {
        to: '/administracao',
        label: 'Administração',
        short: 'Administração',
        description: 'Secretarias, estrutura e pessoal',
        icon: IconBuilding,
      },
    ],
  },
  {
    title: 'Transparência ativa',
    items: [
      {
        to: '/publicacoes',
        label: 'Publicações Oficiais',
        short: 'Publicações',
        description: 'Atos, decretos e portarias',
        icon: IconNewspaper,
      },
      {
        to: '/mapa',
        label: 'OBSERVA Mapa Vivo',
        short: 'Mapa Vivo',
        description: 'Território e equipamentos',
        icon: IconMap,
      },
      {
        to: '/ia',
        label: 'OBSERVA AI',
        short: 'OBSERVA AI',
        description: 'Busca assistida em linguagem natural',
        icon: IconSparkles,
      },
      {
        to: '/alertas',
        label: 'Alertas',
        short: 'Alertas',
        description: 'Pontos de atenção para checagem',
        icon: IconBell,
      },
    ],
  },
  {
    title: 'Consultas',
    items: [
      {
        to: '/relatorios',
        label: 'Relatórios',
        short: 'Relatórios',
        description: 'Séries, cruzamentos e exportação',
        icon: IconChart,
      },
      {
        to: '/fontes',
        label: 'Fontes',
        short: 'Fontes',
        description: 'Origem dos dados e glossário',
        icon: IconLink,
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

/** Itens da barra inferior do celular (5 no máximo, padrão Android). */
export const BOTTOM_NAV: Array<{ to: string; label: string; icon: NavItem['icon'] }> = [
  { to: '/', label: 'Início', icon: IconHome },
  { to: '/contratos', label: 'Contratos', icon: IconFile },
  { to: '/mapa', label: 'Mapa', icon: IconMap },
  { to: '/alertas', label: 'Alertas', icon: IconBell },
];
