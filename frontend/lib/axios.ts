import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './auth';

type ApiResponse<T> = {
  status: number;
  title: string;
  message: string;
  data: T;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

const isApiResponse = <T = unknown>(payload: unknown): payload is ApiResponse<T> => {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    'status' in payload &&
    'title' in payload &&
    'message' in payload &&
    'data' in payload
  );
};

const unwrapApiResponse = <T = unknown>(payload: unknown): T => {
  return isApiResponse<T>(payload) ? payload.data : (payload as T);
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080'}/api/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        const tokenResponse = unwrapApiResponse<Record<string, string>>(response.data);
        const accessToken = tokenResponse.accessToken ?? tokenResponse.access_token;
        const newRefreshToken = tokenResponse.refreshToken ?? tokenResponse.refresh_token;
        if (!accessToken || !newRefreshToken) {
          throw new Error('Invalid refresh token response');
        }
        tokenStore.setTokens(accessToken, newRefreshToken);
        return accessToken;
      })
      .catch(() => {
        tokenStore.clearTokens();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isAuthRequest = config.url?.startsWith('/api/auth/');

  if (!isAuthRequest) {
    const accessToken = tokenStore.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  const userId = tokenStore.getUserId();
  if (!isAuthRequest && userId) {
    config.headers['X-User-Id'] = String(userId);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    response.data = unwrapApiResponse(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthRequest = originalRequest?.url?.startsWith('/api/auth/');

    if (error.response?.status !== 401 || originalRequest?._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      if (typeof window !== 'undefined') {
        window.location.assign('/login');
      }
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(originalRequest);
  }
);

export default apiClient;
export { apiClient };
