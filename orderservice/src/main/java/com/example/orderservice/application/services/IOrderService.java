package com.example.orderservice.application.services;

import java.util.List;
import java.util.Optional;

import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.orderservice.application.dtos.OrderRequest;
import com.example.orderservice.domain.models.Order;

public interface IOrderService {
    Order createOrder(OrderRequest request);
    void cancelOrder(Long orderId, String reason);
    Optional<Order> getOrderById(Long id);
    List<Order> getAllOrders();
    void handlePaymentCompleted(PaymentCompletedEvent event) ;
}
