import apiClient, { TOKEN_KEY } from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    return response.data;
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}

export default new AuthService();
