package com.example.orderservice.application.dtos.responses.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.orderservice.domain.models.voucher.DiscountType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VoucherResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountValue;
    private BigDecimal minOrderValue;
    private long totalQuantity;
    private long usedQuantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<VoucherConditionResponse> conditions;
}
