package com.example.productservice.application.dtos.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageResponse {
    private Long id ;
    private Long mediaId ;
    private Long productId ;
    private int displayOrder ;
    private boolean isPrimary ;
    private String url;
}
