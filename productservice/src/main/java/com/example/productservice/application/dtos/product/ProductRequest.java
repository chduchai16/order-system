package com.example.productservice.application.dtos.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Long categoryId;
    private BigDecimal price;

    private Integer stock;
    private List<VariantRequest> variants;
    private List<AttributeRequest> attributes;
    private List<ProductImageRequest> images;
}
