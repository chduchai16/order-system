package com.example.productservice.application.services;

import com.example.productservice.application.dtos.category.CreateCategoryRequest;
import com.example.productservice.application.dtos.category.UpdateCategoryRequest;
import com.example.productservice.domain.entity.category.Category;
import com.example.productservice.infrastructure.repository.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category createCategory(CreateCategoryRequest request) throws Exception {
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new Exception("Category with name already exists");
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() throws Exception {
        return categoryRepository.findAll();
    }

    @Override
    public Category updateCategory(UpdateCategoryRequest request) throws Exception {
        if (!categoryRepository.existsById(request.getId())) {
            throw new Exception("Category does not exist");
        }
        if (categoryRepository.findByName(request.getName())
                .filter(c -> !c.getId().equals(request.getId()))
                .isPresent()) {
            throw new Exception("Category with name already exists");
        }
        Category category = Category.builder()
                .id(request.getId())
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return categoryRepository.save(category);
    }

    @Override
    public void DeleteCategory(Long id) throws Exception {
        if (!categoryRepository.existsById(id)) {
            throw new Exception("Category does not exist");
        }
        this.categoryRepository.deleteById(id);
    }
}
