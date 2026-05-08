package com.example.orderservice.web;

import com.example.orderservice.application.dtos.OrderRequest;
import com.example.orderservice.application.dtos.OrderResponse;
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
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .items(items)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .fullAddress(order.getShippingAddress() != null ? order.getShippingAddress().getFullAddress() : null)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
