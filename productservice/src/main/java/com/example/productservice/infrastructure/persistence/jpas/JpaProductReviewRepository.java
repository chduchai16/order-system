package com.example.productservice.infrastructure.persistence.jpas;

import com.example.productservice.infrastructure.persistence.entities.ProductReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaProductReviewRepository extends JpaRepository<ProductReviewEntity, Long> {
    Page<ProductReviewEntity> findByProductId(Long productId, Pageable pageable);
}
