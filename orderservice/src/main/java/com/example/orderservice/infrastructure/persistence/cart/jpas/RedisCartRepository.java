package com.example.orderservice.infrastructure.persistence.cart.jpas;

import com.example.orderservice.infrastructure.persistence.cart.entities.CartEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisCartRepository extends CrudRepository<CartEntity, String> {
}
