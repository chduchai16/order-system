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
    private OrderNumber orderNumber;
    private Long userId;
    private List<OrderItem> items;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private Address shippingAddress;
    private ShippingInfo shippingInfo;
    private OrderDiscount discount;
    private TaxInfo tax;
    private List<OrderStatusHistory> statusHistory;
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

    private void transitionStatus(OrderStatus newStatus, String reason) {
        if (statusHistory == null) statusHistory = new ArrayList<>();
        statusHistory.add(OrderStatusHistory.record(this.status, newStatus, reason));
        this.status = newStatus;
    }

    public void markAsStockReserved() {
        if (this.status != OrderStatus.PENDING) {
            throw new RuntimeException("Invalid status transition to STOCK_RESERVED from " + status);
        }
        transitionStatus(OrderStatus.STOCK_RESERVED, "Stock reserved successfully");
    }

    public void markAsPaid() {
        if (this.status != OrderStatus.STOCK_RESERVED) {
            throw new RuntimeException("Cannot pay for order that hasn't reserved stock");
        }
        transitionStatus(OrderStatus.PAID, "Payment completed");
    }

    public void markAsCompleted() {
        transitionStatus(OrderStatus.COMPLETED, "Order fulfilled");
    }

    public void markAsCancelled() {
        markAsCancelled("Cancelled");
    }

    public void markAsCancelled(String reason) {
        transitionStatus(OrderStatus.CANCELLED, reason);
    }
}
