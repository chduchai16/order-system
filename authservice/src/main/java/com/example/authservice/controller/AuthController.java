package com.example.authservice.controller;


import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.RegisterRequest;
import com.example.authservice.dto.TokenResponse;
import com.example.commonlib.events.UserRegisteredIntegrationEvent;
import com.example.authservice.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakService keycloakService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenResponse token = keycloakService.login(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        String keycloakId = keycloakService.register(request);

        if (keycloakId != null) {
            UserRegisteredIntegrationEvent event = new UserRegisteredIntegrationEvent(
                    keycloakId,
                    request.getUsername(),
                    request.getEmail(),
                    request.getFirstName(),
                    request.getLastName()
            );

            try {
                if (kafkaTemplate != null) {
                    kafkaTemplate.send("user-registration-events", keycloakId, event);
                }
            } catch (Exception e) {
                // Log nhưng không fail - event sẽ bị mất nếu Kafka down
                System.err.println("Warning: Failed to publish user registration event: " + e.getMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }

    // truyền refresh token
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody Map<String, String> body) {
        TokenResponse token = keycloakService.refresh(body.get("refresh_token"));
        return ResponseEntity.ok(token);
    }

    // truyền refresh token
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        keycloakService.logout(body.get("refresh_token"));
        return ResponseEntity.noContent().build();
    }
}
