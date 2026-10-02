package com.Hoctructuyenchieu.Ecommerce.service.impl;

import com.Hoctructuyenchieu.Ecommerce.service.OrderService;
import com.Hoctructuyenchieu.Ecommerce.service.CartService;

import com.Hoctructuyenchieu.Ecommerce.entity.*;
import com.Hoctructuyenchieu.Ecommerce.exception.ResourceNotFoundException;
import com.Hoctructuyenchieu.Ecommerce.repository.OrderRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.ProductRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.UserRepository;
import com.Hoctructuyenchieu.Ecommerce.web.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Override
    @Transactional
    public Order checkout(String username, OrderDto.CreateOrderRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Cart cart = cartService.getOrCreateCart(username);
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Không thể đặt hàng khi giỏ hàng trống");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .phone(request.getPhone())
                .recipientName(request.getRecipientName() != null ? request.getRecipientName() : user.getFullName())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .status(Order.OrderStatus.PENDING)
                .paymentStatus(Order.PaymentStatus.UNPAID)
                .build();

        for (CartItem cartItem : cart.getItems()) {
            // Khóa bi quan (PESSIMISTIC_WRITE) để ngăn chặn Race Condition / Overselling
            Product product = productRepository.findByIdWithLock(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", cartItem.getProduct().getId()));

            int availableStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            if (availableStock < cartItem.getQuantity()) {
                throw new IllegalStateException("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho (chỉ còn " + availableStock + ")");
            }

            // Trừ số lượng tồn kho
            product.setStockQuantity(availableStock - cartItem.getQuantity());
            productRepository.save(product);

            BigDecimal itemPrice = product.getDiscountPrice() != null ?
                    product.getDiscountPrice() : product.getPrice();

            totalAmount = totalAmount.add(itemPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .price(itemPrice)
                    .quantity(cartItem.getQuantity())
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful checkout
        cartService.clearCart(cart);

        return savedOrder;
    }

    @Override
    public List<Order> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, OrderDto.UpdateStatusRequest request) {
        Order order = getOrderById(id);

        // Hoàn tồn kho nếu đơn hàng bị hủy (CANCELLED)
        if (request.getStatus() != null && request.getStatus() != order.getStatus()) {
            if (request.getStatus() == Order.OrderStatus.CANCELLED && order.getStatus() != Order.OrderStatus.CANCELLED) {
                for (OrderItem item : order.getItems()) {
                    Product product = productRepository.findByIdWithLock(item.getProduct().getId()).orElse(null);
                    if (product != null) {
                        int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                        product.setStockQuantity(currentStock + item.getQuantity());
                        productRepository.save(product);
                    }
                }
            }
            order.setStatus(request.getStatus());
        }

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelOrder(Long id, String username) {
        Order order = getOrderById(id);

        if (!order.getUser().getUsername().equals(username)) {
            throw new org.springframework.security.access.AccessDeniedException("Bạn không có quyền hủy đơn hàng này");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể hủy đơn hàng khi đơn đang ở trạng thái Chờ xác nhận");
        }

        // Hoàn lại số lượng tồn kho
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findByIdWithLock(item.getProduct().getId()).orElse(null);
            if (product != null) {
                int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                product.setStockQuantity(currentStock + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}
