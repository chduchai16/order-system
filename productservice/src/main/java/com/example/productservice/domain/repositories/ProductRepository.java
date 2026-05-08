package com.example.productservice.domain.repositories;

import com.example.productservice.domain.models.Product;
import java.util.Optional;
import java.util.List;

public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(Long id);
    List<Product> findAll();
    List<Product> findActiveProducts();
    void deleteById(Long id);
}

