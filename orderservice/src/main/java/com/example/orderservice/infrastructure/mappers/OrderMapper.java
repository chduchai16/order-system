package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.*;
import com.example.orderservice.infrastructure.persistence.entities.*;

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
                .orderNumber(entity.getOrderNumber() != null ? new OrderNumber(entity.getOrderNumber()) : null)
                .userId(entity.getUserId())
                .keycloakId(entity.getKeycloakId())
                .items(entity.getItems() != null ?
                    entity.getItems().stream().map(OrderMapper::itemToDomain).collect(Collectors.toList()) :
                    new ArrayList<>())
                .statusHistory(entity.getStatusHistory() != null ?
                    entity.getStatusHistory().stream().map(OrderMapper::historyToDomain).collect(Collectors.toList()) :
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

    private static OrderStatusHistory historyToDomain(OrderStatusHistoryEntity entity) {
        return OrderStatusHistory.builder()
                .id(entity.getId())
                .fromStatus(entity.getFromStatus())
                .toStatus(entity.getToStatus())
                .reason(entity.getReason())
                .changedAt(entity.getChangedAt())
                .build();
    }

    public static OrderEntity toEntity(Order domain) {
        if (domain == null) return null;
        OrderEntity entity = new OrderEntity();
        entity.setId(domain.getId());
        entity.setOrderNumber(domain.getOrderNumber() != null ? domain.getOrderNumber().getValue() : OrderNumber.generate().getValue());
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

        if (domain.getStatusHistory() != null) {
            entity.setStatusHistory(domain.getStatusHistory().stream()
                .map(h -> {
                    OrderStatusHistoryEntity histEntity = historyToEntity(h);
                    histEntity.setOrder(entity);
                    return histEntity;
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

    private static OrderStatusHistoryEntity historyToEntity(OrderStatusHistory domain) {
        OrderStatusHistoryEntity entity = new OrderStatusHistoryEntity();
        entity.setId(domain.getId());
        entity.setFromStatus(domain.getFromStatus());
        entity.setToStatus(domain.getToStatus());
        entity.setReason(domain.getReason());
        entity.setChangedAt(domain.getChangedAt());
        return entity;
    }
}
