package com.example.productservice.application.services;

import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.domain.models.Category;
import com.example.productservice.domain.models.Money;
import com.example.productservice.domain.models.Product;
import com.example.productservice.domain.models.SKU;
import com.example.productservice.domain.ports.persistence.CategoryRepository;
import com.example.productservice.domain.ports.persistence.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import com.example.commonlib.events.ProductPriceChangedEvent;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    @Transactional
    public Product createProduct(ProductRequest productRequest) {
        log.info("Creating product: {}", productRequest.getName());

        Category category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + productRequest.getCategoryId()));
        }

        Product product = Product.builder()
                .sku(SKU.generate())
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .category(category)
                .price(new Money(productRequest.getPrice()))
                .stock(productRequest.getStock())
                .reservedStock(0)
                .active(true)
                .build();

        return productRepository.save(product);
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public void reserveStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        product.reserveStock(quantity);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void releaseStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        product.releaseStock(quantity);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updatePrice(Long productId, BigDecimal newPrice) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        BigDecimal oldPrice = product.getPrice().getAmount();
        product.updatePrice(new Money(newPrice));
        Product savedProduct = productRepository.save(product);
        
        ProductPriceChangedEvent event = new ProductPriceChangedEvent(productId, oldPrice, newPrice);
        kafkaTemplate.send("product.price.changed", event);
        
        return savedProduct;
    }
}
