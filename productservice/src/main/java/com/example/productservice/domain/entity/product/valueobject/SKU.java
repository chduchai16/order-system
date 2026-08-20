package com.example.productservice.domain.entity.product.valueobject;

import lombok.Value;

@Value
public class SKU {

    String value;

    public SKU(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("SKU cannot be blank");
        }
        this.value = value.toUpperCase().trim();
    }

    public static SKU generate() {
        String suffix = java.util.UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
        return new SKU("PROD-" + suffix);
    }

    @Override
    public String toString() {
        return value;
    }
}
