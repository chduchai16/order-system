package com.example.orderservice.domain.entity.order;

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
