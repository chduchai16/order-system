package com.example.paymentservice.application.services;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.commonlib.events.payment.RefundIssuedEvent;
import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.application.dtos.SePayWebhookRequest;
import com.example.paymentservice.domain.models.Money;
import com.example.paymentservice.domain.models.Payment;
import com.example.paymentservice.domain.models.PaymentStatus;
import com.example.paymentservice.domain.ports.persistence.PaymentRepository;
import com.example.paymentservice.infrastructure.adapters.producers.PaymentProducer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService implements IPaymentService {
    private static final Pattern PAYMENT_CODE_PATTERN = Pattern.compile("(PAY-\\d+-\\d+|PAY\\d+)", Pattern.CASE_INSENSITIVE);

    private final PaymentRepository paymentRepository;
    private final IPaymentTransactionService transactionService;
    private final PaymentProducer paymentProducer ; 

    // tạo payment
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

    // thực hiện hoàn tiền
    @Override
    @Transactional
    public void refundPayment(Long orderId) {
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
            
            paymentProducer.publishRefundIssued(event);
            log.info("Payment refunded for orderId={}", orderId);
        });
    }

    // lấy chi tiết thanh toán theo đơn hàng
    @Override
    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    // xử lý thanh toán từ webhook
    @Override
    @Transactional
    public Payment processPayment(SePayWebhookRequest request, Map<String, String> headers) {
        String paymentCode = extractPaymentCode(request);

        // tìm theo code
        Payment payment = findPaymentByWebhookCode(paymentCode)
            .orElseThrow(() -> new RuntimeException(
                "Payment does not exist with code: " + paymentCode));

        // tạo bản ghi payment
        payment.complete();
        Payment savedPayment = paymentRepository.save(payment);

        // tạo bản ghi payment transaction
        transactionService.logTransaction(
                savedPayment.getOrderId(),
                request.getReferenceCode() != null ? request.getReferenceCode() : String.valueOf(request.getId()),
                request.getGateway(),
                request.toString(),
                request.getStatus() != null ? request.getStatus() : savedPayment.getStatus().name());


        // gửi sự kiện thanh toán thành công
        PaymentCompletedEvent event = new PaymentCompletedEvent(
                savedPayment.getId(),
                savedPayment.getOrderId(),
                savedPayment.getUserId(),
                savedPayment.getAmount().getAmount(),
                savedPayment.getPaymentMethod().name(),
                savedPayment.getStatus().name(),
                savedPayment.getProcessedAt());
        paymentProducer.publishPaymentCompleted(event);

        log.info("Payment completed for orderId={}, paymentCode={}",
                savedPayment.getOrderId(), savedPayment.getPaymentCode());
        return savedPayment;
    }

    // lấy payment code từ content chuyển khoản
    private String extractPaymentCode(SePayWebhookRequest request) {
        String[] candidates = {
                request.getContent(),
                request.getDescription(),
                request.getCode(),
                request.getReferenceCode()
        };

        for (String candidate : candidates) {
            String extracted = findPaymentCode(candidate);
            if (extracted != null) {
                return extracted;
            }
        }

        throw new RuntimeException("Payment code not found in SePay webhook payload");
    }

    private String findPaymentCode(String input) {
        if (input == null || input.isBlank()) {
            return null;
        }

        Matcher matcher = PAYMENT_CODE_PATTERN.matcher(input.trim());
        if (!matcher.find()) {
            return null;
        }

        String code = matcher.group(1).toUpperCase();
        if (code.startsWith("PAY-")) {
            return code;
        }
        return "PAY-" + code.substring(3);
    }

    private Optional<Payment> findPaymentByWebhookCode(String paymentCode) {
        return paymentRepository.findByCode(paymentCode)
                .or(() -> paymentRepository.findAll().stream()
                        .filter(payment -> normalizePaymentCode(payment.getPaymentCode())
                                .equals(normalizePaymentCode(paymentCode)))
                        .findFirst());
    }

    private String normalizePaymentCode(String paymentCode) {
        if (paymentCode == null) {
            return "";
        }
        return paymentCode.replace("-", "").trim().toUpperCase();
    }
}
