package com.example.commonlib.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreatedEvent {
    private Long orderId;
    private Long userId ;
    private String keycloakId ;
    private Long productId ;
    private Integer quantity ;
    private BigDecimal totalPrice ;
    private LocalDateTime createdAt ;
}
