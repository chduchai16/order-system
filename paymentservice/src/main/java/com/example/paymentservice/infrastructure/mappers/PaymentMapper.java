package com.example.paymentservice.infrastructure.mappers;

import com.example.paymentservice.domain.models.Money;
import com.example.paymentservice.domain.models.Payment;
import com.example.paymentservice.infrastructure.persistence.entities.PaymentEntity;

public class PaymentMapper {
    
    public static Payment toDomain(PaymentEntity entity) {
        if (entity == null) return null;
        return Payment.builder()
                .id(entity.getId())
                .paymentCode(entity.getPaymentCode())
                .orderId(entity.getOrderId())
                .userId(entity.getUserId())
                .amount(new Money(entity.getAmount()))
                .paymentMethod(entity.getPaymentMethod())
                .status(entity.getStatus())
                .processedAt(entity.getProcessedAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static PaymentEntity toEntity(Payment domain) {
        if (domain == null) return null;
        PaymentEntity entity = new PaymentEntity();
        entity.setId(domain.getId());
        entity.setPaymentCode(domain.getPaymentCode());
        entity.setOrderId(domain.getOrderId());
        entity.setUserId(domain.getUserId());
        if (domain.getAmount() != null) {
            entity.setAmount(domain.getAmount().getAmount());
        }
        entity.setPaymentMethod(domain.getPaymentMethod());
        entity.setStatus(domain.getStatus());
        entity.setProcessedAt(domain.getProcessedAt());
        return entity;
    }
}
