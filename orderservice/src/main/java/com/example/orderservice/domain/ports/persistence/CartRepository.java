package com.example.orderservice.domain.ports.persistence;

import com.example.orderservice.domain.models.cart.Cart;
import java.util.Optional;

public interface CartRepository {
    Optional<Cart> findById(String id);
    Cart save(Cart cart);
    void deleteById(String id);
}
