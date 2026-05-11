package com.example.userservice.infrastructure.persistence.jpas;

import com.example.userservice.infrastructure.persistence.entities.UserWishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserWishlistRepository extends JpaRepository<UserWishlistEntity, Long> {
    List<UserWishlistEntity> findByUserId(Long userId);
}
