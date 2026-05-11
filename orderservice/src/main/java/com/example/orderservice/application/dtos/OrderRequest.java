package com.example.orderservice.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private Long userId;
    private String keycloakId;
    private List<OrderItemRequest> items;
    
    // Shipping info
    private String street;
    private String city;
    private String district;
    private String country;
    private String shippingCarrier;
    private String estimatedDelivery;
    
    // Financial info
    private String discountCode;
}
