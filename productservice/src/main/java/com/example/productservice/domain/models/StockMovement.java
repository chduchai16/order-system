package com.example.productservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockMovement {
    private Long id;
    private Long productId;
    private Long variantId;
    private Integer quantity;
    private MovementType type; // IMPORT, EXPORT, RESERVE, RELEASE
    private String reason;
    private LocalDateTime createdAt;

    public enum MovementType {
        IMPORT, EXPORT, RESERVE, RELEASE, ADJUST
    }
}
