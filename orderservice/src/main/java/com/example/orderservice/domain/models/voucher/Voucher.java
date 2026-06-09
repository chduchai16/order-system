package com.example.orderservice.domain.models.voucher;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
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
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<VoucherCondition> conditions;
    private List<VoucherUsage> usages;

    public void validate(LocalDateTime now) throws Exception {
        if (!isActive) {
            throw new Exception("Voucher is in active");
        }

        if (now.isBefore(startDate) || now.isAfter(endDate)) {
            throw new Exception("Voucher is expired");
        }

        if (usedQuantity >= totalQuantity) {
            throw new Exception("Voucher is out of stock");
        }
    }

    public void validateOrderAmount(BigDecimal orderAmount) throws Exception {
        if (minOrderValue != null && minOrderValue.compareTo(orderAmount) > 0) {
            throw new Exception("Minimum order value is " + minOrderValue);
        }
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) throws Exception {
        switch (discountType) {
            case FREESHIP:
                return BigDecimal.ZERO;
            case FIXED:
                return discountValue;
            case PERCENT:
                BigDecimal discount = orderAmount
                        .multiply(discountValue)
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
                if (maxDiscountValue != null
                        && maxDiscountValue.compareTo(BigDecimal.ZERO) > 0
                        && discount.compareTo(maxDiscountValue) > 0) {
                    return maxDiscountValue;
                }
                return discount;
            default:
                throw new Exception("Unsupport discount type");
        }
    }
}
