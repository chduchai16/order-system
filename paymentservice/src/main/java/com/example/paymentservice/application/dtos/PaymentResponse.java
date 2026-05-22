package com.example.paymentservice.application.dtos;

import com.example.paymentservice.domain.models.PaymentStatus;
import com.example.paymentservice.domain.models.PaymentMethod;
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
    private String paymentCode;  // Mã thanh toán để gửi cho sepay/ngân hàng
    private Long orderId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private LocalDateTime processedAt;
}
