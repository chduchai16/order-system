package com.example.userservice.application.services;

import com.example.userservice.application.dtos.AddressRequest;
import com.example.userservice.domain.models.User;
import java.util.List;
import java.util.Optional;

public interface IUserService {
    User createLocalUser(String keycloakId, String username, String email,
                        String firstName, String lastName);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByKeycloakId(String keycloakId);
    List<User> getAllUsers();
    
    User addAddress(Long userId, AddressRequest request);
    User addToWishlist(Long userId, Long productId, String productName);
}
