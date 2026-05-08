package com.example.orderservice.application.saga;

import com.example.orderservice.domain.models.Order;
import com.example.orderservice.domain.models.OrderStatus;
import com.example.orderservice.domain.repositories.InventoryService;
import com.example.orderservice.domain.repositories.OrderRepository;
import com.example.orderservice.domain.repositories.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderSagaOrchestrator {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    private final PaymentService paymentService;

    public void execute(Order order) {
        log.info("Starting Saga for order {}", order.getId());

        try {
            // Step 1: Reserve Stock for all items
            for (var item : order.getItems()) {
                inventoryService.reserveStock(item.getProductId(), item.getQuantity());
            }
            order.markAsStockReserved();
            orderRepository.save(order);
            log.info("Step 1 (Stock Reserved) completed for order {}", order.getId());


            // Step 2: Payment
            paymentService.processPayment(order);
            order.markAsPaid();
            orderRepository.save(order);
            log.info("Step 2 (Payment Completed) completed for order {}", order.getId());
            
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
        
        // If payment was completed, refund it
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.COMPLETED) {
            try {
                paymentService.refundPayment(order.getId());
                log.info("Payment compensation: refunded for order {}", order.getId());
            } catch (Exception e) {
                log.error("CRITICAL: Failed to refund payment during compensation for order {}", order.getId(), e);
            }
        }

        // If stock was reserved, release it
        if (order.getStatus() == OrderStatus.STOCK_RESERVED || order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.COMPLETED) {
            try {
                for (var item : order.getItems()) {
                    inventoryService.releaseStock(item.getProductId(), item.getQuantity());
                }
                log.info("Stock compensation: released stock for all items in order {}", order.getId());
            } catch (Exception e) {
                log.error("CRITICAL: Failed to release stock during compensation for order {}", order.getId(), e);
            }
        }


        order.markAsCancelled();
        orderRepository.save(order);
    }
}
