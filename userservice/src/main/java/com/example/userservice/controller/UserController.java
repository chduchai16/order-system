package com.example.userservice.controller;

import com.example.userservice.entity.UserProfile;
import com.example.userservice.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;

    // test api
    @GetMapping("/hello")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello from User Service! If you see this, Gateway routing & Auth passed.");
    }

    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllUsers() {
        return ResponseEntity.ok(userProfileService.getAllUserProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userProfileService.getUserProfileById(id));
    }

    @GetMapping("/keycloak/{keycloakId}")
    public ResponseEntity<UserProfile> getUserByKeycloakId(@PathVariable String keycloakId) {
        return ResponseEntity.ok(userProfileService.getUserProfileByKeycloakId(keycloakId));
    }

    @PostMapping
    public ResponseEntity<UserProfile> createUser(@RequestBody UserProfile userProfile) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userProfileService.createUserProfile(userProfile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> updateUser(@PathVariable String id, @RequestBody UserProfile userProfile) {
        return ResponseEntity.ok(userProfileService.updateUserProfile(id, userProfile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userProfileService.deleteUserProfile(id);
        return ResponseEntity.noContent().build();
    }
}
