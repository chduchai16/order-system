package com.example.userservice.web;

import com.example.userservice.application.services.IUserService;
import com.example.userservice.domain.models.User;
import com.example.userservice.application.dtos.UserResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    @GetMapping("/keycloak/{keycloakId}")
    public ResponseEntity<UserResponse> getUserByKeycloakId(@PathVariable String keycloakId) {
        return userService.getUserByKeycloakId(keycloakId)
                .map(user -> ResponseEntity.ok(toResponse(user)))
                .orElseThrow(() -> new RuntimeException("User not found: " + keycloakId));
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
    public ResponseEntity<UserResponse> addAddress(@PathVariable Long id, @RequestBody com.example.userservice.application.dtos.AddressRequest request) {
        // thêm địa chỉ mới
        User user = userService.addAddress(id, request);
        return ResponseEntity.ok(toResponse(user));
    }

    @PostMapping("/{id}/wishlist")
    public ResponseEntity<UserResponse> addToWishlist(@PathVariable Long id, @RequestParam Long productId, @RequestParam String productName) {
        // thêm vào wishlist
        User user = userService.addToWishlist(id, productId, productName);
        return ResponseEntity.ok(toResponse(user));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .keycloakId(user.getKeycloakId())
                .username(user.getUsername())
                .email(user.getEmail() != null ? user.getEmail().getValue() : null)
                .firstName(user.getFullName() != null ? user.getFullName().getFirstName() : null)
                .lastName(user.getFullName() != null ? user.getFullName().getLastName() : null)
                .active(user.isActive())
                .addresses(user.getAddresses() != null ? user.getAddresses().stream()
                        .map(a -> com.example.userservice.application.dtos.AddressResponse.builder()
                                .id(a.getId())
                                .label(a.getLabel())
                                .street(a.getAddress() != null ? a.getAddress().getStreet() : null)
                                .city(a.getAddress() != null ? a.getAddress().getCity() : null)
                                .district(a.getAddress() != null ? a.getAddress().getDistrict() : null)
                                .country(a.getAddress() != null ? a.getAddress().getCountry() : null)
                                .isDefault(a.isDefault())
                                .build())
                        .collect(Collectors.toList()) : null)
                .wishlist(user.getWishlist() != null ? user.getWishlist().stream()
                        .map(w -> com.example.userservice.application.dtos.WishlistResponse.builder()
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
