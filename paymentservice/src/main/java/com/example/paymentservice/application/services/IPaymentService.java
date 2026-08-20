package com.example.paymentservice.application.services;

import java.util.Map;
import java.util.Optional;

import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.application.dtos.SePayWebhookRequest;
import com.example.paymentservice.domain.entity.payment.Payment;

public interface IPaymentService {
    Payment createPayment(PaymentRequest request);
    void refundPayment(Long orderId);
    Optional<Payment> getPaymentByOrderId(Long orderId);
    Payment processPayment(SePayWebhookRequest request, Map<String, String> headers);
}
