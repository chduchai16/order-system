package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.Address;
import com.example.orderservice.domain.models.Order;
import com.example.orderservice.domain.models.OrderItem;
import com.example.orderservice.infrastructure.persistence.entities.OrderEntity;
import com.example.orderservice.infrastructure.persistence.entities.OrderItemEntity;

import java.util.ArrayList;
import java.util.stream.Collectors;

public class OrderMapper {
    
    public static Order toDomain(OrderEntity entity) {
        if (entity == null) return null;
        Address address = null;
        if (entity.getShippingStreet() != null) {
            address = new Address(
                entity.getShippingStreet(),
                entity.getShippingCity(),
                entity.getShippingDistrict(),
                entity.getShippingCountry()
            );
        }

        return Order.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .keycloakId(entity.getKeycloakId())
                .items(entity.getItems() != null ? 
                    entity.getItems().stream().map(OrderMapper::itemToDomain).collect(Collectors.toList()) : 
                    new ArrayList<>())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .shippingAddress(address)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private static OrderItem itemToDomain(OrderItemEntity entity) {
        return OrderItem.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .productName(entity.getProductName())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .build();
    }

    public static OrderEntity toEntity(Order domain) {
        if (domain == null) return null;
        OrderEntity entity = new OrderEntity();
        entity.setId(domain.getId());
        entity.setUserId(domain.getUserId());
        entity.setKeycloakId(domain.getKeycloakId());
        entity.setTotalPrice(domain.getTotalPrice());
        entity.setStatus(domain.getStatus());
        
        if (domain.getShippingAddress() != null) {
            entity.setShippingStreet(domain.getShippingAddress().getStreet());
            entity.setShippingCity(domain.getShippingAddress().getCity());
            entity.setShippingDistrict(domain.getShippingAddress().getDistrict());
            entity.setShippingCountry(domain.getShippingAddress().getCountry());
        }

        if (domain.getItems() != null) {
            entity.setItems(domain.getItems().stream()
                .map(item -> {
                    OrderItemEntity itemEntity = itemToEntity(item);
                    itemEntity.setOrder(entity);
                    return itemEntity;
                }).collect(Collectors.toList()));
        }
        
        return entity;
    }

    private static OrderItemEntity itemToEntity(OrderItem domain) {
        OrderItemEntity entity = new OrderItemEntity();
        entity.setId(domain.getId());
        entity.setProductId(domain.getProductId());
        entity.setProductName(domain.getProductName());
        entity.setQuantity(domain.getQuantity());
        entity.setUnitPrice(domain.getUnitPrice());
        return entity;
    }
}
