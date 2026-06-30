package com.example.productservice.infrastructure.persistence.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_reviews")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "user_id" , nullable = false)
    private Long userId;
    private int rating ;
    private String title ;
    private String content ;

    @Column(name = "created_at")
    private LocalDateTime createdAt ;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt ;

    @OneToMany(mappedBy = "productReview", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductReviewImageEntity> images = new ArrayList<>();
}
