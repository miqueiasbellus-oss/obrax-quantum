import axios from "axios";

const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL ||
  (window as any)?.API_URL ||
  "https://obrax-backend.onrender.com";

export const TOKEN_KEY = "OBRAX_TOKEN";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Adiciona token automaticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erro 401
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default apiClient;
