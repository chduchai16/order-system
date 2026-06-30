package com.example.productservice.application.dtos.product_review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewResponse {
    private Long id ;
    private Long productId ;
    private Long userId ;
    private int rating ;
    private String title ;
    private String content ;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
    private List<ProductReviewImageResponse> images ;
}
