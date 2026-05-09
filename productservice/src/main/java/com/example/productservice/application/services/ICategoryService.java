package com.example.productservice.application.services;

import com.example.productservice.application.dtos.category.CreateCategoryRequest;
import com.example.productservice.application.dtos.category.UpdateCategoryRequest;
import com.example.productservice.domain.models.Category;

import java.util.List;

public interface ICategoryService {
    public Category createCategory(CreateCategoryRequest request) throws Exception;
    public List<Category> getAllCategories() throws Exception;
    public void DeleteCategory(Long id) throws Exception;
    public Category updateCategory(UpdateCategoryRequest request) throws Exception;
}
