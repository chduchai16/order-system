package com.example.paymentservice.infrastructure.persistence.jpas;

import com.example.paymentservice.infrastructure.persistence.entities.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, Long> {
    List<PaymentTransactionEntity> findByOrderId(Long orderId);
}
