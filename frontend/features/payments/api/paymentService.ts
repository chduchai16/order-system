import apiClient from '@/lib/axios';
import { Payment } from '@/components/types';

export const paymentService = {
  getPaymentByOrderId: async (orderId: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/api/payments/order/${orderId}`);
    return response.data;
  },
};
