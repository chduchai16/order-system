package com.example.paymentservice.application.dtos;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SePayWebhookRequest {
    private Long id ; // transaction id bên sepay
    private String gateway ;// ngân hàng
    private LocalDateTime transactionDate ; // thời gian giao dịch
    private String accountNumber ; // stk nhận tiền
    private String code ; 
    private String content ; // nội dung chuyển khoản
    private String transferType ; // in / out 
    private double transferAmount ; // số tiền 
    private double accumulated ; // số dư sau giao dịch
    private String referenceCode ; // mã giao dịch
    private String description ; // mô tả 
    private String status ; // trạng thái
}
