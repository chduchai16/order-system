package com.example.orderservice.infrastructure.adapters;

import com.example.orderservice.domain.models.Order;
import com.example.orderservice.domain.ports.external.PaymentService;

import com.example.orderservice.infrastructure.adapters.clients.PaymentClient;
import com.example.orderservice.infrastructure.adapters.clients.dtos.PaymentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceAdapter implements PaymentService {

    private final PaymentClient paymentClient;

    @Override
    public void processPayment(Order order) {
        log.info("Processing payment for order {}", order.getId());
        PaymentRequest request = PaymentRequest.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .amount(order.getTotalPrice())
                .paymentMethod("BANK_TRANSFER")
                .build();

        
        paymentClient.processPayment(request);
    }

    @Override
    public void refundPayment(Long orderId) {
        log.info("Refunding payment for order {}", orderId);
        paymentClient.refundPayment(orderId);
    }
}
