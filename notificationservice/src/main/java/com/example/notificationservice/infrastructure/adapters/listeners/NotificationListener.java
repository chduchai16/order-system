package com.example.notificationservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.OrderCancelledEvent;
import com.example.commonlib.events.OrderCompletedEvent;
import com.example.commonlib.events.PaymentCompletedEvent;
import com.example.commonlib.events.UserRegisteredIntegrationEvent;
import com.example.commonlib.events.CartCheckedOutEvent;
import com.example.notificationservice.application.services.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final EmailService emailService;

    @KafkaListener(topics = "user.registered", groupId = "notification-group")
    public void handleUserRegistered(UserRegisteredIntegrationEvent event) {
        log.info("Received UserRegistered event for: {}", event.getEmail());
        String subject = "Welcome to Order System!";
        String body = String.format("Hi %s,\n\nWelcome to our platform! Your account has been successfully created.\n\nBest regards,\nOrder System Team", event.getFirstName());
        emailService.sendEmail(event.getEmail(), subject, body);
    }

    @KafkaListener(topics = "cart.checked-out", groupId = "notification-group")
    public void handleOrderPlaced(CartCheckedOutEvent event) {
        log.info("Received CartCheckedOutEvent for keycloakId: {}", event.getKeycloakId());
        // For CartCheckedOutEvent, we don't have user's email directly. 
        // In a real system, Notification Service might call UserService to get email, 
        // or Email is included in the event. 
        // For simplicity, we just log it here.
        log.info("Order Placed. Sending confirmation email (mocked).");
    }

    @KafkaListener(topics = "payment.completed", groupId = "notification-group")
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("Received PaymentCompletedEvent for orderId: {}", event.getOrderId());
        log.info("Payment Completed. Sending receipt email (mocked).");
    }

    @KafkaListener(topics = "order-cancelled", groupId = "notification-group")
    public void handleOrderCancelled(OrderCancelledEvent event) {
        log.info("Received OrderCancelledEvent for orderId: {}", event.getOrderId());
        log.info("Order Cancelled. Sending cancellation email (mocked).");
    }
}
