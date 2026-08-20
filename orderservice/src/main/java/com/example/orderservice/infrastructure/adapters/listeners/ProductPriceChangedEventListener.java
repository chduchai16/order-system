package com.example.orderservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.product.ProductPriceChangedEvent;
import com.example.orderservice.infrastructure.repository.cart.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductPriceChangedEventListener {

    private final CartItemRepository cartItemRepository;

    @KafkaListener(topics = "product.price.changed", groupId = "orderservice-cart-group")
    @Transactional
    public void handleProductPriceChanged(ProductPriceChangedEvent event) {
        log.info("Received ProductPriceChangedEvent for productId: {}, newPrice: {}", event.getProductId(), event.getNewPrice());

        try {
            int updatedCount = cartItemRepository.updateUnitPriceByProductId(event.getProductId(), event.getNewPrice());
            log.info("Đã cập nhật giá cho {} cart item(s) có productId: {}", updatedCount, event.getProductId());
        } catch (Exception e) {
            log.error("Lỗi khi xử lý ProductPriceChangedEvent trong orderservice", e);
        }
    }
}
