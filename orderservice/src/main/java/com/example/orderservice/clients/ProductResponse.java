package com.example.orderservice.clients;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductResponse {
    private Long id ;
    private String name ;
    private BigDecimal price ;
    private Integer stock ;
    private boolean active ;
}
