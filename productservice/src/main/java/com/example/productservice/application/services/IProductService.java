package com.example.productservice.application.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.example.commonlib.events.cart.CartItemDto;
import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.application.dtos.product.UpdateProductImageRequest;
import com.example.productservice.application.dtos.product.UpdateProductRequest;
import com.example.productservice.domain.entity.inventory.StockMovement;
import com.example.productservice.domain.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService {
    Product createProduct(ProductRequest productRequest);
    Product updateProduct(UpdateProductRequest updateProductRequest);
    Optional<Product> getProductById(Long id);
    Page<Product> getAllProducts(Pageable pageable);
    void reserveStock(Long productId, Integer quantity);
    void releaseStock(Long productId, Integer quantity);
    void confirmStock(Long productId, Integer quantity);
    Product updatePrice(Long productId, BigDecimal price);
    void updateImages(Long productId, List<UpdateProductImageRequest> images);
    List<StockMovement> getStockMovements(Long productId);
    void reserveStockForOrder(Long orderId, Long userId, List<CartItemDto> items, BigDecimal totalPrice);
    void confirmStockForOrder(Long orderId, List<CartItemDto> items);
}
