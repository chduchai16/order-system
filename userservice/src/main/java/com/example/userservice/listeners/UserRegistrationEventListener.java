package com.example.userservice.listeners;

import com.example.commonlib.events.UserRegisteredIntegrationEvent;
import com.example.userservice.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationEventListener {

    private final UserService userService;

    @KafkaListener(
        topics = "user-registration-events",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleUserRegistrationEvent(UserRegisteredIntegrationEvent event) {
        try {
            log.info("Received user registration event: keycloakId={}, username={}, email={}",
                    event.getKeycloakId(), event.getUsername(), event.getEmail());

            // Tạo user từ event
            userService.createUserFromEvent(
                event.getKeycloakId(),
                event.getUsername(),
                event.getEmail(),
                event.getFirstName(),
                event.getLastName()
            );

            log.info("User registration event processed successfully: keycloakId={}", event.getKeycloakId());
        } catch (Exception e) {
            log.error("Error processing user registration event: {}", event, e);
            // Re-throw exception để Kafka biết rằng message chưa được xử lý thành công
            throw new RuntimeException("Failed to process user registration event", e);
        }
    }
}

