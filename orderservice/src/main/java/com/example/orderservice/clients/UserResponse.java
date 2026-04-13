package com.example.orderservice.clients;

import lombok.Data;

@Data
public class UserResponse {
    private Long id ;
    private String keycloakId;
    private String username ;
    private boolean active ;
}

