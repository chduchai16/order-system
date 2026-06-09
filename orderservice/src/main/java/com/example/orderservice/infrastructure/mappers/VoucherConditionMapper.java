package com.example.orderservice.infrastructure.mappers;

import com.example.orderservice.domain.models.voucher.VoucherCondition;
import com.example.orderservice.infrastructure.persistence.entities.voucher.VoucherConditionEntity;

public class VoucherConditionMapper {

    public static VoucherCondition toDomain(VoucherConditionEntity entity) {
        if (entity == null) {
            return null;
        }

        return VoucherCondition.builder()
                .id(entity.getId())
                .conditionType(entity.getConditionType())
                .value(entity.getValue())
                .build();
    }

    public static VoucherConditionEntity toEntity(VoucherCondition domain) {
        if (domain == null) {
            return null;
        }

        VoucherConditionEntity entity = new VoucherConditionEntity();
        entity.setId(domain.getId());
        entity.setConditionType(domain.getConditionType());
        entity.setValue(domain.getValue());
        return entity;
    }
}
