package com.example.paymentservice.infrastructure.adapters.producers;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.commonlib.events.payment.RefundIssuedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate ; 

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        if(kafkaTemplate == null) {
            log.warn("KafkaTemplate is not available - event not published: {}", event.getPaymentId());
            return ;
        }
        try {
            kafkaTemplate.send("payment.completed" , event) ;

        } catch(Exception ex) {
            log.error("Failed to publish event: {}", ex.getMessage());
        }
    }

    public void publishRefundIssued(RefundIssuedEvent event) {
        if(kafkaTemplate == null) {
            log.warn("KafkaTemplate is not available - event not published: {}", event.getPaymentId());
            return ;
        }
        try {
            kafkaTemplate.send("refund.issued" , event) ;

        } catch(Exception ex) {
            log.error("Failed to publish event: {}", ex.getMessage());
        }
    }

}
