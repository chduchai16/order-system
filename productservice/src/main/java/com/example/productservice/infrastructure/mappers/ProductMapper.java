package com.example.productservice.infrastructure.mappers;

import com.example.productservice.domain.models.*;
import com.example.productservice.infrastructure.persistence.entities.*;
import java.util.stream.Collectors;

public class ProductMapper {

    public static Product toDomain(ProductEntity entity) {
        if (entity == null) return null;
        return Product.builder()
                .id(entity.getId())
                .version(entity.getVersion())
                .sku(entity.getSku() != null ? new SKU(entity.getSku()) : null)
                .name(entity.getName())
                .description(entity.getDescription())
                .category(categoryToDomain(entity.getCategory()))
                .price(new Money(entity.getPrice()))
                .stock(entity.getStock())
                .reservedStock(entity.getReservedStock())
                .active(entity.isActive())
                .variants(entity.getVariants() != null ? entity.getVariants().stream().map(ProductMapper::variantToDomain).collect(Collectors.toList()) : null)
                .attributes(entity.getAttributes() != null ? entity.getAttributes().stream().map(ProductMapper::attributeToDomain).collect(Collectors.toList()) : null)
                .images(entity.getImages() != null ? entity.getImages().stream().map(ProductMapper::imageToDomain).collect(Collectors.toList()) : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private static ProductVariant variantToDomain(ProductVariantEntity entity) {
        if (entity == null) return null;
        return ProductVariant.builder()
                .id(entity.getId())
                .skuCode(entity.getSkuCode())
                .name(entity.getName())
                .price(entity.getPrice())
                .totalStock(entity.getTotalStock())
                .reservedStock(entity.getReservedStock())
                .build();
    }

    private static ProductAttribute attributeToDomain(ProductAttributeEmbeddable entity) {
        if (entity == null) return null;
        return ProductAttribute.builder()
                .name(entity.getName())
                .value(entity.getValue())
                .build();
    }

    private static Category categoryToDomain(CategoryEntity entity) {
        if (entity == null) return null;
        return Category.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }

    public static ProductEntity toEntity(Product domain) {
        if (domain == null) return null;
        ProductEntity entity = new ProductEntity();
        entity.setId(domain.getId());
        entity.setVersion(domain.getVersion());
        entity.setSku(domain.getSku() != null ? domain.getSku().getValue() : SKU.generate().getValue());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setCategory(categoryToEntity(domain.getCategory()));
        if (domain.getPrice() != null) {
            entity.setPrice(domain.getPrice().getAmount());
        }
        entity.setStock(domain.getStock());
        entity.setReservedStock(domain.getReservedStock() != null ? domain.getReservedStock() : 0);
        entity.setActive(domain.isActive());
        
        if (domain.getVariants() != null) {
            entity.setVariants(domain.getVariants().stream().map(v -> {
                ProductVariantEntity ve = variantToEntity(v);
                ve.setProduct(entity);
                return ve;
            }).collect(Collectors.toList()));
        }

        if (domain.getAttributes() != null) {
            entity.setAttributes(domain.getAttributes().stream().map(ProductMapper::attributeToEntity).collect(Collectors.toList()));
        }

        if (domain.getImages() != null) {
            entity.setImages(domain.getImages().stream().map(image -> {
                ProductImageEntity ie = imageToEntity(image);
                ie.setProduct(entity);
                return ie;
            }).collect(Collectors.toList()));
        }
        
        return entity;
    }

    private static ProductVariantEntity variantToEntity(ProductVariant domain) {
        if (domain == null) return null;
        return ProductVariantEntity.builder()
                .id(domain.getId())
                .skuCode(domain.getSkuCode())
                .name(domain.getName())
                .price(domain.getPrice())
                .totalStock(domain.getTotalStock())
                .reservedStock(domain.getReservedStock())
                .build();
    }

    private static ProductAttributeEmbeddable attributeToEntity(ProductAttribute domain) {
        if (domain == null) return null;
        return ProductAttributeEmbeddable.builder()
                .name(domain.getName())
                .value(domain.getValue())
                .build();
    }

    private static CategoryEntity categoryToEntity(Category domain) {
        if (domain == null) return null;
        CategoryEntity entity = new CategoryEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        return entity;
    }

    private static ProductImageEntity imageToEntity(ProductImage domain) {
        if (domain == null) return null;
        ProductImageEntity entity = new ProductImageEntity();
        entity.setId(domain.getId());
        entity.setMediaId(domain.getMediaId());
        entity.setDisplayOrder(domain.getDisplayOrder());
        entity.setPrimary(domain.isPrimary());
        return entity;
    }

    private static ProductImage imageToDomain(ProductImageEntity entity) {
        if (entity == null) return null;
        return ProductImage.builder()
                .id(entity.getId())
                .mediaId(entity.getMediaId())
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null)
                .displayOrder(entity.getDisplayOrder())
                .isPrimary(entity.isPrimary())
                .build();
    }

    public static StockMovement toDomain(StockMovementEntity entity) {
        if (entity == null) return null;
        return StockMovement.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .variantId(entity.getVariantId())
                .quantity(entity.getQuantity())
                .type(StockMovement.MovementType.valueOf(entity.getType().name()))
                .reason(entity.getReason())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
