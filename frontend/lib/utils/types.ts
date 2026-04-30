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
}

export interface Order {
  id: string;
  keycloakId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: string;
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

export interface CreateOrderRequest {
  productId: string;
  quantity: number;
}
