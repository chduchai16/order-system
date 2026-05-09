package com.example.productservice.application.services;

import com.example.productservice.application.dtos.category.CreateCategoryRequest;
import com.example.productservice.application.dtos.category.UpdateCategoryRequest;
import com.example.productservice.domain.models.Category;
import com.example.productservice.domain.ports.persistence.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements  ICategoryService{

    private final CategoryRepository categoryRepository ;

    @Override
    public Category createCategory(CreateCategoryRequest request) throws Exception {
        try {
             if(categoryRepository.findByName(request.getName()).isPresent()){
                 throw  new Exception("Category with name already exists");
             }
            Category category = Category.builder().name(request.getName()).description(request.getDescription()).build();
             return categoryRepository.save(category);
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }
    }

    @Override
    public List<Category> getAllCategories() throws Exception {
        try {
            return categoryRepository.findAll();
        } catch (Exception ex) {
            throw new Exception(ex.getMessage()) ;
        }
    }

    @Override
    public Category updateCategory(UpdateCategoryRequest request) throws Exception {
        try {
            if(categoryRepository.findById(request.getId()).isPresent()){
                throw new Exception("Category does not exist");
            }
            if(categoryRepository.findByName(request.getName()).isPresent()){
                throw  new Exception("Category with name already exists");
            }
            Category category = Category.builder().id(request.getId()).description(request.getDescription()).build();
            return categoryRepository.save(category);
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }
    }

    @Override
    public void DeleteCategory(Long id) throws Exception {
        try {
            if(categoryRepository.findById(id).isPresent()){
                throw new Exception("Category does not exist");
            }
            this.categoryRepository.deleteById(id);
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }
    }
}
