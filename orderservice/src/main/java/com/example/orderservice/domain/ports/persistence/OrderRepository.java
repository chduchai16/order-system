package com.example.orderservice.domain.ports.persistence;

import com.example.orderservice.domain.models.order.Order;
import java.util.Optional;
import java.util.List;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(Long id);
    List<Order> findAll();
    List<Order> findByUserId(Long userId);
    Optional<String> findLatestOrderNumberByPrefix(String prefix);
}
