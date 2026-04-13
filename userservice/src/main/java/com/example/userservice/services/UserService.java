package com.example.userservice.services;

import com.example.userservice.entities.User;
import com.example.userservice.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    /**
     * Tạo user mới từ event registration
     */
    public User createUserFromEvent(String keycloakId, String username, String email,
                                     String firstName, String lastName) {
        log.info("Creating user from registration event: keycloakId={}, username={}, email={}",
                keycloakId, username, email);

        // Kiểm tra xem user đã tồn tại hay chưa
        if (userRepository.findByKeycloakId(keycloakId).isPresent()) {
            log.warn("User with keycloakId {} already exists", keycloakId);
            return userRepository.findByKeycloakId(keycloakId).get();
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

    /**
     * Lấy user theo keycloakId
     */
    public Optional<User> getUserByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId);
    }

    /**
     * Lấy user theo username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Lấy user theo email
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Lấy tất cả users
     */
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

