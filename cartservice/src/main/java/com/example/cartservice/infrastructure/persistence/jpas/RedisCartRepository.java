package com.example.cartservice.infrastructure.persistence.jpas;

import com.example.cartservice.infrastructure.persistence.entities.CartEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisCartRepository extends CrudRepository<CartEntity, String> {
}
