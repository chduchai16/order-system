import apiClient from '@/features/shared/api/client';
import { Payment } from '@/features/shared/types';

export const paymentService = {
  getPaymentByOrderId: async (orderId: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/api/payments/order/${orderId}`);
    return response.data;
  },
};
