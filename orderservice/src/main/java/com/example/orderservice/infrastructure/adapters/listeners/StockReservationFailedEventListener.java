package com.example.orderservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.stock.StockReservationFailedEvent;
import com.example.orderservice.application.services.IOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StockReservationFailedEventListener {

    private final IOrderService orderService;

    @KafkaListener(topics = "stock-reservation-failed", groupId = "orderservice-group")
    public void handleStockReservationFailed(StockReservationFailedEvent event) {
        log.info("Received StockReservationFailedEvent for orderId: {}", event.getOrderId());
        orderService.cancelOrder(event.getOrderId(), event.getReason());
    }
}
