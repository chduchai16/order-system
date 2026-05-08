package com.example.orderservice.domain.models;

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
public class Order {
    private Long id;
    private Long userId;
    private String keycloakId;
    private Long productId;
    private Integer quantity;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Domain logic
    public void markAsStockReserved() {
        this.status = OrderStatus.STOCK_RESERVED;
    }

    public void markAsPaid() {
        this.status = OrderStatus.PAID;
    }

    public void markAsCompleted() {
        this.status = OrderStatus.COMPLETED;
    }

    public void markAsCancelled() {
        this.status = OrderStatus.CANCELLED;
    }

    public void markAsPaymentFailed() {
        this.status = OrderStatus.PAYMENT_FAILED;
    }
}
