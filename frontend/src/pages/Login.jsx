import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin2");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate("/obras", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Erro ao fazer login";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: 360, border: "1px solid #333", borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: 0 }}>OBRAX QUANTUM</h2>
        <p style={{ opacity: 0.8, marginTop: 6 }}>Login</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            disabled={loading}
            style={{ padding: 10, borderRadius: 10 }}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            disabled={loading}
            style={{ padding: 10, borderRadius: 10 }}
          />
          <button disabled={loading} style={{ padding: 10, borderRadius: 10, cursor: "pointer" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {error ? <div style={{ color: "tomato" }}>{error}</div> : null}
        </form>
      </div>
    </div>
  );
}
