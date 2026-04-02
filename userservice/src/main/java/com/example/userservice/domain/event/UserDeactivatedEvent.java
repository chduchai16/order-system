package com.example.userservice.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDeactivatedEvent implements DomainEvent {
    private UUID userId ;
    private LocalDateTime occurredAt = LocalDateTime.now();

    public UserDeactivatedEvent(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() { return userId; }
    @Override
    public LocalDateTime occurredAt() {
        return occurredAt ;
    }
}
