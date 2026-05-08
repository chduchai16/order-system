package com.example.paymentservice.domain.repositories;

import com.example.paymentservice.domain.models.Payment;
import java.util.Optional;
import java.util.List;

public interface PaymentRepository {
    Payment save(Payment payment);
    Optional<Payment> findById(Long id);
    Optional<Payment> findByOrderId(Long orderId);
    List<Payment> findAll();
}
