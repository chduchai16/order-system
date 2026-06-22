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

export interface VoucherCondition {
  id: number;
  conditionType: string;
  value: string;
}

export interface Voucher {
  id: number;
  code: string;
  name: string;
  description?: string;
  discountType: 'FIXED' | 'PERCENT' | 'FREESHIP';
  discountValue: number;
  maxDiscountValue?: number | null;
  minOrderValue?: number | null;
  totalQuantity: number;
  usedQuantity: number;
  startDate: string;
  endDate: string;
  active: boolean;
  conditions: VoucherCondition[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
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

export interface CreateOrderItemRequest {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  userId: number;
  items: CreateOrderItemRequest[];
  street: string;
  city: string;
  district: string;
  country: string;
  shippingCarrier?: string;
  discountCode?: string;
}

export interface Payment {
  id: number;
  orderId: number;
  paymentCode: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
  createdAt?: string;
  expiresAt?: string;
  processedAt?: string;
}
