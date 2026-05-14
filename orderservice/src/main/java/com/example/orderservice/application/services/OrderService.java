package com.example.orderservice.application.services;

import com.example.orderservice.application.dtos.OrderRequest;
import com.example.orderservice.application.saga.OrderSagaOrchestrator;
import com.example.orderservice.domain.models.*;
import com.example.orderservice.domain.ports.persistence.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final OrderSagaOrchestrator sagaOrchestrator;

    @Override
    public Order createOrder(OrderRequest request) {
        log.info("Creating order for user {}", request.getUserId());

        Address shippingAddress = new Address(
                request.getStreet(),
                request.getCity(),
                request.getDistrict(),
                request.getCountry()
        );

        List<OrderItem> items = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        Order order = Order.builder()
                .orderNumber(OrderNumber.generate())
                .userId(request.getUserId())
                .items(items)
                .status(OrderStatus.PENDING)
                .shippingAddress(shippingAddress)
                .shippingInfo(ShippingInfo.builder()
                        .carrier(request.getShippingCarrier())
                        .estimatedDelivery(request.getEstimatedDelivery())
                        .shippingFee(new BigDecimal("30000")) // default fee
                        .build())
                .discount(OrderDiscount.builder()
                        .code(request.getDiscountCode())
                        .amount(BigDecimal.ZERO) // logic to apply discount could go here
                        .build())
                .statusHistory(new ArrayList<>())
                .build();

        order.calculateTotalPrice();
        
        // Calculate tax (10% VAT)
        BigDecimal taxAmount = order.getTotalPrice().multiply(new BigDecimal("0.1"));
        order.setTax(TaxInfo.builder()
                .amount(taxAmount)
                .type("VAT10")
                .rate(new BigDecimal("0.1"))
                .build());

        Order savedOrder = orderRepository.save(order);

        // Thực hiện Saga: reserve stock → payment → complete
        sagaOrchestrator.execute(savedOrder);

        return savedOrder;
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
