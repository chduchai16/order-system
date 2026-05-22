package com.example.commonlib.events.order;

import java.util.List;
import com.example.commonlib.events.cart.CartItemDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCancelledEvent {
    private Long orderId;
    private String orderNumber;
    private String reason;
    private List<CartItemDto> items;
}
