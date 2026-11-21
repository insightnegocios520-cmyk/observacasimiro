/** Página 404 — rota inexistente com atalhos para as seções principais. */
import { Link } from 'react-router-dom';
import { ActionCard, PageHeader } from '@/components/ui/primitives';
import {
  IconAlert,
  IconBell,
  IconFile,
  IconHardHat,
  IconHome,
  IconMap,
  IconSearch,
} from '@/components/ui/icons';

export default function NaoEncontrado() {
  return (
    <div>
      <PageHeader
        eyebrow="Erro 404"
        title="Página não encontrada"
        description="O endereço acessado não existe nesta versão do OBSERVA. Use um dos atalhos abaixo para continuar navegando."
        icon={<IconAlert size={22} />}
      />

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        <ActionCard to="/" title="Visão Geral" description="Painel com os principais indicadores da plataforma." icon={<IconHome size={18} />} LinkComponent={Link} />
        <ActionCard to="/contratos" title="Contratos" description="Lista filtrável de contratos administrativos fictícios." icon={<IconFile size={18} />} LinkComponent={Link} />
        <ActionCard to="/obras" title="Obras" description="Execução física e financeira das obras mapeadas." icon={<IconHardHat size={18} />} LinkComponent={Link} />
        <ActionCard to="/mapa-vivo" title="OBSERVA MAPA VIVO" description="Pontos de saúde, educação, obras e serviços." icon={<IconMap size={18} />} LinkComponent={Link} />
        <ActionCard to="/alertas" title="Alertas" description="Sinais objetivos que merecem conferência documental." icon={<IconBell size={18} />} LinkComponent={Link} />
        <ActionCard to="/busca" title="Busca" description="Pesquise em todas as seções da plataforma." icon={<IconSearch size={18} />} LinkComponent={Link} />
      </div>
    </div>
  );
}
