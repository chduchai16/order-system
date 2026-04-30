import apiClient from './client';
import { TokenResponse } from '@/lib/utils/types';

export const authService = {
  login: async (username: string, password: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  register: async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/register', {
      firstName,
      lastName,
      username,
      email,
      password,
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
