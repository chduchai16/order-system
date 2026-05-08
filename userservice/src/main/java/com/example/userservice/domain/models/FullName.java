package com.example.userservice.domain.models;

import lombok.Value;

@Value
public class FullName {
    String firstName;
    String lastName;

    public String getFormattedName() {
        return firstName + " " + lastName;
    }
}
