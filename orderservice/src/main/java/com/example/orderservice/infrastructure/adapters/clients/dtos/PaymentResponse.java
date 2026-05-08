package com.example.orderservice.infrastructure.adapters.clients.dtos;

import lombok.Data;

@Data
public class PaymentResponse {
    private Long id;
    private String status;
}
