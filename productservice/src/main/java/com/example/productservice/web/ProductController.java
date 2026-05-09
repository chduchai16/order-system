package com.example.productservice.web;

import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.application.dtos.product.ProductResponse;
import com.example.productservice.application.services.IProductService;
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
    private final IProductService productService;

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
        List<ProductResponse> products = productService.getAllProducts()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/{id}/reserve-stock")
    public ResponseEntity<Void> reserveStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        productService.reserveStock(id, quantity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/release-stock")
    public ResponseEntity<Void> releaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        productService.releaseStock(id, quantity);
        return ResponseEntity.ok().build();
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .price(product.getPrice() != null ? product.getPrice().getAmount() : null)
                .stock(product.getStock())
                .active(product.isActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
