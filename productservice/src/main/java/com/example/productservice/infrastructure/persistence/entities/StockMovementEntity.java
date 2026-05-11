package com.example.productservice.infrastructure.persistence.entities;

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
public class StockMovementEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
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
