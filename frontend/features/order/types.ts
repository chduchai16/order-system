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
