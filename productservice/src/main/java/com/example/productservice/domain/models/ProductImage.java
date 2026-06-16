package com.example.productservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImage {
    private Long id ;
    private Long mediaId ;
    private Long productId ;
    private int displayOrder ;
    private boolean isPrimary ;
}
