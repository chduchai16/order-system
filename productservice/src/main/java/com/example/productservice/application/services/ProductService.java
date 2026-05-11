package com.example.productservice.application.services;

import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.domain.models.*;
import com.example.productservice.domain.ports.persistence.CategoryRepository;
import com.example.productservice.domain.ports.persistence.ProductRepository;
import com.example.productservice.infrastructure.persistence.entities.*;
import com.example.productservice.infrastructure.persistence.jpas.StockMovementRepository;
import com.example.productservice.infrastructure.mappers.ProductMapper;
import com.example.commonlib.events.ProductPriceChangedEvent;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    @Transactional
    public Product createProduct(ProductRequest productRequest) {
        // tạo sản phẩm mới kèm variants và attributes
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

        if (productRequest.getVariants() != null) {
            product.setVariants(productRequest.getVariants().stream()
                    .map(v -> ProductVariant.builder()
                            .skuCode(v.getSkuCode())
                            .name(v.getName())
                            .price(v.getPrice())
                            .totalStock(v.getStock())
                            .reservedStock(0)
                            .build())
                    .collect(Collectors.toList()));
        }

        if (productRequest.getAttributes() != null) {
            product.setAttributes(productRequest.getAttributes().stream()
                    .map(a -> ProductAttribute.builder()
                            .name(a.getName())
                            .value(a.getValue())
                            .build())
                    .collect(Collectors.toList()));
        }

        Product savedProduct = productRepository.save(product);

        // ghi log nhập kho ban đầu
        if (savedProduct.getStock() > 0) {
            stockMovementRepository.save(StockMovementEntity.builder()
                    .productId(savedProduct.getId())
                    .quantity(savedProduct.getStock())
                    .type(StockMovementEntity.MovementType.IMPORT)
                    .reason("Initial stock import on creation")
                    .build());
        }

        if (savedProduct.getVariants() != null) {
            savedProduct.getVariants().forEach(v -> {
                if (v.getTotalStock() > 0) {
                    stockMovementRepository.save(StockMovementEntity.builder()
                            .productId(savedProduct.getId())
                            .variantId(v.getId())
                            .quantity(v.getTotalStock())
                            .type(StockMovementEntity.MovementType.IMPORT)
                            .reason("Initial variant stock import")
                            .build());
                }
            });
        }

        return savedProduct;
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        // lấy chi tiết sản phẩm
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getAllProducts() {
        // lấy danh sách sản phẩm
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public void reserveStock(Long productId, Integer quantity) {
        // thực hiện giữ chỗ kho và log movement
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        product.reserveStock(quantity);
        productRepository.save(product);

        stockMovementRepository.save(StockMovementEntity.builder()
                .productId(productId)
                .quantity(quantity)
                .type(StockMovementEntity.MovementType.RESERVE)
                .reason("Order reservation")
                .build());
    }

    @Override
    @Transactional
    public void releaseStock(Long productId, Integer quantity) {
        // giải phóng kho và log movement
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        product.releaseStock(quantity);
        productRepository.save(product);

        stockMovementRepository.save(StockMovementEntity.builder()
                .productId(productId)
                .quantity(quantity)
                .type(StockMovementEntity.MovementType.RELEASE)
                .reason("Order cancellation or adjustment")
                .build());
    }

    @Override
    @Transactional
    public Product updatePrice(Long productId, BigDecimal newPrice) {
        // cập nhật giá và publish event
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        BigDecimal oldPrice = product.getPrice().getAmount();
        product.updatePrice(new Money(newPrice));
        Product savedProduct = productRepository.save(product);
        
        ProductPriceChangedEvent event = new ProductPriceChangedEvent(productId, oldPrice, newPrice);
        kafkaTemplate.send("product.price.changed", event);
        
        return savedProduct;
    }

    @Override
    public List<StockMovement> getStockMovements(Long productId) {
        // lấy danh sách lịch sử kho
        return stockMovementRepository.findByProductId(productId).stream()
                .map(ProductMapper::toDomain)
                .collect(Collectors.toList());
    }
}
