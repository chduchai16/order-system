package com.example.productservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private Long id;
    private Long version;
    private SKU sku;
    private String name;
    private String description;
    private Category category;
    private Money price;
    private Integer stock;
    private Integer reservedStock;
    private boolean active;
    private java.util.List<ProductVariant> variants;
    private java.util.List<ProductAttribute> attributes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public int getAvailableStock() {
        return stock - (reservedStock != null ? reservedStock : 0);
    }

    public boolean hasStock(int quantity) {
        return getAvailableStock() >= quantity;
    }

    public void reserveStock(int quantity) {
        if (!hasStock(quantity)) {
            throw new RuntimeException("Insufficient stock for product: " + name);
        }
        this.reservedStock = (reservedStock != null ? reservedStock : 0) + quantity;
    }

    public void releaseStock(int quantity) {
        int current = reservedStock != null ? reservedStock : 0;
        this.reservedStock = Math.max(0, current - quantity);
    }

    public void confirmStock(int quantity) {
        this.stock -= quantity;
        releaseStock(quantity);
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public void updatePrice(Money newPrice) {
        this.price = newPrice;
    }
}
