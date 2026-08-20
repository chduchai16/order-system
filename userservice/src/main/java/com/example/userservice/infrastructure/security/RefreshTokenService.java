package com.example.userservice.infrastructure.security;

import com.example.userservice.domain.entity.token.RefreshToken;
import com.example.userservice.domain.entity.user.User;
import com.example.userservice.infrastructure.repository.token.RefreshTokenRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-token-ttl-days}")
    private long refreshTokenTtlDays;

    @Transactional
    public String createRefreshToken(User user) {
        String rawToken = UUID.randomUUID().toString();

        RefreshToken entity = RefreshToken.builder()
                .tokenHash(hash(rawToken))
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenTtlDays))
                .revoked(false)
                .build();
        refreshTokenRepository.save(entity);

        return rawToken;
    }

    @Transactional
    public User consumeRefreshToken(String rawToken) {
        RefreshToken entity = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (entity.isRevoked() || entity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        entity.setRevoked(true);
        return entity.getUser();
    }

    @Transactional
    public void revokeRefreshToken(String rawToken) {
        refreshTokenRepository.findByTokenHash(hash(rawToken))
                .ifPresent(token -> token.setRevoked(true));
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
