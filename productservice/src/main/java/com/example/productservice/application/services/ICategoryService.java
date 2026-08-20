package com.example.productservice.application.services;

import com.example.productservice.application.dtos.category.CreateCategoryRequest;
import com.example.productservice.application.dtos.category.UpdateCategoryRequest;
import com.example.productservice.domain.entity.category.Category;

import java.util.List;

public interface ICategoryService {
    Category createCategory(CreateCategoryRequest request) throws Exception;
    List<Category> getAllCategories() throws Exception;
    Category updateCategory(UpdateCategoryRequest request) throws Exception;
    void DeleteCategory(Long id) throws Exception;
}
