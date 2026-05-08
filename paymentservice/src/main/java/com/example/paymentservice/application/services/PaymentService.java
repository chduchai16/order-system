package com.example.paymentservice.application.services;

import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.domain.models.Money;
import com.example.paymentservice.domain.models.Payment;
import com.example.paymentservice.domain.models.PaymentStatus;
import com.example.paymentservice.domain.ports.persistence.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public Payment processPayment(PaymentRequest request) {
        log.info("Processing payment for orderId={}", request.getOrderId());

        return paymentRepository.findByOrderId(request.getOrderId())
                .orElseGet(() -> {
                    Payment payment = Payment.builder()
                            .orderId(request.getOrderId())
                            .userId(request.getUserId())
                            .keycloakId(request.getKeycloakId())
                            .amount(new Money(request.getAmount()))
                            .status(PaymentStatus.PENDING)
                            .build();

                    // Simulate external payment gateway call
                    payment.complete(); 
                    
                    return paymentRepository.save(payment);
                });
    }

    @Override
    @Transactional
    public void refundPayment(Long orderId) {
        log.info("Refunding payment for orderId={}", orderId);
        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            payment.refund();
            paymentRepository.save(payment);
            log.info("Payment refunded for orderId={}", orderId);
        });
    }

    @Override
    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
}
