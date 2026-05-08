package com.example.productservice.application.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Long categoryId;
    private BigDecimal price;

    private Integer stock;
}
