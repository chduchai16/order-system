package com.example.userservice.domain.model;

import com.example.userservice.domain.event.DomainEvent;
import com.example.userservice.domain.event.UserProfileCreatedEvent;
import com.example.userservice.domain.event.AddressAddedEvent;
import com.example.userservice.domain.event.DefaultAddressSetEvent;
import com.example.userservice.domain.event.UserDeactivatedEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class UserProfile {

    private String keycloakId;
    private UUID userId;
    private FullName fullName;
    private PhoneNumber phoneNumber;
    private UserStatus status;
    private List<ShippingAddress> addresses = new ArrayList<>();

    private List<DomainEvent> domainEvents = new ArrayList<>();

    // CREATE
    public static UserProfile create(UUID id, String keycloakId, FullName name, PhoneNumber phone) {
        UserProfile user = new UserProfile();
        user.userId = id;
        user.keycloakId = keycloakId;
        user.fullName = name;
        user.phoneNumber = phone;
        user.status = UserStatus.ACTIVE;

        user.addEvent(new UserProfileCreatedEvent(id));
        return user;
    }

    // ADD ADDRESS
    public void addAddress(ShippingAddress address) {
        if (status == UserStatus.DEACTIVATED) {
            throw new IllegalStateException("User deactivated");
        }

        addresses.add(address);

        addEvent(new AddressAddedEvent(userId, address.getId()));
    }

    // SET DEFAULT
    public void setDefaultAddress(UUID addressId) {
        boolean found = false;

        for (ShippingAddress addr : addresses) {
            if (addr.getId().equals(addressId)) {
                addr.setDefault();
                found = true;
            } else {
                addr.unsetDefault();
            }
        }

        if (!found) throw new RuntimeException("Address not found");

        addEvent(new DefaultAddressSetEvent(userId, addressId));
    }

    // DEACTIVATE
    public void deactivate() {
        if (status == UserStatus.DEACTIVATED) {
            throw new RuntimeException("Already deactivated");
        }

        status = UserStatus.DEACTIVATED;
        addEvent(new UserDeactivatedEvent(userId));
    }

    // EVENTS
    private void addEvent(DomainEvent event) {
        domainEvents.add(event);
    }

    public List<DomainEvent> getEvents() {
        return domainEvents;
    }

    public void clearEvents() {
        domainEvents.clear();
    }

    public UUID getId() {
        return userId;
    }

    public String getKeycloakId() {
        return keycloakId;
    }

    public FullName getFullName() {
        return fullName;
    }

    public PhoneNumber getPhoneNumber() {
        return phoneNumber;
    }

    public UserStatus getStatus() {
        return status;
    }

    public List<ShippingAddress> getAddresses() {
        return new ArrayList<>(addresses);
    }
}
