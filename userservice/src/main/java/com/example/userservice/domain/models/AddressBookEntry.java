package com.example.userservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressBookEntry {
    private Long id;
    private String label; // Home, Office, etc.
    private Address address;
    private boolean isDefault;
}
