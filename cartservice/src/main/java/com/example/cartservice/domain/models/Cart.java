package com.example.cartservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Cart {
    private String id; // userId
    private List<CartItem> items;
    private List<CartItem> savedItems;
    private BigDecimal totalPrice;

    public void saveForLater(Long productId) {
        // di chuyển item từ giỏ hàng sang danh sách lưu lại
        if (items != null) {
            items.stream()
                    .filter(item -> item.getProductId().equals(productId))
                    .findFirst()
                    .ifPresent(item -> {
                        if (savedItems == null) savedItems = new java.util.ArrayList<>();
                        savedItems.add(item);
                        items.remove(item);
                    });
            calculateTotalPrice();
        }
    }

    public void moveToCart(Long productId) {
        // di chuyển item từ danh sách lưu lại vào giỏ hàng
        if (savedItems != null) {
            savedItems.stream()
                    .filter(item -> item.getProductId().equals(productId))
                    .findFirst()
                    .ifPresent(item -> {
                        if (items == null) items = new java.util.ArrayList<>();
                        items.add(item);
                        savedItems.remove(item);
                    });
            calculateTotalPrice();
        }
    }

    public void calculateTotalPrice() {
        if (items == null) {
            this.totalPrice = BigDecimal.ZERO;
            return;
        }
        this.totalPrice = items.stream()
                .map(CartItem::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void addItem(CartItem newItem) {
        if (items == null) items = new ArrayList<>();
        
        Optional<CartItem> existingItem = items.stream()
                .filter(item -> item.getProductId().equals(newItem.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + newItem.getQuantity());
            // Update price in case it changed
            existingItem.get().setUnitPrice(newItem.getUnitPrice());
            existingItem.get().setProductName(newItem.getProductName());
            existingItem.get().setSku(newItem.getSku());
        } else {
            items.add(newItem);
        }
        calculateTotalPrice();
    }

    public void removeItem(Long productId) {
        if (items != null) {
            items.removeIf(item -> item.getProductId().equals(productId));
            calculateTotalPrice();
        }
    }

    public void updateItemQuantity(Long productId, Integer newQuantity) {
        if (items != null) {
            items.stream()
                    .filter(item -> item.getProductId().equals(productId))
                    .findFirst()
                    .ifPresent(item -> item.setQuantity(newQuantity));
            calculateTotalPrice();
        }
    }
    
    public void clear() {
        this.items = new ArrayList<>();
        this.totalPrice = BigDecimal.ZERO;
    }
}
