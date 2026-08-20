package com.example.orderservice.domain.entity.voucher;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vouchers")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "discount_type")
    private DiscountType discountType;

    @Column(nullable = false, name = "discount_value")
    private BigDecimal discountValue;

    @Column(name = "max_discount_value")
    private BigDecimal maxDiscountValue;

    @Column(name = "min_order_value")
    private BigDecimal minOrderValue;

    @Column(name = "total_quantity")
    private long totalQuantity;

    @Column(name = "used_quantity")
    private long usedQuantity;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "voucher_id")
    @Builder.Default
    private List<VoucherCondition> conditions = new ArrayList<>();

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VoucherUsage> usages = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Business validation logic
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

    // Discount calculation logic
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
                throw new Exception("Unsupported discount type");
        }
    }

    // Redemption logic
    public void redeem(Long userId, Long orderId, BigDecimal discountAmount) throws Exception {
        if (usedQuantity >= totalQuantity) {
            throw new Exception("Voucher is out of stock");
        }

        if (usages == null) {
            usages = new ArrayList<>();
        }

        usedQuantity++;
        VoucherUsage usage = VoucherUsage.builder()
                .userId(userId)
                .orderId(orderId)
                .discountAmount(discountAmount)
                .usedAt(LocalDateTime.now())
                .voucher(this)
                .build();
        usages.add(usage);
        updatedAt = LocalDateTime.now();
    }
}
