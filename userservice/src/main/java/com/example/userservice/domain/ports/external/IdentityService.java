package com.example.userservice.domain.ports.external;

import com.example.userservice.application.dtos.LoginRequest;
import com.example.userservice.application.dtos.RegisterRequest;
import com.example.userservice.application.dtos.TokenResponse;

public interface IdentityService {
    TokenResponse login(LoginRequest request);
    TokenResponse refresh(String refreshToken);
    String register(RegisterRequest request);
    void logout(String refreshToken);
}
