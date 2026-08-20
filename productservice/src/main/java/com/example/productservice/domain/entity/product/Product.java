package com.example.productservice.domain.entity.product;

import com.example.productservice.domain.entity.category.Category;
import com.example.productservice.domain.entity.product.valueobject.Money;
import com.example.productservice.domain.entity.product.valueobject.SKU;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "reserved_stock", nullable = false)
    @Builder.Default
    private Integer reservedStock = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Version
    private Long version;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_attributes", joinColumns = @JoinColumn(name = "product_id"))
    @Builder.Default
    private List<ProductAttribute> attributes = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Value object helper
    @Transient
    public SKU getSkuObject() {
        return sku != null ? new SKU(sku) : null;
    }

    @Transient
    public Money getPriceObject() {
        return price != null ? new Money(price) : null;
    }

    // Business Logic Methods
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
        int currentStock = stock != null ? stock : 0;
        int currentReserved = reservedStock != null ? reservedStock : 0;
        if (currentReserved < quantity) {
            throw new RuntimeException("Insufficient reserved stock for product: " + name);
        }
        if (currentStock < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + name);
        }
        this.stock = currentStock - quantity;
        releaseStock(quantity);
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public void updatePrice(BigDecimal newPrice) {
        if (newPrice == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        this.price = newPrice;
    }

    public void addProductImage(ProductImage productImage) {
        if (productImage == null) {
            throw new IllegalArgumentException("Product image cannot be null");
        }
        if (this.images == null) this.images = new ArrayList<>();
        productImage.setProduct(this);
        this.images.add(productImage);
    }

    public void removeProductImage(Long imageId) {
        if (imageId == null || this.images == null) {
            return;
        }
        images.removeIf(x -> x.getId() != null && x.getId().equals(imageId));
    }

    public void addProductVariant(ProductVariant productVariant) {
        if (productVariant == null) {
            throw new IllegalArgumentException("Product variant cannot be null");
        }
        if (this.variants == null) this.variants = new ArrayList<>();
        productVariant.setProduct(this);
        this.variants.add(productVariant);
    }

    public void removeProductVariant(Long productVariantId) {
        if (productVariantId == null || this.variants == null) {
            return;
        }
        this.variants.removeIf(x -> x.getId() != null && x.getId().equals(productVariantId));
    }

    public void updateVariant(Long variantId, ProductVariant productVariant) {
        if (variantId == null) {
            throw new IllegalArgumentException("Variant id cannot be null");
        }
        if (productVariant == null) {
            throw new IllegalArgumentException("Product variant cannot be null");
        }
        if (this.variants == null) return;
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
        if (this.attributes == null) this.attributes = new ArrayList<>();
        this.attributes.add(productAttribute);
    }

    public void removeProductAttribute(String attributeName) {
        if (attributeName == null || attributeName.isBlank() || this.attributes == null) {
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
        if (this.attributes == null) return;
        ProductAttribute attribute = attributes.stream()
                .filter(item -> item.getName() != null
                        && item.getName().equalsIgnoreCase(attributeName.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Attribute not found: " + attributeName));

        attribute.updateFrom(productAttribute);
    }
}
