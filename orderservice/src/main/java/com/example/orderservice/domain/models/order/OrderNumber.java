package com.example.orderservice.domain.models.order;

import lombok.Value;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Value
public class OrderNumber {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMM");

    String value;

    public OrderNumber(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("OrderNumber cannot be blank");
        }
        this.value = value;
    }

    public static OrderNumber generate() {
        return generate(1);
    }

    public static OrderNumber generate(long seq) {
        String yearMonth = LocalDateTime.now().format(FORMATTER);
        return new OrderNumber(String.format("ORD-%s-%05d", yearMonth, seq));
    }

    public static String currentPrefix() {
        return String.format("ORD-%s-", LocalDateTime.now().format(FORMATTER));
    }

    @Override
    public String toString() {
        return value;
    }
}
