package com.example.orderservice.infrastructure.adapters.clients;

import com.example.orderservice.infrastructure.adapters.clients.dtos.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "userservice", url = "${USER_SERVICE_URL:http://localhost:8081}")
public interface UserClient {
    @GetMapping("/api/users/{userId}")
    UserResponse getUserById(@PathVariable("userId") Long userId);
}
