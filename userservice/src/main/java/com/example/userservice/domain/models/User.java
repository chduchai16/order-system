package com.example.userservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String username;
    private Email email;
    private FullName fullName;
    private boolean active;
    private java.util.List<AddressBookEntry> addresses;
    private java.util.List<UserWishlistEntry> wishlist;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public void addAddress(AddressBookEntry entry) {
        if (this.addresses == null) this.addresses = new java.util.ArrayList<>();
        if (entry.isDefault()) {
            this.addresses.forEach(a -> a.setDefault(false));
        }
        this.addresses.add(entry);
    }

    public void addToWishlist(UserWishlistEntry item) {
        if (this.wishlist == null) this.wishlist = new java.util.ArrayList<>();
        this.wishlist.add(item);
    }
}
