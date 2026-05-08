package com.example.orderservice.domain.ports.external;

import com.example.orderservice.domain.models.Order;

public interface PaymentService {
    void processPayment(Order order);
    void refundPayment(Long orderId);
}
