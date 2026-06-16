package com.example.productservice.application.dtos.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateAttributeRequest {
    private long id ;
    private String name ;
    private String value ;
}
