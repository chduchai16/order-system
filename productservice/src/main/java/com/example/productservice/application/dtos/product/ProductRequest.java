package com.example.productservice.application.dtos.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Long categoryId;
    private BigDecimal price;

    private Integer stock;
    private java.util.List<VariantRequest> variants;
    private java.util.List<AttributeRequest> attributes;

    @Data
    public static class VariantRequest {
        private String skuCode;
        private String name;
        private BigDecimal price;
        private Integer stock;
    }

    @Data
    public static class AttributeRequest {
        private String name;
        private String value;
    }
}
