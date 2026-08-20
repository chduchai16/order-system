package com.example.orderservice.application.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.example.orderservice.application.dtos.responses.voucher.VoucherResponse;
import com.example.orderservice.domain.entity.voucher.Voucher;

public class VoucherResponseMapper {

    public static VoucherResponse toResponse(Voucher voucher) {
        if (voucher == null) {
            return null;
        }

        VoucherResponse response = new VoucherResponse();
        response.setId(voucher.getId());
        response.setCode(voucher.getCode());
        response.setName(voucher.getName());
        response.setDescription(voucher.getDescription());
        response.setDiscountType(voucher.getDiscountType());
        response.setDiscountValue(voucher.getDiscountValue());
        response.setMaxDiscountValue(voucher.getMaxDiscountValue());
        response.setMinOrderValue(voucher.getMinOrderValue());
        response.setTotalQuantity(voucher.getTotalQuantity());
        response.setUsedQuantity(voucher.getUsedQuantity());
        response.setStartDate(voucher.getStartDate());
        response.setEndDate(voucher.getEndDate());
        response.setActive(voucher.isActive());
        response.setCreatedAt(voucher.getCreatedAt());
        response.setUpdatedAt(voucher.getUpdatedAt());
        response.setConditions(voucher.getConditions() != null
                ? voucher.getConditions().stream().map(VoucherConditionResponseMapper::toResponse).collect(Collectors.toList())
                : List.of());
        return response;
    }
}
