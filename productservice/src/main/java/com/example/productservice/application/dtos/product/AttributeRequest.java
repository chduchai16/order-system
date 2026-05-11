package com.example.productservice.application.dtos.product;

import lombok.Data;

@Data
public class AttributeRequest {
    private String name;
    private String value;
}
