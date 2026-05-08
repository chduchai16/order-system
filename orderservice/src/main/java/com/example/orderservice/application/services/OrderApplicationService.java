package com.example.orderservice.application.services;

import com.example.orderservice.application.dtos.OrderRequest;
import com.example.orderservice.application.saga.OrderSagaOrchestrator;
import com.example.orderservice.domain.models.Address;
import com.example.orderservice.domain.models.Order;
import com.example.orderservice.domain.models.OrderItem;
import com.example.orderservice.domain.models.OrderStatus;
import com.example.orderservice.domain.ports.persistence.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderApplicationService {

    private final OrderRepository orderRepository;
    private final OrderSagaOrchestrator sagaOrchestrator;

    public Order createOrder(OrderRequest request) {
        log.info("Creating initial order for user {}", request.getUserId());

        Address shippingAddress = new Address(
                request.getStreet(),
                request.getCity(),
                request.getDistrict(),
                request.getCountry()
        );

        List<OrderItem> items = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        Order order = Order.builder()
                .userId(request.getUserId())
                .keycloakId(request.getKeycloakId())
                .items(items)
                .status(OrderStatus.PENDING)
                .shippingAddress(shippingAddress)
                .build();

        order.calculateTotalPrice();

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
