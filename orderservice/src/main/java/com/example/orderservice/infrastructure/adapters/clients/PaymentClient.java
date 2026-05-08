package com.example.orderservice.infrastructure.adapters.clients;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;

@FeignClient(name = "paymentservice")
public interface PaymentClient {

    @PostMapping("/api/payments")
    PaymentResponse processPayment(@RequestBody PaymentRequest request);

    @PostMapping("/api/payments/refund/{orderId}")
    void refundPayment(@PathVariable Long orderId);

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    class PaymentRequest {
        private Long orderId;
        private Long userId;
        private String keycloakId;
        private BigDecimal amount;
    }

    @Data
    class PaymentResponse {
        private Long id;
        private String status;
    }
}
