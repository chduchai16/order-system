package com.example.orderservice.application.services;

import java.util.List;
import java.util.Optional;

import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.commonlib.events.stock.StockReservedEvent;
import com.example.orderservice.application.dtos.requests.order.OrderRequest;
import com.example.orderservice.application.dtos.responses.order.OrderResponse;

public interface IOrderService {
    OrderResponse createOrder(OrderRequest request);
    void cancelOrder(Long orderId, String reason);
    Optional<OrderResponse> getOrderById(Long id);
    List<OrderResponse> getAllOrders();
    void handleStockReserved(StockReservedEvent event);
    void handlePaymentCompleted(PaymentCompletedEvent event) ;
}
