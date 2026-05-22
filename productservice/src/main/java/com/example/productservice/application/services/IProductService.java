package com.example.productservice.application.services;

import com.example.commonlib.events.cart.CartItemDto;
import com.example.productservice.application.dtos.product.ProductRequest;
import com.example.productservice.domain.models.Product;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface IProductService {
    Product createProduct(ProductRequest productRequest);
    Optional<Product> getProductById(Long id);
    List<Product> getAllProducts();
    void reserveStock(Long productId, Integer quantity);
    void reserveStockForOrder(Long orderId, Long userId, List<CartItemDto> items, BigDecimal totalPrice);
    void releaseStock(Long productId, Integer quantity);
    Product updatePrice(Long productId, BigDecimal newPrice);
    java.util.List<com.example.productservice.domain.models.StockMovement> getStockMovements(Long productId);
}
