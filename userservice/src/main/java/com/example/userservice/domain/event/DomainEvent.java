package com.example.userservice.domain.event;

import java.time.LocalDateTime;

public interface DomainEvent {
    LocalDateTime occurredAt();
}
