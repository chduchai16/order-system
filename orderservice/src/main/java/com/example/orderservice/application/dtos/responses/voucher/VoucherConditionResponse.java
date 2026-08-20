package com.example.orderservice.application.dtos.responses.voucher;

import com.example.orderservice.domain.entity.voucher.ConditionType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VoucherConditionResponse {
    private long id;
    private ConditionType conditionType;
    private String value;
}
