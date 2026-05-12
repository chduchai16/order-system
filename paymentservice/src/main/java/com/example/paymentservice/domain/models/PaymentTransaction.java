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
public class PaymentTransaction {
    private Long id;
    private Long orderId;
    private String transactionId;
    private String gatewayProvider;
    private String rawResponse;
    private String status;
    private LocalDateTime createdAt;
}
