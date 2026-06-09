package com.example.orderservice.application.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.commonlib.events.cart.CartItemDto;
import com.example.commonlib.events.order.OrderCancelledEvent;
import com.example.commonlib.events.order.OrderCreatedEvent;
import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.orderservice.application.dtos.OrderRequest;
import com.example.orderservice.domain.models.order.Address;
import com.example.orderservice.domain.models.order.Order;
import com.example.orderservice.domain.models.order.OrderDiscount;
import com.example.orderservice.domain.models.order.OrderItem;
import com.example.orderservice.domain.models.order.OrderNumber;
import com.example.orderservice.domain.models.order.OrderStatus;
import com.example.orderservice.domain.models.order.ShippingInfo;
import com.example.orderservice.domain.models.order.TaxInfo;
import com.example.orderservice.domain.ports.persistence.OrderRepository;
import com.example.orderservice.infrastructure.adapters.producers.OrderEventProducer;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer ;

    // tạo đơn hàng
    @Override
    @Transactional
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

        for (int attempt = 0; attempt < 3; attempt++) {
            Order order = Order.builder()
                    .orderNumber(nextOrderNumber())
                    .userId(request.getUserId())
                    .items(items)
                    .status(OrderStatus.PENDING)
                    .shippingAddress(shippingAddress)
                    .shippingInfo(ShippingInfo.builder()
                            .carrier(request.getShippingCarrier())
                            .estimatedDelivery(request.getEstimatedDelivery())
                            .shippingFee(new BigDecimal("30000"))
                            .build())
                    .discount(OrderDiscount.builder()
                            .code(request.getDiscountCode())
                            .amount(BigDecimal.ZERO)
                            .build())
                    .statusHistory(new ArrayList<>())
                    .build();

            order.calculateTotalPrice();

            BigDecimal taxAmount = order.getTotalPrice().multiply(new BigDecimal("0.1"));
            order.setTax(TaxInfo.builder()
                    .amount(taxAmount)
                    .type("VAT10")
                    .rate(new BigDecimal("0.1"))
                    .build());

            Order createdOrder = orderRepository.save(order);
            List<CartItemDto> itemDtos = createdOrder.getItems().stream()
                    .map(item -> CartItemDto.builder()
                            .productId(item.getProductId())
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .build())
                    .toList();
            OrderCreatedEvent event = new OrderCreatedEvent(
                    createdOrder.getId(),
                    createdOrder.getUserId(),
                    itemDtos,
                    createdOrder.getTotalPrice(),
                    createdOrder.getCreatedAt()
            );
            // gửi event vào trong kafka
            orderEventProducer.publishOrderCreated(event);
            return createdOrder;
        }

        throw new IllegalStateException("Unable to generate a unique order number after multiple attempts");
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            log.info("Order {} already cancelled", orderId);
            return;
        }

        order.markAsCancelled(reason);
        Order savedOrder = orderRepository.save(order);

        orderEventProducer.publishOrderCancelled(new OrderCancelledEvent(
                savedOrder.getId(),
                savedOrder.getOrderNumber() != null ? savedOrder.getOrderNumber().getValue() : null,
                reason,
                savedOrder.getItems().stream()
                        .map(item -> CartItemDto.builder()
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .build())
                        .toList()
        ));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private OrderNumber nextOrderNumber() {
        String prefix = OrderNumber.currentPrefix();
        long nextSequence = orderRepository.findLatestOrderNumberByPrefix(prefix)
                .map(this::extractSequence)
                .orElse(0L) + 1;
        return OrderNumber.generate(nextSequence);
    }

    private long extractSequence(String orderNumber) {
        int lastDashIndex = orderNumber.lastIndexOf('-');
        if (lastDashIndex < 0 || lastDashIndex == orderNumber.length() - 1) {
            return 0L;
        }
        return Long.parseLong(orderNumber.substring(lastDashIndex + 1));
    }

    // xử lý đánh đã thanh toán
    @Override
    @Transactional
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));        
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.COMPLETED) {
                return;
        }

        order.markAsPaid();
        orderRepository.save(order);
    }
}
