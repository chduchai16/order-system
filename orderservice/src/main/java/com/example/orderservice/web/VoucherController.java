package com.example.orderservice.web;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.orderservice.application.dtos.requests.voucher.VoucherRequest;
import com.example.orderservice.application.dtos.responses.voucher.VoucherResponse;
import com.example.orderservice.application.services.IVoucherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final IVoucherService voucherService;

    @PostMapping
    public ResponseEntity<VoucherResponse> createVoucher(@RequestBody VoucherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(voucherService.createVoucher(request));
    }

    @GetMapping
    public ResponseEntity<Page<VoucherResponse>> getPageVouchers(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(voucherService.getPageVouchers(search, pageable));
    }
}
