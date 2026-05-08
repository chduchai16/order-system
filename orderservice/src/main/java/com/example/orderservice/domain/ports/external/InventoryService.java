package com.example.orderservice.domain.ports.external;

public interface InventoryService {
    void reserveStock(Long productId, Integer quantity);
    void releaseStock(Long productId, Integer quantity);
}
