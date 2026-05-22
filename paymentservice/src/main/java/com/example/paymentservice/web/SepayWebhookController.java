package com.example.paymentservice.web;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.paymentservice.application.dtos.SePayWebhookRequest;
import com.example.paymentservice.application.services.IPaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments/webhook")
@RequiredArgsConstructor
public class SepayWebhookController {

    private final IPaymentService paymentService;

    @PostMapping("/sepay")
    public ResponseEntity<Void> webhook(
            @RequestBody SePayWebhookRequest request,
            @RequestHeader Map<String, String> headers) {

        paymentService.processPayment(request, headers);

        return ResponseEntity.ok().build();
    }
}
