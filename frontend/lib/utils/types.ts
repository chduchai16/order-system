export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface Address {
  id?: number;
  label: string;
  street: string;
  city: string;
  district: string;
  country: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: number;
  productId: string;
  productName: string;
  addedAt: string;
}

export interface User {
  id?: string;
  keycloakId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses?: Address[];
  wishlist?: WishlistItem[];
}

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

export interface Product {
  id: string;
  sku?: string;
  name: string;
  price: number;
  stock: number;
  availableStock?: number;
  description?: string;
  image?: string;
  categoryName?: string;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  slug?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  discount?: number;
  image: string;
  link?: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingInfo {
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingFee: number;
}

export interface TaxInfo {
  type: string;
  amount: number;
}

export interface DiscountInfo {
  code?: string;
  amount: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  keycloakId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    country: string;
  };
  shippingInfo?: ShippingInfo;
  tax?: TaxInfo;
  discount?: DiscountInfo;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  subTotal?: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  savedItems?: CartItem[];
  totalPrice: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface CreateOrderItemRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  userId: number;
  keycloakId: string;
  items: CreateOrderItemRequest[];
  totalPrice: number;
  street: string;
  city: string;
  district: string;
  country: string;
  shippingCarrier?: string;
  discountCode?: string;
}
