package com.example.orderservice.infrastructure.repository.order;

import com.example.orderservice.domain.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    @Query("select max(o.orderNumber) from Order o where o.orderNumber like concat(:prefix, '%')")
    Optional<String> findLatestOrderNumberByPrefix(@Param("prefix") String prefix);
}
