package com.example.cartservice.infrastructure.persistence.adapters;

import com.example.cartservice.domain.models.Cart;
import com.example.cartservice.domain.ports.persistence.CartRepository;
import com.example.cartservice.infrastructure.mappers.CartMapper;
import com.example.cartservice.infrastructure.persistence.entities.CartEntity;
import com.example.cartservice.infrastructure.persistence.jpas.RedisCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CartRepositoryAdapter implements CartRepository {

    private final RedisCartRepository redisRepository;

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
