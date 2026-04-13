package com.example.orderservice.services;


import com.example.commonlib.events.OrderCreatedEvent;
import com.example.orderservice.clients.ProductClient;
import com.example.orderservice.clients.ProductResponse;
import com.example.orderservice.clients.UserClient;
import com.example.orderservice.clients.UserResponse;
import com.example.orderservice.dtos.OrderRequest;
import com.example.orderservice.entities.Order;
import com.example.orderservice.entities.OrderStatus;
import com.example.orderservice.producers.OrderEventProducer;
import com.example.orderservice.repositories.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserClient userClient;
    private final ProductClient productClient;
    private final OrderEventProducer orderEventProducer;

    @Transactional
    public Order createOrder(String keycloakId, OrderRequest request) {
        // Validate user qua Feign
        log.info("Validating user: keycloakId={}", keycloakId);
        UserResponse user = userClient.getUserByKeycloakId(keycloakId);

        if (!user.isActive()) {
            throw new RuntimeException("User is not active: " + keycloakId);
        }

        // Deduct stock qua Feign — nếu stock không đủ sẽ throw 409
        log.info("Deducting stock: productId={}, quantity={}",
                request.getProductId(), request.getQuantity());
        ProductResponse product = productClient.deductStock(
                request.getProductId(), request.getQuantity());

        // Tính giá và tạo order
        Order order = new Order();
        order.setUserId(user.getId());
        order.setKeycloakId(keycloakId);
        order.setProductId(request.getProductId());
        order.setQuantity(request.getQuantity());
        order.setTotalPrice(product.getPrice()
                .multiply(java.math.BigDecimal.valueOf(request.getQuantity())));
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);
        log.info("Order created: id={}", savedOrder.getId());

        // Publish Kafka event
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                user.getId(),
                keycloakId,
                request.getProductId(),
                request.getQuantity(),
                savedOrder.getTotalPrice(),
                savedOrder.getCreatedAt()
        );
        orderEventProducer.publishOrderCreated(event);

        return savedOrder;
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByKeycloakId(String keycloakId) {
        return orderRepository.findByKeycloakId(keycloakId);
    }

}
