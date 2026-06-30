package com.example.productservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductReviewImage {
    private Long id;
    private Long mediaId ;
    private Long productReviewId ;
}
