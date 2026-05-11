package com.example.paymentservice.infrastructure.persistence.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private String transactionId;
    private String gatewayProvider; // Stripe, VNPay, etc.
    
    @Column(columnDefinition = "TEXT")
    private String rawResponse; // Raw JSON from provider

    private String status; // SUCCESS, FAILED, PENDING

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
