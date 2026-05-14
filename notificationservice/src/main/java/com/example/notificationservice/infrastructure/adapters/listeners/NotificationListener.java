package com.example.notificationservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.OrderCancelledEvent;
import com.example.commonlib.events.OrderCompletedEvent;
import com.example.commonlib.events.PaymentCompletedEvent;
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

    @KafkaListener(topics = "cart.checked-out", groupId = "notification-group")
    public void handleOrderPlaced(CartCheckedOutEvent event) {
        log.info("Received CartCheckedOutEvent for userId: {}", event.getUserId());
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
