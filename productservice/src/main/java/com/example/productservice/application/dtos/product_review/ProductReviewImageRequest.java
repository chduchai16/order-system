package com.example.productservice.application.dtos.product_review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewImageRequest {
    private Long mediaId;
}
