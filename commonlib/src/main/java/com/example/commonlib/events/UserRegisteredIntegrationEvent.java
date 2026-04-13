package com.example.commonlib.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisteredIntegrationEvent {
    private String keycloakId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}

