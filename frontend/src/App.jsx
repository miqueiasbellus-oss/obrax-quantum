import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://obrax-api.onrender.com";

export default function App() {
  const [status, setStatus] = useState("carregando...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((d) => setStatus(JSON.stringify(d, null, 2)))
      .catch((e) => setStatus(`Erro: ${e.message}`));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>OBRAX QUANTUM</h1>
      <p>API_URL: <code>{API_URL}</code></p>
      <p>Resposta do /health:</p>
      <pre>{status}</pre>
    </div>
  );
}