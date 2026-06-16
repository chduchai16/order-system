package com.example.productservice.application.dtos.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String sku;
    private String name;
    private String description;
    private String categoryName;
    private BigDecimal price;
    private Integer stock;
    private Integer reservedStock;
    private Integer availableStock;
    private boolean active;
    private List<VariantResponse> variants;
    private List<AttributeResponse> attributes;
    private List<ProductImageResponse> images;
    private LocalDateTime createdAt;
}
