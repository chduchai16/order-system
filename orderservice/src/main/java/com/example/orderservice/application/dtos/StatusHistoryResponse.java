package com.example.orderservice.application.dtos;

import com.example.orderservice.domain.models.order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatusHistoryResponse {
    private OrderStatus fromStatus;
    private OrderStatus toStatus;
    private String reason;
    private LocalDateTime changedAt;
}
