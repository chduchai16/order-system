package com.example.cartservice.application.dtos;

import lombok.Data;

@Data
public class CheckoutRequest {
    private Long userId; // For order creation mapping
    private String shippingStreet;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingCountry;
    private String paymentMethod;
}
