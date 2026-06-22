import apiClient from '@/lib/axios';
import { PageResponse, Voucher } from '@/components/types';

export const voucherService = {
  getVouchers: async (search = '', page = 0, size = 10): Promise<PageResponse<Voucher>> => {
    const response = await apiClient.get<PageResponse<Voucher>>('/api/vouchers', {
      params: { search, page, size },
    });
    return response.data;
  },
};
