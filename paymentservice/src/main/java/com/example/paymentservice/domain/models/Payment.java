package com.example.paymentservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Money amount;
    private PaymentStatus status;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;

    public void complete() {
        if (this.status == PaymentStatus.COMPLETED) return;
        this.status = PaymentStatus.COMPLETED;
        this.processedAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = PaymentStatus.FAILED;
        this.processedAt = LocalDateTime.now();
    }

    public void refund() {
        if (this.status != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Cannot refund a payment that is not completed");
        }
        this.status = PaymentStatus.REFUNDED;
    }
}
