import apiClient from '@/lib/axios';
import { Voucher, PageResponse } from '@/components/types';

const VOUCHERS_OVERLAY_KEY = 'shop_vn_seller_vouchers_overlay';

const isBrowser = () => typeof window !== 'undefined';

const getOverlay = <T>(key: string): Record<string, T> => {
  if (!isBrowser()) return {};
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as Record<string, T>) : {};
  } catch {
    return {};
  }
};

const saveOverlay = <T>(key: string, data: Record<string, T>) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save overlay for ${key}:`, err);
  }
};

export const sellerVouchersService = {
  getVouchers: async (): Promise<Voucher[]> => {
    let backendVouchers: Voucher[] = [];
    try {
      const response = await apiClient.get<PageResponse<Voucher>>('/api/vouchers');
      backendVouchers = response.data.content || [];
    } catch (err) {
      console.warn('Fallback to mocked/seeded vouchers due to network error:', err);
    }

    const overlay = getOverlay<Voucher>(VOUCHERS_OVERLAY_KEY);
    const mergedList: Voucher[] = [...backendVouchers];

    // Merge local additions
    Object.keys(overlay).forEach((key) => {
      const exists = mergedList.some(v => String(v.id) === key);
      if (!exists) {
        mergedList.push(overlay[key]);
      } else {
        // Replace with modified versions
        const idx = mergedList.findIndex(v => String(v.id) === key);
        if (idx !== -1) {
          mergedList[idx] = { ...mergedList[idx], ...overlay[key] };
        }
      }
    });

    return mergedList;
  },

  createVoucher: async (voucherData: Omit<Voucher, 'id' | 'usedQuantity'>): Promise<Voucher> => {
    const newVoucher: Voucher = {
      ...voucherData,
      id: Date.now(),
      usedQuantity: 0,
    };

    try {
      // Mapping discount type to integer for Spring Boot DTO (FIXED = 0, PERCENT = 1, FREESHIP = 2)
      let typeInt = 0;
      if (voucherData.discountType === 'PERCENT') typeInt = 1;
      else if (voucherData.discountType === 'FREESHIP') typeInt = 2;

      await apiClient.post('/api/vouchers', {
        code: voucherData.code,
        name: voucherData.name,
        description: voucherData.description,
        discountType: typeInt,
        discountValue: voucherData.discountValue,
        maxDiscountValue: voucherData.maxDiscountValue,
        minOrderValue: voucherData.minOrderValue,
        totalQuantity: voucherData.totalQuantity,
        startDate: new Date(voucherData.startDate).toISOString(),
        endDate: new Date(voucherData.endDate).toISOString(),
        active: voucherData.active,
        conditions: [],
      });
    } catch (err) {
      console.warn('Backend voucher creation failed, saving locally:', err);
    }

    const overlay = getOverlay<Partial<Voucher>>(VOUCHERS_OVERLAY_KEY);
    overlay[String(newVoucher.id)] = newVoucher;
    saveOverlay(VOUCHERS_OVERLAY_KEY, overlay);

    return newVoucher;
  },

  toggleVoucherActive: async (voucherId: number, active: boolean): Promise<void> => {
    const overlay = getOverlay<Partial<Voucher>>(VOUCHERS_OVERLAY_KEY);
    const key = String(voucherId);
    if (!overlay[key]) {
      overlay[key] = { id: voucherId };
    }
    overlay[key].active = active;
    saveOverlay(VOUCHERS_OVERLAY_KEY, overlay);
  },
};
