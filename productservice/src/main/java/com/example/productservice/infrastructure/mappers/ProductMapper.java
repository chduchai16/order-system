package com.example.productservice.infrastructure.mappers;

import com.example.productservice.domain.models.Category;
import com.example.productservice.domain.models.Money;
import com.example.productservice.domain.models.Product;
import com.example.productservice.infrastructure.persistence.entities.CategoryEntity;
import com.example.productservice.infrastructure.persistence.entities.ProductEntity;

public class ProductMapper {
    
    public static Product toDomain(ProductEntity entity) {
        if (entity == null) return null;
        return Product.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(categoryToDomain(entity.getCategory()))
                .price(new Money(entity.getPrice()))
                .stock(entity.getStock())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
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
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setCategory(categoryToEntity(domain.getCategory()));
        if (domain.getPrice() != null) {
            entity.setPrice(domain.getPrice().getAmount());
        }
        entity.setStock(domain.getStock());
        entity.setActive(domain.isActive());
        return entity;
    }

    private static CategoryEntity categoryToEntity(Category domain) {
        if (domain == null) return null;
        CategoryEntity entity = new CategoryEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        return entity;
    }
}
