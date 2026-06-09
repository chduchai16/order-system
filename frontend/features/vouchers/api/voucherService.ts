import apiClient from '@/features/shared/api/client';
import { PageResponse, Voucher } from '@/features/shared/types';

export const voucherService = {
  getVouchers: async (search = '', page = 0, size = 10): Promise<PageResponse<Voucher>> => {
    const response = await apiClient.get<PageResponse<Voucher>>('/api/vouchers', {
      params: { search, page, size },
    });
    return response.data;
  },
};
