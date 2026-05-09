package com.example.productservice.application.dtos.category;

import lombok.Data;

@Data
public class UpdateCategoryRequest {
    private Long id ;
    private String name ;
    private String description ;
}
