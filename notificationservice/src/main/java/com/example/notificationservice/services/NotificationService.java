package com.example.notificationservice.services;

import com.example.commonlib.events.OrderCreatedEvent;
import com.example.commonlib.events.UserRegisteredIntegrationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    public void sendUserRegistrationNotification(UserRegisteredIntegrationEvent event) {
        log.info("===== USER REGISTRATION NOTIFICATION =====");
        log.info("To: email={}", event.getEmail());
        log.info("Subject: Welcome to Order System!");
        log.info("Body: Hi {}, welcome to our order system. Your account has been created successfully.",
                event.getFirstName());
        log.info("==========================================");
    }

    public void sendPaymentNotification(OrderCreatedEvent event) {
        log.info("===== PAYMENT PROCESSED NOTIFICATION =====");
        log.info("To: keycloakId={}", event.getKeycloakId());
        log.info("Subject: Payment processed - Order #{}", event.getOrderId());
        log.info("Body: Your order #{} payment has been processed. Amount: {}",
                event.getOrderId(), event.getTotalPrice());
        log.info("==========================================");
    }
}
