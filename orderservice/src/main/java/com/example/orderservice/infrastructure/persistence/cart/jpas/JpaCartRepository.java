package com.example.orderservice.infrastructure.persistence.cart.jpas;

import com.example.orderservice.infrastructure.persistence.cart.entities.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCartRepository extends JpaRepository<CartEntity, String> {
}
