package com.example.orderservice.application.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.commonlib.events.cart.CartItemDto;
import com.example.commonlib.events.order.OrderCancelledEvent;
import com.example.commonlib.events.order.OrderCreatedEvent;
import com.example.commonlib.events.order.OrderPaidEvent;
import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.commonlib.events.stock.StockReservedEvent;
import com.example.orderservice.application.dtos.requests.order.OrderRequest;
import com.example.orderservice.application.dtos.responses.order.OrderResponse;
import com.example.orderservice.application.mappers.OrderResponseMapper;
import com.example.orderservice.domain.entity.order.Order;
import com.example.orderservice.domain.entity.order.OrderItem;
import com.example.orderservice.domain.entity.order.OrderStatus;
import com.example.orderservice.domain.entity.order.valueobject.Address;
import com.example.orderservice.domain.entity.order.valueobject.OrderDiscount;
import com.example.orderservice.domain.entity.order.valueobject.OrderNumber;
import com.example.orderservice.domain.entity.order.valueobject.ShippingInfo;
import com.example.orderservice.domain.entity.order.valueobject.TaxInfo;
import com.example.orderservice.domain.entity.voucher.Voucher;
import com.example.orderservice.infrastructure.adapters.producers.OrderEventProducer;
import com.example.orderservice.infrastructure.repository.order.OrderRepository;
import com.example.orderservice.infrastructure.repository.voucher.VoucherRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService implements IOrderService {

    private static final BigDecimal DEFAULT_SHIPPING_FEE = new BigDecimal("30000");
    private static final BigDecimal VAT_RATE = new BigDecimal("0.1");

    private final OrderRepository orderRepository;
    private final VoucherRepository voucherRepository;
    private final OrderEventProducer orderEventProducer;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
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
                .orderNumber(nextOrderNumber().getValue())
                .userId(request.getUserId())
                .items(new ArrayList<>())
                .status(OrderStatus.PENDING)
                .shippingStreet(request.getStreet())
                .shippingCity(request.getCity())
                .shippingDistrict(request.getDistrict())
                .shippingCountry(request.getCountry())
                .shippingCarrier(request.getShippingCarrier())
                .estimatedDelivery(request.getEstimatedDelivery())
                .shippingFee(DEFAULT_SHIPPING_FEE)
                .discountCode(request.getDiscountCode())
                .discountAmount(BigDecimal.ZERO)
                .statusHistory(new ArrayList<>())
                .build();

        items.forEach(order::addItem);

        Voucher voucher = null;
        if (request.getDiscountCode() != null && !request.getDiscountCode().isBlank()) {
            voucher = voucherRepository.findByCode(request.getDiscountCode())
                    .orElseThrow(() -> new IllegalArgumentException("Voucher not found: " + request.getDiscountCode()));

            try {
                voucher.validate(LocalDateTime.now());
                voucher.validateOrderAmount(order.getTotalPrice());
                BigDecimal discountAmount = voucher.calculateDiscount(order.getTotalPrice());
                order.applyVoucher(voucher.getId(), voucher.getCode(), discountAmount);
            } catch (Exception e) {
                throw new IllegalArgumentException("Cannot apply voucher: " + e.getMessage(), e);
            }
        }

        BigDecimal taxAmount = order.getTotalPrice().multiply(VAT_RATE);
        order.setTax(TaxInfo.builder()
                .amount(taxAmount)
                .type("VAT10")
                .rate(VAT_RATE)
                .build());

        Order createdOrder = orderRepository.save(order);

        if (voucher != null) {
            try {
                voucher.redeem(
                        createdOrder.getUserId(),
                        createdOrder.getId(),
                        createdOrder.getVoucherDiscountAmount());
            } catch (Exception e) {
                throw new IllegalArgumentException("Cannot redeem voucher: " + e.getMessage(), e);
            }

            voucherRepository.save(voucher);
        }

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
        orderEventProducer.publishOrderCreated(event);

        return OrderResponseMapper.toResponse(createdOrder);
    }

    @Override
    public Optional<OrderResponse> getOrderById(Long id) {
        return orderRepository.findById(id).map(OrderResponseMapper::toResponse);
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
                savedOrder.getOrderNumber(),
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
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponseMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void handleStockReserved(StockReservedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() == OrderStatus.STOCK_RESERVED
                || order.getStatus() == OrderStatus.PAID
                || order.getStatus() == OrderStatus.COMPLETED) {
            return;
        }

        order.markAsStockReserved();
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.COMPLETED) {
            return;
        }

        order.markAsPaid();
        Order savedOrder = orderRepository.save(order);

        orderEventProducer.publishOrderPaid(new OrderPaidEvent(
                savedOrder.getId(),
                savedOrder.getOrderNumber(),
                savedOrder.getUserId(),
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
}
