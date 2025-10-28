import api from './api';
import { LoginRequest, LoginResponse, Usuario, ApiResponse } from '@/types';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  // Logout
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  // Obter dados do usuário atual
  async getMe(): Promise<Usuario> {
    const response = await api.get<ApiResponse<Usuario>>('/auth/me');
    return response.data.data!;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data!;
  },
};

