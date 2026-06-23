package com.example.productservice.application.dtos.product;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PagedProductResponse {
    private List<ProductResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
