package com.example.orderservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusHistory {
    private Long id;
    private OrderStatus fromStatus;
    private OrderStatus toStatus;
    private String reason;
    private LocalDateTime changedAt;

    public static OrderStatusHistory record(OrderStatus from, OrderStatus to, String reason) {
        return OrderStatusHistory.builder()
                .fromStatus(from)
                .toStatus(to)
                .reason(reason)
                .changedAt(LocalDateTime.now())
                .build();
    }
}
