package com.example.orderservice.domain.models.order;

public enum OrderStatus {
    PENDING,
    STOCK_RESERVED,
    PAID,
    COMPLETED,
    CANCELLED,
    STOCK_RELEASED,
    PAYMENT_FAILED,
    SHIPPING,
    DELIVERED
}
