package com.example.orderservice.application.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.commonlib.events.cart.CartItemDto;
import com.example.commonlib.events.order.OrderCancelledEvent;
import com.example.commonlib.events.order.OrderCreatedEvent;
import com.example.commonlib.events.payment.PaymentCompletedEvent;
import com.example.orderservice.application.dtos.requests.order.OrderRequest;
import com.example.orderservice.application.dtos.responses.order.OrderResponse;
import com.example.orderservice.application.mappers.OrderResponseMapper;
import com.example.orderservice.domain.models.order.Address;
import com.example.orderservice.domain.models.order.Order;
import com.example.orderservice.domain.models.order.OrderDiscount;
import com.example.orderservice.domain.models.order.OrderItem;
import com.example.orderservice.domain.models.order.OrderNumber;
import com.example.orderservice.domain.models.order.OrderStatus;
import com.example.orderservice.domain.models.order.ShippingInfo;
import com.example.orderservice.domain.models.order.TaxInfo;
import com.example.orderservice.domain.models.voucher.Voucher;
import com.example.orderservice.domain.ports.persistence.OrderRepository;
import com.example.orderservice.domain.ports.persistence.VoucherRepository;
import com.example.orderservice.infrastructure.adapters.producers.OrderEventProducer;

import jakarta.transaction.Transactional;
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

        Order order = buildOrder(request);
        Voucher voucher = applyVoucherIfPresent(order, request.getDiscountCode());
        applyTax(order);

        Order createdOrder = orderRepository.save(order);
        redeemVoucherIfPresent(createdOrder, voucher);
        publishOrderCreated(createdOrder);

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
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponseMapper::toResponse)
                .toList();
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
        orderRepository.save(order);
    }

    private Order buildOrder(OrderRequest request) {
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
                .orderNumber(nextOrderNumber())
                .userId(request.getUserId())
                .items(items)
                .status(OrderStatus.PENDING)
                .shippingAddress(shippingAddress)
                .shippingInfo(ShippingInfo.builder()
                        .carrier(request.getShippingCarrier())
                        .estimatedDelivery(request.getEstimatedDelivery())
                        .shippingFee(DEFAULT_SHIPPING_FEE)
                        .build())
                .discount(OrderDiscount.builder()
                        .code(request.getDiscountCode())
                        .amount(BigDecimal.ZERO)
                        .build())
                .statusHistory(new ArrayList<>())
                .build();
        order.calculateTotalPrice();
        return order;
    }

    private Voucher applyVoucherIfPresent(Order order, String discountCode) {
        if (discountCode == null || discountCode.isBlank()) {
            return null;
        }

        Voucher voucher = voucherRepository.findByCode(discountCode)
                .orElseThrow(() -> new IllegalArgumentException("Voucher not found: " + discountCode));

        try {
            voucher.validate(LocalDateTime.now());
            voucher.validateOrderAmount(order.getTotalPrice());
            BigDecimal discountAmount = voucher.calculateDiscount(order.getTotalPrice());
            order.applyVoucher(voucher.getId(), voucher.getCode(), discountAmount);
            return voucher;
        } catch (Exception e) {
            throw new IllegalArgumentException("Cannot apply voucher: " + e.getMessage(), e);
        }
    }

    // thuế đơn hàng
    private void applyTax(Order order) {
        BigDecimal taxAmount = order.getTotalPrice().multiply(VAT_RATE);
        order.setTax(TaxInfo.builder()
                .amount(taxAmount)
                .type("VAT10")
                .rate(VAT_RATE)
                .build());
    }

    // áp dụng voucher
    private void redeemVoucherIfPresent(Order createdOrder, Voucher voucher) {
        if (voucher == null) {
            return;
        }

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

    // gửi sự kiện vào kafka
    private void publishOrderCreated(Order createdOrder) {
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
    }

    // lấy số đơn hàng
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
