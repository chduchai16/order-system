package com.example.productservice.application.services;

import com.example.productservice.application.dtos.ProductRequest;
import com.example.productservice.domain.models.Product;
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

    public Product createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .stock(productRequest.getStock())
                .active(true)
                .build();
        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findActiveProducts();
    }

    @Transactional
    public Product deductStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        product.reserveStock(quantity); // Use domain logic
        
        log.info("Stock deducted: productId={}, quantity={}, remaining={}",
                productId, quantity, product.getStock());
        return productRepository.save(product);
    }

    @Transactional
    public Product releaseStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        product.releaseStock(quantity);
        
        log.info("Stock released: productId={}, quantity={}, new_stock={}",
                productId, quantity, product.getStock());
        return productRepository.save(product);
    }
}
