package com.example.orderservice.application.mappers;

import java.util.List;

import com.example.orderservice.application.dtos.requests.voucher.VoucherRequest;
import com.example.orderservice.domain.models.voucher.DiscountType;
import com.example.orderservice.domain.models.voucher.Voucher;

public class VoucherRequestMapper {

    public static Voucher toDomain(VoucherRequest request) {
        if (request == null) {
            return null;
        }

        return Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .discountType(toDiscountType(request.getDiscountType()))
                .discountValue(request.getDiscountValue())
                .maxDiscountValue(request.getMaxDiscountValue())
                .minOrderValue(request.getMinOrderValue())
                .totalQuantity(request.getTotalQuantity())
                .usedQuantity(0)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isActive(request.isActive())
                .conditions(request.getConditions() != null
                        ? request.getConditions().stream().map(VoucherConditionRequestMapper::toDomain).toList()
                        : List.of())
                .usages(List.of())
                .build();
    }

    private static DiscountType toDiscountType(int value) {
        DiscountType[] types = DiscountType.values();
        if (value < 0 || value >= types.length) {
            throw new IllegalArgumentException("Invalid discountType: " + value);
        }
        return types[value];
    }
}
