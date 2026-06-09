package com.example.orderservice.application.services;

import com.example.orderservice.application.dtos.requests.voucher.VoucherRequest;
import com.example.orderservice.application.dtos.responses.voucher.VoucherResponse;
import com.example.orderservice.domain.models.voucher.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IVoucherService {
    VoucherResponse createVoucher(VoucherRequest request);
    Page<VoucherResponse> getPageVouchers(String search, Pageable pageable);
}
