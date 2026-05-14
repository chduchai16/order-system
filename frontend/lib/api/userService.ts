import apiClient from './client';
import { tokenStore } from './tokenStore';
import { User, Address, WishlistItem } from '@/lib/utils/types';

const getCurrentUserId = (): number => {
  const userId = tokenStore.getUserId();
  if (!userId) {
    throw new Error('User is not authenticated');
  }
  return userId;
};

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(`/api/users/${getCurrentUserId()}`);
    return response.data;
  },

  getAddresses: async (userId = getCurrentUserId()): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>(`/api/users/${userId}/addresses`);
    return response.data;
  },

  addAddress: async (userId: number, address: Partial<Address>): Promise<User> => {
    const response = await apiClient.post<User>(`/api/users/${userId}/addresses`, address);
    return response.data;
  },

  addMyAddress: async (address: Partial<Address>): Promise<User> => {
    const response = await apiClient.post<User>(`/api/users/${getCurrentUserId()}/addresses`, address);
    return response.data;
  },

  getWishlist: async (userId = getCurrentUserId()): Promise<WishlistItem[]> => {
    const response = await apiClient.get<WishlistItem[]>(`/api/users/${userId}/wishlist`);
    return response.data;
  },

  addToWishlist: async (userId: number, productId: number, productName: string): Promise<User> => {
    const response = await apiClient.post<User>(`/api/users/${userId}/wishlist?productId=${productId}&productName=${productName}`, {});
    return response.data;
  },
};
