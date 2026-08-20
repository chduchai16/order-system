package com.example.orderservice.domain.entity.cart;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "carts")
public class Cart {

    @Id
    private String id; // userId

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();

    @Transient
    public List<CartItem> getItems() {
        if (cartItems == null) return new ArrayList<>();
        return cartItems.stream()
                .filter(item -> !Boolean.TRUE.equals(item.getIsSavedForLater()))
                .toList();
    }

    @Transient
    public List<CartItem> getSavedItems() {
        if (cartItems == null) return new ArrayList<>();
        return cartItems.stream()
                .filter(item -> Boolean.TRUE.equals(item.getIsSavedForLater()))
                .toList();
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void saveForLater(Long productId) {
        if (cartItems != null) {
            cartItems.stream()
                    .filter(item -> item.getProductId().equals(productId) && !Boolean.TRUE.equals(item.getIsSavedForLater()))
                    .findFirst()
                    .ifPresent(item -> item.setIsSavedForLater(true));
            calculateTotalPrice();
        }
    }

    public void moveToCart(Long productId) {
        if (cartItems != null) {
            cartItems.stream()
                    .filter(item -> item.getProductId().equals(productId) && Boolean.TRUE.equals(item.getIsSavedForLater()))
                    .findFirst()
                    .ifPresent(item -> item.setIsSavedForLater(false));
            calculateTotalPrice();
        }
    }

    public void calculateTotalPrice() {
        List<CartItem> activeItems = getItems();
        if (activeItems.isEmpty()) {
            this.totalPrice = BigDecimal.ZERO;
            return;
        }
        this.totalPrice = activeItems.stream()
                .map(CartItem::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void addItem(CartItem newItem) {
        if (cartItems == null) cartItems = new ArrayList<>();

        Optional<CartItem> existingItem = cartItems.stream()
                .filter(item -> item.getProductId().equals(newItem.getProductId()) && !Boolean.TRUE.equals(item.getIsSavedForLater()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + newItem.getQuantity());
            item.setUnitPrice(newItem.getUnitPrice());
            item.setProductName(newItem.getProductName());
            item.setSku(newItem.getSku());
        } else {
            newItem.setCart(this);
            newItem.setIsSavedForLater(false);
            cartItems.add(newItem);
        }
        calculateTotalPrice();
    }

    public void removeItem(Long productId) {
        if (cartItems != null) {
            cartItems.removeIf(item -> item.getProductId().equals(productId));
            calculateTotalPrice();
        }
    }

    public void updateItemQuantity(Long productId, Integer newQuantity) {
        if (cartItems != null) {
            cartItems.stream()
                    .filter(item -> item.getProductId().equals(productId) && !Boolean.TRUE.equals(item.getIsSavedForLater()))
                    .findFirst()
                    .ifPresent(item -> item.setQuantity(newQuantity));
            calculateTotalPrice();
        }
    }

    public void clear() {
        if (this.cartItems != null) {
            this.cartItems.removeIf(item -> !Boolean.TRUE.equals(item.getIsSavedForLater()));
        }
        this.totalPrice = BigDecimal.ZERO;
    }
}
