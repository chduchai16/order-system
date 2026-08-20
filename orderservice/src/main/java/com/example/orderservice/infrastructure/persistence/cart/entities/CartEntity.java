package com.example.orderservice.infrastructure.persistence.cart.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "Cart", timeToLive = 86400) // TTL 24 hours
public class CartEntity {
    
    @Id
    private String id; // userId
    
    private List<CartItemEntity> items;
    private List<CartItemEntity> savedItems;
    private BigDecimal totalPrice;
}
