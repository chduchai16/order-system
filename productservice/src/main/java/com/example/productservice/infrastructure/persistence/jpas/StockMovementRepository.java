package com.example.productservice.infrastructure.persistence.jpas;

import com.example.productservice.infrastructure.persistence.entities.StockMovementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovementEntity, Long> {
    List<StockMovementEntity> findByProductId(Long productId);
}
