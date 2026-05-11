package com.example.userservice.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserWishlistEntry {
    private Long id;
    private Long productId;
    private String productName;
    private LocalDateTime addedAt;
}
