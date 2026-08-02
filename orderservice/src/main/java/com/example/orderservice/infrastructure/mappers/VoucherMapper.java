package com.example.orderservice.infrastructure.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.orderservice.domain.models.voucher.Voucher;
import com.example.orderservice.infrastructure.persistence.entities.voucher.VoucherEntity;
import com.example.orderservice.infrastructure.persistence.entities.voucher.VoucherUsageEntity;

public class VoucherMapper {

    public static Voucher toDomain(VoucherEntity entity) {
        if (entity == null) {
            return null;
        }

        return Voucher.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .name(entity.getName())
                .description(entity.getDescription())
                .discountType(entity.getDiscountType())
                .discountValue(entity.getDiscountValue())
                .maxDiscountValue(entity.getMaxDiscountValue())
                .minOrderValue(entity.getMinOrderValue())
                .totalQuantity(entity.getTotalQuantity())
                .usedQuantity(entity.getUsedQuantity())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .isActive(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .conditions(entity.getConditions() != null
                        ? entity.getConditions().stream().map(VoucherConditionMapper::toDomain).collect(Collectors.toList())
                        : new ArrayList<>())
                .usages(entity.getUsages() != null
                        ? entity.getUsages().stream().map(VoucherUsageMapper::toDomain).collect(Collectors.toList())
                        : new ArrayList<>())
                .build();
    }

    public static VoucherEntity toEntity(Voucher domain) {
        if (domain == null) {
            return null;
        }

        VoucherEntity entity = new VoucherEntity();
        entity.setId(domain.getId());
        entity.setCode(domain.getCode());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setDiscountType(domain.getDiscountType());
        entity.setDiscountValue(domain.getDiscountValue());
        entity.setMaxDiscountValue(domain.getMaxDiscountValue());
        entity.setMinOrderValue(domain.getMinOrderValue());
        entity.setTotalQuantity(domain.getTotalQuantity());
        entity.setUsedQuantity(domain.getUsedQuantity());
        entity.setStartDate(domain.getStartDate());
        entity.setEndDate(domain.getEndDate());
        entity.setActive(domain.isActive());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        entity.setConditions(domain.getConditions() != null
                ? domain.getConditions().stream().map(VoucherConditionMapper::toEntity).collect(Collectors.toList())
                : new ArrayList<>());
        List<VoucherUsageEntity> usages = domain.getUsages() != null
                ? domain.getUsages().stream().map(VoucherUsageMapper::toEntity).collect(Collectors.toList())
                : new ArrayList<>();
        usages.forEach(usage -> usage.setVoucher(entity));
        entity.setUsages(usages);
        return entity;
    }
}
