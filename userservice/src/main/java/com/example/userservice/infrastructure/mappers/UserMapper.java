package com.example.userservice.infrastructure.mappers;

import com.example.userservice.domain.models.*;
import com.example.userservice.infrastructure.persistence.entities.*;
import java.util.stream.Collectors;

public class UserMapper {
    
    public static User toDomain(UserEntity entity) {
        if (entity == null) return null;
        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(new Email(entity.getEmail()))
                .fullName(new FullName(entity.getFirstName(), entity.getLastName()))
                .active(entity.isActive())
                .addresses(entity.getAddresses() != null ? 
                    entity.getAddresses().stream().map(UserMapper::addressToDomain).collect(Collectors.toList()) : null)
                .wishlist(entity.getWishlist() != null ? 
                    entity.getWishlist().stream().map(UserMapper::wishlistToDomain).collect(Collectors.toList()) : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private static AddressBookEntry addressToDomain(AddressBookEntity entity) {
        if (entity == null) return null;
        return AddressBookEntry.builder()
                .id(entity.getId())
                .label(entity.getLabel())
                .isDefault(entity.isDefault())
                .address(Address.builder()
                        .street(entity.getStreet())
                        .city(entity.getCity())
                        .district(entity.getDistrict())
                        .country(entity.getCountry())
                        .build())
                .build();
    }

    private static UserWishlistEntry wishlistToDomain(UserWishlistEntity entity) {
        if (entity == null) return null;
        return UserWishlistEntry.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .productName(entity.getProductName())
                .addedAt(entity.getAddedAt())
                .build();
    }

    public static UserEntity toEntity(User domain) {
        if (domain == null) return null;
        UserEntity entity = new UserEntity();
        entity.setId(domain.getId());
        entity.setUsername(domain.getUsername());
        if (domain.getEmail() != null) {
            entity.setEmail(domain.getEmail().getValue());
        }
        if (domain.getFullName() != null) {
            entity.setFirstName(domain.getFullName().getFirstName());
            entity.setLastName(domain.getFullName().getLastName());
        }
        entity.setActive(domain.isActive());
        
        if (domain.getAddresses() != null) {
            entity.setAddresses(domain.getAddresses().stream().map(a -> {
                AddressBookEntity ae = addressToEntity(a);
                ae.setUser(entity);
                return ae;
            }).collect(Collectors.toList()));
        }
        
        if (domain.getWishlist() != null) {
            entity.setWishlist(domain.getWishlist().stream().map(w -> {
                UserWishlistEntity we = wishlistToEntity(w);
                we.setUser(entity);
                return we;
            }).collect(Collectors.toList()));
        }
        
        return entity;
    }

    private static AddressBookEntity addressToEntity(AddressBookEntry domain) {
        if (domain == null) return null;
        AddressBookEntity entity = new AddressBookEntity();
        entity.setId(domain.getId());
        entity.setLabel(domain.getLabel());
        entity.setDefault(domain.isDefault());
        if (domain.getAddress() != null) {
            entity.setStreet(domain.getAddress().getStreet());
            entity.setCity(domain.getAddress().getCity());
            entity.setDistrict(domain.getAddress().getDistrict());
            entity.setCountry(domain.getAddress().getCountry());
        }
        return entity;
    }

    private static UserWishlistEntity wishlistToEntity(UserWishlistEntry domain) {
        if (domain == null) return null;
        UserWishlistEntity entity = new UserWishlistEntity();
        entity.setId(domain.getId());
        entity.setProductId(domain.getProductId());
        entity.setProductName(domain.getProductName());
        entity.setAddedAt(domain.getAddedAt());
        return entity;
    }
}
