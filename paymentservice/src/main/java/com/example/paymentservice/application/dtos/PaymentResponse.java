package com.example.paymentservice.application.dtos;

import com.example.paymentservice.domain.entity.payment.PaymentMethod;
import com.example.paymentservice.domain.entity.payment.PaymentStatus;
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
public class PaymentResponse {
    private Long id;
    private String paymentCode;
    private Long orderId;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String bankCode;
    private String bankName;
    private String accountNumber;
    private String accountName;
    private String transferContent;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime processedAt;
}
