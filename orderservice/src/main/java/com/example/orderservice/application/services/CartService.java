package com.example.orderservice.application.services;

import com.example.orderservice.application.dtos.cart.CheckoutRequest;
import com.example.orderservice.application.dtos.requests.order.OrderItemRequest;
import com.example.orderservice.application.dtos.requests.order.OrderRequest;
import com.example.orderservice.application.dtos.responses.order.OrderResponse;
import com.example.orderservice.domain.entity.cart.Cart;
import com.example.orderservice.domain.entity.cart.CartItem;
import com.example.orderservice.infrastructure.repository.cart.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final IOrderService orderService;

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

    @Transactional
    public OrderResponse checkout(String userIdHeader, CheckoutRequest request) {
        Cart cart = getCart(userIdHeader);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Long userId = request.getUserId();
        if (userId == null) {
            try {
                userId = Long.parseLong(userIdHeader);
            } catch (NumberFormatException e) {
                log.warn("Could not parse userId from userIdHeader: {}", userIdHeader);
            }
        }

        OrderRequest orderRequest = OrderRequest.builder()
                .userId(userId)
                .street(request.getShippingStreet())
                .city(request.getShippingCity())
                .district(request.getShippingDistrict())
                .country(request.getShippingCountry())
                .shippingCarrier(request.getShippingCarrier())
                .discountCode(request.getDiscountCode())
                .items(cart.getItems().stream()
                        .map(item -> OrderItemRequest.builder()
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        OrderResponse orderResponse = orderService.createOrder(orderRequest);
        log.info("Directly created order {} for user {} via cart checkout", orderResponse.getId(), userId);

        clearCart(userIdHeader);
        return orderResponse;
    }
}
