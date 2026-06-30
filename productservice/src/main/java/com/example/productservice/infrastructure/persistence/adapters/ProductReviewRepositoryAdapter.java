package com.example.productservice.infrastructure.persistence.adapters;

import com.example.productservice.domain.models.ProductReview;
import com.example.productservice.domain.ports.persistence.ProductReviewRepository;
import com.example.productservice.infrastructure.mappers.ProductReviewMapper;
import com.example.productservice.infrastructure.persistence.entities.ProductReviewEntity;
import com.example.productservice.infrastructure.persistence.jpas.JpaProductReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProductReviewRepositoryAdapter implements ProductReviewRepository {

    private final JpaProductReviewRepository jpaProductReviewRepository;

    @Override
    public Page<ProductReview> findPageable(Pageable pageable, Long productId) {
        return jpaProductReviewRepository.findByProductId(productId, pageable)
                .map(ProductReviewMapper::toDomain);
    }

    @Override
    public ProductReview save(ProductReview productReview) {
        ProductReviewEntity entity = ProductReviewMapper.toEntity(productReview);
        ProductReviewEntity savedEntity = jpaProductReviewRepository.save(entity);
        return ProductReviewMapper.toDomain(savedEntity);
    }

    @Override
    public void delete(Long productReviewId) throws Exception {
        if (!jpaProductReviewRepository.existsById(productReviewId)) {
            throw new Exception("Product review with id " + productReviewId + " does not exist.");
        }
        jpaProductReviewRepository.deleteById(productReviewId);
    }
}
