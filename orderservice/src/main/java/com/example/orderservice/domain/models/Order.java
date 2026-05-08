package com.example.orderservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private Long id;
    private Long userId;
    private String keycloakId;
    private List<OrderItem> items;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private Address shippingAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void calculateTotalPrice() {
        this.totalPrice = items.stream()
                .map(OrderItem::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void addItem(OrderItem item) {
        if (items == null) items = new ArrayList<>();
        items.add(item);
        calculateTotalPrice();
    }

    // Business Methods
    public void markAsStockReserved() {
        if (this.status != OrderStatus.PENDING) {
            throw new RuntimeException("Invalid status transition to STOCK_RESERVED from " + status);
        }
        this.status = OrderStatus.STOCK_RESERVED;
    }

    public void markAsPaid() {
        if (this.status != OrderStatus.STOCK_RESERVED) {
            throw new RuntimeException("Cannot pay for order that hasn't reserved stock");
        }
        this.status = OrderStatus.PAID;
    }

    public void markAsCompleted() {
        this.status = OrderStatus.COMPLETED;
    }

    public void markAsCancelled() {
        this.status = OrderStatus.CANCELLED;
    }
}
