package com.example.orderservice.application.dtos.requests.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VoucherRequest {
    private String code;
    private String name;
    private String description;
    private int discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountValue;
    private BigDecimal minOrderValue;
    private long totalQuantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;
    private List<VoucherConditionRequest> conditions;
}
