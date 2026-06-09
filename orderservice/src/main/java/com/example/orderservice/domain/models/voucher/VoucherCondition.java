package com.example.orderservice.domain.models.voucher;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherCondition {
    private long id ;
    private ConditionType conditionType ;
    private String value ;
}
