import { create } from 'zustand';
import { cartService, emptyCart } from '@/features/cart/api';
import { tokenStore } from '@/lib/auth';
import { CartItem } from '@/components/types';

interface CartStore {
  id: string;
  items: CartItem[];
  savedItems: CartItem[];
  totalPrice: number;
  loading: boolean;
  initializedForUserId: number | null;
  initializeCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  saveForLater: (productId: string) => Promise<void>;
  moveToCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCartState: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const applyCartState = (set: (partial: Partial<CartStore>) => void, cart: { id?: string; items?: CartItem[]; savedItems?: CartItem[]; totalPrice?: number }, userId: number | null) => {
  set({
    id: cart.id ?? (userId ? String(userId) : 'guest'),
    items: cart.items ?? [],
    savedItems: cart.savedItems ?? [],
    totalPrice: Number(cart.totalPrice ?? 0),
    initializedForUserId: userId,
  });
};

const buildGuestCart = (items: CartItem[], savedItems: CartItem[]) => ({
  id: 'guest',
  items,
  savedItems,
  totalPrice: items.reduce((total, item) => total + (item.unitPrice || 0) * item.quantity, 0),
});

export const useCartStore = create<CartStore>()((set, get) => ({
  id: 'guest',
  items: [],
  savedItems: [],
  totalPrice: 0,
  loading: false,
  initializedForUserId: null,

  initializeCart: async () => {
    const userId = tokenStore.getUserId();
    const initializedForUserId = get().initializedForUserId;

    if (userId === initializedForUserId) {
      return;
    }

    if (!userId) {
      applyCartState(set, emptyCart(), null);
      return;
    }

    set({ loading: true });
    try {
      const cart = await cartService.getCart();
      applyCartState(set, cart, userId);
    } catch (error) {
      console.error('Failed to initialize cart', error);
      applyCartState(set, emptyCart(userId), userId);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (item: CartItem) => {
    const userId = tokenStore.getUserId();

    if (!userId) {
      set((state) => {
        const existingItem = state.items.find((current) => current.productId === item.productId);
        const items = existingItem
          ? state.items.map((current) =>
              current.productId === item.productId
                ? { ...current, quantity: current.quantity + item.quantity, unitPrice: item.unitPrice, productName: item.productName, sku: item.sku }
                : current
            )
          : [...state.items, item];
        return buildGuestCart(items, state.savedItems);
      });
      return;
    }

    const cart = await cartService.addItem(item);
    applyCartState(set, cart, userId);
  },

  removeFromCart: async (productId: string) => {
    const userId = tokenStore.getUserId();

    if (!userId) {
      set((state) => {
        const items = state.items.filter((item) => item.productId !== productId);
        const savedItems = state.savedItems.filter((item) => item.productId !== productId);
        return buildGuestCart(items, savedItems);
      });
      return;
    }

    const cart = await cartService.removeItem(productId);
    applyCartState(set, cart, userId);
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const nextQuantity = Math.max(1, quantity);
    const userId = tokenStore.getUserId();

    if (!userId) {
      set((state) => {
        const items = state.items.map((item) =>
          item.productId === productId ? { ...item, quantity: nextQuantity } : item
        );
        return buildGuestCart(items, state.savedItems);
      });
      return;
    }

    const cart = await cartService.updateItemQuantity(productId, nextQuantity);
    applyCartState(set, cart, userId);
  },

  saveForLater: async (productId: string) => {
    const userId = tokenStore.getUserId();

    if (!userId) {
      set((state) => {
        const item = state.items.find((current) => current.productId === productId);
        if (!item) {
          return state;
        }
        return buildGuestCart(
          state.items.filter((current) => current.productId !== productId),
          [...state.savedItems, item]
        );
      });
      return;
    }

    const cart = await cartService.saveForLater(productId);
    applyCartState(set, cart, userId);
  },

  moveToCart: async (productId: string) => {
    const userId = tokenStore.getUserId();

    if (!userId) {
      set((state) => {
        const item = state.savedItems.find((current) => current.productId === productId);
        if (!item) {
          return state;
        }
        return buildGuestCart(
          [...state.items, item],
          state.savedItems.filter((current) => current.productId !== productId)
        );
      });
      return;
    }

    const cart = await cartService.moveToCart(productId);
    applyCartState(set, cart, userId);
  },

  clearCart: async () => {
    const userId = tokenStore.getUserId();

    if (!userId) {
      applyCartState(set, emptyCart(), null);
      return;
    }

    await cartService.clearCart();
    applyCartState(set, emptyCart(userId), userId);
  },

  resetCartState: () => {
    applyCartState(set, emptyCart(), tokenStore.getUserId());
  },

  getTotalPrice: () => get().items.reduce((total, item) => total + (item.unitPrice || 0) * item.quantity, 0),
  getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));
