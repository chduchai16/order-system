package com.example.paymentservice.domain.ports.persistence;

import java.util.List;
import java.util.Optional;

import com.example.paymentservice.domain.models.Payment;

public interface PaymentRepository {
    Payment save(Payment payment);
    Optional<Payment> findById(Long id);
    Optional<Payment> findByOrderId(Long orderId);
    List<Payment> findAll();
    Optional<Payment> findByCode(String code) ;
}
