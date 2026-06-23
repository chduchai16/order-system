package com.example.productservice.web;

import com.example.productservice.application.dtos.product.*;
import com.example.productservice.application.services.IProductService;
import com.example.productservice.domain.models.Product;
import com.example.productservice.domain.models.StockMovement;
import com.example.productservice.domain.models.external.MediaInfo;
import com.example.productservice.domain.ports.externals.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final IProductService productService;
    private final MediaService mediaService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody UpdateProductRequest request) {
        request.setId(id);
        Product product = productService.updateProduct(request);
        return ResponseEntity.ok(toResponse(product));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    @GetMapping
    public ResponseEntity<PagedProductResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<Product> result = productService.getAllProducts(PageRequest.of(page, limit));
        List<ProductResponse> products = result.getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(PagedProductResponse.builder()
                .content(products)
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build());
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

    @PatchMapping("/{id}/price")
    public ResponseEntity<ProductResponse> updatePrice(
            @PathVariable Long id,
            @RequestParam BigDecimal price) {
        // cập nhật giá
        Product product = productService.updatePrice(id, price);
        return ResponseEntity.ok(toResponse(product));
    }

    @GetMapping("/{id}/stock-movements")
    public ResponseEntity<List<StockMovement>> getStockMovements(@PathVariable Long id) {
        // lấy lịch sử kho
        return ResponseEntity.ok(productService.getStockMovements(id));
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .sku(product.getSku() != null ? product.getSku().getValue() : null)
                .name(product.getName())
                .description(product.getDescription())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .price(product.getPrice() != null ? product.getPrice().getAmount() : null)
                .stock(product.getStock())
                .reservedStock(product.getReservedStock())
                .availableStock(product.getAvailableStock())
                .active(product.isActive())
                .variants(product.getVariants() != null ? product.getVariants().stream()
                        .map(v -> VariantResponse.builder()
                                .id(v.getId())
                                .skuCode(v.getSkuCode())
                                .name(v.getName())
                                .price(v.getPrice())
                                .stock(v.getTotalStock())
                                .build())
                        .collect(Collectors.toList()) : null)
                .attributes(product.getAttributes() != null ? product.getAttributes().stream()
                        .map(a -> AttributeResponse.builder()
                                .name(a.getName())
                                .value(a.getValue())
                                .build())
                        .collect(Collectors.toList()) : null)
                .images(buildImageResponses(product))
                .createdAt(product.getCreatedAt())
                .build();
    }

    private List<ProductImageResponse> buildImageResponses(Product product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return List.of();
        }

        List<Long> mediaIds = product.getImages().stream()
                .map(com.example.productservice.domain.models.ProductImage::getMediaId)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();

        List<MediaInfo> mediaInfos = mediaService.getByIds(mediaIds);

        java.util.Map<Long, MediaInfo> mediaInfoMap = mediaInfos.stream()
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toMap(MediaInfo::getId, item -> item, (left, right) -> left));

        return product.getImages().stream()
                .map(image -> ProductImageResponse.builder()
                        .id(image.getId())
                        .mediaId(image.getMediaId())
                        .productId(image.getProductId())
                        .displayOrder(image.getDisplayOrder())
                        .isPrimary(image.isPrimary())
                        .url(mediaInfoMap.get(image.getMediaId()) != null ? mediaInfoMap.get(image.getMediaId()).getUrl() : null)
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }
}
