package com.example.userservice.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserProfileCreatedEvent implements DomainEvent{
    private UUID userId;
    private LocalDateTime occurredAt = LocalDateTime.now();

    public UserProfileCreatedEvent(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() { return userId; }
    @Override
    public LocalDateTime occurredAt() {
        return occurredAt;
    }

}
