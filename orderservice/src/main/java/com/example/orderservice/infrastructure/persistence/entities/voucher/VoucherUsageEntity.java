package com.example.orderservice.infrastructure.persistence.entities.voucher;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "voucher_usages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherUsageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Column(nullable = false , name = "user_id")
    private long userId ;

    @Column(nullable = false , name = "order_id")
    private long orderId ;

    @Column(nullable = false , name = "discount_amount")
    private BigDecimal discountAmount ;

    @Column(nullable = false , name = "used_at")
    private LocalDateTime usedAt ;
}
