package com.example.orderservice.infrastructure.persistence.cart.adapters;

import com.example.orderservice.domain.models.cart.Cart;
import com.example.orderservice.domain.ports.persistence.CartRepository;
import com.example.orderservice.infrastructure.persistence.cart.mappers.CartMapper;
import com.example.orderservice.infrastructure.persistence.cart.entities.CartEntity;
import com.example.orderservice.infrastructure.persistence.cart.jpas.RedisCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class CartRepositoryAdapter implements CartRepository {

    private final RedisCartRepository redisRepository;

    public CartRepositoryAdapter(RedisCartRepository redisRepository) {
        this.redisRepository = redisRepository;
    }

    @Override
    public Optional<Cart> findById(String id) {
        return redisRepository.findById(id).map(CartMapper::toDomain);
    }

    @Override
    public Cart save(Cart cart) {
        CartEntity entity = CartMapper.toEntity(cart);
        CartEntity savedEntity = redisRepository.save(entity);
        return CartMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(String id) {
        redisRepository.deleteById(id);
    }
}
