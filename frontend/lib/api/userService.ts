import apiClient from './client';
import { User, Address, WishlistItem } from '@/lib/utils/types';

export const userService = {
  getProfile: async (): Promise<User> => {
    // In a real app, this would use the sub from JWT or a /me endpoint
    // For now, we use a generic placeholder or fetch by ID if we have it
    const response = await apiClient.get<User>('/api/users/profile');
    return response.data;
  },

  getAddresses: async (userId: number): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>(`/api/users/${userId}/addresses`);
    return response.data;
  },

  addAddress: async (userId: number, address: Partial<Address>): Promise<User> => {
    const response = await apiClient.post<User>(`/api/users/${userId}/addresses`, address);
    return response.data;
  },

  getWishlist: async (userId: number): Promise<WishlistItem[]> => {
    const response = await apiClient.get<WishlistItem[]>(`/api/users/${userId}/wishlist`);
    return response.data;
  },

  addToWishlist: async (userId: number, productId: number, productName: string): Promise<User> => {
    const response = await apiClient.post<User>(`/api/users/${userId}/wishlist?productId=${productId}&productName=${productName}`, {});
    return response.data;
  },
};
