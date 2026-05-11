package com.example.userservice.infrastructure.persistence.jpas;

import com.example.userservice.infrastructure.persistence.entities.AddressBookEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AddressBookRepository extends JpaRepository<AddressBookEntity, Long> {
    List<AddressBookEntity> findByUserId(Long userId);
}
