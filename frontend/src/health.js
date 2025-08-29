const API_URL = import.meta.env.VITE_API_URL || "https://obrax-api.onrender.com";

async function check() {
  try {
    const r = await fetch(`${API_URL}/health`, { cache: "no-store" });
    const d = await r.json();

    document.querySelector("[data-health]")?.classList.add("ok");
    document.querySelector("[data-health-text]")?.textContent = "Backend Conectado!";
    document.querySelector("[data-health-status]")?.textContent = d.status ?? "online";
    document.querySelector("[data-health-version]")?.textContent = d.version ?? "";
  } catch (e) {
    document.querySelector("[data-health]")?.classList.add("fail");
    document.querySelector("[data-health-text]")?.textContent = "Backend Offline";
  }
}
check();