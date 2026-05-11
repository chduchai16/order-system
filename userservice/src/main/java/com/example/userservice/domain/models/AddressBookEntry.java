package com.example.userservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressBookEntry {
    private Long id;
    private String label; // Home, Office, etc.
    private Address address;
    private boolean isDefault;
}
