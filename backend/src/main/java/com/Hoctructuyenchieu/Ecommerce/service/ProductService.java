package com.Hoctructuyenchieu.Ecommerce.service;

import com.Hoctructuyenchieu.Ecommerce.entity.Product;
import com.Hoctructuyenchieu.Ecommerce.web.dto.ProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<Product> getAllProducts(String keyword, Long categoryId, Pageable pageable);

    Page<Product> getFeaturedProducts(Pageable pageable);

    Product getProductById(Long id);

    Product createProduct(ProductRequest request);

    Product updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}
