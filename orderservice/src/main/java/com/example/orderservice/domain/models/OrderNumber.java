package com.example.orderservice.domain.models;

import lombok.Value;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

@Value
public class OrderNumber {

    private static final AtomicLong sequence = new AtomicLong(0);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMM");

    String value;

    public OrderNumber(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("OrderNumber cannot be blank");
        }
        this.value = value;
    }

    public static OrderNumber generate() {
        String yearMonth = LocalDateTime.now().format(FORMATTER);
        long seq = sequence.incrementAndGet() % 100000;
        return new OrderNumber(String.format("ORD-%s-%05d", yearMonth, seq));
    }

    @Override
    public String toString() {
        return value;
    }
}
