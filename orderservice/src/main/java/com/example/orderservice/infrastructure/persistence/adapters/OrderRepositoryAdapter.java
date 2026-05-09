package com.example.orderservice.infrastructure.persistence.adapters;

import com.example.orderservice.domain.models.Order;
import com.example.orderservice.domain.ports.persistence.OrderRepository;

import com.example.orderservice.infrastructure.mappers.OrderMapper;
import com.example.orderservice.infrastructure.persistence.entities.OrderEntity;
import com.example.orderservice.infrastructure.persistence.jpas.JpaOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderRepositoryAdapter implements OrderRepository {

    private final JpaOrderRepository jpaOrderRepository;

    @Override
    public Order save(Order order) {
        OrderEntity entity = OrderMapper.toEntity(order);
        OrderEntity savedEntity = jpaOrderRepository.save(entity);
        return OrderMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Order> findById(Long id) {
        return jpaOrderRepository.findById(id).map(OrderMapper::toDomain);
    }

    @Override
    public List<Order> findAll() {
        return jpaOrderRepository.findAll().stream()
                .map(OrderMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return jpaOrderRepository.findByUserId(userId).stream()
                .map(OrderMapper::toDomain)
                .collect(Collectors.toList());
    }
}
