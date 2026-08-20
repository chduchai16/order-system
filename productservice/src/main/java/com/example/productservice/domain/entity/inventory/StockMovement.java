package com.example.productservice.domain.entity.inventory;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "variant_id")
    private Long variantId;

    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private MovementType type;

    private String reason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum MovementType {
        IMPORT, EXPORT, RESERVE, RELEASE, ADJUST
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
