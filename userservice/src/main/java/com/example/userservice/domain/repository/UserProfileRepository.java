package com.example.userservice.domain.repository;

import com.example.userservice.domain.model.UserProfile;

import java.util.Optional;
import java.util.UUID;

public interface UserProfileRepository {
    UserProfile save(UserProfile userProfile);
    Optional<UserProfile> findById(UUID id);
    Optional<UserProfile> findByKeycloakId(String keycloakId);
}
