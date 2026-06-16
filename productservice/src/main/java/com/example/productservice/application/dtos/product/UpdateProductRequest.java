package com.example.productservice.application.dtos.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductRequest {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private BigDecimal price;
    private Integer stock;
    private List<UpdateVariantRequest> variants;
    private List<UpdateAttributeRequest> attributes;
    private List<UpdateProductImageRequest> images;
}
