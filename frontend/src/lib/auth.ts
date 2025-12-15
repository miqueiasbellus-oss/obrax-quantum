import apiClient, { TOKEN_KEY } from "./api";

const authService = {
  async login(username: string, password: string) {
    const res = await apiClient.post("/auth/login", { username, password });
    const { access_token } = res.data;
    localStorage.setItem(TOKEN_KEY, access_token);
    return res.data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default authService;
