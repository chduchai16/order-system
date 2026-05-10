package com.example.userservice.application.services;

import com.example.userservice.domain.models.Email;
import com.example.userservice.domain.models.FullName;
import com.example.userservice.domain.models.User;
import com.example.userservice.domain.ports.persistence.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import com.example.commonlib.events.UserRegisteredIntegrationEvent;
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public User createLocalUser(String keycloakId, String username, String email,
                                String firstName, String lastName) {
        log.info("Application layer: Creating local user for keycloakId={}", keycloakId);

        return userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .keycloakId(keycloakId)
                            .username(username)
                            .email(new Email(email))
                            .fullName(new FullName(firstName, lastName))
                            .active(true)
                            .build();
                            
                    User savedUser = userRepository.save(newUser);
                    
                    UserRegisteredIntegrationEvent event = new UserRegisteredIntegrationEvent(
                        savedUser.getKeycloakId(),
                        savedUser.getUsername(),
                        savedUser.getEmail().getValue(),
                        savedUser.getFullName().getFirstName(),
                        savedUser.getFullName().getLastName()
                    );
                    kafkaTemplate.send("user.registered", event);
                    
                    return savedUser;
                });
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
