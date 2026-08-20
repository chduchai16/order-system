package com.example.orderservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.product.ProductPriceChangedEvent;
import com.example.orderservice.domain.models.cart.Cart;
import com.example.orderservice.infrastructure.persistence.cart.entities.CartEntity;
import com.example.orderservice.infrastructure.persistence.cart.jpas.RedisCartRepository;
import com.example.orderservice.infrastructure.persistence.cart.mappers.CartMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductPriceChangedEventListener {

    private final RedisCartRepository redisCartRepository;

    @KafkaListener(topics = "product.price.changed", groupId = "orderservice-cart-group")
    public void handleProductPriceChanged(ProductPriceChangedEvent event) {
        log.info("Received ProductPriceChangedEvent for productId: {}, newPrice: {}", event.getProductId(), event.getNewPrice());

        try {
            Iterable<CartEntity> allCarts = redisCartRepository.findAll();
            for (CartEntity cartEntity : allCarts) {
                boolean updated = false;
                Cart cart = CartMapper.toDomain(cartEntity);
                
                if (cart.getItems() != null) {
                    for (var item : cart.getItems()) {
                        if (item.getProductId().equals(event.getProductId())) {
                            item.setUnitPrice(event.getNewPrice());
                            updated = true;
                        }
                    }
                }
                
                if (updated) {
                    cart.calculateTotalPrice();
                    redisCartRepository.save(CartMapper.toEntity(cart));
                    log.info("Updated price in cart for userId: {}", cart.getId());
                }
            }
        } catch (Exception e) {
            log.error("Failed to process ProductPriceChangedEvent in orderservice", e);
        }
    }
}
