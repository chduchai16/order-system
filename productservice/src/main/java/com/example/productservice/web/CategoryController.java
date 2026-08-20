package com.example.productservice.web;

import com.example.productservice.application.dtos.category.CreateCategoryRequest;
import com.example.productservice.application.dtos.category.UpdateCategoryRequest;
import com.example.productservice.domain.entity.category.Category;
import com.example.productservice.application.services.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ICategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CreateCategoryRequest request) throws Exception {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() throws Exception {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PutMapping
    public ResponseEntity<Category> updateCategory(@RequestBody UpdateCategoryRequest request) throws Exception {
        return ResponseEntity.ok(categoryService.updateCategory(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) throws Exception {
        categoryService.DeleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
