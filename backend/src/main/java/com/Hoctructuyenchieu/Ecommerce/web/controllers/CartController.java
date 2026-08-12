package com.Hoctructuyenchieu.Ecommerce.web.controllers;

import com.Hoctructuyenchieu.Ecommerce.common.dto.ApiResponse;
import com.Hoctructuyenchieu.Ecommerce.entity.Cart;
import com.Hoctructuyenchieu.Ecommerce.service.CartService;
import com.Hoctructuyenchieu.Ecommerce.web.dto.CartDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(Authentication authentication) {
        Cart cart = cartService.getOrCreateCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(cart, "Fetched user cart"));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<Cart>> addToCart(Authentication authentication, @Valid @RequestBody CartDto.AddToCartRequest request) {
        Cart cart = cartService.addToCart(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item added to cart"));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> updateCartItem(Authentication authentication, @PathVariable Long itemId, @Valid @RequestBody CartDto.UpdateItemRequest request) {
        Cart cart = cartService.updateItemQuantity(authentication.getName(), itemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success(cart, "Cart item updated"));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> removeCartItem(Authentication authentication, @PathVariable Long itemId) {
        Cart cart = cartService.removeItem(authentication.getName(), itemId);
        return ResponseEntity.ok(ApiResponse.success(cart, "Cart item removed"));
    }
}
