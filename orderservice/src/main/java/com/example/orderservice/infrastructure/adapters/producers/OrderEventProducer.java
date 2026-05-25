package com.example.orderservice.infrastructure.adapters.producers;


import com.example.commonlib.events.order.OrderCreatedEvent;
import com.example.commonlib.events.order.OrderCompletedEvent;
import com.example.commonlib.events.order.OrderCancelledEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.example.commonlib.events.order.OrderPaidEvent;

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
    if (kafkaTemplate == null) {
        log.warn("KafkaTemplate is not available - event not published: {}", event.getOrderId());
        return;
    }
    try {
        log.info("Publishing OrderCompletedEvent: orderId={}", event.getOrderId());
        kafkaTemplate.send("order-completed", String.valueOf(event.getOrderId()), event);
    } catch (Exception e) {
        log.error("Failed to publish OrderCompletedEvent for orderId={}: {}", event.getOrderId(), e.getMessage(), e);
    }
}

    public void publishOrderCancelled(OrderCancelledEvent event) {
        if (kafkaTemplate == null) {
            log.warn("KafkaTemplate is not available - event not published: {}", event.getOrderId());
            return;
        }
        try {
            log.info("Publishing OrderCancelledEvent: orderId={}", event.getOrderId());
            kafkaTemplate.send("order-cancelled", String.valueOf(event.getOrderId()), event);
        } catch (Exception e) {
            log.error("Failed to publish OrderCancelledEvent for orderId={}: {}", event.getOrderId(), e.getMessage(), e);
        }
    }

    public void publishOrderPaid(OrderPaidEvent event) {
        if(kafkaTemplate == null) {
            log.warn("KafkaTemplate is not available - event not published: {}" , event.getOrderId());
            return ;
        }
        try{
            log.info("Publishing OrderPaidEvent: orderId={}", event.getOrderId());
            kafkaTemplate.send("order-paid", String.valueOf(event.getOrderId()), event);
        } catch (Exception ex) {
            log.error("Failed to publish OrderPaidEvent for orderId: {}", event.getOrderId() , ex.getMessage() , ex) ;
        }
    }
}

