package com.example.orderservice.infrastructure.repository.cart;

import com.example.orderservice.domain.entity.cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
}
