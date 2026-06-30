package com.example.productservice.infrastructure.mappers;

import com.example.productservice.domain.models.ProductReview;
import com.example.productservice.domain.models.ProductReviewImage;
import com.example.productservice.infrastructure.persistence.entities.ProductReviewEntity;
import com.example.productservice.infrastructure.persistence.entities.ProductReviewImageEntity;

import java.util.stream.Collectors;

public class ProductReviewMapper {

    public static ProductReview toDomain(ProductReviewEntity entity) {
        if (entity == null) return null;
        return ProductReview.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .userId(entity.getUserId())
                .rating(entity.getRating())
                .title(entity.getTitle())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .images(entity.getImages() != null ? entity.getImages().stream()
                        .map(ProductReviewMapper::imageToDomain)
                        .collect(Collectors.toList()) : null)
                .build();
    }

    public static ProductReviewEntity toEntity(ProductReview domain) {
        if (domain == null) return null;
        ProductReviewEntity entity =
                ProductReviewEntity.builder()
                        .id(domain.getId())
                        .productId(domain.getProductId())
                        .userId(domain.getUserId())
                        .rating(domain.getRating())
                        .title(domain.getTitle())
                        .content(domain.getContent())
                        .createdAt(domain.getCreatedAt())
                        .updatedAt(domain.getUpdatedAt())
                        .build();

        if (domain.getImages() != null) {
            entity.setImages(domain.getImages().stream().map(image -> {
                ProductReviewImageEntity ie = imageToEntity(image);
                ie.setProductReview(entity);
                return ie;
            }).collect(Collectors.toList()));
        }
        return entity;
    }

    private static ProductReviewImage imageToDomain(ProductReviewImageEntity entity) {
        if (entity == null) return null;
        return ProductReviewImage.builder()
                .id(entity.getId())
                .mediaId(entity.getMediaId())
                .build();
    }

    private static ProductReviewImageEntity imageToEntity(ProductReviewImage domain) {
        if (domain == null) return null;
        return ProductReviewImageEntity.builder()
                .id(domain.getId())
                .mediaId(domain.getMediaId())
                .build();
    }
}
