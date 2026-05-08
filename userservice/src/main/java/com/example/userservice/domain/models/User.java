package com.example.userservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String keycloakId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public boolean isValid() {
        return email != null && email.contains("@");
    }

    public void deactivate() {
        this.active = false;
    }
}
