package com.example.commonlib.events.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartCheckedOutEvent {
    private Long userId;
    private List<CartItemDto> items;
    private String shippingStreet;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingCountry;
    private String paymentMethod;
}
