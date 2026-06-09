package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.order.OrderStatusHistory;
import com.example.orderservice.infrastructure.persistence.entities.order.OrderStatusHistoryEntity;

public class OrderStatusHistoryMapper {

    public static OrderStatusHistory toDomain(OrderStatusHistoryEntity entity) {
        if (entity == null) {
            return null;
        }

        return OrderStatusHistory.builder()
                .id(entity.getId())
                .fromStatus(entity.getFromStatus())
                .toStatus(entity.getToStatus())
                .reason(entity.getReason())
                .changedAt(entity.getChangedAt())
                .build();
    }

    public static OrderStatusHistoryEntity toEntity(OrderStatusHistory domain) {
        if (domain == null) {
            return null;
        }

        OrderStatusHistoryEntity entity = new OrderStatusHistoryEntity();
        entity.setId(domain.getId());
        entity.setFromStatus(domain.getFromStatus());
        entity.setToStatus(domain.getToStatus());
        entity.setReason(domain.getReason());
        entity.setChangedAt(domain.getChangedAt());
        return entity;
    }
}
