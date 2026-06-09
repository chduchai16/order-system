package com.example.orderservice.domain.models.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShippingInfo {
    private String carrier; // GHTK, GHN, etc.
    private String trackingNumber;
    private BigDecimal shippingFee;
    private String estimatedDelivery;
}
