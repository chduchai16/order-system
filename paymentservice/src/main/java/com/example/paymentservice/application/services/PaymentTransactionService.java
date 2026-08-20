package com.example.paymentservice.application.services;

import com.example.paymentservice.domain.entity.transaction.PaymentTransaction;
import com.example.paymentservice.infrastructure.repository.transaction.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentTransactionService implements IPaymentTransactionService {

    private final PaymentTransactionRepository transactionRepository;

    @Override
    public void logTransaction(Long orderId, String transactionId, String provider, String rawResponse, String status) {
        log.info("Logging transaction for orderId={}, status={}", orderId, status);

        PaymentTransaction entity = PaymentTransaction.builder()
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
        return transactionRepository.findByOrderId(orderId);
    }

    @Override
    public List<PaymentTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
