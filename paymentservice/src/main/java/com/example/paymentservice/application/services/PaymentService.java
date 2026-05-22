package com.example.paymentservice.application.services;

import java.time.LocalDateTime;

import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.application.dtos.SePayWebhookRequest;
import com.example.paymentservice.domain.models.Money;
import com.example.paymentservice.domain.models.Payment;
import com.example.paymentservice.domain.models.PaymentStatus;
import com.example.paymentservice.domain.ports.persistence.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.kafka.core.KafkaTemplate;

import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.commonlib.events.payment.RefundIssuedEvent;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final IPaymentTransactionService transactionService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    @Transactional
    public Payment createPayment(PaymentRequest request) {
        log.info("Processing payment for orderId={}", request.getOrderId());

        if(!paymentRepository.findByOrderId(request.getOrderId()).isPresent()) {
            // tạo payment code dạng : PAY-{timestamp}-{orderId}
            String paymentCode = "PAY-" + System.currentTimeMillis() + "-" + request.getOrderId();
            
            Payment payment = Payment.builder()
                    .paymentCode(paymentCode)
                    .orderId(request.getOrderId())
                    .userId(request.getUserId())
                    .amount(new Money(request.getAmount()))
                    .paymentMethod(request.getPaymentMethod())
                    .status(PaymentStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            Payment savedPayment = paymentRepository.save(payment);
            log.info("Payment created with code={} for orderId={}", paymentCode, request.getOrderId());
            return savedPayment;
        }
        
        throw new RuntimeException("Payment already exists for orderId: " + request.getOrderId());
    }

    @Override
    @Transactional
    public void refundPayment(Long orderId) {
        // thực hiện hoàn tiền
        log.info("Refunding payment for orderId={}", orderId);
        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            payment.refund();
            paymentRepository.save(payment);

            // lưu log hoàn tiền
            transactionService.logTransaction(
                orderId,
                "REF-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                "InternalMock",
                "{\"action\":\"refund\", \"status\":\"success\"}",
                "REFUNDED"
            );
            
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
        // lấy chi tiết thanh toán theo đơn hàng
        return paymentRepository.findByOrderId(orderId);
    }

    @Override
    @Transactional
    public Payment processPayment(SePayWebhookRequest request, Map<String, String> headers) {
        Payment payment = paymentRepository.findByCode(request.getContent())
                .orElseThrow(() -> new RuntimeException(
                        "Payment does not exist with code: " + request.getContent()));

        payment.complete();
        Payment savedPayment = paymentRepository.save(payment);

        transactionService.logTransaction(
                savedPayment.getOrderId(),
                request.getReferenceCode() != null ? request.getReferenceCode() : String.valueOf(request.getId()),
                request.getGateway(),
                request.toString(),
                request.getStatus() != null ? request.getStatus() : savedPayment.getStatus().name());

        PaymentCompletedEvent event = new PaymentCompletedEvent(
                savedPayment.getId(),
                savedPayment.getOrderId(),
                savedPayment.getUserId(),
                savedPayment.getAmount().getAmount(),
                savedPayment.getPaymentMethod().name(),
                savedPayment.getStatus().name(),
                savedPayment.getProcessedAt());
        kafkaTemplate.send("payment.completed", event);

        log.info("Payment completed for orderId={}, paymentCode={}",
                savedPayment.getOrderId(), savedPayment.getPaymentCode());
        return savedPayment;
    }
}
