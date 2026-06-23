package com.example.productservice.domain.ports.persistence;

import com.example.productservice.domain.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.List;

public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(Long id);
    Boolean existsById(Long id);
    List<Product> findAll();
    Page<Product> findAll(Pageable pageable);
    List<Product> findActiveProducts();
    void deleteById(Long id);
}
