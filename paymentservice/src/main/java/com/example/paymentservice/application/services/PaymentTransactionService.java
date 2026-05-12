package com.example.paymentservice.application.services;

import com.example.paymentservice.domain.models.PaymentTransaction;
import com.example.paymentservice.infrastructure.persistence.entities.PaymentTransactionEntity;
import com.example.paymentservice.infrastructure.persistence.jpas.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentTransactionService implements IPaymentTransactionService {

    private final PaymentTransactionRepository transactionRepository;

    @Override
    public void logTransaction(Long orderId, String transactionId, String provider, String rawResponse, String status) {
        log.info("Logging transaction for orderId={}, status={}", orderId, status);
        
        PaymentTransactionEntity entity = PaymentTransactionEntity.builder()
                .orderId(orderId)
                .transactionId(transactionId)
                .gatewayProvider(provider)
                .rawResponse(rawResponse)
                .status(status)
                .build();
        
        transactionRepository.save(entity);
    }

    @Override
    public List<PaymentTransaction> getTransactionsByOrderId(Long orderId) {
        return transactionRepository.findByOrderId(orderId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentTransaction> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private PaymentTransaction toDomain(PaymentTransactionEntity entity) {
        return PaymentTransaction.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .transactionId(entity.getTransactionId())
                .gatewayProvider(entity.getGatewayProvider())
                .rawResponse(entity.getRawResponse())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
