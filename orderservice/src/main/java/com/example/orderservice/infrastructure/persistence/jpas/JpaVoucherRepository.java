package com.example.orderservice.infrastructure.persistence.jpas;

import com.example.orderservice.infrastructure.persistence.entities.voucher.VoucherEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaVoucherRepository extends JpaRepository<VoucherEntity , Long> {

    @Query("""
        select v
        from VoucherEntity v
        where :search is null
           or trim(:search) = ''
           or lower(v.code) like lower(concat('%', :search, '%'))
           or lower(v.name) like lower(concat('%', :search, '%'))
    """)
    Page<VoucherEntity> search(
            @Param("search") String search,
            Pageable pageable
    );
}
