package com.example.orderservice.domain.models;

public enum OrderStatus {
    PENDING,
    STOCK_RESERVED,
    PAID,
    COMPLETED,
    CANCELLED,
    STOCK_RELEASED,
    PAYMENT_FAILED
}
