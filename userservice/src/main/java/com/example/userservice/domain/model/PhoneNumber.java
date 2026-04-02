package com.example.userservice.domain.model;

public class PhoneNumber {
    private final String value;

    public PhoneNumber(String value) {
        if (!value.matches("0[0-9]{9}")) {
            throw new IllegalArgumentException("Invalid VN phone");
        }
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
