import apiClient from '@/features/shared/api/client';
import { Cart, CartItem } from '@/features/shared/types';

interface AddCartItemRequest {
  productId: number;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

const emptyCart = (userId?: number | null): Cart => ({
  id: userId ? String(userId) : 'guest',
  items: [],
  savedItems: [],
  totalPrice: 0,
});

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/api/cart');
    return {
      ...response.data,
      items: response.data.items ?? [],
      savedItems: response.data.savedItems ?? [],
      totalPrice: Number(response.data.totalPrice ?? 0),
    };
  },

  addItem: async (item: CartItem): Promise<Cart> => {
    const payload: AddCartItemRequest = {
      productId: Number(item.productId),
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    };
    const response = await apiClient.post<Cart>('/api/cart/items', payload);
    return {
      ...response.data,
      items: response.data.items ?? [],
      savedItems: response.data.savedItems ?? [],
      totalPrice: Number(response.data.totalPrice ?? 0),
    };
  },

  updateItemQuantity: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<Cart>(`/api/cart/items/${productId}?quantity=${quantity}`);
    return {
      ...response.data,
      items: response.data.items ?? [],
      savedItems: response.data.savedItems ?? [],
      totalPrice: Number(response.data.totalPrice ?? 0),
    };
  },

  removeItem: async (productId: string): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/api/cart/items/${productId}`);
    return {
      ...response.data,
      items: response.data.items ?? [],
      savedItems: response.data.savedItems ?? [],
      totalPrice: Number(response.data.totalPrice ?? 0),
    };
  },

  clearCart: async (): Promise<Cart> => {
    await apiClient.delete('/api/cart');
    return emptyCart();
  },

  saveForLater: async (productId: string): Promise<Cart> => {
    const response = await apiClient.post<Cart>(`/api/cart/items/${productId}/save-for-later`);
    return {
      ...response.data,
      items: response.data.items ?? [],
      savedItems: response.data.savedItems ?? [],
      totalPrice: Number(response.data.totalPrice ?? 0),
    };
  },

  moveToCart: async (productId: string): Promise<Cart> => {
    const response = await apiClient.post<Cart>(`/api/cart/items/${productId}/move-to-cart`);
    return {
      ...response.data,
      items: response.data.items ?? [],
      savedItems: response.data.savedItems ?? [],
      totalPrice: Number(response.data.totalPrice ?? 0),
    };
  },
};

export { emptyCart };
