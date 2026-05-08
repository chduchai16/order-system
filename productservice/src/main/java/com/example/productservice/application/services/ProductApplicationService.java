package com.example.productservice.application.services;

import com.example.productservice.application.dtos.ProductRequest;
import com.example.productservice.domain.models.Category;
import com.example.productservice.domain.models.Money;
import com.example.productservice.domain.models.Product;
import com.example.productservice.domain.repositories.CategoryRepository;
import com.example.productservice.domain.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductApplicationService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public Product createProduct(ProductRequest productRequest) {
        log.info("Creating product: {}", productRequest.getName());
        
        Category category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + productRequest.getCategoryId()));
        }

        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .category(category)
                .price(new Money(productRequest.getPrice()))
                .stock(productRequest.getStock())
                .active(true)
                .build();

        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional
    public void reserveStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.reserveStock(quantity);
        productRepository.save(product);
    }

    @Transactional
    public void releaseStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.releaseStock(quantity);
        productRepository.save(product);
    }
}
