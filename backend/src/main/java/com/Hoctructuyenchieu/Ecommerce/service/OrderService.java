package com.Hoctructuyenchieu.Ecommerce.service;

import com.Hoctructuyenchieu.Ecommerce.entity.*;
import com.Hoctructuyenchieu.Ecommerce.web.dto.OrderDto;
import java.util.List;

public interface OrderService {
    Order checkout(String username, OrderDto.CreateOrderRequest request);

    List<Order> getUserOrders(String username);

    List<Order> getAllOrders();

    Order getOrderById(Long id);

    Order updateOrderStatus(Long id, OrderDto.UpdateStatusRequest request);
}
