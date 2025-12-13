import { useEffect, useState } from "react";
import apiClient from "../lib/api";
import authService from "../lib/auth";

export default function Obras() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    work_type: "RESIDENTIAL",
    status: "ACTIVE",
    location: "",
    description: "",
    start_date: "2025-12-01",
    end_date: "2026-06-30",
    budget: 3500000,
  });

  async function fetchWorks() {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/works");
      setWorks(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorks();
  }, []);

  async function createWork(e) {
    e.preventDefault();

    const payload = {
      ...form,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : undefined,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : undefined,
    };

    await apiClient.post("/api/works", payload);
    setForm((f) => ({ ...f, name: "" }));
    fetchWorks();
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Obras</h2>
        <button onClick={() => authService.logout()} style={{ padding: 8, borderRadius: 10 }}>
          Sair
        </button>
      </div>

      <form onSubmit={createWork} style={{ marginTop: 16, display: "grid", gap: 8, maxWidth: 520 }}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nome da obra"
          required
          style={{ padding: 10, borderRadius: 10 }}
        />
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Localização"
          required
          style={{ padding: 10, borderRadius: 10 }}
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descrição"
          rows={3}
          style={{ padding: 10, borderRadius: 10 }}
        />

        <button style={{ padding: 10, borderRadius: 10, cursor: "pointer" }}>
          Criar Obra
        </button>
      </form>

      <hr style={{ margin: "16px 0" }} />

      {loading ? (
        <div>Carregando...</div>
      ) : works.length === 0 ? (
        <div>Nenhuma obra cadastrada ainda.</div>
      ) : (
        <ul style={{ display: "grid", gap: 10, padding: 0, listStyle: "none" }}>
          {works.map((w) => (
            <li key={w.id} style={{ border: "1px solid #333", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{w.name}</div>
              <div style={{ opacity: 0.85 }}>{w.location}</div>
              <div style={{ opacity: 0.75, marginTop: 6 }}>
                {w.work_type} • {w.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
