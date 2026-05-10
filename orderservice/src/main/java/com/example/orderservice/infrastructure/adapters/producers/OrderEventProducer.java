package com.example.orderservice.infrastructure.adapters.producers;


import com.example.commonlib.events.OrderCreatedEvent;
import com.example.commonlib.events.OrderCompletedEvent;
import com.example.commonlib.events.OrderCancelledEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private static final String TOPIC = "order-created";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreated(OrderCreatedEvent event) {
        if (kafkaTemplate == null) {
            log.warn("KafkaTemplate is not available - event not published: {}", event.getOrderId());
            return;
        }
        try {
            log.info("Publishing OrderCreatedEvent: orderId={}", event.getOrderId());
            kafkaTemplate.send(TOPIC, String.valueOf(event.getOrderId()), event);
        } catch (Exception e) {
            log.error("Failed to publish event: {}", e.getMessage());
        }
    }

    public void publishOrderCompleted(OrderCompletedEvent event) {
        if (kafkaTemplate != null) {
            kafkaTemplate.send("order-completed", String.valueOf(event.getOrderId()), event);
        }
    }

    public void publishOrderCancelled(OrderCancelledEvent event) {
        if (kafkaTemplate != null) {
            kafkaTemplate.send("order-cancelled", String.valueOf(event.getOrderId()), event);
        }
    }
}

