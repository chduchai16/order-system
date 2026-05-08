package com.example.userservice.domain.repositories;

import com.example.userservice.domain.models.User;
import java.util.Optional;
import java.util.List;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByKeycloakId(String keycloakId);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    void deleteById(Long id);
}
