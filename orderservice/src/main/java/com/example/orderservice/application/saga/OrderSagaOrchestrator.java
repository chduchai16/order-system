package com.example.orderservice.application.saga;

import com.example.orderservice.domain.models.Order;
import com.example.orderservice.domain.repositories.InventoryService;
import com.example.orderservice.domain.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderSagaOrchestrator {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    public void execute(Order order) {
        log.info("Starting Saga for order {}", order.getId());

        try {
            // Step 1: Reserve Stock
            inventoryService.reserveStock(order.getProductId(), order.getQuantity());
            order.markAsStockReserved();
            orderRepository.save(order);
            log.info("Step 1 (Stock Reserved) completed for order {}", order.getId());

            // Step 2: Payment (To be implemented)
            // simulatePayment(order);
            
            // Step 3: Complete
            order.markAsCompleted();
            orderRepository.save(order);
            log.info("Saga completed successfully for order {}", order.getId());

        } catch (Exception e) {
            log.error("Saga failed for order {}. Starting compensation...", order.getId(), e);
            compensate(order);
            throw new RuntimeException("Checkout failed: " + e.getMessage());
        }
    }

    private void compensate(Order order) {
        log.info("Compensating order {}", order.getId());
        
        // If stock was reserved, release it
        if (order.getStatus().name().startsWith("STOCK_RESERVED") || order.getStatus().name().startsWith("PAID")) {
            try {
                inventoryService.releaseStock(order.getProductId(), order.getQuantity());
                log.info("Stock compensation: released stock for product {}", order.getProductId());
            } catch (Exception e) {
                log.error("CRITICAL: Failed to release stock during compensation for order {}", order.getId(), e);
            }
        }

        order.markAsCancelled();
        orderRepository.save(order);
    }
}
