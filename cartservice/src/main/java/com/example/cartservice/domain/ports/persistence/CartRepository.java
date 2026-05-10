package com.example.cartservice.domain.ports.persistence;

import com.example.cartservice.domain.models.Cart;
import java.util.Optional;

public interface CartRepository {
    Optional<Cart> findById(String id);
    Cart save(Cart cart);
    void deleteById(String id);
}
