package com.example.productservice.application.dtos.product_review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewRequest {
    private Long productId ;
    private int rating ;
    private String title ;
    private String content ;
    private List<ProductReviewImageRequest> images ;
}
