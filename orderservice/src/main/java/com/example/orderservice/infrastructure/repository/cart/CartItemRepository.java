package com.example.orderservice.infrastructure.repository.cart;

import com.example.orderservice.domain.entity.cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Modifying
    @Query("UPDATE CartItem ci SET ci.unitPrice = :newPrice, ci.updatedAt = CURRENT_TIMESTAMP WHERE ci.productId = :productId")
    int updateUnitPriceByProductId(@Param("productId") Long productId, @Param("newPrice") BigDecimal newPrice);
}
