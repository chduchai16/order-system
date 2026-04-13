package com.example.authservice.service;

import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.RegisterRequest;
import com.example.authservice.dto.TokenResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class KeycloakService {

    private static final Logger logger = LoggerFactory.getLogger(KeycloakService.class);
    private final WebClient webClient;

    @Value("${keycloak.server-url}")
    private String serverUrl ;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    public KeycloakService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // login
    public TokenResponse login (LoginRequest request) {
        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("grant_type","password");
            form.add("client_id",clientId);
            form.add("client_secret", clientSecret);
            form.add("username",request.getUsername());
            form.add("password",request.getPassword());

            logger.info("Attempting login for user: {}", request.getUsername());

            return webClient.post()
                    .uri(serverUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(form))
                    .retrieve()
                    .bodyToMono(TokenResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            logger.error("Keycloak login error: HTTP {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Login failed", e);
            throw new RuntimeException("Login failed: " + e.getMessage(), e);
        }
    }

    // refresh token
    public TokenResponse refresh(String refreshToken) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type",    "refresh_token");
        form.add("client_id",     clientId);
        form.add("client_secret", clientSecret);
        form.add("refresh_token", refreshToken);

        return webClient.post()
                .uri(serverUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(form))
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .block();
    }

    // register
    public String register(RegisterRequest request) {
        try {
            // Bước 1: lấy admin token
            String adminToken = getAdminToken();
            logger.info("Admin token obtained successfully");

            // Bước 2: tạo user trong Keycloak
            Map<String, Object> userPayload = Map.of(
                    "username",      request.getUsername(),
                    "email",         request.getEmail(),
                    "firstName",     request.getFirstName(),
                    "lastName",      request.getLastName(),
                    "enabled",       true,
                    "emailVerified", true,
                    "credentials",   List.of(Map.of(
                            "type",      "password",
                            "value",     request.getPassword(),
                            "temporary", false
                    ))
            );

            logger.info("Creating user in Keycloak: {}", request.getUsername());

            var response = webClient.post()
                    .uri(serverUrl + "/admin/realms/" + realm + "/users")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(userPayload)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            // Lấy Keycloak ID từ Location header
            if (response != null && response.getHeaders().getLocation() != null) {
                String location = response.getHeaders().getLocation().toString();
                String keycloakId = location.substring(location.lastIndexOf('/') + 1);
                logger.info("User created successfully with ID: {}", keycloakId);
                return keycloakId;
            }
            logger.warn("No Location header in response");
            return null;
        } catch (WebClientResponseException e) {
            logger.error("Keycloak registration error: HTTP {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Registration failed", e);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    // logout
    public void logout(String refreshToken) {
        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("client_id",     clientId);
            form.add("client_secret", clientSecret);
            form.add("refresh_token", refreshToken);

            logger.info("Attempting logout");

            webClient.post()
                    .uri(serverUrl + "/realms/" + realm + "/protocol/openid-connect/logout")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(form))
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            logger.info("Logout successful");
        } catch (Exception e) {
            logger.error("Logout failed", e);
            throw new RuntimeException("Logout failed: " + e.getMessage(), e);
        }
    }

    private String getAdminToken() {
        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("grant_type",    "client_credentials");
            form.add("client_id",     clientId);
            form.add("client_secret", clientSecret);

            logger.info("Attempting to get admin token from Keycloak");

            Map response = webClient.post()
                    .uri(serverUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(form))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                logger.error("No response from Keycloak token endpoint");
                throw new RuntimeException("Failed to get admin token - null response");
            }

            String token = (String) response.get("access_token");
            if (token == null) {
                logger.error("No access_token in response. Response keys: {}", response.keySet());
                throw new RuntimeException("Failed to get admin token - no access_token in response");
            }

            logger.info("Admin token obtained successfully");
            return token;
        } catch (WebClientResponseException e) {
            logger.error("Keycloak admin token error: HTTP {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Failed to get admin token", e);
            throw new RuntimeException("Failed to get admin token: " + e.getMessage(), e);
        }
    }

}
