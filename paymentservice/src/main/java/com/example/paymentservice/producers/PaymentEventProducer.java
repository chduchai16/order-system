package com.example.paymentservice.producers;

import com.example.commonlib.events.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {

    private static final String TOPIC = "payment-processed";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishPaymentProcessed(OrderCreatedEvent event) {
        log.info("Publishing payment processed event: orderId={}, totalPrice={}",
                event.getOrderId(), event.getTotalPrice());
        kafkaTemplate.send(TOPIC, String.valueOf(event.getOrderId()), event);
    }
}

