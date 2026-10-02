package com.Hoctructuyenchieu.Ecommerce.web.controllers;

import com.Hoctructuyenchieu.Ecommerce.common.dto.ApiResponse;
import com.Hoctructuyenchieu.Ecommerce.entity.Product;
import com.Hoctructuyenchieu.Ecommerce.service.ProductService;
import com.Hoctructuyenchieu.Ecommerce.web.dto.ProductRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        productService.getAllProducts(keyword, categoryId, pageable),
                        "Fetched products"));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<Page<Product>>> getFeaturedProducts(
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        productService.getFeaturedProducts(pageable),
                        "Fetched featured products"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id), "Fetched product"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(productService.createProduct(request), "Sản phẩm đã được tạo thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success(productService.updateProduct(id, request), "Sản phẩm đã được cập nhật"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
