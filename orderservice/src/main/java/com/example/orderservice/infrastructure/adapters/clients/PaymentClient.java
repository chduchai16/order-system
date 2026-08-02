package com.example.orderservice.infrastructure.adapters.clients;

import com.example.commonlib.response.ApiResponse;
import com.example.orderservice.infrastructure.adapters.clients.dtos.PaymentRequest;
import com.example.orderservice.infrastructure.adapters.clients.dtos.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "paymentservice", url = "${PAYMENT_SERVICE_URL:http://localhost:8084}")
public interface PaymentClient {

    @PostMapping("/api/payments")
    ApiResponse<PaymentResponse> processPayment(@RequestBody PaymentRequest request);

    @PostMapping("/api/payments/refund/{orderId}")
    void refundPayment(@PathVariable Long orderId);
}
