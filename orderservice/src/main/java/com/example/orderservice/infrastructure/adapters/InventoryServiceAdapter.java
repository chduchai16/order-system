package com.example.orderservice.infrastructure.adapters;

import com.example.orderservice.domain.ports.external.InventoryService;

import com.example.orderservice.infrastructure.adapters.clients.ProductClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceAdapter implements InventoryService {

    private final ProductClient productClient;

    @Override
    public void reserveStock(Long productId, Integer quantity) {
        log.info("Reserving stock for product {}: quantity {}", productId, quantity);
        productClient.deductStock(productId, quantity);
    }

    @Override
    public void releaseStock(Long productId, Integer quantity) {
        log.info("Releasing stock for product {}: quantity {}", productId, quantity);
        productClient.releaseStock(productId, quantity);
    }
}
