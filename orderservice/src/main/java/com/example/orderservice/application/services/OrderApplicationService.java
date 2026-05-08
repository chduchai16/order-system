package com.example.orderservice.application.services;

import com.example.orderservice.application.dtos.OrderRequest;
import com.example.orderservice.application.saga.OrderSagaOrchestrator;
import com.example.orderservice.domain.models.Order;
import com.example.orderservice.domain.models.OrderStatus;
import com.example.orderservice.domain.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderApplicationService {

    private final OrderRepository orderRepository;
    private final OrderSagaOrchestrator sagaOrchestrator;

    public Order createOrder(OrderRequest request) {
        log.info("Creating initial order for user {}", request.getUserId());

        Order order = Order.builder()
                .userId(request.getUserId())
                .keycloakId(request.getKeycloakId())
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .totalPrice(request.getTotalPrice())
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);
        
        // Execute Saga Orchestration
        sagaOrchestrator.execute(savedOrder);
        
        return savedOrder;
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
