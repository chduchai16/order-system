package com.example.paymentservice.web;

import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.application.dtos.PaymentResponse;
import com.example.paymentservice.application.services.IPaymentService;
import com.example.paymentservice.domain.models.Payment;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    @Value("${payment.bank.code:ICB}")
    private String bankCode;

    @Value("${payment.bank.name:VietinBank}")
    private String bankName;

    @Value("${payment.bank.account-number}")
    private String accountNumber;

    @Value("${payment.bank.account-name}")
    private String accountName;

    @Value("${payment.transfer.prefix:SEVQR}")
    private String transferPrefix;

    @Value("${payment.transfer.ttl-minutes:30}")
    private long transferTtlMinutes;

    @PostConstruct
    void validateBankConfiguration() {
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalStateException("payment.bank.account-number must be configured via env or paymentservice/.env.properties");
        }
        if (accountName == null || accountName.isBlank()) {
            throw new IllegalStateException("payment.bank.account-name must be configured via env or paymentservice/.env.properties");
        }
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest request) {
        Payment payment = paymentService.createPayment(request);
        return ResponseEntity.ok(toResponse(payment));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId)
                .map(payment -> ResponseEntity.ok(toResponse(payment)))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Payment not found for order: " + orderId
                ));
    }

    @PostMapping("/refund/{orderId}")
    public ResponseEntity<Void> refundPayment(@PathVariable Long orderId) {
        paymentService.refundPayment(orderId);
        return ResponseEntity.ok().build();
    }

    private PaymentResponse toResponse(Payment payment) {
        LocalDateTime createdAt = payment.getCreatedAt();
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentCode(payment.getPaymentCode())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount() != null ? payment.getAmount().getAmount() : null)
                .currency("VND")
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .bankCode(bankCode)
                .bankName(bankName)
                .accountNumber(accountNumber)
                .accountName(accountName)
                .transferContent(buildTransferContent(payment.getPaymentCode()))
                .createdAt(createdAt)
                .expiresAt(createdAt != null ? createdAt.plusMinutes(transferTtlMinutes) : null)
                .processedAt(payment.getProcessedAt())
                .build();
    }

    private String buildTransferContent(String paymentCode) {
        if (paymentCode == null || paymentCode.isBlank()) {
            return paymentCode;
        }
        return transferPrefix + " " + paymentCode;
    }
}
