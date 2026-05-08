package com.example.userservice.domain.models;

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
}
