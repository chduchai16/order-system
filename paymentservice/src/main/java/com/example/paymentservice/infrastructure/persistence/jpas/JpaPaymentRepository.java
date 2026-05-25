package com.example.paymentservice.infrastructure.persistence.jpas;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.paymentservice.infrastructure.persistence.entities.PaymentEntity;

@Repository
public interface JpaPaymentRepository extends JpaRepository<PaymentEntity, Long> {
    Optional<PaymentEntity> findByOrderId(Long orderId);
    Optional<PaymentEntity> findByPaymentCode(String paymentCode);
}
