package com.example.productservice.application.dtos.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageRequest {
    private Long mediaId ;
    private int displayOrder ;
    private boolean isPrimary ;
}
