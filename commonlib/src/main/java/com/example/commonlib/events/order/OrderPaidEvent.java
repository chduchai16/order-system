package com.example.commonlib.events.order;

import com.example.commonlib.events.cart.CartItemDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPaidEvent {
    private Long orderId ; 
    private String orderNumber ;
    private Long userId;
    private List<CartItemDto> items;
}
