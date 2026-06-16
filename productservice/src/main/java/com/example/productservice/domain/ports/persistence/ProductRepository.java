package com.example.productservice.domain.ports.persistence;

import com.example.productservice.domain.models.Product;
import java.util.Optional;
import java.util.List;

public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(Long id);
    Boolean existsById(Long id);
    List<Product> findAll();
    List<Product> findActiveProducts();
    void deleteById(Long id);
}
