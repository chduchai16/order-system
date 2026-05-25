package com.example.orderservice.infrastructure.adapters.listeners;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.orderservice.application.services.IOrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentCompletedEventListener {
    private final IOrderService orderService ;

    @KafkaListener(topics = "payment.completed" , groupId="order-group")
    public void handlePaymentCompletedEvent(PaymentCompletedEvent event){
        log.info("Received PaymentCompletedEvent for order: " , event.getOrderId());
        try {
            orderService.handlePaymentCompleted(event);
        } catch(Exception ex) {
            log.error("Failed to mark order as paid fromm PaymentCompletedEvent: {}" , ex.getMessage() , ex) ;
        }
    }
}
