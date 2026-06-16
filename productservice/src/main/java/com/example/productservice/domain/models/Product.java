package com.example.productservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private Long id;
    private Long version;
    private SKU sku;
    private String name;
    private String description;
    private Category category;
    private Money price;
    private Integer stock;
    private Integer reservedStock;
    @Builder.Default
    private boolean active = true;
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();
    @Builder.Default
    private List<ProductAttribute> attributes = new ArrayList<>();
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public int getAvailableStock() {
        int currentStock = stock != null ? stock : 0;
        int currentReserved = reservedStock != null ? reservedStock : 0;
        return Math.max(0, currentStock - currentReserved);
    }

    public boolean hasStock(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        return getAvailableStock() >= quantity;
    }

    public void reserveStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        if (!hasStock(quantity)) {
            throw new RuntimeException("Insufficient stock for product: " + name);
        }
        this.reservedStock = (reservedStock != null ? reservedStock : 0) + quantity;
    }

    public void releaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        int current = reservedStock != null ? reservedStock : 0;
        this.reservedStock = Math.max(0, current - quantity);
    }

    public void confirmStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        if (!hasStock(quantity)) {
            throw new RuntimeException("Insufficient stock for product: " + name);
        }
        this.stock = (stock != null ? stock : 0) - quantity;
        releaseStock(quantity);
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public void updatePrice(Money newPrice) {
        if (newPrice == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        this.price = newPrice;
    }

    public void addProductImage(ProductImage productImage) {
        if (productImage == null) {
            throw new IllegalArgumentException("Product image cannot be null");
        }
        this.images.add(productImage);
    }

    public void removeProductImage(Long imageId) {
        if (imageId == null) {
            return;
        }
        images.removeIf(x -> x.getId().equals(imageId));
    }

    public void addProductVariant(ProductVariant productVariant) {
        if (productVariant == null) {
            throw new IllegalArgumentException("Product variant cannot be null");
        }
        this.variants.add(productVariant);
    }

    public void removeProductVariant(Long productVariantId) {
        if (productVariantId == null) {
            return;
        }
        this.variants.removeIf(x -> x.getId().equals(productVariantId));
    }

    public void updateVariant(Long variantId, ProductVariant productVariant) {
        if (variantId == null) {
            throw new IllegalArgumentException("Variant id cannot be null");
        }
        if (productVariant == null) {
            throw new IllegalArgumentException("Product variant cannot be null");
        }
        ProductVariant variant = variants.stream()
                .filter(item -> item.getId() != null && item.getId().equals(variantId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Variant not found: " + variantId));

        variant.updateFrom(productVariant);
    }

    public void addProductAttribute(ProductAttribute productAttribute) {
        if (productAttribute == null) {
            throw new IllegalArgumentException("Product attribute cannot be null");
        }
        this.attributes.add(productAttribute);
    }

    public void removeProductAttribute(String attributeName) {
        if (attributeName == null || attributeName.isBlank()) {
            return;
        }
        this.attributes.removeIf(attribute -> attribute.getName() != null
                && attribute.getName().equalsIgnoreCase(attributeName.trim()));
    }

    public void updateAttribute(String attributeName, ProductAttribute productAttribute) {
        if (attributeName == null || attributeName.isBlank()) {
            throw new IllegalArgumentException("Attribute name cannot be blank");
        }
        if (productAttribute == null) {
            throw new IllegalArgumentException("Product attribute cannot be null");
        }

        ProductAttribute attribute = attributes.stream()
                .filter(item -> item.getName() != null
                        && item.getName().equalsIgnoreCase(attributeName.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Attribute not found: " + attributeName));

        attribute.updateFrom(productAttribute);
    }
}
