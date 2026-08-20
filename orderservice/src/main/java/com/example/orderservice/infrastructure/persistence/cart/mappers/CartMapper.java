package com.example.orderservice.infrastructure.persistence.cart.mappers;

import com.example.orderservice.domain.models.cart.Cart;
import com.example.orderservice.domain.models.cart.CartItem;
import com.example.orderservice.infrastructure.persistence.cart.entities.CartEntity;
import com.example.orderservice.infrastructure.persistence.cart.entities.CartItemEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CartMapper {

    public static Cart toDomain(CartEntity entity) {
        if (entity == null) return null;

        List<CartItem> items = new ArrayList<>();
        List<CartItem> savedItems = new ArrayList<>();

        if (entity.getCartItems() != null) {
            for (CartItemEntity itemEntity : entity.getCartItems()) {
                CartItem item = itemToDomain(itemEntity);
                if (Boolean.TRUE.equals(itemEntity.getIsSavedForLater())) {
                    savedItems.add(item);
                } else {
                    items.add(item);
                }
            }
        }

        return Cart.builder()
                .id(entity.getId())
                .items(items)
                .savedItems(savedItems)
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

        CartEntity cartEntity = CartEntity.builder()
                .id(domain.getId())
                .userId(domain.getId() != null ? Long.parseLong(domain.getId()) : null)
                .totalPrice(domain.getTotalPrice())
                .cartItems(new ArrayList<>())
                .build();

        // Map active items (isSavedForLater = false)
        if (domain.getItems() != null) {
            for (CartItem item : domain.getItems()) {
                CartItemEntity itemEntity = itemToEntity(item, cartEntity, false);
                cartEntity.getCartItems().add(itemEntity);
            }
        }

        // Map saved items (isSavedForLater = true)
        if (domain.getSavedItems() != null) {
            for (CartItem item : domain.getSavedItems()) {
                CartItemEntity itemEntity = itemToEntity(item, cartEntity, true);
                cartEntity.getCartItems().add(itemEntity);
            }
        }

        return cartEntity;
    }

    private static CartItemEntity itemToEntity(CartItem domain, CartEntity cart, boolean savedForLater) {
        return CartItemEntity.builder()
                .cart(cart)
                .productId(domain.getProductId())
                .productName(domain.getProductName())
                .sku(domain.getSku())
                .quantity(domain.getQuantity())
                .unitPrice(domain.getUnitPrice())
                .isSavedForLater(savedForLater)
                .build();
    }
}
