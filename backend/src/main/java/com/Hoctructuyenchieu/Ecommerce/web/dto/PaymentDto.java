package com.Hoctructuyenchieu.Ecommerce.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class PaymentDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VNPayResponse {
        private String paymentUrl;
        private Long orderId;
        private String orderNumber;
        private String message;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentCallbackResult {
        private String orderNumber;
        private String transactionNo;
        private BigDecimal amount;
        private String status; // SUCCESS, FAILED, INVALID_SIGNATURE
        private String message;
    }
}
