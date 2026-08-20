package com.example.orderservice.infrastructure.persistence.cart.jpas;

import com.example.orderservice.infrastructure.persistence.cart.entities.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface JpaCartItemRepository extends JpaRepository<CartItemEntity, Long> {

    @Modifying
    @Query("UPDATE CartItemEntity ci SET ci.unitPrice = :newPrice, ci.updatedAt = CURRENT_TIMESTAMP WHERE ci.productId = :productId")
    int updateUnitPriceByProductId(@Param("productId") Long productId, @Param("newPrice") BigDecimal newPrice);
}
