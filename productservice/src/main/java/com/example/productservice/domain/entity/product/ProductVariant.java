package com.example.productservice.domain.entity.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku_code", nullable = false)
    private String skuCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "total_stock", nullable = false)
    private Integer totalStock;

    @Column(name = "reserved_stock", nullable = false)
    @Builder.Default
    private Integer reservedStock = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

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
