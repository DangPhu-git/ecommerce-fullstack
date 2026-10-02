package com.Hoctructuyenchieu.Ecommerce.web.controllers;

import com.Hoctructuyenchieu.Ecommerce.common.dto.ApiResponse;
import com.Hoctructuyenchieu.Ecommerce.entity.Order;
import com.Hoctructuyenchieu.Ecommerce.service.OrderService;
import com.Hoctructuyenchieu.Ecommerce.web.dto.OrderDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders/checkout — tạo đơn hàng mới → 201 Created
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Order>> checkout(Authentication authentication,
            @Valid @RequestBody OrderDto.CreateOrderRequest request) {
        Order order = orderService.checkout(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(order, "Đặt hàng thành công"));
    }

    // GET /api/orders/my-orders — lịch sử đơn của user hiện tại
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(Authentication authentication) {
        List<Order> orders = orderService.getUserOrders(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(orders, "Fetched user orders"));
    }

    // GET /api/orders — chỉ ADMIN
    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders, "Fetched all orders"));
    }

    // GET /api/orders/{id} — chỉ ADMIN
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order, "Fetched order details"));
    }

    // PUT /api/orders/{id}/status — chỉ ADMIN
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(@PathVariable Long id,
            @RequestBody OrderDto.UpdateStatusRequest request) {
        Order order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(order, "Trạng thái đơn hàng đã được cập nhật"));
    }

    // POST /api/orders/{id}/cancel — User tự hủy đơn khi còn PENDING và hoàn kho
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(@PathVariable Long id, Authentication authentication) {
        Order order = orderService.cancelOrder(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(order, "Đã hủy đơn hàng và hoàn lại số lượng tồn kho"));
    }
}
