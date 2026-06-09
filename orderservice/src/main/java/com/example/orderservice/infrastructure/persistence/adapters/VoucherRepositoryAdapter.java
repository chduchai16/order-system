package com.example.orderservice.infrastructure.persistence.adapters;

import com.example.orderservice.domain.models.voucher.Voucher;
import com.example.orderservice.domain.ports.persistence.VoucherRepository;
import com.example.orderservice.infrastructure.mappers.VoucherMapper;
import com.example.orderservice.infrastructure.persistence.entities.voucher.VoucherEntity;
import com.example.orderservice.infrastructure.persistence.jpas.JpaVoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class VoucherRepositoryAdapter implements VoucherRepository {

    private final VoucherMapper voucherMapper ;
    private final JpaVoucherRepository voucherRepository ;

    @Override
    public Voucher save(Voucher voucher) {
        VoucherEntity entity = VoucherMapper.toEntity(voucher);
        VoucherEntity savedEntity = voucherRepository.save(entity);
        return VoucherMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Voucher> findById(Long id) {
        return voucherRepository.findById(id).map(VoucherMapper::toDomain);
    }

    @Override
    public Optional<Voucher> findByCode(String code) {
        return voucherRepository.findByCode(code).map(VoucherMapper::toDomain);
    }

    @Override
    public Optional<Voucher> findByName(String name) {
        return  voucherRepository.findByName(name).map(VoucherMapper::toDomain);
    }

    @Override
    public Page<Voucher> findPaged(String search, Pageable pageable) {
        return voucherRepository.search(search, pageable).map(VoucherMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        voucherRepository.deleteById(id);
    }
}
