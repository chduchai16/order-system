package com.example.userservice.application.services;

import com.example.userservice.application.dtos.LoginRequest;
import com.example.userservice.application.dtos.RefreshTokenRequest;
import com.example.userservice.application.dtos.RegisterRequest;
import com.example.userservice.application.dtos.TokenResponse;
import com.example.userservice.infrastructure.persistence.entities.RoleEntity;
import com.example.userservice.infrastructure.persistence.entities.UserEntity;
import com.example.userservice.infrastructure.persistence.jpas.JpaUserRepository;
import com.example.userservice.infrastructure.persistence.jpas.RoleRepository;
import com.example.userservice.infrastructure.security.JwtService;
import com.example.userservice.infrastructure.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final String DEFAULT_ROLE = "CUSTOMER";

    private final JpaUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public TokenResponse register(RegisterRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(user -> {
            throw new IllegalArgumentException("Username already exists");
        });
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new IllegalArgumentException("Email already exists");
        });

        RoleEntity role = roleRepository.findByName(DEFAULT_ROLE)
                .orElseGet(() -> {
                    RoleEntity entity = new RoleEntity();
                    entity.setName(DEFAULT_ROLE);
                    return roleRepository.save(entity);
                });

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(role);
        user.setActive(true);

        return issueTokens(userRepository.save(user));
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.isActive()
                || user.getPasswordHash() == null
                || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return issueTokens(user);
    }

    @Transactional
    public TokenResponse refresh(RefreshTokenRequest request) {
        UserEntity user = refreshTokenService.consumeRefreshToken(request.getRefreshToken());
        return issueTokens(user);
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenService.revokeRefreshToken(request.getRefreshToken());
    }

    private TokenResponse issueTokens(UserEntity user) {
        return TokenResponse.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(refreshTokenService.createRefreshToken(user))
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenTtlSeconds())
                .build();
    }
}
