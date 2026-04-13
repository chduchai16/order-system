package com.example.userservice.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.userservice.entities.User;
import com.example.userservice.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;


    // tạo mới user bắt từ sự kiện đăng ký từ Keycloak
    public User createUserFromEvent(String keycloakId, String username, String email,
                                    String firstName, String lastName) {
        log.info("Creating user from registration event: keycloakId={}, username={}, email={}",
                keycloakId, username, email);

        Optional<User> existing = userRepository.findByKeycloakId(keycloakId);
        if (existing.isPresent()) {
            log.warn("User with keycloakId {} already exists", keycloakId);
            return existing.get();
        }

        User user = new User();
        user.setKeycloakId(keycloakId);
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);

        User savedUser = userRepository.save(user);
        log.info("User created successfully: id={}, username={}", savedUser.getId(), savedUser.getUsername());

        return savedUser;
    }

    public Optional<User> getUserByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

}

