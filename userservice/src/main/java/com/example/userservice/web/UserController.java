package com.example.userservice.web;

import com.example.userservice.application.services.IUserService;
import com.example.userservice.domain.models.User;
import com.example.userservice.application.dtos.UserResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .keycloakId(user.getKeycloakId())
                .username(user.getUsername())
                .email(user.getEmail() != null ? user.getEmail().getValue() : null)
                .firstName(user.getFullName() != null ? user.getFullName().getFirstName() : null)
                .lastName(user.getFullName() != null ? user.getFullName().getLastName() : null)
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
