package com.example.orderservice.application.services;

import com.example.orderservice.application.dtos.requests.voucher.VoucherRequest;
import com.example.orderservice.application.dtos.responses.voucher.VoucherResponse;
import com.example.orderservice.application.mappers.VoucherRequestMapper;
import com.example.orderservice.application.mappers.VoucherResponseMapper;
import com.example.orderservice.domain.entity.voucher.Voucher;
import com.example.orderservice.infrastructure.repository.voucher.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoucherService implements IVoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public VoucherResponse createVoucher(VoucherRequest request) {
        Voucher voucher = VoucherRequestMapper.toDomain(request);
        voucher.setCreatedAt(java.time.LocalDateTime.now());
        voucher.setUpdatedAt(java.time.LocalDateTime.now());
        Voucher savedVoucher = voucherRepository.save(voucher);
        return VoucherResponseMapper.toResponse(savedVoucher);
    }

    @Override
    public Page<VoucherResponse> getPageVouchers(String search, Pageable pageable) {
        return voucherRepository.findPaged(search, pageable)
                .map(VoucherResponseMapper::toResponse);
    }
}
