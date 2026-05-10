package com.example.commonlib.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartCheckedOutEvent {
    private Long userId;
    private String keycloakId;
    private List<CartItemDto> items;
    private String shippingStreet;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingCountry;
    private String paymentMethod;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartItemDto {
        private Long productId;
        private String productName;
        private String sku;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
