package com.example.userservice.domain.repositories;

import com.example.userservice.application.dtos.LoginRequest;
import com.example.userservice.application.dtos.TokenResponse;
import com.example.userservice.application.dtos.RegisterRequest;

public interface IdentityService {
    String register(RegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse refresh(String refreshToken);
    void logout(String refreshToken);
}
