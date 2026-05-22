package com.example.productservice.infrastructure.adapters.producers;

import com.example.commonlib.events.product.ProductPriceChangedEvent;
import com.example.commonlib.events.stock.StockReservationFailedEvent;
import com.example.commonlib.events.stock.StockReservedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishStockReserved(StockReservedEvent event) {
        publish("stock-reserved", event.getOrderId(), event);
    }

    public void publishStockReservationFailed(StockReservationFailedEvent event) {
        publish("stock-reservation-failed", event.getOrderId(), event);
    }

    public void publishProductPriceChanged(ProductPriceChangedEvent event) {
        publish("product.price.changed", event.getProductId(), event);
    }

    private void publish(String topic, Long key, Object event) {
        if (kafkaTemplate == null) {
            log.warn("KafkaTemplate is not available - event not published to topic {}", topic);
            return;
        }
        try {
            kafkaTemplate.send(topic, String.valueOf(key), event);
        } catch (Exception e) {
            log.error("Failed to publish event to topic {}: {}", topic, e.getMessage());
        }
    }
}
