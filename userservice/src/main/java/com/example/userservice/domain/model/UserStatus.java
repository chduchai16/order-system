package com.example.userservice.domain.model;

public enum UserStatus {
    ACTIVE,
    DEACTIVATED;

    public boolean isActive () {
        return this == ACTIVE;
    }

}
