package com.example.productservice.application.services;

import com.example.productservice.application.dtos.product_review.ProductReviewRequest;
import com.example.productservice.application.dtos.product_review.ProductReviewResponse;
import com.example.productservice.application.dtos.product_review.ProductReviewImageResponse;
import com.example.productservice.domain.entity.review.ProductReview;
import com.example.productservice.domain.entity.review.ProductReviewImage;
import com.example.productservice.infrastructure.adapters.clients.UserClient;
import com.example.productservice.infrastructure.adapters.clients.dtos.UserResponse;
import com.example.productservice.infrastructure.repository.product.ProductRepository;
import com.example.productservice.infrastructure.repository.review.ProductReviewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductReviewService implements IProductReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final UserClient userClient;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_KEY_PREFIX = "user:profile:";
    private static final long CACHE_TTL_SECONDS = 900; // 15 mins

    @Override
    public Page<ProductReviewResponse> findByProductId(Long productId, Pageable pageable) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product with id " + productId + " does not exist.");
        }
        return productReviewRepository.findByProductId(productId, pageable)
                .map(this::toResponse);
    }

    @Override
    public ProductReviewResponse save(ProductReviewRequest productReview) {
        if (!productRepository.existsById(productReview.getProductId())) {
            throw new RuntimeException("Product with id " + productReview.getProductId() + " does not exist.");
        }
        if (productReview.getRating() < 1 || productReview.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new RuntimeException("Request context is not available.");
        }
        HttpServletRequest request = attributes.getRequest();
        String userIdStr = request.getHeader("X-User-Id");
        if (userIdStr == null || userIdStr.isBlank()) {
            throw new RuntimeException("Missing X-User-Id header.");
        }

        Long userId;
        try {
            userId = Long.parseLong(userIdStr);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid X-User-Id header value: " + userIdStr);
        }

        ProductReview review = ProductReview.builder()
                .productId(productReview.getProductId())
                .userId(userId)
                .rating(productReview.getRating())
                .title(productReview.getTitle())
                .content(productReview.getContent())
                .images(new ArrayList<>())
                .build();

        if (productReview.getImages() != null) {
            for (var imgReq : productReview.getImages()) {
                ProductReviewImage img = ProductReviewImage.builder()
                        .mediaId(imgReq.getMediaId())
                        .productReview(review)
                        .build();
                review.getImages().add(img);
            }
        }

        ProductReview saved = productReviewRepository.save(review);
        return toResponse(saved);
    }

    @Override
    public void delete(Long productReviewId) throws Exception {
        if (!productReviewRepository.existsById(productReviewId)) {
            throw new Exception("Product review does not exist.");
        }
        productReviewRepository.deleteById(productReviewId);
    }

    private ProductReviewResponse toResponse(ProductReview review) {
        return ProductReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .images(review.getImages() != null ? review.getImages().stream()
                        .map(img -> ProductReviewImageResponse.builder()
                                .id(img.getId())
                                .mediaId(img.getMediaId())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }

    private UserResponse getUserProfile(Long userId) {
        String cacheKey = CACHE_KEY_PREFIX + userId;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null && !cached.isBlank()) {
                return objectMapper.readValue(cached, UserResponse.class);
            }
        } catch (Exception e) {
            log.warn("Failed to read user profile from Redis cache for userId: {}", userId, e);
        }

        try {
            var apiResponse = userClient.getUserById(userId);
            if (apiResponse != null && apiResponse.getData() != null) {
                UserResponse user = apiResponse.getData();
                try {
                    String json = objectMapper.writeValueAsString(user);
                    redisTemplate.opsForValue().set(cacheKey, json, Duration.ofSeconds(CACHE_TTL_SECONDS));
                } catch (Exception e) {
                    log.warn("Failed to write user profile to Redis cache for userId: {}", userId, e);
                }
                return user;
            }
        } catch (Exception e) {
            log.error("Failed to fetch user profile via UserClient for userId: {}", userId, e);
        }
        return null;
    }
}
