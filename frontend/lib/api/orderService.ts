import apiClient from './client';
import { Order, CreateOrderRequest } from '@/lib/utils/types';

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/api/orders', request);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${id}`);
    return response.data;
  },
};
