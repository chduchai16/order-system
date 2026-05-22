package com.example.cartservice.application.services;

import com.example.cartservice.domain.models.Cart;
import com.example.cartservice.domain.models.CartItem;
import com.example.cartservice.domain.ports.persistence.CartRepository;
import com.example.commonlib.events.cart.CartCheckedOutEvent;
import com.example.commonlib.events.cart.CartItemDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Cart getCart(String userId) {
        return cartRepository.findById(userId)
                .orElseGet(() -> Cart.builder().id(userId).build());
    }

    public Cart addItemToCart(String userId, CartItem item) {
        Cart cart = getCart(userId);
        cart.addItem(item);
        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String userId, Long productId) {
        Cart cart = getCart(userId);
        cart.removeItem(productId);
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String userId, Long productId, Integer quantity) {
        Cart cart = getCart(userId);
        cart.updateItemQuantity(productId, quantity);
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        cartRepository.deleteById(userId);
    }

    public Cart saveForLater(String userId, Long productId) {
        Cart cart = getCart(userId);
        cart.saveForLater(productId);
        return cartRepository.save(cart);
    }

    public Cart moveToCart(String userId, Long productId) {
        Cart cart = getCart(userId);
        cart.moveToCart(productId);
        return cartRepository.save(cart);
    }

    public void checkout(String userIdHeader, Long userId, String street, String city, String district, String country, String paymentMethod) {
        Cart cart = getCart(userIdHeader);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        CartCheckedOutEvent event = CartCheckedOutEvent.builder()
                .userId(userId)
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

        kafkaTemplate.send("cart.checked-out", userIdHeader, event);
        log.info("Published CartCheckedOutEvent for user {}", userId);

        clearCart(userIdHeader);
    }
}
