package com.example.orderservice.web;

import com.example.orderservice.application.dtos.cart.AddCartItemRequest;
import com.example.orderservice.application.dtos.cart.CheckoutRequest;
import com.example.orderservice.application.dtos.responses.order.OrderResponse;
import com.example.orderservice.application.services.CartService;
import com.example.orderservice.domain.models.cart.Cart;
import com.example.orderservice.domain.models.cart.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(@RequestHeader("X-User-Id") String userId,
            @RequestBody AddCartItemRequest request) {
        CartItem item = CartItem.builder()
                .productId(request.getProductId())
                .productName(request.getProductName())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .build();
        return ResponseEntity.ok(cartService.addItemToCart(userId, item));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateItemQuantity(@RequestHeader("X-User-Id") String userId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItem(@RequestHeader("X-User-Id") String userId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(userId, productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/items/{productId}/save-for-later")
    public ResponseEntity<Cart> saveForLater(@RequestHeader("X-User-Id") String userId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.saveForLater(userId, productId));
    }

    @PostMapping("/items/{productId}/move-to-cart")
    public ResponseEntity<Cart> moveToCart(@RequestHeader("X-User-Id") String userId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.moveToCart(userId, productId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestHeader("X-User-Id") String userIdHeader,
            @RequestBody CheckoutRequest request) {
        OrderResponse orderResponse = cartService.checkout(userIdHeader, request);
        return ResponseEntity.ok(orderResponse);
    }
}
