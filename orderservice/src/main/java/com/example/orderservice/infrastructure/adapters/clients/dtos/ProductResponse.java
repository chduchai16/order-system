package com.example.orderservice.infrastructure.adapters.clients.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private Integer stock;
    private BigDecimal price;
}
