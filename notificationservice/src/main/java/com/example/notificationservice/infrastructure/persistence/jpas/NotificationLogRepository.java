package com.example.notificationservice.infrastructure.persistence.jpas;

import com.example.notificationservice.infrastructure.persistence.entities.NotificationLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLogEntity, Long> {
    java.util.List<NotificationLogEntity> findByUserId(Long userId);
}
