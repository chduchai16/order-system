package com.example.orderservice.dtos;

import lombok.Data;

@Data
public class OrderRequest {
    private Long productId ;
    private Integer quantity ;
}
