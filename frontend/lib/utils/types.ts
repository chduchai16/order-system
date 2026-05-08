export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface User {
  id?: string;
  keycloakId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  categoryName?: string;
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

export interface Order {
  id: string;
  keycloakId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  fullAddress: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
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
}
