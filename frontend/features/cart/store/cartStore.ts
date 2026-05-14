import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/features/shared/types';

interface CartStore {
  items: CartItem[];
  savedItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      
      addToCart: (item: CartItem) =>
        set((state) => {
          const existingItem = state.items.find(i => i.productId === item.productId);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      
      removeFromCart: (productId: string) =>
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId),
          savedItems: state.savedItems.filter(i => i.productId !== productId),
        })),
      
      updateQuantity: (productId: string, quantity: number) =>
        set((state) => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      saveForLater: (productId: string) =>
        set((state) => {
          const item = state.items.find(i => i.productId === productId);
          if (!item) return state;
          return {
            items: state.items.filter(i => i.productId !== productId),
            savedItems: [...state.savedItems, item],
          };
        }),

      moveToCart: (productId: string) =>
        set((state) => {
          const item = state.savedItems.find(i => i.productId === productId);
          if (!item) return state;
          return {
            savedItems: state.savedItems.filter(i => i.productId !== productId),
            items: [...state.items, item],
          };
        }),
      
      clearCart: () => set({ items: [], savedItems: [] }),
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.unitPrice || 0) * item.quantity, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'order-system-cart',
    }
  )
);
