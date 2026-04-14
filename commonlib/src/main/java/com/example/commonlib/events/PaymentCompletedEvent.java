package com.example.commonlib.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentCompletedEvent {
    private Long paymentId;
    private Long orderId;
    private Long userId;
    private String keycloakId;
    private BigDecimal amount;
    private String status; // SUCCESS, FAILED
    private LocalDateTime processedAt;
}
