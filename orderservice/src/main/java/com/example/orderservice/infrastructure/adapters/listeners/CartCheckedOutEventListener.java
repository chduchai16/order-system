package com.example.orderservice.infrastructure.adapters.listeners;

import java.util.stream.Collectors;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.example.commonlib.events.cart.CartCheckedOutEvent;
import com.example.orderservice.application.dtos.requests.order.OrderItemRequest;
import com.example.orderservice.application.dtos.requests.order.OrderRequest;
import com.example.orderservice.application.services.IOrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
