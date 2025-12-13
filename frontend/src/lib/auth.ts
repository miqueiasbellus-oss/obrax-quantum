import apiClient from "./api";

const authService = {
  async login(username, password) {
    const res = await apiClient.post("/auth/login", { username, password });
    const { access_token } = res.data;
    localStorage.setItem("access_token", access_token);
    return res.data;
  },

  logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  },

  getToken() {
    return localStorage.getItem("access_token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};

export default authService;
