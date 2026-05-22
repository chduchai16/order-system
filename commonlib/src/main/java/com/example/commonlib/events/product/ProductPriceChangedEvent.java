package com.example.commonlib.events.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPriceChangedEvent {
    private Long productId;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
}
