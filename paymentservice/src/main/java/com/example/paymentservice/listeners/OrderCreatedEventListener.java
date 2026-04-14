package com.example.paymentservice.listeners;

import com.example.commonlib.events.OrderCreatedEvent;
import com.example.paymentservice.services.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderCreatedEventListener {

    private final PaymentService  paymentService;

    @KafkaListener(
        topics = "order-created",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        try {

            log.info("Received OrderCreatedEvent: orderId={}", event.getOrderId());
            paymentService.processPayment(event);

            log.info("Payment processed successfully for order: orderId={}", event.getOrderId());
        } catch (Exception e) {
            log.error("Error processing order created event: {}", event, e);
            throw new RuntimeException("Failed to process order event", e);
        }
    }
}

