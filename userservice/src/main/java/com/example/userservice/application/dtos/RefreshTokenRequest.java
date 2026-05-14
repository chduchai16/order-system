package com.example.userservice.application.dtos;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}
