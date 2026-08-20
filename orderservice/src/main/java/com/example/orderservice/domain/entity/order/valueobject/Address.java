package com.example.orderservice.domain.entity.order.valueobject;

import lombok.Value;

@Value
public class Address {
    String street;
    String city;
    String district;
    String country;

    public String getFullAddress() {
        return String.format("%s, %s, %s, %s", street, district, city, country);
    }
}
