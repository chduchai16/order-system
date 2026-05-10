package com.example.paymentservice.application.services;

import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.domain.models.Money;
import com.example.paymentservice.domain.models.Payment;
import com.example.paymentservice.domain.models.PaymentStatus;
import com.example.paymentservice.domain.models.PaymentMethod;
import com.example.paymentservice.domain.ports.persistence.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.kafka.core.KafkaTemplate;
import com.example.commonlib.events.PaymentCompletedEvent;
import com.example.commonlib.events.RefundIssuedEvent;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

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
                            .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.BANK_TRANSFER) 
                            .status(PaymentStatus.PENDING)
                            .build();

                    payment.complete(); 
                    
                    Payment savedPayment = paymentRepository.save(payment);
                    
                    PaymentCompletedEvent event = new PaymentCompletedEvent(
                        savedPayment.getId(),
                        savedPayment.getOrderId(),
                        savedPayment.getUserId(),
                        savedPayment.getKeycloakId(),
                        savedPayment.getAmount().getAmount(),
                        savedPayment.getPaymentMethod().name(),
                        savedPayment.getStatus().name(),
                        savedPayment.getProcessedAt()
                    );
                    kafkaTemplate.send("payment.completed", event);
                    
                    return savedPayment;
                });
    }

    @Override
    @Transactional
    public void refundPayment(Long orderId) {
        log.info("Refunding payment for orderId={}", orderId);
        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            payment.refund();
            paymentRepository.save(payment);
            
            RefundIssuedEvent event = new RefundIssuedEvent(
                payment.getId(),
                payment.getOrderId(),
                payment.getUserId(),
                payment.getAmount().getAmount(),
                payment.getProcessedAt()
            );
            kafkaTemplate.send("refund.issued", event);
            
            log.info("Payment refunded for orderId={}", orderId);
        });
    }

    @Override
    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
}
