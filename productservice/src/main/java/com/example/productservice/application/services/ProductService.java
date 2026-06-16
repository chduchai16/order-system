package com.example.productservice.application.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.commonlib.events.cart.CartItemDto;
import com.example.commonlib.events.product.ProductPriceChangedEvent;
import com.example.commonlib.events.stock.StockReservationFailedEvent;
import com.example.commonlib.events.stock.StockReservedEvent;
import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.application.dtos.product.UpdateProductImageRequest;
import com.example.productservice.application.dtos.product.UpdateProductRequest;
import com.example.productservice.domain.models.Category;
import com.example.productservice.domain.models.Money;
import com.example.productservice.domain.models.Product;
import com.example.productservice.domain.models.ProductAttribute;
import com.example.productservice.domain.models.ProductImage;
import com.example.productservice.domain.models.ProductVariant;
import com.example.productservice.domain.models.SKU;
import com.example.productservice.domain.models.StockMovement;
import com.example.productservice.domain.models.external.MediaInfo;
import com.example.productservice.domain.ports.externals.MediaService;
import com.example.productservice.domain.ports.persistence.CategoryRepository;
import com.example.productservice.domain.ports.persistence.ProductRepository;
import com.example.productservice.infrastructure.adapters.producers.ProductEventProducer;
import com.example.productservice.infrastructure.mappers.ProductMapper;
import com.example.productservice.infrastructure.persistence.entities.StockMovementEntity;
import com.example.productservice.infrastructure.persistence.jpas.StockMovementRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final ProductEventProducer productEventProducer;
    private final MediaService mediaService;

    @Override
    @Transactional
    public Product createProduct(ProductRequest productRequest) {
        // tạo sản phẩm mới kèm variants và attributes, images
        log.info("Creating product: {}", productRequest.getName());

        Category category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + productRequest.getCategoryId()));
        }

        // tạo model product
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

        // map product variant
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

        // map product attribute
        if (productRequest.getAttributes() != null) {
            product.setAttributes(productRequest.getAttributes().stream()
                    .map(a -> ProductAttribute.builder()
                            .name(a.getName())
                            .value(a.getValue())
                            .build())
                    .collect(Collectors.toList()));
        }

        // map product image
        validateMediaIds(productRequest.getImages() != null
                ? productRequest.getImages().stream().map(image -> image.getMediaId()).toList()
                : null);

        if(productRequest.getImages() != null) {
            product.setImages(productRequest.getImages().stream().map(
                    image -> ProductImage.builder()
                            .mediaId(image.getMediaId())
                            .displayOrder(image.getDisplayOrder())
                            .isPrimary(image.isPrimary())
                            .build()
            ).toList());
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
    public Product updateProduct(UpdateProductRequest productRequest) {
        log.info("Update product: {}", productRequest.getName());

        // product tồn tại
        Product product = productRepository.findById(productRequest.getId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + productRequest.getId()));

        Category category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + productRequest.getCategoryId()));
        }

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setCategory(category);
        if(productRequest.getPrice()!= null) {
            product.setPrice(new Money(productRequest.getPrice()));
        }
        product.setStock(productRequest.getStock());

        // map product variant
        if(productRequest.getVariants() != null) {
            product.setVariants(productRequest.getVariants()
                    .stream()
                    .map(
                    var -> ProductVariant
                            .builder()
                            .skuCode(var.getSkuCode())
                            .name(var.getName())
                            .price(var.getPrice())
                            .totalStock(var.getTotalStock())
                            .reservedStock(var.getReservedStock())
                            .build()
            ).toList());
        }

        // map product attribute
        if(productRequest.getAttributes() != null) {
            product.setAttributes(productRequest.getAttributes()
                    .stream()
                    .map(
                            attr -> ProductAttribute
                                    .builder()
                                    .name(attr.getName())
                                    .value(attr.getValue())
                                    .build()
                    ).toList());
        }

        // map product image
        validateMediaIds(productRequest.getImages() != null
                ? productRequest.getImages().stream().map(UpdateProductImageRequest::getMediaId).toList()
                : null);

        if(productRequest.getImages() != null) {
            product.setImages(productRequest.getImages()
                    .stream()
                    .map(
                            image -> ProductImage
                                    .builder()
                                    .mediaId(image.getMediaId())
                                    .displayOrder(image.getDisplayOrder())
                                    .isPrimary(image.isPrimary())
                                    .build()
                    )
                    .toList());
        }

        return productRepository.save(product);
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


    // trừ stock , nếu lỗi thì thực hiện cộng stock
    @Override
    @Transactional
    public void reserveStockForOrder(Long orderId, Long userId, List<CartItemDto> items, BigDecimal totalPrice) {
        try {
            for (CartItemDto item : items) {
                reserveStock(item.getProductId(), item.getQuantity());
                log.info("Reserved stock for productId: {}, quantity: {}", item.getProductId(), item.getQuantity());
            }

            StockReservedEvent event = new StockReservedEvent(
                    orderId,
                    userId,
                    items,
                    totalPrice,
                    LocalDateTime.now()
            );
            productEventProducer.publishStockReserved(event);
            log.info("Published StockReservedEvent for orderId: {}", orderId);
        } catch (Exception e) {
            StockReservationFailedEvent failedEvent = new StockReservationFailedEvent(
                    orderId,
                    userId,
                    items,
                    "Stock reservation failed: " + e.getMessage(),
                    LocalDateTime.now()
            );
            productEventProducer.publishStockReservationFailed(failedEvent);
            log.info("Published StockReservationFailedEvent for orderId: {}", orderId);
            throw e;
        }
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
        productEventProducer.publishProductPriceChanged(event);
        
        return savedProduct;
    }

    @Override
    public List<StockMovement> getStockMovements(Long productId) {
        // lấy danh sách lịch sử kho
        return stockMovementRepository.findByProductId(productId).stream()
                .map(ProductMapper::toDomain)
                .collect(Collectors.toList());
    }

    private void validateMediaIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        List<MediaInfo> mediaInfos = mediaService.getByIds(ids);
        Set<Long> foundIds = mediaInfos.stream()
                .map(MediaInfo::getId)
                .collect(Collectors.toSet());

        List<Long> missingIds = ids.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();

        if (!missingIds.isEmpty()) {
            throw new RuntimeException("Media not found for ids: " + missingIds);
        }
    }
}
