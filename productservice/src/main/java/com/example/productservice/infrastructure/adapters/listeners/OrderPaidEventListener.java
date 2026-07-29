package com.example.productservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.order.OrderPaidEvent;
import com.example.productservice.application.services.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderPaidEventListener {

    private final IProductService productService;

    @KafkaListener(topics = "order-paid", groupId = "product-group")
    public void handleOrderPaid(OrderPaidEvent event) {
        log.info("Received OrderPaidEvent for orderId: {}", event.getOrderId());
        try {
            productService.confirmStockForOrder(event.getOrderId(), event.getItems());
        } catch (Exception e) {
            log.error("Failed to confirm stock for orderId: {}", event.getOrderId(), e);
        }
    }
}
