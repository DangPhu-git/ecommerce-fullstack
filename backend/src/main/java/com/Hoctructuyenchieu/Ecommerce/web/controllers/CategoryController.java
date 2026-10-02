package com.Hoctructuyenchieu.Ecommerce.web.controllers;

import com.Hoctructuyenchieu.Ecommerce.common.dto.ApiResponse;
import com.Hoctructuyenchieu.Ecommerce.entity.Category;
import com.Hoctructuyenchieu.Ecommerce.service.CategoryService;
import com.Hoctructuyenchieu.Ecommerce.web.dto.CategoryRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories(), "Fetched all categories"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategoryById(id), "Fetched category"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(categoryService.createCategory(request), "Danh mục đã được tạo thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success(categoryService.updateCategory(id, request), "Danh mục đã được cập nhật"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
