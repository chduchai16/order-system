package com.example.productservice.domain.entity.product.valueobject;

import lombok.Value;
import java.math.BigDecimal;

@Value
public class Money {
    BigDecimal amount;
    String currency;

    public Money(BigDecimal amount) {
        this(amount, "VND");
    }

    public Money(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Invalid amount");
        }
        this.amount = amount;
        this.currency = currency;
    }
}
