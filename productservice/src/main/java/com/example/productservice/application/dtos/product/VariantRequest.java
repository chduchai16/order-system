package com.example.productservice.application.dtos.product;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class VariantRequest {
    private String skuCode;
    private String name;
    private BigDecimal price;
    private Integer stock;
}
