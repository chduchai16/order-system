package com.example.orderservice.domain.entity.order.valueobject;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDiscount {
    private String code;
    private BigDecimal amount;
    private String description;
}
