package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.voucher.VoucherUsage;
import com.example.orderservice.infrastructure.persistence.entities.voucher.VoucherUsageEntity;

public class VoucherUsageMapper {

    public static VoucherUsage toDomain(VoucherUsageEntity entity) {
        if (entity == null) {
            return null;
        }

        return VoucherUsage.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .orderId(entity.getOrderId())
                .discountAmount(entity.getDiscountAmount())
                .usedAt(entity.getUsedAt())
                .build();
    }

    public static VoucherUsageEntity toEntity(VoucherUsage domain) {
        if (domain == null) {
            return null;
        }

        VoucherUsageEntity entity = new VoucherUsageEntity();
        entity.setId(domain.getId());
        entity.setUserId(domain.getUserId());
        entity.setOrderId(domain.getOrderId());
        entity.setDiscountAmount(domain.getDiscountAmount());
        entity.setUsedAt(domain.getUsedAt());
        return entity;
    }
}
