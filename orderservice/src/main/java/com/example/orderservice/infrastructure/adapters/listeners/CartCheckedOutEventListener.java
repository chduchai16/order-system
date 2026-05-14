package com.example.orderservice.infrastructure.adapters.listeners;

import com.example.commonlib.events.CartCheckedOutEvent;
import com.example.orderservice.application.dtos.OrderItemRequest;
import com.example.orderservice.application.dtos.OrderRequest;
import com.example.orderservice.application.services.IOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CartCheckedOutEventListener {

    private final IOrderService orderService;

    @KafkaListener(topics = "cart.checked-out", groupId = "order-group")
    public void handleCartCheckedOutEvent(CartCheckedOutEvent event) {
        log.info("Received CartCheckedOutEvent for userId: {}", event.getUserId());

        try {
            OrderRequest orderRequest = OrderRequest.builder()
                    .userId(event.getUserId())
                    .street(event.getShippingStreet())
                    .city(event.getShippingCity())
                    .district(event.getShippingDistrict())
                    .country(event.getShippingCountry())
                    .items(event.getItems().stream()
                            .map(item -> OrderItemRequest.builder()
                                    .productId(item.getProductId())
                                    .productName(item.getProductName())
                                    .quantity(item.getQuantity())
                                    .unitPrice(item.getUnitPrice())
                                    .build())
                            .collect(Collectors.toList()))
                    .build();

            orderService.createOrder(orderRequest);
            log.info("Successfully created order from CartCheckedOutEvent for userId: {}", event.getUserId());
        } catch (Exception e) {
            log.error("Failed to create order from CartCheckedOutEvent: {}", e.getMessage(), e);
        }
    }
}
