package com.example.cartservice.application.services;

import com.example.cartservice.domain.models.Cart;
import com.example.cartservice.domain.models.CartItem;
import com.example.cartservice.domain.ports.persistence.CartRepository;
import com.example.commonlib.events.CartCheckedOutEvent;
import com.example.commonlib.events.CartItemDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Cart getCart(String keycloakId) {
        return cartRepository.findById(keycloakId)
                .orElseGet(() -> Cart.builder().id(keycloakId).build());
    }

    public Cart addItemToCart(String keycloakId, CartItem item) {
        Cart cart = getCart(keycloakId);
        cart.addItem(item);
        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String keycloakId, Long productId) {
        Cart cart = getCart(keycloakId);
        cart.removeItem(productId);
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String keycloakId, Long productId, Integer quantity) {
        Cart cart = getCart(keycloakId);
        cart.updateItemQuantity(productId, quantity);
        return cartRepository.save(cart);
    }

    public void clearCart(String keycloakId) {
        cartRepository.deleteById(keycloakId);
    }

    public void checkout(String keycloakId, Long userId, String street, String city, String district, String country, String paymentMethod) {
        Cart cart = getCart(keycloakId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        CartCheckedOutEvent event = CartCheckedOutEvent.builder()
                .userId(userId)
                .keycloakId(keycloakId)
                .items(cart.getItems().stream()
                        .map(item -> CartItemDto.builder()
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .sku(item.getSku())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .build())
                        .collect(Collectors.toList()))
                .shippingStreet(street)
                .shippingCity(city)
                .shippingDistrict(district)
                .shippingCountry(country)
                .paymentMethod(paymentMethod)
                .build();

        kafkaTemplate.send("cart.checked-out", keycloakId, event);
        log.info("Published CartCheckedOutEvent for user {}", keycloakId);

        // Clear cart after successful checkout
        clearCart(keycloakId);
    }
}
