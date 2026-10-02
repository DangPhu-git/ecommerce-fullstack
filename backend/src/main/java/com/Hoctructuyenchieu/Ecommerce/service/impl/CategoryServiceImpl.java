package com.Hoctructuyenchieu.Ecommerce.service.impl;

import com.Hoctructuyenchieu.Ecommerce.service.CategoryService;

import com.Hoctructuyenchieu.Ecommerce.entity.Category;
import com.Hoctructuyenchieu.Ecommerce.exception.ConflictException;
import com.Hoctructuyenchieu.Ecommerce.exception.ResourceNotFoundException;
import com.Hoctructuyenchieu.Ecommerce.repository.CategoryRepository;
import com.Hoctructuyenchieu.Ecommerce.web.dto.CategoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }

    @Override
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new ConflictException("Danh mục đã tồn tại: " + request.getName());
        }

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryById(id);
        category.setName(request.getName());
        category.setSlug(request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", id);
        }
        categoryRepository.deleteById(id);
    }
}
