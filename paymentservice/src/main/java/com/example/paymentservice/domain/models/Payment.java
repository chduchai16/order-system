package com.example.paymentservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    private Long id;
    private Long orderId;
    private Long userId;
    private String keycloakId;
    private BigDecimal amount;
    private PaymentStatus status;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;

    // Domain logic
    public void complete() {
        this.status = PaymentStatus.COMPLETED;
        this.processedAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = PaymentStatus.FAILED;
        this.processedAt = LocalDateTime.now();
    }

    public void refund() {
        this.status = PaymentStatus.REFUNDED;
    }
}
