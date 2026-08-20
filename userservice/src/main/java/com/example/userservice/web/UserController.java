package com.example.userservice.web;

import com.example.userservice.application.services.IUserService;
import com.example.userservice.domain.entity.user.User;
import com.example.userservice.application.dtos.AddressRequest;
import com.example.userservice.application.dtos.AddressResponse;
import com.example.userservice.application.dtos.UserResponse;
import com.example.userservice.application.dtos.WishlistResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final IUserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(toResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{id}/addresses")
    public ResponseEntity<UserResponse> addAddress(@PathVariable Long id, @RequestBody AddressRequest request) {
        User user = userService.addAddress(id, request);
        return ResponseEntity.ok(toResponse(user));
    }

    @PostMapping("/{id}/wishlist")
    public ResponseEntity<UserResponse> addToWishlist(@PathVariable Long id, @RequestParam Long productId, @RequestParam String productName) {
        User user = userService.addToWishlist(id, productId, productName);
        return ResponseEntity.ok(toResponse(user));
    }

    @GetMapping("/{id}/wishlist")
    public ResponseEntity<List<WishlistResponse>> getWishlist(@PathVariable Long id) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        List<WishlistResponse> wishlist = user.getWishlist() != null ? user.getWishlist().stream()
                .map(w -> WishlistResponse.builder()
                        .id(w.getId())
                        .productId(w.getProductId())
                        .productName(w.getProductName())
                        .addedAt(w.getAddedAt())
                        .build())
                .collect(Collectors.toList()) : Collections.emptyList();
        return ResponseEntity.ok(wishlist);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .active(user.isActive())
                .addresses(user.getAddresses() != null ? user.getAddresses().stream()
                        .map(a -> AddressResponse.builder()
                                .id(a.getId())
                                .label(a.getLabel())
                                .street(a.getStreet())
                                .city(a.getCity())
                                .district(a.getDistrict())
                                .country(a.getCountry())
                                .isDefault(a.isDefault())
                                .build())
                        .collect(Collectors.toList()) : null)
                .wishlist(user.getWishlist() != null ? user.getWishlist().stream()
                        .map(w -> WishlistResponse.builder()
                                .id(w.getId())
                                .productId(w.getProductId())
                                .productName(w.getProductName())
                                .addedAt(w.getAddedAt())
                                .build())
                        .collect(Collectors.toList()) : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
