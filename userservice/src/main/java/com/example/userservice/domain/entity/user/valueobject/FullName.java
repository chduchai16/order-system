package com.example.userservice.domain.entity.user.valueobject;

import lombok.Value;

@Value
public class FullName {
    String firstName;
    String lastName;

    public String getFormattedName() {
        return firstName + " " + lastName;
    }
}
