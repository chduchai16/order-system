package com.example.userservice.service;

import com.example.userservice.entity.UserProfile;
import com.example.userservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }

    public UserProfile getUserProfileById(String id) {
        return userProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + id));
    }

    public UserProfile getUserProfileByKeycloakId(String keycloakId) {
        return userProfileRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new RuntimeException("User profile not found with Keycloak ID: " + keycloakId));
    }

    public UserProfile createUserProfile(UserProfile userProfile) {
        if (userProfileRepository.findByUsername(userProfile.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userProfileRepository.findByEmail(userProfile.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        return userProfileRepository.save(userProfile);
    }

    public UserProfile updateUserProfile(String id, UserProfile updateReq) {
        UserProfile existingProfile = getUserProfileById(id);
        
        existingProfile.setFirstName(updateReq.getFirstName());
        existingProfile.setLastName(updateReq.getLastName());
        existingProfile.setPhone(updateReq.getPhone());
        existingProfile.setAddress(updateReq.getAddress());
        
        return userProfileRepository.save(existingProfile);
    }

    public void deleteUserProfile(String id) {
        if (!userProfileRepository.existsById(id)) {
            throw new RuntimeException("User profile not found with ID: " + id);
        }
        userProfileRepository.deleteById(id);
    }
}
