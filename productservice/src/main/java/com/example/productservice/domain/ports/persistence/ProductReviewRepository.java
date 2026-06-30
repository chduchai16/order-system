package com.example.productservice.domain.ports.persistence;

import com.example.productservice.domain.models.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductReviewRepository {
    Page<ProductReview> findPageable(Pageable pageable , Long productId) ;
    ProductReview save(ProductReview productReview);
    void  delete(Long productReviewId) throws Exception;
}
