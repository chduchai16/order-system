package com.example.paymentservice.services;

import com.example.commonlib.events.OrderCreatedEvent;
import com.example.paymentservice.entities.Payment;
import com.example.paymentservice.entities.PaymentStatus;
import com.example.paymentservice.producers.PaymentEventProducer;
import com.example.paymentservice.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentEventProducer paymentEventProducer;

    @Transactional
    public void processPayment(OrderCreatedEvent event) {
        log.info("Processing payment for orderId={}", event.getOrderId());

        // Idempotency check — tránh xử lý 2 lần cùng 1 order
        if (paymentRepository.findByOrderId(event.getOrderId()).isPresent()) {
            log.warn("Payment already processed for orderId={}", event.getOrderId());
            return;
        }

        // giả lập quá trình thanh toán
        // Thực tế: gọi payment gateway (VNPay, Stripe...)
        PaymentStatus status = PaymentStatus.SUCCESS;

        Payment payment = new Payment();
        payment.setOrderId(event.getOrderId());
        payment.setUserId(event.getUserId());
        payment.setKeycloakId(event.getKeycloakId());
        payment.setAmount(event.getTotalPrice());
        payment.setStatus(status);
        payment.setProcessedAt(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);
        log.info("Payment saved: id={}, status={}", saved.getId(), saved.getStatus());

        // Publish event thông báo đã thanh toán thành công
        paymentEventProducer.publishPaymentProcessed(event);
    }
}
