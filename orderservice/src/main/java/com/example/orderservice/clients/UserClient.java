package com.example.orderservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "userservice")
public interface UserClient {
    @GetMapping("/api/users/keycloak/{keycloakId}")
    UserResponse getUserByKeycloakId(@PathVariable("keycloakId") String keycloakId);
}
