package com.Hoctructuyenchieu.Ecommerce.web.dto;

import com.Hoctructuyenchieu.Ecommerce.entity.Order;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class OrderDto {

    @Data
    public static class CreateOrderRequest {
        @NotBlank(message = "Shipping address is required")
        private String shippingAddress;

        @NotBlank(message = "Phone number is required")
        private String phone;

        private String recipientName;
        private String note;
        private Order.PaymentMethod paymentMethod = Order.PaymentMethod.COD;
    }

    @Data
    public static class UpdateStatusRequest {
        private Order.OrderStatus status;
        private Order.PaymentStatus paymentStatus;
    }
}
