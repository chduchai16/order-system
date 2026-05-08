package com.example.paymentservice.infrastructure.mappers;

import com.example.paymentservice.domain.models.Payment;
import com.example.paymentservice.infrastructure.persistence.entities.PaymentEntity;

public class PaymentMapper {
    
    public static Payment toDomain(PaymentEntity entity) {
        if (entity == null) return null;
        return Payment.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .userId(entity.getUserId())
                .keycloakId(entity.getKeycloakId())
                .amount(entity.getAmount())
                .status(entity.getStatus())
                .processedAt(entity.getProcessedAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static PaymentEntity toEntity(Payment domain) {
        if (domain == null) return null;
        PaymentEntity entity = new PaymentEntity();
        entity.setId(domain.getId());
        entity.setOrderId(domain.getOrderId());
        entity.setUserId(domain.getUserId());
        entity.setKeycloakId(domain.getKeycloakId());
        entity.setAmount(domain.getAmount());
        entity.setStatus(domain.getStatus());
        entity.setProcessedAt(domain.getProcessedAt());
        return entity;
    }
}
