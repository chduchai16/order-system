package com.example.orderservice.application.mappers;

import com.example.orderservice.application.dtos.responses.voucher.VoucherConditionResponse;
import com.example.orderservice.domain.models.voucher.VoucherCondition;

public class VoucherConditionResponseMapper {

    public static VoucherConditionResponse toResponse(VoucherCondition condition) {
        if (condition == null) {
            return null;
        }

        VoucherConditionResponse response = new VoucherConditionResponse();
        response.setId(condition.getId());
        response.setConditionType(condition.getConditionType());
        response.setValue(condition.getValue());
        return response;
    }
}
