package com.example.orderservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.stock.StockReservedEvent;
import com.example.orderservice.application.services.IOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StockReservedEventListener {

    private final IOrderService orderService;

    @KafkaListener(topics = "stock-reserved", groupId = "orderservice-group")
    public void handleStockReserved(StockReservedEvent event) {
        log.info("Received StockReservedEvent for orderId: {}", event.getOrderId());
        try {
            orderService.handleStockReserved(event);
        } catch (Exception e) {
            log.error("Failed to mark order as stock reserved: {}", e.getMessage(), e);
        }
    }
}
