package com.example.paymentservice.application.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SePayWebhookRequest {
    private Long id;
    private String gateway;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime transactionDate;
    private String accountNumber;
    private String code;
    private String content;
    private String transferType;
    private double transferAmount;
    private double accumulated;
    private String referenceCode;
    private String description;
    private String status;
}
