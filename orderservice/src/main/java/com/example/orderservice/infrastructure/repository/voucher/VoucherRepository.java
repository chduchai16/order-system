package com.example.orderservice.infrastructure.repository.voucher;

import com.example.orderservice.domain.entity.voucher.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    Optional<Voucher> findByCode(String code);

    Optional<Voucher> findByName(String name);

    @Query("select v from Voucher v where (:search is null or v.code like %:search% or v.name like %:search%)")
    Page<Voucher> findPaged(@Param("search") String search, Pageable pageable);
}
