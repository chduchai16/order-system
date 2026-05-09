package com.example.productservice.application.services;

import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.domain.models.Product;
import java.util.List;
import java.util.Optional;

public interface IProductService {
    Product createProduct(ProductRequest productRequest);
    Optional<Product> getProductById(Long id);
    List<Product> getAllProducts();
    void reserveStock(Long productId, Integer quantity);
    void releaseStock(Long productId, Integer quantity);
}
