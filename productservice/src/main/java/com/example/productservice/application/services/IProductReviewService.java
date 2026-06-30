package com.example.productservice.application.services;

import com.example.productservice.application.dtos.product_review.ProductReviewRequest;
import com.example.productservice.application.dtos.product_review.ProductReviewResponse;
import com.example.productservice.domain.models.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductReviewService {
    Page<ProductReviewResponse> findByProductId(Long productId, Pageable pageable);
    ProductReviewResponse save(ProductReviewRequest productReview);
    void delete(Long productReviewId) throws Exception;
}
