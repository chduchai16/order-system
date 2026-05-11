package com.example.notificationservice.web;

import com.example.notificationservice.application.dtos.NotificationResponse;
import com.example.notificationservice.infrastructure.persistence.jpas.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationLogRepository notificationLogRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getLogsByUserId(@PathVariable Long userId) {
        // lấy lịch sử thông báo
        List<NotificationResponse> logs = notificationLogRepository.findByUserId(userId).stream()
                .map(log -> NotificationResponse.builder()
                        .id(log.getId())
                        .userId(log.getUserId())
                        .recipient(log.getRecipient())
                        .subject(log.getSubject())
                        .content(log.getContent())
                        .status(log.getStatus())
                        .sentAt(log.getSentAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(logs);
    }
}
