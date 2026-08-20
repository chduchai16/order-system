package com.example.paymentservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.stock.StockReservedEvent;
import com.example.paymentservice.application.dtos.PaymentRequest;
import com.example.paymentservice.application.services.IPaymentService;
import com.example.paymentservice.domain.entity.payment.PaymentMethod;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StockReservedEventListener {

    private final IPaymentService paymentService;

    @KafkaListener(topics = "stock-reserved", groupId = "paymentservice-group")
    public void handleStockReserved(StockReservedEvent event) {
        log.info("Received StockReservedEvent for orderId: {}", event.getOrderId());

        PaymentRequest request = PaymentRequest.builder()
                .orderId(event.getOrderId())
                .userId(event.getUserId())
                .amount(event.getTotalPrice())
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .build();

        paymentService.createPayment(request);
        log.info("Triggered payment processing for orderId: {}", event.getOrderId());
    }
}
