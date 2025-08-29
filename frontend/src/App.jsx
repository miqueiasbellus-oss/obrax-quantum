import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://obrax-api.onrender.com";

export default function App() {
  const [health, setHealth] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch(setErr);
  }, []);

  const online = !!health && String(health.status).toLowerCase() === "healthy";
  const ts = health?.timestamp ? new Date(health.timestamp).toLocaleString() : null;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">OBRAX <span>QUANTUM</span></div>
        <div className="actions">
          <span className={`pill ${online ? "ok" : err ? "bad" : "warn"}`}>
            {online ? "API Online" : err ? "API Offline" : "Conectando..."}
          </span>
          <a className="btn" href="#">Fazer Login</a>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Simples no Campo, Poderoso no Escritório</h1>
          <p>ERP nativo, controle total e obra viva. Zero surpresa, zero retrabalho, zero duplicidade.</p>
        </section>

        <section className={`status ${online ? "ok" : err ? "bad" : "warn"}`}>
          <strong>{online ? "✅ Backend Conectado!" : err ? "❌ Erro ao conectar" : "⏳ Conectando..."}</strong>
          <div className="muted">
            {online && <>API funcionando em <b>{ts}</b></>}
            {!online && !err && <>Tentando contato com a API...</>}
            {err && <>Não foi possível contatar a API.</>}
          </div>
          <div className="kv">
            <span>Versão:</span> <b>{health?.version ?? "—"}</b>
            <span>Status:</span> <b>{online ? "online" : err ? "offline" : "aguarde"}</b>
            <span>Docs:</span> <a href={`${API_URL}/docs`} target="_blank" rel="noreferrer">/docs</a>
            <span>Redoc:</span> <a href={`${API_URL}/redoc`} target="_blank" rel="noreferrer">/redoc</a>
          </div>
        </section>

        <section className="grid">
          <Card title="Gestão de Obras" desc="Controle completo de atividades, cronogramas e dependências." />
          <Card title="Equipes de Campo" desc="Interface simples para encarregados e equipes de execução." />
          <Card title="Checklists Visuais" desc="Verificações de qualidade com fotos e evidências." />
          <Card title="Controle de Materiais" desc="Solicitação, aprovação e rastreabilidade de materiais." />
          <Card title="Dashboard Inteligente" desc="KPIs em tempo real e insights com IA." />
          <Card title="ERP Nativo" desc="Controle financeiro e integração completa." />
        </section>

        <section className="sprint">
          <h3>Sprint 0 • Fundações</h3>
          <ul>
            <li className={online ? "done" : ""}><span>✔</span> Backend FastAPI configurado</li>
            <li className="done"><span>✔</span> Frontend Vite + React no Vercel</li>
            <li className={online ? "done" : ""}><span>✔</span> Conexão Frontend ↔ API</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function Card({ title, desc }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>{desc}</p>
      <button className="ghost">Abrir</button>
    </div>
  );
}