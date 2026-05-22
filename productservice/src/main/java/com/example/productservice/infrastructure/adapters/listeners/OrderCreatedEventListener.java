package com.example.productservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.order.OrderCreatedEvent;
import com.example.productservice.application.services.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCreatedEventListener {

    private final IProductService productService;

    @KafkaListener(topics = "order-created", groupId = "product-group")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received OrderCreatedEvent for orderId: {}", event.getOrderId());

        try {
            productService.reserveStockForOrder(
                    event.getOrderId(),
                    event.getUserId(),
                    event.getItems(),
                    event.getTotalPrice()
            );
            log.info("Successfully processed OrderCreatedEvent for orderId: {}", event.getOrderId());
        } catch (Exception e) {
            log.error("Failed to process OrderCreatedEvent for orderId: {}", event.getOrderId(), e);
        }
    }
}
