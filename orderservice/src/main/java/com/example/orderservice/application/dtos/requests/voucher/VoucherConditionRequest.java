package com.example.orderservice.application.dtos.requests.voucher;

import com.example.orderservice.domain.models.voucher.ConditionType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VoucherConditionRequest {
    private ConditionType conditionType;
    private String value;
}
