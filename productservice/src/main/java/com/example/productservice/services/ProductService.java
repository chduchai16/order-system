package com.example.productservice.services;


import com.example.productservice.dtos.ProductRequest;
import com.example.productservice.entities.Product;
import com.example.productservice.exceptions.InsufficientStockException;
import com.example.productservice.exceptions.ProductNotFoundException;
import com.example.productservice.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductRepository productRepository ;

    public Product createProduct(ProductRequest  productRequest) {
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStock(productRequest.getStock());
        productRepository.save(product);
        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    // trừ tồn kho
    @Transactional
    public Product deductStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found: " + productId));

        if (product.getStock() < quantity) {
            throw new InsufficientStockException(
                    "Insufficient stock for product " + productId +
                            ": requested=" + quantity + ", available=" + product.getStock()
            );
        }

        product.setStock(product.getStock() - quantity);
        log.info("Stock deducted: productId={}, quantity={}, remaining={}",
                productId, quantity, product.getStock());
        return productRepository.save(product);
    }
}
