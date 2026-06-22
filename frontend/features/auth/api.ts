import apiClient from '@/lib/axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const authService = {
  login: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/login', request);
    return response.data;
  },

  register: async (request: RegisterRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/register', request);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/api/auth/logout', { refreshToken });
  },
};
