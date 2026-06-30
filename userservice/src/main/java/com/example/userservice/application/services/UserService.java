package com.example.userservice.application.services;

import com.example.userservice.application.dtos.AddressRequest;
import com.example.userservice.domain.models.*;
import com.example.userservice.domain.ports.persistence.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_KEY_PREFIX = "user:profile:";
    private static final long CACHE_TTL_SECONDS = 900; // 15 mins

    @Override
    public Optional<User> getUserById(Long id) {
        String cacheKey = CACHE_KEY_PREFIX + id;
        try {
            String cachedUser = redisTemplate.opsForValue().get(cacheKey);
            if (cachedUser != null) {
                User user = objectMapper.readValue(cachedUser, User.class);
                return Optional.of(user);
            }
        } catch (Exception e) {
            log.error("Failed to read user from Redis cache for id: {}", id, e);
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            try {
                redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(userOpt.get()), Duration.ofSeconds(CACHE_TTL_SECONDS));
            } catch (Exception e) {
                log.error("Failed to write user to Redis cache for id: {}", id, e);
            }
        }
        return userOpt;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User addAddress(Long userId, AddressRequest request) {
        User user = getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        user.addAddress(AddressBookEntry.builder()
                .label(request.getLabel())
                .address(Address.builder()
                        .street(request.getStreet())
                        .city(request.getCity())
                        .district(request.getDistrict())
                        .country(request.getCountry())
                        .build())
                .isDefault(request.isDefault())
                .build());
        
        User savedUser = userRepository.save(user);
        evictCache(userId);
        return savedUser;
    }

    @Override
    public User addToWishlist(Long userId, Long productId, String productName) {
        User user = getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        user.addToWishlist(UserWishlistEntry.builder()
                .productId(productId)
                .productName(productName)
                .build());
        
        User savedUser = userRepository.save(user);
        evictCache(userId);
        return savedUser;
    }

    private void evictCache(Long userId) {
        try {
            redisTemplate.delete(CACHE_KEY_PREFIX + userId);
        } catch (Exception e) {
            log.error("Failed to evict user cache for id: {}", userId, e);
        }
    }
}
