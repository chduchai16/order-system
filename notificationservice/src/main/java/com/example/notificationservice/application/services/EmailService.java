package com.example.notificationservice.application.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final com.example.notificationservice.infrastructure.persistence.jpas.NotificationLogRepository notificationLogRepository;

    public void sendEmail(String to, String subject, String body) {
        // gửi email và lưu log
        log.info("Sending email to {}: {}", to, subject);
        String status = "SENT";
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@ordersystem.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            javaMailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            status = "FAILED";
            log.error("Failed to send email to {}", to, e);
        } finally {
            notificationLogRepository.save(com.example.notificationservice.infrastructure.persistence.entities.NotificationLogEntity.builder()
                .recipient(to)
                .subject(subject)
                .content(body)
                .status(status)
                .build());
        }
    }
}
