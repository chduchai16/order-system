package com.example.authservice.producers;

import com.example.commonlib.events.UserRegisteredIntegrationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventProducer {

    private static final String TOPIC = "user-registration-events";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishUserRegistered(UserRegisteredIntegrationEvent event) {
        if (kafkaTemplate == null) {
            log.warn("KafkaTemplate is not available - event not published: keycloakId={}", event.getKeycloakId());
            return;
        }
        try {
            log.info("Publishing UserRegisteredIntegrationEvent: keycloakId={}, username={}",
                    event.getKeycloakId(), event.getUsername());
            kafkaTemplate.send(TOPIC, event.getKeycloakId(), event);
        } catch (Exception e) {
            log.error("Failed to publish event: {}", e.getMessage());
        }
    }
}

