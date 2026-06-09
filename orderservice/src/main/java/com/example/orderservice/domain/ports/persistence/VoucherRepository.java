package com.example.orderservice.domain.ports.persistence;

import com.example.orderservice.domain.models.voucher.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface VoucherRepository {
    Voucher save(Voucher voucher);
    Optional<Voucher> findById(Long id);
    Page<Voucher> findPaged(String search ,Pageable pageable);
    void deleteById(Long id);
}
