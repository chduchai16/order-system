package com.example.paymentservice.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import com.example.paymentservice.domain.models.PaymentMethod;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    private Long orderId;
    private Long userId;
    private String keycloakId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
}
