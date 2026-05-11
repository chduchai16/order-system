package com.example.orderservice.web;

import com.example.orderservice.application.dtos.*;
import com.example.orderservice.application.services.IOrderService;
import com.example.orderservice.domain.models.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(order -> ResponseEntity.ok(toResponse(order)))
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subTotal(item.getSubTotal())
                        .build())
                .collect(Collectors.toList());

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
