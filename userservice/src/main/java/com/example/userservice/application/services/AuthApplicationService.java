package com.example.userservice.application.services;

import com.example.userservice.domain.ports.external.IdentityService;

import com.example.userservice.application.dtos.LoginRequest;
import com.example.userservice.application.dtos.RegisterRequest;
import com.example.userservice.application.dtos.TokenResponse;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthApplicationService {

    private final IdentityService identityService;
    private final UserApplicationService userApplicationService;

    public void register(RegisterRequest request) {
        try {
            String keycloakId = identityService.register(request);
            log.info("Identity created in Keycloak: keycloakId={}, username={}", keycloakId, request.getUsername());

            if (keycloakId != null) {
                userApplicationService.createLocalUser(
                        keycloakId,
                        request.getUsername(),
                        request.getEmail(),
                        request.getFirstName(),
                        request.getLastName()
                );
                log.info("Local user record synced successfully: keycloakId={}", keycloakId);
            }
        } catch (Exception e) {
            log.error("Registration use case failed for user: {}", request.getUsername(), e);
            throw e;
        }
    }

    public TokenResponse login(LoginRequest request) {
        return identityService.login(request);
    }

    public TokenResponse refresh(String refreshToken) {
        return identityService.refresh(refreshToken);
    }

    public void logout(String refreshToken) {
        identityService.logout(refreshToken);
    }
}



