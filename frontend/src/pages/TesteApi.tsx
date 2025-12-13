import { useState } from "react";
import auth from "../lib/auth";
import api from "../lib/api";

export default function TesteApi() {
  const [log, setLog] = useState<any>(null);

  async function doLogin() {
    const r = await auth.login({ username: "admin2", password: "123456" });
    setLog(r);
  }

  async function listarObras() {
    const r = await api.get("/api/works");
    setLog(r.data);
  }

  async function criarObra() {
    const r = await api.post("/api/works", {
      name: "OBRA DEMO - Torre Infinita (Piloto)",
      work_type: "RESIDENTIAL",
      status: "ACTIVE",
      location: "Itajaí/SC",
      description: "Obra piloto para validar OBRAX QUANTUM em produção.",
      start_date: "2025-12-01T00:00:00Z",
      end_date: "2026-06-30T00:00:00Z",
      budget: 3500000,
    });
    setLog(r.data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Teste API OBRAX</h2>

      <button onClick={doLogin}>1) Login</button>{" "}
      <button onClick={listarObras}>2) Listar Obras</button>{" "}
      <button onClick={criarObra}>3) Criar Obra</button>

      <pre style={{ marginTop: 20, background: "#111", color: "#0f0", padding: 12 }}>
        {JSON.stringify(log, null, 2)}
      </pre>
    </div>
  );
}
