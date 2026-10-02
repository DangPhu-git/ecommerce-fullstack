package com.Hoctructuyenchieu.Ecommerce.web.controllers;

import com.Hoctructuyenchieu.Ecommerce.common.dto.ApiResponse;
import com.Hoctructuyenchieu.Ecommerce.service.PaymentService;
import com.Hoctructuyenchieu.Ecommerce.web.dto.PaymentDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // GET /api/payment/vnpay-url/{orderId} — Tạo URL thanh toán VNPay cho đơn hàng
    @GetMapping("/vnpay-url/{orderId}")
    public ResponseEntity<ApiResponse<PaymentDto.VNPayResponse>> createVNPayUrl(
            @PathVariable Long orderId,
            Authentication authentication,
            HttpServletRequest request) {
        PaymentDto.VNPayResponse response = paymentService.createVNPayPaymentUrl(
                orderId,
                authentication.getName(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success(response, "URL thanh toán VNPay đã được tạo"));
    }

    // GET /api/payment/vnpay-callback — Xử lý kết quả trả về từ cổng thanh toán VNPay
    @GetMapping("/vnpay-callback")
    public ResponseEntity<ApiResponse<PaymentDto.PaymentCallbackResult>> handleVNPayCallback(
            @RequestParam Map<String, String> queryParams) {
        PaymentDto.PaymentCallbackResult result = paymentService.processVNPayCallback(queryParams);
        return ResponseEntity.ok(ApiResponse.success(result, result.getMessage()));
    }
}
