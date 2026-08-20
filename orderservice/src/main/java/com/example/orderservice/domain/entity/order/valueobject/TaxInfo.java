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
public class TaxInfo {
    private String type;
    private BigDecimal rate;
    private BigDecimal amount;
}
