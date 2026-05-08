package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.Order;
import com.example.orderservice.infrastructure.persistence.entities.OrderEntity;

public class OrderMapper {
    
    public static Order toDomain(OrderEntity entity) {
        if (entity == null) return null;
        return Order.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .keycloakId(entity.getKeycloakId())
                .productId(entity.getProductId())
                .quantity(entity.getQuantity())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static OrderEntity toEntity(Order domain) {
        if (domain == null) return null;
        OrderEntity entity = new OrderEntity();
        entity.setId(domain.getId());
        entity.setUserId(domain.getUserId());
        entity.setKeycloakId(domain.getKeycloakId());
        entity.setProductId(domain.getProductId());
        entity.setQuantity(domain.getQuantity());
        entity.setTotalPrice(domain.getTotalPrice());
        entity.setStatus(domain.getStatus());
        return entity;
    }
}
