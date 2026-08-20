package com.example.orderservice.domain.entity.order;

import com.example.orderservice.domain.entity.order.valueobject.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Column(nullable = false)
    private Long userId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "shipping_street")
    private String shippingStreet;

    @Column(name = "shipping_city")
    private String shippingCity;

    @Column(name = "shipping_district")
    private String shippingDistrict;

    @Column(name = "shipping_country")
    private String shippingCountry;

    @Column(name = "shipping_carrier")
    private String shippingCarrier;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipping_fee")
    private BigDecimal shippingFee;

    @Column(name = "estimated_delivery")
    private String estimatedDelivery;

    @Column(name = "discount_code")
    private String discountCode;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    @Column(name = "tax_amount")
    private BigDecimal taxAmount;

    @Column(name = "tax_type")
    private String taxType;

    @Column(name = "voucher_id")
    private Long voucherId;

    @Column(name = "voucher_code")
    private String voucherCode;

    @Column(name = "voucher_discount_amount")
    private BigDecimal voucherDiscountAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper Value Object getters / setters
    @Transient
    public Address getShippingAddress() {
        if (shippingStreet == null && shippingCity == null) return null;
        return new Address(shippingStreet, shippingCity, shippingDistrict, shippingCountry);
    }

    public void setShippingAddress(Address address) {
        if (address != null) {
            this.shippingStreet = address.getStreet();
            this.shippingCity = address.getCity();
            this.shippingDistrict = address.getDistrict();
            this.shippingCountry = address.getCountry();
        }
    }

    @Transient
    public ShippingInfo getShippingInfo() {
        return ShippingInfo.builder()
                .carrier(shippingCarrier)
                .trackingNumber(trackingNumber)
                .shippingFee(shippingFee)
                .estimatedDelivery(estimatedDelivery)
                .build();
    }

    public void setShippingInfo(ShippingInfo info) {
        if (info != null) {
            this.shippingCarrier = info.getCarrier();
            this.trackingNumber = info.getTrackingNumber();
            this.shippingFee = info.getShippingFee();
            this.estimatedDelivery = info.getEstimatedDelivery();
        }
    }

    @Transient
    public OrderDiscount getDiscount() {
        return OrderDiscount.builder()
                .code(discountCode)
                .amount(discountAmount)
                .build();
    }

    public void setDiscount(OrderDiscount discount) {
        if (discount != null) {
            this.discountCode = discount.getCode();
            this.discountAmount = discount.getAmount();
        }
    }

    @Transient
    public TaxInfo getTax() {
        return TaxInfo.builder()
                .amount(taxAmount)
                .type(taxType)
                .build();
    }

    public void setTax(TaxInfo tax) {
        if (tax != null) {
            this.taxAmount = tax.getAmount();
            this.taxType = tax.getType();
        }
    }

    // Business Logic Methods
    public void calculateTotalPrice() {
        if (items == null) {
            this.totalPrice = BigDecimal.ZERO;
            return;
        }
        this.totalPrice = items.stream()
                .map(OrderItem::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void addItem(OrderItem item) {
        if (items == null) items = new ArrayList<>();
        item.setOrder(this);
        items.add(item);
        calculateTotalPrice();
    }

    public void applyVoucher(Long voucherId, String voucherCode, BigDecimal voucherDiscountAmount) {
        this.voucherId = voucherId;
        this.voucherCode = voucherCode;
        this.voucherDiscountAmount = voucherDiscountAmount;
        this.discountCode = voucherCode;
        this.discountAmount = voucherDiscountAmount;

        if (this.totalPrice == null) {
            calculateTotalPrice();
        }
        this.totalPrice = this.totalPrice.subtract(voucherDiscountAmount).max(BigDecimal.ZERO);
    }

    private void transitionStatus(OrderStatus newStatus, String reason) {
        if (statusHistory == null) statusHistory = new ArrayList<>();
        OrderStatusHistory history = OrderStatusHistory.record(this.status, newStatus, reason);
        history.setOrder(this);
        statusHistory.add(history);
        this.status = newStatus;
    }

    public void markAsStockReserved() {
        if (this.status != OrderStatus.PENDING) {
            throw new RuntimeException("Invalid status transition to STOCK_RESERVED from " + status);
        }
        transitionStatus(OrderStatus.STOCK_RESERVED, "Stock reserved successfully");
    }

    public void markAsPaid() {
        if (this.status != OrderStatus.STOCK_RESERVED) {
            throw new RuntimeException("Cannot pay for order that hasn't reserved stock");
        }
        transitionStatus(OrderStatus.PAID, "Payment completed");
    }

    public void markAsCompleted() {
        transitionStatus(OrderStatus.COMPLETED, "Order fulfilled");
    }

    public void markAsCancelled() {
        markAsCancelled("Cancelled");
    }

    public void markAsCancelled(String reason) {
        transitionStatus(OrderStatus.CANCELLED, reason);
    }
}
