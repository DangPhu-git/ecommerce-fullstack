package com.Hoctructuyenchieu.Ecommerce.service.impl;

import com.Hoctructuyenchieu.Ecommerce.config.VNPayConfig;
import com.Hoctructuyenchieu.Ecommerce.entity.Order;
import com.Hoctructuyenchieu.Ecommerce.exception.ResourceNotFoundException;
import com.Hoctructuyenchieu.Ecommerce.repository.OrderRepository;
import com.Hoctructuyenchieu.Ecommerce.service.PaymentService;
import com.Hoctructuyenchieu.Ecommerce.web.dto.PaymentDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;

    @Override
    public PaymentDto.VNPayResponse createVNPayPaymentUrl(Long orderId, String username, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Bạn không có quyền thanh toán cho đơn hàng này");
        }

        if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            throw new IllegalStateException("Đơn hàng này đã được thanh toán thành công");
        }

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = order.getOrderNumber();
        String vnp_IpAddr = VNPayConfig.getIpAddress(request);
        String vnp_TmnCode = vnPayConfig.getVnpTmnCode();
        String hashSecret = vnPayConfig.getVnpHashSecret();

        if (vnp_TmnCode == null || vnp_TmnCode.isBlank() || hashSecret == null || hashSecret.isBlank()) {
            throw new IllegalStateException("Chưa cấu hình VNPAY_TMN_CODE hoặc VNPAY_HASH_SECRET trong file .env. Bạn vui lòng lấy mã sandbox miễn phí tại https://sandbox.vnpayment.vn/devreg/ để cấu hình.");
        }

        long amount = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (UnsupportedEncodingException e) {
                    // Ignore
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getVnpHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVnpPayUrl() + "?" + queryUrl;

        return PaymentDto.VNPayResponse.builder()
                .paymentUrl(paymentUrl)
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .message("Tạo URL thanh toán VNPay thành công")
                .build();
    }

    @Override
    @Transactional
    public PaymentDto.PaymentCallbackResult processVNPayCallback(Map<String, String> queryParams) {
        Map<String, String> fields = new HashMap<>();
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            if (entry.getKey().startsWith("vnp_")) {
                fields.put(entry.getKey(), entry.getValue());
            }
        }

        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String calculatedHash = VNPayConfig.hashAllFields(fields, vnPayConfig.getVnpHashSecret());

        String orderNumber = fields.get("vnp_TxnRef");
        String transactionNo = fields.get("vnp_TransactionNo");
        String responseCode = fields.get("vnp_ResponseCode");
        String amountStr = fields.get("vnp_Amount");
        BigDecimal amount = amountStr != null ? new BigDecimal(amountStr).divide(BigDecimal.valueOf(100)) : BigDecimal.ZERO;

        if (!calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
            return PaymentDto.PaymentCallbackResult.builder()
                    .orderNumber(orderNumber)
                    .transactionNo(transactionNo)
                    .amount(amount)
                    .status("INVALID_SIGNATURE")
                    .message("Chữ ký số không hợp lệ (Checksum failed)")
                    .build();
        }

        Order order = orderRepository.findByOrderNumber(orderNumber).orElse(null);

        if ("00".equals(responseCode)) {
            if (order != null) {
                order.setPaymentStatus(Order.PaymentStatus.PAID);
                order.setStatus(Order.OrderStatus.PROCESSING);
                order.setPaymentMethod(Order.PaymentMethod.VNPAY);
                orderRepository.save(order);
            }
            return PaymentDto.PaymentCallbackResult.builder()
                    .orderNumber(orderNumber)
                    .transactionNo(transactionNo)
                    .amount(amount)
                    .status("SUCCESS")
                    .message("Giao dịch thanh toán VNPay thành công")
                    .build();
        } else {
            if (order != null && order.getPaymentStatus() != Order.PaymentStatus.PAID) {
                order.setPaymentStatus(Order.PaymentStatus.FAILED);
                orderRepository.save(order);
            }
            return PaymentDto.PaymentCallbackResult.builder()
                    .orderNumber(orderNumber)
                    .transactionNo(transactionNo)
                    .amount(amount)
                    .status("FAILED")
                    .message("Giao dịch không thành công hoặc người dùng đã hủy (Mã phản hồi: " + responseCode + ")")
                    .build();
        }
    }
}
