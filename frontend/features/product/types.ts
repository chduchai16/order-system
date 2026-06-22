export interface ProductVariant {
  id: number;
  skuCode: string;
  name: string;
  price: number;
  stock: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductImage {
  id?: number;
  mediaId: number;
  productId?: number;
  displayOrder: number;
  isPrimary: boolean;
  url?: string;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  price: number;
  stock: number;
  availableStock?: number;
  description?: string;
  image?: string;
  images?: ProductImage[];
  categoryName?: string;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
}
