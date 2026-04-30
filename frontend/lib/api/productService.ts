import apiClient from './client';
import { Product } from '@/lib/utils/types';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/api/products');
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};
