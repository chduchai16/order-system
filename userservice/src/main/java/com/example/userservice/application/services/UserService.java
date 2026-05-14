package com.example.userservice.application.services;

import com.example.userservice.application.dtos.AddressRequest;
import com.example.userservice.domain.models.*;
import com.example.userservice.domain.ports.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {

    private final UserRepository userRepository;

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
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
        
        return userRepository.save(user);
    }

    @Override
    public User addToWishlist(Long userId, Long productId, String productName) {
        User user = getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        user.addToWishlist(UserWishlistEntry.builder()
                .productId(productId)
                .productName(productName)
                .build());
        
        return userRepository.save(user);
    }
}
