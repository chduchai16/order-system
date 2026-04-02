package com.example.userservice.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

public class AddressAddedEvent implements  DomainEvent{
    private UUID userId;
    private UUID addressId ;
    private LocalDateTime occurredAt = LocalDateTime.now();

    public AddressAddedEvent(UUID userId, UUID addressId) {
        this.userId = userId;
        this.addressId = addressId;
    }

    public UUID getUserId() { return userId; }
    public UUID getAddressId() { return addressId; }

    @Override
    public LocalDateTime occurredAt() {
        return occurredAt;
    }
}
