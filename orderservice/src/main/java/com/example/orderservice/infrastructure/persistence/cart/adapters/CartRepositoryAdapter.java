package com.example.orderservice.infrastructure.persistence.cart.adapters;

import com.example.orderservice.domain.models.cart.Cart;
import com.example.orderservice.domain.ports.persistence.CartRepository;
import com.example.orderservice.infrastructure.persistence.cart.entities.CartEntity;
import com.example.orderservice.infrastructure.persistence.cart.jpas.JpaCartRepository;
import com.example.orderservice.infrastructure.persistence.cart.mappers.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CartRepositoryAdapter implements CartRepository {

    private final JpaCartRepository jpaCartRepository;

    @Override
    public Optional<Cart> findById(String id) {
        return jpaCartRepository.findById(id).map(CartMapper::toDomain);
    }

    @Override
    @Transactional
    public Cart save(Cart cart) {
        // Tìm entity hiện tại hoặc tạo mới
        CartEntity existingEntity = jpaCartRepository.findById(cart.getId()).orElse(null);

        CartEntity newEntity = CartMapper.toEntity(cart);

        if (existingEntity != null) {
            // Xóa hết cart items cũ và gán mới (orphanRemoval sẽ xóa bản ghi cũ)
            existingEntity.getCartItems().clear();
            existingEntity.getCartItems().addAll(newEntity.getCartItems());
            // Gán lại cart reference cho các items mới
            existingEntity.getCartItems().forEach(item -> item.setCart(existingEntity));
            existingEntity.setTotalPrice(newEntity.getTotalPrice());
            CartEntity savedEntity = jpaCartRepository.save(existingEntity);
            return CartMapper.toDomain(savedEntity);
        } else {
            CartEntity savedEntity = jpaCartRepository.save(newEntity);
            return CartMapper.toDomain(savedEntity);
        }
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        jpaCartRepository.deleteById(id);
    }
}
