package com.example.userservice.services;

import org.springframework.stereotype.Service;

import com.example.userservice.dtos.RegisterRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final KeycloakService keycloakService;
    private final UserService userService;

    public void register(RegisterRequest request) {
        try {
            String keycloakId = keycloakService.register(request);
            log.info("User registered in Keycloak: keycloakId={}, username={}", keycloakId, request.getUsername());

            if (keycloakId != null) {
                userService.createLocalUser(
                        keycloakId,
                        request.getUsername(),
                        request.getEmail(),
                        request.getFirstName(),
                        request.getLastName()
                );
                log.info("Local user created successfully: keycloakId={}", keycloakId);
            }
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.getUsername(), e);
            throw e;
        }
    }
}

