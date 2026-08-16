package com.Hoctructuyenchieu.Ecommerce.service;

import com.Hoctructuyenchieu.Ecommerce.entity.Product;
import com.Hoctructuyenchieu.Ecommerce.web.dto.ProductRequest;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts(String keyword, Long categoryId);

    List<Product> getFeaturedProducts();

    Product getProductById(Long id);

    Product createProduct(ProductRequest request);

    Product updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}
