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
export interface ProductFormPayload {
  name: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  price: number;
  stock: number;
  image?: string;
  images?: Omit<ProductImage, 'id'>[];
  attributes?: ProductAttribute[];
  variants?: Omit<ProductVariant, 'id'>[];
}

export interface ProductReviewImage {
  id: number;
  mediaId: number;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  images?: ProductReviewImage[];
}
