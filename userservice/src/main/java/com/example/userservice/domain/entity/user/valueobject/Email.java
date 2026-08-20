package com.example.userservice.domain.entity.user.valueobject;

import lombok.Value;

@Value
public class Email {
    String value;

    public Email(String value) {
        if (value == null || !value.contains("@")) {
            throw new RuntimeException("Invalid email format");
        }
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
