package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.order.Address;
import com.example.orderservice.domain.models.order.Order;
import com.example.orderservice.domain.models.order.OrderDiscount;
import com.example.orderservice.domain.models.order.OrderNumber;
import com.example.orderservice.domain.models.order.ShippingInfo;
import com.example.orderservice.domain.models.order.TaxInfo;
import com.example.orderservice.infrastructure.persistence.entities.order.OrderEntity;
import com.example.orderservice.infrastructure.persistence.entities.order.OrderItemEntity;
import com.example.orderservice.infrastructure.persistence.entities.order.OrderStatusHistoryEntity;

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
                .items(entity.getItems() != null ?
                    entity.getItems().stream().map(OrderItemMapper::toDomain).collect(Collectors.toList()) :
                    new ArrayList<>())
                .statusHistory(entity.getStatusHistory() != null ?
                    entity.getStatusHistory().stream().map(OrderStatusHistoryMapper::toDomain).collect(Collectors.toList()) :
                    new ArrayList<>())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .voucherId(entity.getVoucherId())
                .voucherCode(entity.getVoucherCode())
                .voucherDiscountAmount(entity.getVoucherDiscountAmount())
                .shippingAddress(address)
                .shippingInfo(ShippingInfo.builder()
                        .carrier(entity.getShippingCarrier())
                        .trackingNumber(entity.getTrackingNumber())
                        .shippingFee(entity.getShippingFee())
                        .estimatedDelivery(entity.getEstimatedDelivery())
                        .build())
                .discount(OrderDiscount.builder()
                        .code(entity.getDiscountCode())
                        .amount(entity.getDiscountAmount())
                        .build())
                .tax(TaxInfo.builder()
                        .amount(entity.getTaxAmount())
                        .type(entity.getTaxType())
                        .build())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static OrderEntity toEntity(Order domain) {
        if (domain == null) return null;
        OrderEntity entity = new OrderEntity();
        entity.setId(domain.getId());
        entity.setOrderNumber(domain.getOrderNumber() != null ? domain.getOrderNumber().getValue() : OrderNumber.generate().getValue());
        entity.setUserId(domain.getUserId());
        entity.setTotalPrice(domain.getTotalPrice());
        entity.setStatus(domain.getStatus());
        entity.setVoucherId(domain.getVoucherId());
        entity.setVoucherCode(domain.getVoucherCode());
        entity.setVoucherDiscountAmount(domain.getVoucherDiscountAmount());

        if (domain.getShippingAddress() != null) {
            entity.setShippingStreet(domain.getShippingAddress().getStreet());
            entity.setShippingCity(domain.getShippingAddress().getCity());
            entity.setShippingDistrict(domain.getShippingAddress().getDistrict());
            entity.setShippingCountry(domain.getShippingAddress().getCountry());
        }

        if (domain.getShippingInfo() != null) {
            entity.setShippingCarrier(domain.getShippingInfo().getCarrier());
            entity.setTrackingNumber(domain.getShippingInfo().getTrackingNumber());
            entity.setShippingFee(domain.getShippingInfo().getShippingFee());
            entity.setEstimatedDelivery(domain.getShippingInfo().getEstimatedDelivery());
        }

        if (domain.getDiscount() != null) {
            entity.setDiscountCode(domain.getDiscount().getCode());
            entity.setDiscountAmount(domain.getDiscount().getAmount());
        }

        if (domain.getTax() != null) {
            entity.setTaxAmount(domain.getTax().getAmount());
            entity.setTaxType(domain.getTax().getType());
        }

        if (domain.getItems() != null) {
            entity.setItems(domain.getItems().stream()
                .map(item -> {
                    OrderItemEntity itemEntity = OrderItemMapper.toEntity(item);
                    itemEntity.setOrder(entity);
                    return itemEntity;
                }).collect(Collectors.toList()));
        }

        if (domain.getStatusHistory() != null) {
            entity.setStatusHistory(domain.getStatusHistory().stream()
                .map(h -> {
                    OrderStatusHistoryEntity histEntity = OrderStatusHistoryMapper.toEntity(h);
                    histEntity.setOrder(entity);
                    return histEntity;
                }).collect(Collectors.toList()));
        }

        return entity;
    }
}
