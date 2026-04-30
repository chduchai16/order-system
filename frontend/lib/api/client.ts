import axios, { AxiosInstance, AxiosError } from 'axios';
import { tokenManager } from '@/lib/auth/tokenManager';
import { jwtDecoder } from '@/lib/auth/jwtDecoder';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth headers
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenManager.getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = accessToken;
      
      // Extract keycloakId from token and add as header
      const tokenWithoutBearer = accessToken.replace('Bearer ', '');
      const keycloakId = jwtDecoder.getKeycloakId(tokenWithoutBearer);
      if (keycloakId) {
        config.headers['X-User-KeycloakId'] = keycloakId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Only retry on 401 and if we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token available, logout
          tokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { access_token, refresh_token } = response.data;
        tokenManager.setTokens(access_token, refresh_token);

        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        const keycloakId = jwtDecoder.getKeycloakId(access_token);
        if (keycloakId) {
          originalRequest.headers['X-User-KeycloakId'] = keycloakId;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
