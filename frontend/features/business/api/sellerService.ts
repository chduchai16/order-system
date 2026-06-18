import apiClient from '@/features/shared/api/client';
import { Product, Order, Voucher, PageResponse } from '@/features/shared/types';

// Storage keys
const PRODUCTS_OVERLAY_KEY = 'shop_vn_seller_products_overlay';
const ORDERS_OVERLAY_KEY = 'shop_vn_seller_orders_overlay';
const VOUCHERS_OVERLAY_KEY = 'shop_vn_seller_vouchers_overlay';
const SHOP_SETTINGS_KEY = 'shop_vn_seller_settings';

export interface ShopSettings {
  shopName: string;
  description: string;
  avatarUrl: string;
  coverUrl: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  district: string;
  country: string;
  walletBalance: number;
  joinedDate: string;
}

const defaultSettings: ShopSettings = {
  shopName: 'Gốm Sứ & Đồ Da Mộc ShopVN',
  description: 'Gia đình nghệ nhân 3 thế hệ chế tác gốm sứ men hoả biến độc bản Bát Tràng và khâu tay ví da bò cao cấp mộc mạc.',
  avatarUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=200&auto=format&fit=crop&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=1200&auto=format&fit=crop&q=80',
  phone: '0987.654.321',
  email: 'lienhe@moccrafts.vn',
  street: 'Làng gốm Bát Tràng, xã Bát Tràng',
  city: 'Hà Nội',
  district: 'Gia Lâm',
  country: 'Việt Nam',
  walletBalance: 24850000,
  joinedDate: 'Tháng 5, 2024',
};

const isBrowser = () => typeof window !== 'undefined';

// Helper to load overlays
const getOverlay = <T>(key: string): Record<string, T> => {
  if (!isBrowser()) return {};
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as Record<string, T>) : {};
  } catch {
    return {};
  }
};

// Helper to save overlays
const saveOverlay = <T>(key: string, data: Record<string, T>) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save overlay for ${key}:`, err);
  }
};

export const sellerService = {
  // --- PRODUCTS MANAGEMENT ---
  getProducts: async (): Promise<Product[]> => {
    let backendProducts: Product[] = [];
    try {
      const response = await apiClient.get<Product[]>('/api/products');
      backendProducts = response.data;
    } catch (err) {
      console.warn('Fallback to mocked/seeded products due to network error:', err);
      // Try to load cached backend products, or return empty if none
    }

    const overlay = getOverlay<Partial<Product>>(PRODUCTS_OVERLAY_KEY);

    // Merge backend products with local changes, and add completely new local products
    const mergedList: Product[] = [];

    // Process backend products
    backendProducts.forEach((bp) => {
      const id = String(bp.id);
      if (overlay[id]) {
        // If flagged as deleted locally
        if (overlay[id]._isDeleted) return;

        // Merge attributes
        mergedList.push({
          ...bp,
          ...overlay[id],
        } as Product);
      } else {
        mergedList.push(bp);
      }
    });

    // Process local-only new products
    Object.keys(overlay).forEach((key) => {
      if (key.startsWith('local_') && !overlay[key]._isDeleted) {
        mergedList.push(overlay[key] as Product);
      }
    });

    return mergedList;
  },

  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: `local_${Date.now()}`,
    };

    try {
      // Try creating in backend
      const response = await apiClient.post<Product>('/api/products', {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        categoryId: 1, // Fallback category ID
      });
      if (response.data && response.data.id) {
        newProduct.id = String(response.data.id);
      }
    } catch (err) {
      console.warn('Backend creation failed, creating product locally:', err);
    }

    // Save overlay in localStorage
    const overlay = getOverlay<any>(PRODUCTS_OVERLAY_KEY);
    overlay[newProduct.id] = newProduct;
    saveOverlay(PRODUCTS_OVERLAY_KEY, overlay);

    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      // Try backend if not a local-only product
      if (!id.startsWith('local_')) {
        await apiClient.put(`/api/products/${id}`, {
          name: updates.name,
          description: updates.description,
          price: updates.price,
          stock: updates.stock,
        });
      }
    } catch (err) {
      console.warn('Backend update failed, updating product locally:', err);
    }

    const overlay = getOverlay<any>(PRODUCTS_OVERLAY_KEY);
    const existing = overlay[id] || {};
    overlay[id] = {
      ...existing,
      ...updates,
      id, // ensure ID is preserved
    };
    saveOverlay(PRODUCTS_OVERLAY_KEY, overlay);

    return overlay[id] as Product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    // We mock delete by flag
    const overlay = getOverlay<any>(PRODUCTS_OVERLAY_KEY);
    if (!overlay[id]) {
      overlay[id] = {};
    }
    overlay[id]._isDeleted = true;
    saveOverlay(PRODUCTS_OVERLAY_KEY, overlay);
  },

  // --- ORDERS MANAGEMENT ---
  getOrders: async (): Promise<Order[]> => {
    let backendOrders: Order[] = [];
    try {
      const response = await apiClient.get<Order[]>('/api/orders');
      backendOrders = response.data;
    } catch (err) {
      console.warn('Fallback to mocked/seeded orders due to network error:', err);
    }

    const overlay = getOverlay<any>(ORDERS_OVERLAY_KEY);

    // Merge status and shipping overrides from local storage
    return backendOrders.map((order) => {
      const id = String(order.id);
      if (overlay[id]) {
        return {
          ...order,
          status: overlay[id].status || order.status,
          shippingInfo: {
            ...order.shippingInfo,
            ...overlay[id].shippingInfo,
          },
        };
      }
      return order;
    });
  },

  updateOrderStatus: async (orderId: string, status: string, carrier?: string, trackingNumber?: string): Promise<void> => {
    const overlay = getOverlay<any>(ORDERS_OVERLAY_KEY);
    const existing = overlay[orderId] || {};

    const shippingInfoUpdates: any = {};
    if (carrier) shippingInfoUpdates.carrier = carrier;
    if (trackingNumber) shippingInfoUpdates.trackingNumber = trackingNumber;

    overlay[orderId] = {
      ...existing,
      status,
      shippingInfo: {
        ...(existing.shippingInfo || {}),
        ...shippingInfoUpdates,
      },
    };
    saveOverlay(ORDERS_OVERLAY_KEY, overlay);
  },

  // --- VOUCHERS MANAGEMENT ---
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

    const overlay = getOverlay<Voucher>(VOUCHERS_OVERLAY_KEY);
    overlay[String(newVoucher.id)] = newVoucher;
    saveOverlay(VOUCHERS_OVERLAY_KEY, overlay);

    return newVoucher;
  },

  toggleVoucherActive: async (voucherId: number, active: boolean): Promise<void> => {
    const overlay = getOverlay<any>(VOUCHERS_OVERLAY_KEY);
    const key = String(voucherId);
    if (!overlay[key]) {
      overlay[key] = { id: voucherId };
    }
    overlay[key].active = active;
    saveOverlay(VOUCHERS_OVERLAY_KEY, overlay);
  },

  // --- SHOP SETTINGS ---
  getShopSettings: (): ShopSettings => {
    if (!isBrowser()) return defaultSettings;
    try {
      const data = localStorage.getItem(SHOP_SETTINGS_KEY);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  updateShopSettings: (settings: Partial<ShopSettings>): ShopSettings => {
    const current = sellerService.getShopSettings();
    const updated = { ...current, ...settings };
    if (isBrowser()) {
      localStorage.setItem(SHOP_SETTINGS_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};
