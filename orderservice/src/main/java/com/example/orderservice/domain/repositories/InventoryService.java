package com.example.orderservice.domain.repositories;

public interface InventoryService {
    void reserveStock(Long productId, Integer quantity);
    void releaseStock(Long productId, Integer quantity);
}
