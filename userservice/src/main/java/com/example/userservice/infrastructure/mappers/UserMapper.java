package com.example.userservice.infrastructure.mappers;

import com.example.userservice.domain.models.User;
import com.example.userservice.infrastructure.persistence.entities.UserEntity;


public class UserMapper {
    
    public static User toDomain(UserEntity entity) {
        if (entity == null) return null;
        return User.builder()
                .id(entity.getId())
                .keycloakId(entity.getKeycloakId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static UserEntity toEntity(User domain) {
        if (domain == null) return null;
        UserEntity entity = new UserEntity();
        entity.setId(domain.getId());
        entity.setKeycloakId(domain.getKeycloakId());
        entity.setUsername(domain.getUsername());
        entity.setEmail(domain.getEmail());
        entity.setFirstName(domain.getFirstName());
        entity.setLastName(domain.getLastName());
        entity.setActive(domain.isActive());
        return entity;
    }
}

