const API_URL = window.API_URL || "https://obrax-api.onrender.com";

async function check() {
  try {
    const r = await fetch(API_URL + "/health", { cache: "no-store" });
    const d = await r.json();

    const box = document.querySelector("[data-health]");
    const text = document.querySelector("[data-health-text]");
    const status = document.querySelector("[data-health-status]");
    const version = document.querySelector("[data-health-version]");

    if (box) box.classList.add("ok");
    if (text) text.textContent = "Backend Conectado!";
    if (status) status.textContent = d.status || "online";
    if (version) version.textContent = d.version || "";
  } catch (e) {
    const box = document.querySelector("[data-health]");
    const text = document.querySelector("[data-health-text]");

    if (box) box.classList.add("fail");
    if (text) text.textContent = "Backend Offline";
  }
}

check();
