package com.example.orderservice.infrastructure.adapters.listeners;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.example.commonlib.events.payment.RefundIssuedEvent;
import com.example.orderservice.application.services.IOrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefundIssuedEventListener {
    
    private final IOrderService orderService ; 

    @KafkaListener(topics = "payment.completed" , groupId="order-group")
    public void handleRefundIssuedEvent(RefundIssuedEvent event){
        log.info("Received RefundIssuedEvent for order: {}" , event.getOrderId());

    }
}
