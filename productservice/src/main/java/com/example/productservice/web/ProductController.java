package com.example.productservice.web;

import com.example.productservice.application.dtos.ProductRequest;
import com.example.productservice.application.dtos.ProductResponse;
import com.example.productservice.application.services.ProductApplicationService;
import com.example.productservice.domain.models.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductApplicationService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(product));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllActiveProducts()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/{id}/deduct-stock")
    public ResponseEntity<ProductResponse> deductStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        Product product = productService.deductStock(id, quantity);
        return ResponseEntity.ok(toResponse(product));
    }

    @PostMapping("/{id}/release-stock")
    public ResponseEntity<ProductResponse> releaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        Product product = productService.releaseStock(id, quantity);
        return ResponseEntity.ok(toResponse(product));
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .active(product.isActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
