package com.example.productservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariant {
    private Long id;
    private String skuCode;
    private String name; // ví dụ "iPhone 15 Pro - Blue"
    private BigDecimal price;
    private Integer totalStock;
    private Integer reservedStock;

    public Integer getAvailableStock() {
        return totalStock - reservedStock;
    }

    public void reserveStock(Integer quantity) {
        if (getAvailableStock() < quantity) {
            throw new RuntimeException("Insufficient stock for variant: " + skuCode);
        }
        this.reservedStock += quantity;
    }

    public void releaseStock(Integer quantity) {
        this.reservedStock = Math.max(0, this.reservedStock - quantity);
    }
}
