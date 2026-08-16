package com.Hoctructuyenchieu.Ecommerce.service;

import com.Hoctructuyenchieu.Ecommerce.entity.Cart;
import com.Hoctructuyenchieu.Ecommerce.web.dto.CartDto;

public interface CartService {
    Cart getOrCreateCart(String username);

    Cart addToCart(String username, CartDto.AddToCartRequest request);

    Cart updateItemQuantity(String username, Long itemId, Integer quantity);

    Cart removeItem(String username, Long itemId);

    void clearCart(Cart cart);
}
