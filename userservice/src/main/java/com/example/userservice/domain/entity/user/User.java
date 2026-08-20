package com.example.userservice.domain.entity.user;

import com.example.userservice.domain.entity.role.Role;
import com.example.userservice.domain.entity.user.valueobject.Email;
import com.example.userservice.domain.entity.user.valueobject.FullName;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(nullable = false)
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AddressBook> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserWishlist> wishlist = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Value Objects helper
    @Transient
    public Email getEmailObject() {
        return email != null ? new Email(email) : null;
    }

    @Transient
    public FullName getFullNameObject() {
        return (firstName != null || lastName != null) ? new FullName(firstName, lastName) : null;
    }

    // Business Methods
    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public void addAddress(AddressBook entry) {
        if (this.addresses == null) this.addresses = new ArrayList<>();
        if (entry.isDefault()) {
            this.addresses.forEach(a -> a.setDefault(false));
        }
        entry.setUser(this);
        this.addresses.add(entry);
    }

    public void addToWishlist(UserWishlist item) {
        if (this.wishlist == null) this.wishlist = new ArrayList<>();
        item.setUser(this);
        this.wishlist.add(item);
    }
}
