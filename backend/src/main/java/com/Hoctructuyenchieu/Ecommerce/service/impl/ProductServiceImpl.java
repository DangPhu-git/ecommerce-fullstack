package com.Hoctructuyenchieu.Ecommerce.service.impl;

import com.Hoctructuyenchieu.Ecommerce.service.ProductService;

import com.Hoctructuyenchieu.Ecommerce.entity.Category;
import com.Hoctructuyenchieu.Ecommerce.entity.Product;
import com.Hoctructuyenchieu.Ecommerce.exception.ResourceNotFoundException;
import com.Hoctructuyenchieu.Ecommerce.repository.CategoryRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.ProductRepository;
import com.Hoctructuyenchieu.Ecommerce.web.dto.ProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<Product> getAllProducts(String keyword, Long categoryId, Pageable pageable) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        if (cleanKeyword != null && categoryId != null) {
            return productRepository.findByKeywordAndCategoryId(cleanKeyword, categoryId, pageable);
        } else if (cleanKeyword != null) {
            return productRepository.findByKeyword(cleanKeyword, pageable);
        } else if (categoryId != null) {
            return productRepository.findByCategoryId_(categoryId, pageable);
        }
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByIsFeaturedTrue(pageable);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    @Override
    public Product createProduct(ProductRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        }

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .category(category)
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setSlug(request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
    }
}
