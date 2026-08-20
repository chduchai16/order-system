package com.example.paymentservice.application.services;

import com.example.paymentservice.domain.entity.transaction.PaymentTransaction;
import java.util.List;

public interface IPaymentTransactionService {
    void logTransaction(Long orderId, String transactionId, String provider, String rawResponse, String status);
    List<PaymentTransaction> getTransactionsByOrderId(Long orderId);
    List<PaymentTransaction> getAllTransactions();
}
