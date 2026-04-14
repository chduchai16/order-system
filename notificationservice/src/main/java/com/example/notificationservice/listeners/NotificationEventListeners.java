package com.example.notificationservice.listeners;

import com.example.commonlib.events.OrderCreatedEvent;
import com.example.commonlib.events.UserRegisteredIntegrationEvent;
import com.example.notificationservice.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListeners {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "user-registration-events",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleUserRegistered(UserRegisteredIntegrationEvent event) {
        log.info("Received UserRegisteredIntegrationEvent: keycloakId={}, username={}, email={}",
                event.getKeycloakId(), event.getUsername(), event.getEmail());
        notificationService.sendUserRegistrationNotification(event);
    }

    @KafkaListener(
            topics = "payment-processed",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePaymentProcessed(OrderCreatedEvent event) {
        log.info("Received payment processed event: orderId={}, userId={}, totalPrice={}",
                event.getOrderId(), event.getUserId(), event.getTotalPrice());
        notificationService.sendPaymentNotification(event);
    }
}
