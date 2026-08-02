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

type BackendTokenResponse = TokenResponse & {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
};

const normalizeTokenResponse = (tokens: BackendTokenResponse): TokenResponse => ({
  access_token: tokens.access_token ?? tokens.accessToken ?? '',
  refresh_token: tokens.refresh_token ?? tokens.refreshToken ?? '',
  token_type: tokens.token_type ?? tokens.tokenType ?? 'Bearer',
  expires_in: tokens.expires_in ?? tokens.expiresIn ?? 0,
});

export const authService = {
  login: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<BackendTokenResponse>('/api/auth/login', request);
    return normalizeTokenResponse(response.data);
  },

  register: async (request: RegisterRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<BackendTokenResponse>('/api/auth/register', request);
    return normalizeTokenResponse(response.data);
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/api/auth/logout', { refreshToken });
  },
};
