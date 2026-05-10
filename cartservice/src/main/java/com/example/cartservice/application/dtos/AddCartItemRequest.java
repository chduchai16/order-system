package com.example.cartservice.application.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddCartItemRequest {
    private Long productId;
    private String productName;
    private String sku;
    private Integer quantity;
    private BigDecimal unitPrice;
}
