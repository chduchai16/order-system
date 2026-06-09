package com.example.orderservice.application.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.example.orderservice.application.dtos.responses.order.OrderItemResponse;
import com.example.orderservice.application.dtos.responses.order.OrderResponse;
import com.example.orderservice.application.dtos.responses.order.StatusHistoryResponse;
import com.example.orderservice.domain.models.order.Order;

public class OrderResponseMapper {

    public static OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemResponse> items = order.getItems() != null
                ? order.getItems().stream()
                        .map(item -> OrderItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .subTotal(item.getSubTotal())
                                .build())
                        .collect(Collectors.toList())
                : List.of();

        List<StatusHistoryResponse> history = order.getStatusHistory() != null
                ? order.getStatusHistory().stream()
                        .map(h -> StatusHistoryResponse.builder()
                                .fromStatus(h.getFromStatus())
                                .toStatus(h.getToStatus())
                                .reason(h.getReason())
                                .changedAt(h.getChangedAt())
                                .build())
                        .collect(Collectors.toList())
                : List.of();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber() != null ? order.getOrderNumber().getValue() : null)
                .userId(order.getUserId())
                .items(items)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .fullAddress(order.getShippingAddress() != null ? order.getShippingAddress().getFullAddress() : null)
                .statusHistory(history)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
