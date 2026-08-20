package com.example.productservice.domain.entity.product;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductAttribute {
    private String name;
    private String value;

    public void updateFrom(ProductAttribute other) {
        if (other == null) {
            throw new IllegalArgumentException("Attribute data cannot be null");
        }
        if (other.name == null || other.name.isBlank()) {
            throw new IllegalArgumentException("Attribute name cannot be blank");
        }
        this.name = other.name.trim();
        this.value = other.value != null ? other.value.trim() : null;
    }
}
