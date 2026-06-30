package com.example.productservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductReview {
    private Long id ;
    private Long productId;
    private Long userId ;
    private int rating ;
    private String title ;
    private String content ;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
    private List<ProductReviewImage> images ;
}
