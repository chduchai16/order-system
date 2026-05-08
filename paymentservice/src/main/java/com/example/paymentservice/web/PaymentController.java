package com.example.paymentservice.web;

import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.application.dtos.PaymentResponse;
import com.example.paymentservice.application.services.IPaymentService;
import com.example.paymentservice.domain.models.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest request) {
        Payment payment = paymentService.processPayment(request);
        return ResponseEntity.ok(toResponse(payment));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));
    }

    @PostMapping("/refund/{orderId}")
    public ResponseEntity<Void> refundPayment(@PathVariable Long orderId) {
        paymentService.refundPayment(orderId);
        return ResponseEntity.ok().build();
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount() != null ? payment.getAmount().getAmount() : null)
                .status(payment.getStatus())
                .processedAt(payment.getProcessedAt())
                .build();
    }

}
