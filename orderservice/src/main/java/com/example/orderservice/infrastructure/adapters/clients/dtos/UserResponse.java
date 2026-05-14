package com.example.orderservice.infrastructure.adapters.clients.dtos;

import lombok.Data;

@Data
public class UserResponse {
    private Long id ;
    private String username ;
    private boolean active ;
}
