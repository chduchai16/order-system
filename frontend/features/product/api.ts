import apiClient from '@/lib/axios';
import { Product } from './types';

const PRODUCTS_OVERLAY_KEY = 'shop_vn_seller_products_overlay';

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

interface OverlayProduct extends Partial<Product> {
  _isDeleted?: boolean;
}

type PagedProductResponse = {
  content?: Product[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

export const productService = {
  getProductsPage: async (page = 0, limit = 20): Promise<PagedProductResponse> => {
    const response = await apiClient.get<PagedProductResponse>('/api/products', {
      params: { page, limit },
    });
    return response.data;
  },

  getProducts: async (): Promise<Product[]> => {
    let backendProducts: Product[] = [];
    try {
      const firstPage = await productService.getProductsPage(0, 100);
      const totalPages = Math.max(1, firstPage.totalPages ?? 1);
      backendProducts = [...(firstPage.content ?? [])];

      for (let page = 1; page < totalPages; page += 1) {
        const nextPage = await productService.getProductsPage(page, 100);
        backendProducts.push(...(nextPage.content ?? []));
      }
    } catch (err) {
      console.warn('Fallback to mocked/seeded products due to network error:', err);
    }

    const overlay = getOverlay<OverlayProduct>(PRODUCTS_OVERLAY_KEY);
    const mergedList: Product[] = [];

    // Process backend products
    backendProducts.forEach((bp) => {
      const id = String(bp.id);
      if (overlay[id]) {
        // If flagged as deleted locally
        if (overlay[id]._isDeleted) return;

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

  getProductById: async (id: string): Promise<Product> => {
    // Check overlay first
    const overlay = getOverlay<OverlayProduct>(PRODUCTS_OVERLAY_KEY);
    if (overlay[id]) {
      if (overlay[id]._isDeleted) {
        throw new Error('Product is deleted');
      }
      // If it's local only
      if (id.startsWith('local_')) {
        return overlay[id] as Product;
      }
    }

    try {
      const response = await apiClient.get<Product>(`/api/products/${id}`);
      const bp = response.data;
      if (overlay[id]) {
        return {
          ...bp,
          ...overlay[id],
        } as Product;
      }
      return bp;
    } catch (err) {
      if (overlay[id]) {
        return overlay[id] as Product;
      }
      throw err;
    }
  },

  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: `local_${Date.now()}`,
    };

    try {
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

    const overlay = getOverlay<OverlayProduct>(PRODUCTS_OVERLAY_KEY);
    overlay[newProduct.id] = newProduct;
    saveOverlay(PRODUCTS_OVERLAY_KEY, overlay);

    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
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

    const overlay = getOverlay<OverlayProduct>(PRODUCTS_OVERLAY_KEY);
    const existing = overlay[id] || {};
    overlay[id] = {
      ...existing,
      ...updates,
      id,
    };
    saveOverlay(PRODUCTS_OVERLAY_KEY, overlay);

    return overlay[id] as Product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      if (!id.startsWith('local_')) {
        await apiClient.delete(`/api/products/${id}`);
      }
    } catch (err) {
      console.warn('Backend delete failed, performing local delete only:', err);
    }
    const overlay = getOverlay<OverlayProduct>(PRODUCTS_OVERLAY_KEY);
    if (!overlay[id]) {
      overlay[id] = {};
    }
    overlay[id]._isDeleted = true;
    saveOverlay(PRODUCTS_OVERLAY_KEY, overlay);
  },
};
