package com.example.productservice.infrastructure.persistence;

import com.example.productservice.infrastructure.persistence.entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaProductRepository extends JpaRepository<ProductEntity, Long> {
    List<ProductEntity> findByActiveTrue();
}
