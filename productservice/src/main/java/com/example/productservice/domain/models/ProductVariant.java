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
    private String name;
    private BigDecimal price;
    private Integer totalStock;
    private Integer reservedStock;

    public Integer getAvailableStock() {
        int currentTotal = totalStock != null ? totalStock : 0;
        int currentReserved = reservedStock != null ? reservedStock : 0;
        return Math.max(0, currentTotal - currentReserved);
    }

    public void reserveStock(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        if (getAvailableStock() < quantity) {
            throw new RuntimeException("Insufficient stock for variant: " + skuCode);
        }
        this.reservedStock = (reservedStock != null ? reservedStock : 0) + quantity;
    }

    public void releaseStock(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        int currentReserved = reservedStock != null ? reservedStock : 0;
        this.reservedStock = Math.max(0, currentReserved - quantity);
    }

    public void updateFrom(ProductVariant other) {
        if (other == null) {
            throw new IllegalArgumentException("Variant data cannot be null");
        }
        this.skuCode = other.skuCode;
        this.name = other.name;
        this.price = other.price;
        this.totalStock = other.totalStock;
        this.reservedStock = other.reservedStock != null ? other.reservedStock : 0;
    }
}
