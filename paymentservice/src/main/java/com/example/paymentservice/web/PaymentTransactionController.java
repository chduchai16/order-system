package com.example.paymentservice.web;

import com.example.paymentservice.application.services.IPaymentTransactionService;
import com.example.paymentservice.domain.entity.transaction.PaymentTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments/transactions")
@RequiredArgsConstructor
public class PaymentTransactionController {

    private final IPaymentTransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<PaymentTransaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentTransaction>> getTransactionsByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(transactionService.getTransactionsByOrderId(orderId));
    }
}
