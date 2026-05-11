package com.example.cartservice.web;

import com.example.cartservice.application.dtos.AddCartItemRequest;
import com.example.cartservice.application.dtos.CheckoutRequest;
import com.example.cartservice.application.services.CartService;
import com.example.cartservice.domain.models.Cart;
import com.example.cartservice.domain.models.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestHeader("X-User-Id") String keycloakId) {
        return ResponseEntity.ok(cartService.getCart(keycloakId));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(@RequestHeader("X-User-Id") String keycloakId,
            @RequestBody AddCartItemRequest request) {
        CartItem item = CartItem.builder()
                .productId(request.getProductId())
                .productName(request.getProductName())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .build();
        return ResponseEntity.ok(cartService.addItemToCart(keycloakId, item));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateItemQuantity(@RequestHeader("X-User-Id") String keycloakId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateItemQuantity(keycloakId, productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItem(@RequestHeader("X-User-Id") String keycloakId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(keycloakId, productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") String keycloakId) {
        cartService.clearCart(keycloakId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/items/{productId}/save-for-later")
    public ResponseEntity<Cart> saveForLater(@RequestHeader("X-User-Id") String keycloakId,
            @PathVariable Long productId) {
        // lưu lại mua sau
        return ResponseEntity.ok(cartService.saveForLater(keycloakId, productId));
    }

    @PostMapping("/items/{productId}/move-to-cart")
    public ResponseEntity<Cart> moveToCart(@RequestHeader("X-User-Id") String keycloakId,
            @PathVariable Long productId) {
        // chuyển vào giỏ hàng
        return ResponseEntity.ok(cartService.moveToCart(keycloakId, productId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout(@RequestHeader("X-User-Id") String keycloakId,
            @RequestBody CheckoutRequest request) {
        cartService.checkout(
                keycloakId,
                request.getUserId(),
                request.getShippingStreet(),
                request.getShippingCity(),
                request.getShippingDistrict(),
                request.getShippingCountry(),
                request.getPaymentMethod());
        return ResponseEntity.ok().build();
    }
}
