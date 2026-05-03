export const jwtDecoder = {
  decodeToken: (token: string): Record<string, unknown> => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return {};
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {};
    }
  },

  getKeycloakId: (token: string): string | null => {
    const decoded = jwtDecoder.decodeToken(token);
    return (decoded.sub as string) || null;
  },

  getTokenExpiry: (token: string): number => {
    const decoded = jwtDecoder.decodeToken(token);
    return ((decoded.exp as number) || 0) * 1000;
  },

  getTokenRoles: (token: string): string[] => {
    const decoded = jwtDecoder.decodeToken(token);
    return ((decoded.realm_access as { roles?: string[] })?.roles) || [];
  },
};
