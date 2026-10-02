package com.Hoctructuyenchieu.Ecommerce.service;

import com.Hoctructuyenchieu.Ecommerce.web.dto.PaymentDto;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface PaymentService {
    PaymentDto.VNPayResponse createVNPayPaymentUrl(Long orderId, String username, HttpServletRequest request);
    PaymentDto.PaymentCallbackResult processVNPayCallback(Map<String, String> queryParams);
}
