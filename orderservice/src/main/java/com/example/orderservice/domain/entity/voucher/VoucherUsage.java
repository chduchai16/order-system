package com.example.orderservice.domain.entity.voucher;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "voucher_usages")
public class VoucherUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, name = "user_id")
    private long userId;

    @Column(nullable = false, name = "order_id")
    private long orderId;

    @Column(nullable = false, name = "discount_amount")
    private BigDecimal discountAmount;

    @Column(nullable = false, name = "used_at")
    private LocalDateTime usedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Voucher voucher;
}
