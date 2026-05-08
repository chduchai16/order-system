package com.example.productservice.domain.models;

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
public class Product {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Domain logic
    public boolean hasStock(int quantity) {
        return stock >= quantity;
    }

    public void reserveStock(int quantity) {
        if (!hasStock(quantity)) {
            throw new RuntimeException("Insufficient stock for product: " + name);
        }
        this.stock -= quantity;
    }

    public void releaseStock(int quantity) {
        this.stock += quantity;
    }
}
