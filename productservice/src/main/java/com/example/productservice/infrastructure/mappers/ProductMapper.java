package com.example.productservice.infrastructure.mappers;

import com.example.productservice.domain.models.Product;
import com.example.productservice.infrastructure.persistence.entities.ProductEntity;

public class ProductMapper {
    
    public static Product toDomain(ProductEntity entity) {
        if (entity == null) return null;
        return Product.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .stock(entity.getStock())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static ProductEntity toEntity(Product domain) {
        if (domain == null) return null;
        ProductEntity entity = new ProductEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setPrice(domain.getPrice());
        entity.setStock(domain.getStock());
        entity.setActive(domain.isActive());
        return entity;
    }
}
