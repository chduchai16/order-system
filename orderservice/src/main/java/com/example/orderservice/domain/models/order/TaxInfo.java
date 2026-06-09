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
public class TaxInfo {
    private String type; // VAT, GST
    private BigDecimal rate; // e.g. 0.10 for 10%
    private BigDecimal amount;
}
