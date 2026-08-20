package com.example.productservice.application.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.commonlib.events.cart.CartItemDto;
import com.example.commonlib.events.product.ProductPriceChangedEvent;
import com.example.commonlib.events.stock.StockReservationFailedEvent;
import com.example.commonlib.events.stock.StockReservedEvent;
import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.application.dtos.product.UpdateProductImageRequest;
import com.example.productservice.application.dtos.product.UpdateProductRequest;
import com.example.productservice.domain.entity.category.Category;
import com.example.productservice.domain.entity.inventory.StockMovement;
import com.example.productservice.domain.entity.product.Product;
import com.example.productservice.domain.entity.product.ProductAttribute;
import com.example.productservice.domain.entity.product.ProductImage;
import com.example.productservice.domain.entity.product.ProductVariant;
import com.example.productservice.domain.entity.product.valueobject.SKU;
import com.example.productservice.infrastructure.adapters.producers.ProductEventProducer;
import com.example.productservice.infrastructure.repository.category.CategoryRepository;
import com.example.productservice.infrastructure.repository.inventory.StockMovementRepository;
import com.example.productservice.infrastructure.repository.product.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final ProductEventProducer productEventProducer;

    @Override
    @Transactional
    public Product createProduct(ProductRequest productRequest) {
        log.info("Creating product: {}", productRequest.getName());

        Category category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Product product = Product.builder()
                .sku(SKU.generate().getValue())
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .category(category)
                .price(productRequest.getPrice())
                .stock(productRequest.getStock())
                .active(true)
                .build();

        if (productRequest.getVariants() != null) {
            for (var v : productRequest.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .skuCode(v.getSkuCode())
                        .name(v.getName())
                        .price(v.getPrice())
                        .totalStock(v.getStock())
                        .reservedStock(0)
                        .build();
                product.addProductVariant(variant);
            }
        }

        if (productRequest.getAttributes() != null) {
            for (var a : productRequest.getAttributes()) {
                ProductAttribute attr = ProductAttribute.builder()
                        .name(a.getName())
                        .value(a.getValue())
                        .build();
                product.addProductAttribute(attr);
            }
        }

        if (productRequest.getImages() != null) {
            for (var img : productRequest.getImages()) {
                ProductImage image = ProductImage.builder()
                        .mediaId(img.getMediaId())
                        .displayOrder(img.getDisplayOrder())
                        .isPrimary(img.isPrimary())
                        .build();
                product.addProductImage(image);
            }
        }

        Product savedProduct = productRepository.save(product);

        if (productRequest.getStock() != null && productRequest.getStock() > 0) {
            StockMovement movement = StockMovement.builder()
                    .productId(savedProduct.getId())
                    .quantity(productRequest.getStock())
                    .type(StockMovement.MovementType.IMPORT)
                    .reason("Initial stock for new product")
                    .build();
            stockMovementRepository.save(movement);
        }

        return savedProduct;
    }

    @Override
    @Transactional
    public Product updateProduct(UpdateProductRequest request) {
        log.info("Updating product: {}", request.getId());
        Product product = productRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());

        if (request.getPrice() != null && !request.getPrice().equals(product.getPrice())) {
            updatePrice(product.getId(), request.getPrice());
        }

        if (request.getAttributes() != null) {
            for (var attrReq : request.getAttributes()) {
                ProductAttribute newAttr = ProductAttribute.builder()
                        .name(attrReq.getName())
                        .value(attrReq.getValue())
                        .build();
                try {
                    product.updateAttribute(newAttr.getName(), newAttr);
                } catch (Exception e) {
                    product.addProductAttribute(newAttr);
                }
            }
        }

        if (request.getVariants() != null) {
            for (var variantReq : request.getVariants()) {
                ProductVariant newVariant = ProductVariant.builder()
                        .id(variantReq.getId())
                        .skuCode(variantReq.getSkuCode())
                        .name(variantReq.getName())
                        .price(variantReq.getPrice())
                        .totalStock(variantReq.getTotalStock())
                        .build();
                if (newVariant.getId() != null) {
                    product.updateVariant(newVariant.getId(), newVariant);
                } else {
                    product.addProductVariant(newVariant);
                }
            }
        }

        return productRepository.save(product);
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public void reserveStock(Long productId, Integer quantity) {
        log.info("Reserving stock for product: {}, quantity: {}", productId, quantity);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        product.reserveStock(quantity);
        productRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .productId(productId)
                .quantity(quantity)
                .type(StockMovement.MovementType.RESERVE)
                .reason("Reserved stock for order")
                .build();
        stockMovementRepository.save(movement);
    }

    @Override
    @Transactional
    public void releaseStock(Long productId, Integer quantity) {
        log.info("Releasing stock for product: {}, quantity: {}", productId, quantity);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        product.releaseStock(quantity);
        productRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .productId(productId)
                .quantity(quantity)
                .type(StockMovement.MovementType.RELEASE)
                .reason("Released reserved stock")
                .build();
        stockMovementRepository.save(movement);
    }

    @Override
    @Transactional
    public void confirmStock(Long productId, Integer quantity) {
        log.info("Confirming stock deduction for product: {}, quantity: {}", productId, quantity);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        product.confirmStock(quantity);
        productRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .productId(productId)
                .quantity(quantity)
                .type(StockMovement.MovementType.EXPORT)
                .reason("Confirmed order stock deduction")
                .build();
        stockMovementRepository.save(movement);
    }

    @Override
    @Transactional
    public Product updatePrice(Long productId, BigDecimal newPrice) {
        log.info("Updating price for product: {}, new price: {}", productId, newPrice);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        BigDecimal oldPrice = product.getPrice();
        product.updatePrice(newPrice);
        Product savedProduct = productRepository.save(product);

        ProductPriceChangedEvent event = new ProductPriceChangedEvent(
                productId,
                oldPrice,
                newPrice
        );
        productEventProducer.publishProductPriceChanged(event);

        return savedProduct;
    }

    @Override
    @Transactional
    public void updateImages(Long productId, List<UpdateProductImageRequest> images) {
        log.info("Updating images for product: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (images != null) {
            for (var imgReq : images) {
                ProductImage newImage = ProductImage.builder()
                        .mediaId(imgReq.getMediaId())
                        .displayOrder(imgReq.getDisplayOrder())
                        .isPrimary(imgReq.isPrimary())
                        .build();
                product.addProductImage(newImage);
            }
        }

        productRepository.save(product);
    }

    @Override
    public List<StockMovement> getStockMovements(Long productId) {
        return stockMovementRepository.findByProductId(productId);
    }

    @Override
    @Transactional
    public void reserveStockForOrder(Long orderId, Long userId, List<CartItemDto> items, BigDecimal totalPrice) {
        log.info("Handling OrderCreatedEvent for order: {}, items count: {}", orderId, items.size());
        try {
            for (CartItemDto item : items) {
                reserveStock(item.getProductId(), item.getQuantity());
            }
            log.info("Successfully reserved stock for order: {}", orderId);
            productEventProducer.publishStockReserved(new StockReservedEvent(orderId, userId, items, totalPrice, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Failed to reserve stock for order: {}, reason: {}", orderId, e.getMessage());
            productEventProducer.publishStockReservationFailed(new StockReservationFailedEvent(orderId, userId, items, e.getMessage(), LocalDateTime.now()));
        }
    }

    @Override
    @Transactional
    public void confirmStockForOrder(Long orderId, List<CartItemDto> items) {
        log.info("Handling OrderPaidEvent for order: {}, items count: {}", orderId, items.size());
        for (CartItemDto item : items) {
            confirmStock(item.getProductId(), item.getQuantity());
        }
        log.info("Successfully confirmed stock deduction for paid order: {}", orderId);
    }
}
