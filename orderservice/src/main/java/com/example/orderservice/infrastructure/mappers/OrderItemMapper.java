package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.order.OrderItem;
import com.example.orderservice.infrastructure.persistence.entities.order.OrderItemEntity;

public class OrderItemMapper {

    public static OrderItem toDomain(OrderItemEntity entity) {
        if (entity == null) {
            return null;
        }

        return OrderItem.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .productName(entity.getProductName())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .discountAmount(entity.getDiscountAmount())
                .taxAmount(entity.getTaxAmount())
                .build();
    }

    public static OrderItemEntity toEntity(OrderItem domain) {
        if (domain == null) {
            return null;
        }

        OrderItemEntity entity = new OrderItemEntity();
        entity.setId(domain.getId());
        entity.setProductId(domain.getProductId());
        entity.setProductName(domain.getProductName());
        entity.setQuantity(domain.getQuantity());
        entity.setUnitPrice(domain.getUnitPrice());
        entity.setDiscountAmount(domain.getDiscountAmount());
        entity.setTaxAmount(domain.getTaxAmount());
        return entity;
    }
}
