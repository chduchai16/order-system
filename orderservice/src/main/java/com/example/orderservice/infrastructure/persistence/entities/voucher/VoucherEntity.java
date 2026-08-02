package com.example.orderservice.infrastructure.persistence.entities.voucher;

import com.example.orderservice.domain.models.voucher.DiscountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code ;
    private String name ;
    private String description ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false , name = "discount_type")
    private DiscountType discountType;

    @Column(nullable = false , name = "discount_value")
    private BigDecimal discountValue ;

    @Column(name = "max_discount_value")
    private BigDecimal maxDiscountValue ;

    @Column(name = "min_order_value")
    private BigDecimal minOrderValue ;

    @Column(name = "total_quantity")
    private long totalQuantity ;

    @Column(name = "used_quantity")
    private long usedQuantity ;

    @Column(name = "start_date" , nullable = false)
    private LocalDateTime startDate ;

    @Column(name = "end_date" ,  nullable = false)
    private LocalDateTime endDate ;

    @Column(name = "is_active")
    private boolean isActive ;

    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;

    @OneToMany( cascade = CascadeType.ALL , orphanRemoval = true )
    @JoinColumn(name = "voucher_id")
    private List<VoucherConditionEntity> conditions ;

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL ,  orphanRemoval = true )
    private List<VoucherUsageEntity>  usages ;

}
