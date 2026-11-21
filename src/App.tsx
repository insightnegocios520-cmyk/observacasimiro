/** Rotas do OBSERVA — uma rota por seção do produto. */
import { Route, Routes } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import VisaoGeral from '@/pages/VisaoGeral';
import DinheiroPublico from '@/pages/DinheiroPublico';
import Contratos from '@/pages/Contratos';
import Licitacoes from '@/pages/Licitacoes';
import Obras from '@/pages/Obras';
import Saude from '@/pages/Saude';
import Educacao from '@/pages/Educacao';
import Servicos from '@/pages/Servicos';
import Administracao from '@/pages/Administracao';
import Publicacoes from '@/pages/Publicacoes';
import MapaVivo from '@/pages/MapaVivo';
import ObservaAI from '@/pages/ObservaAI';
import Alertas from '@/pages/Alertas';
import Relatorios from '@/pages/Relatorios';
import Fontes from '@/pages/Fontes';
import Busca from '@/pages/Busca';
import NaoEncontrado from '@/pages/NaoEncontrado';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<VisaoGeral />} />
        <Route path="dinheiro-publico" element={<DinheiroPublico />} />
        <Route path="contratos" element={<Contratos />} />
        <Route path="licitacoes" element={<Licitacoes />} />
        <Route path="obras" element={<Obras />} />
        <Route path="saude" element={<Saude />} />
        <Route path="educacao" element={<Educacao />} />
        <Route path="servicos" element={<Servicos />} />
        <Route path="servicos-municipais" element={<Servicos />} />
        <Route path="administracao" element={<Administracao />} />
        <Route path="publicacoes" element={<Publicacoes />} />
        <Route path="mapa" element={<MapaVivo />} />
        <Route path="mapa-vivo" element={<MapaVivo />} />
        <Route path="ia" element={<ObservaAI />} />
        <Route path="observa-ai" element={<ObservaAI />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="fontes" element={<Fontes />} />
        <Route path="busca" element={<Busca />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Route>
    </Routes>
  );
}
