import apiClient from '@/lib/axios';
import { Order, CreateOrderRequest } from './types';

const ORDERS_OVERLAY_KEY = 'shop_vn_seller_orders_overlay';

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

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/api/orders', request);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  // Seller/Merchant order fulfillments
  getSellerOrders: async (): Promise<Order[]> => {
    let backendOrders: Order[] = [];
    try {
      const response = await apiClient.get<Order[]>('/api/orders');
      backendOrders = response.data;
    } catch (err) {
      console.warn('Fallback to mocked/seeded orders due to network error:', err);
    }

    const overlay = getOverlay<any>(ORDERS_OVERLAY_KEY);

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
        } as Order;
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
};
