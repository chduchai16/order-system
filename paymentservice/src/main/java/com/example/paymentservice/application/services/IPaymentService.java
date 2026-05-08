package com.example.paymentservice.application.services;

import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.domain.models.Payment;
import java.util.Optional;

public interface IPaymentService {
    Payment processPayment(PaymentRequest request);
    void refundPayment(Long orderId);
    Optional<Payment> getPaymentByOrderId(Long orderId);
}
