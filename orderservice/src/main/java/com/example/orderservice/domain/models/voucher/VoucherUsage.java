package com.example.orderservice.domain.models.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUsage {
    private long id ;
    private long userId ;
    private long orderId ;
    private BigDecimal discountAmount ;
    private LocalDateTime usedAt ;
}
