package com.example.orderservice.infrastructure.persistence.cart.mappers;

import com.example.orderservice.domain.models.cart.Cart;
import com.example.orderservice.domain.models.cart.CartItem;
import com.example.orderservice.infrastructure.persistence.cart.entities.CartEntity;
import com.example.orderservice.infrastructure.persistence.cart.entities.CartItemEntity;

import java.util.ArrayList;
import java.util.stream.Collectors;

public class CartMapper {

    public static Cart toDomain(CartEntity entity) {
        if (entity == null) return null;
        return Cart.builder()
                .id(entity.getId())
                .items(entity.getItems() != null ?
                        entity.getItems().stream().map(CartMapper::itemToDomain).collect(Collectors.toList()) :
                        new ArrayList<>())
                .savedItems(entity.getSavedItems() != null ?
                        entity.getSavedItems().stream().map(CartMapper::itemToDomain).collect(Collectors.toList()) :
                        new ArrayList<>())
                .totalPrice(entity.getTotalPrice())
                .build();
    }

    private static CartItem itemToDomain(CartItemEntity entity) {
        return CartItem.builder()
                .productId(entity.getProductId())
                .productName(entity.getProductName())
                .sku(entity.getSku())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .build();
    }

    public static CartEntity toEntity(Cart domain) {
        if (domain == null) return null;
        return CartEntity.builder()
                .id(domain.getId())
                .items(domain.getItems() != null ?
                        domain.getItems().stream().map(CartMapper::itemToEntity).collect(Collectors.toList()) :
                        new ArrayList<>())
                .savedItems(domain.getSavedItems() != null ?
                        domain.getSavedItems().stream().map(CartMapper::itemToEntity).collect(Collectors.toList()) :
                        new ArrayList<>())
                .totalPrice(domain.getTotalPrice())
                .build();
    }

    private static CartItemEntity itemToEntity(CartItem domain) {
        return CartItemEntity.builder()
                .productId(domain.getProductId())
                .productName(domain.getProductName())
                .sku(domain.getSku())
                .quantity(domain.getQuantity())
                .unitPrice(domain.getUnitPrice())
                .build();
    }
}
