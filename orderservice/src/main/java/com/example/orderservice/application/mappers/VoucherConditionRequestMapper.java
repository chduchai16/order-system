package com.example.orderservice.application.mappers;

import com.example.orderservice.application.dtos.requests.voucher.VoucherConditionRequest;
import com.example.orderservice.domain.models.voucher.VoucherCondition;

public class VoucherConditionRequestMapper {

    public static VoucherCondition toDomain(VoucherConditionRequest request) {
        if (request == null) {
            return null;
        }

        return VoucherCondition.builder()
                .conditionType(request.getConditionType())
                .value(request.getValue())
                .build();
    }
}
