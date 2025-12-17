import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Status from "./pages/Status";
import ComingSoon from "./pages/ComingSoon";
import ProgramacaoQuinzenal from "./pages/ProgramacaoQuinzenal";
import PainelEncarregado from "./pages/PainelEncarregado";
import Login from "./pages/Login";
import Obras from "./pages/Obras";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://obrax-api.onrender.com";

export default function App() {
  const [apiStatus, setApiStatus] = useState({
    online: false,
    error: false,
    version: null,
    timestamp: null,
  });

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();

        setApiStatus({
          online: data.status === "healthy" || data.status === "ok",
          error: false,
          version: data.version,
          timestamp: data.timestamp ? new Date(data.timestamp).toLocaleString() : null,
        });
      } catch (error) {
        setApiStatus({
          online: false,
          error: true,
          version: null,
          timestamp: null,
        });
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router basename="/obrax-quantum">
      <div className="app">
        <Navbar apiStatus={apiStatus} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home apiStatus={apiStatus} />} />
            <Route path="/status" element={<Status />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />

            {/* OBRAS (PROTEGIDO) */}
            <Route
              path="/obras"
              element={
                <ProtectedRoute>
                  <Obras />
                </ProtectedRoute>
              }
            />

            {/* Sprint 1 - Funcionalidades Implementadas */}
            <Route path="/programacao-quinzenal" element={<ProgramacaoQuinzenal />} />
            <Route path="/painel-encarregado" element={<PainelEncarregado />} />

            {/* Rotas alternativas para compatibilidade */}
            <Route path="/programacao" element={<ProgramacaoQuinzenal />} />
            <Route path="/encarregado" element={<PainelEncarregado />} />

            <Route
              path="/equipes"
              element={
                <ComingSoon
                  title="Equipes de Campo"
                  description="Interface simplificada para encarregados e equipes registrarem progresso, problemas e evidências diretamente do campo."
                  expectedDate="Sprint 2 - Janeiro 2025"
                />
              }
            />

            <Route
              path="/checklists"
              element={
                <ComingSoon
                  title="Checklists Visuais"
                  description="Sistema de verificação de qualidade com captura de fotos, evidências e aprovações digitais em tempo real."
                  expectedDate="Sprint 2 - Janeiro 2025"
                />
              }
            />

            <Route
              path="/materiais"
              element={
                <ComingSoon
                  title="Controle de Materiais"
                  description="Gestão completa de solicitação, aprovação e rastreabilidade de materiais com controle de estoque integrado."
                  expectedDate="Sprint 4 - Março 2025"
                />
              }
            />

            <Route
              path="/dashboard"
              element={
                <ComingSoon
                  title="Dashboard Inteligente"
                  description="KPIs em tempo real, análises preditivas e insights com IA para otimização da gestão de obras."
                  expectedDate="Sprint 6 - Maio 2025"
                />
              }
            />

            <Route
              path="/erp"
              element={
                <ComingSoon
                  title="ERP Nativo"
                  description="Módulo financeiro completo com controle de custos, integração contábil e gestão administrativa."
                  expectedDate="Sprint 8 - Julho 2025"
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
