package com.example.userservice.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequest {
    private String label;
    private String street;
    private String city;
    private String district;
    private String country;
    private boolean isDefault;
}
