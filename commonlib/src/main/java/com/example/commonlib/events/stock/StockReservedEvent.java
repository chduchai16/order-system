package com.example.commonlib.events.stock;

import com.example.commonlib.events.cart.CartItemDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockReservedEvent {
    private Long orderId;
    private Long userId;
    private List<CartItemDto> items;
    private BigDecimal totalPrice;
    private LocalDateTime reservedAt;
}
