const ACCESS_TOKEN_KEY = 'order_system_access_token';
const REFRESH_TOKEN_KEY = 'order_system_refresh_token';

export interface JwtPayload {
  sub?: string;
  username?: string;
  email?: string;
  roles?: string[];
  exp?: number;
}

const isBrowser = () => typeof window !== 'undefined';

export const tokenStore = {
  getAccessToken: (): string | null => {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: () => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getPayload: (): JwtPayload | null => {
    const accessToken = tokenStore.getAccessToken();
    if (!accessToken) return null;

    try {
      const [, payload] = accessToken.split('.');
      if (!payload) return null;

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
      const decoded = window.atob(padded);
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  },

  getUserId: (): number | null => {
    const sub = tokenStore.getPayload()?.sub;
    return sub ? Number(sub) : null;
  },
};
