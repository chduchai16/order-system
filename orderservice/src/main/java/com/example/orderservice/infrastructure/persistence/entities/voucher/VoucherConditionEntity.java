package com.example.orderservice.infrastructure.persistence.entities.voucher;

import com.example.orderservice.domain.models.voucher.ConditionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "voucher_conditions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherConditionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;
    @Enumerated(EnumType.STRING)
    @Column(name = "condition_type" , nullable = false)
    private ConditionType conditionType ;
    private String value ;
}
