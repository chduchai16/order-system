package com.example.paymentservice.infrastructure.repository.transaction;

import com.example.paymentservice.domain.entity.transaction.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByOrderId(Long orderId);
}
