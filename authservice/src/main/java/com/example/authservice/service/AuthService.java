package com.example.authservice.service;

import com.example.authservice.dto.RegisterRequest;
import com.example.commonlib.events.UserRegisteredIntegrationEvent;
import com.example.authservice.producers.UserEventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final KeycloakService keycloakService;
    private final UserEventProducer userEventProducer;

    public void register(RegisterRequest request) {
        try {
            String keycloakId = keycloakService.register(request);
            log.info("User registered in Keycloak: keycloakId={}, username={}", keycloakId, request.getUsername());

            if (keycloakId != null) {
                UserRegisteredIntegrationEvent event = new UserRegisteredIntegrationEvent(
                        keycloakId,
                        request.getUsername(),
                        request.getEmail(),
                        request.getFirstName(),
                        request.getLastName()
                );

                userEventProducer.publishUserRegistered(event);
                log.info("User registration event published: keycloakId={}", keycloakId);
            }
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.getUsername(), e);
            throw e;
        }
    }
}

