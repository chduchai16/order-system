package com.example.productservice.application.dtos.category;

import lombok.Data;

@Data
public class CreateCategoryRequest {
    private String name ;
    private String description ;
}
