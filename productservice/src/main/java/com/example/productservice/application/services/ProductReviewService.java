package com.example.productservice.application.services;

import com.example.productservice.application.dtos.product_review.ProductReviewRequest;
import com.example.productservice.application.dtos.product_review.ProductReviewResponse;
import com.example.productservice.application.dtos.product_review.ProductReviewImageResponse;
import com.example.productservice.domain.models.ProductReview;
import com.example.productservice.domain.ports.persistence.ProductRepository;
import com.example.productservice.domain.ports.persistence.ProductReviewRepository;
import com.example.productservice.infrastructure.adapters.clients.UserClient;
import com.example.productservice.infrastructure.adapters.clients.dtos.UserResponse;
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
        return productReviewRepository.findPageable(pageable, productId)
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

        // Extract User ID from X-User-Id HTTP header
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new RuntimeException("Request context is not available.");
        }
        HttpServletRequest request = attributes.getRequest();
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader == null) {
            throw new RuntimeException("User is not authenticated (X-User-Id header is missing).");
        }
        Long userId = Long.valueOf(userIdHeader);

        // Try reading from Shared Redis Cache first
        UserResponse user = null;
        String cacheKey = CACHE_KEY_PREFIX + userId;
        try {
            String cachedUserJson = redisTemplate.opsForValue().get(cacheKey);
            if (cachedUserJson != null) {
                user = objectMapper.readValue(cachedUserJson, UserResponse.class);
            }
        } catch (Exception e) {
            log.error("Failed to read user from Redis cache in productservice for id: {}", userId, e);
        }

        // Fallback to Feign client call on Cache Miss
        if (user == null) {
            try {
                user = userClient.getUserById(userId).getData();
                if (user != null) {
                    // Update cache for subsequent requests
                    redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(user), Duration.ofSeconds(CACHE_TTL_SECONDS));
                }
            } catch (Exception e) {
                throw new RuntimeException("User with id " + userId + " does not exist.");
            }
        }

        if (user == null || !user.isActive()) {
            throw new RuntimeException("User with id " + userId + " is inactive or does not exist.");
        }

        ProductReview domain = new ProductReview();
        domain.setProductId(productReview.getProductId());
        domain.setRating(productReview.getRating());
        domain.setContent(productReview.getContent());
        domain.setTitle(productReview.getTitle());
        domain.setUserId(user.getId());

        ProductReview savedDomain = productReviewRepository.save(domain);
        return toResponse(savedDomain);
    }

    @Override
    public void delete(Long productReviewId) throws Exception {
        productReviewRepository.delete(productReviewId);
    }

    private ProductReviewResponse toResponse(ProductReview domain) {
        if (domain == null) return null;
        return ProductReviewResponse.builder()
                .id(domain.getId())
                .productId(domain.getProductId())
                .userId(domain.getUserId())
                .rating(domain.getRating())
                .title(domain.getTitle())
                .content(domain.getContent())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .images(domain.getImages() != null ? domain.getImages().stream()
                        .map(img -> new ProductReviewImageResponse(img.getId(), img.getMediaId()))
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
