package com.example.orderservice.infrastructure.persistence.jpas;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.orderservice.infrastructure.persistence.entities.order.OrderEntity;

@Repository
public interface JpaOrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserId(Long userId);

    @Query("select max(o.orderNumber) from OrderEntity o where o.orderNumber like concat(:prefix, '%')")
    Optional<String> findLatestOrderNumberByPrefix(@Param("prefix") String prefix);
}