package com.example.productservice.domain.ports.persistence;

import com.example.productservice.domain.models.Category;
import java.util.Optional;
import java.util.List;

public interface CategoryRepository {
    Category save(Category category);
    Optional<Category> findById(Long id);
    Boolean existsById(Long id);
    List<Category> findAll();
    void deleteById(Long id);
    Optional<Category> findByName(String name);
}
