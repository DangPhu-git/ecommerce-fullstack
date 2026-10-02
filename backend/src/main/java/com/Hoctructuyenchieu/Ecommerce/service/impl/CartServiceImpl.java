package com.Hoctructuyenchieu.Ecommerce.service.impl;

import com.Hoctructuyenchieu.Ecommerce.service.CartService;

import com.Hoctructuyenchieu.Ecommerce.entity.Cart;
import com.Hoctructuyenchieu.Ecommerce.entity.CartItem;
import com.Hoctructuyenchieu.Ecommerce.entity.Product;
import com.Hoctructuyenchieu.Ecommerce.entity.User;
import com.Hoctructuyenchieu.Ecommerce.exception.ResourceNotFoundException;
import com.Hoctructuyenchieu.Ecommerce.repository.CartItemRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.CartRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.ProductRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.UserRepository;
import com.Hoctructuyenchieu.Ecommerce.web.dto.CartDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public Cart getOrCreateCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    @Override
    @Transactional
    public Cart addToCart(String username, CartDto.AddToCartRequest request) {
        Cart cart = getOrCreateCart(username);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        int targetQuantity = request.getQuantity();
        if (existingItem.isPresent()) {
            targetQuantity += existingItem.get().getQuantity();
        }

        if (product.getStockQuantity() == null || product.getStockQuantity() < targetQuantity) {
            int available = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            throw new IllegalStateException("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho (còn lại: " + available + ")");
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(targetQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
            cartItemRepository.save(item);
        }

        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart updateItemQuantity(String username, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(username);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa item này");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            Product product = item.getProduct();
            if (product.getStockQuantity() == null || product.getStockQuantity() < quantity) {
                int available = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                throw new IllegalStateException("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho (còn lại: " + available + ")");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart removeItem(String username, Long itemId) {
        Cart cart = getOrCreateCart(username);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa item này");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
