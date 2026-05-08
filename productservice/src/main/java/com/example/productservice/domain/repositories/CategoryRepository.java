package com.example.productservice.domain.repositories;

import com.example.productservice.domain.models.Category;
import java.util.Optional;
import java.util.List;

public interface CategoryRepository {
    Category save(Category category);
    Optional<Category> findById(Long id);
    List<Category> findAll();
}
