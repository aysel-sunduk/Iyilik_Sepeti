// service/CategoryServiceImpl.java
package com.donatecommerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.request.CategoryCreateRequest;
import com.donatecommerce.dto.response.CategoryResponse;
import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.CategoryType;
import com.donatecommerce.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<CategoryResponse> getCategoriesByType(CategoryType type) {
        return categoryRepository.findByTypeAndIsActiveTrue(type)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kategori bulunamadı: " + id));
        return convertToResponse(category);
    }
    
    @Override
    public CategoryResponse getCategoryByName(String name) {
        Category category = categoryRepository.findByName(name)
            .orElseThrow(() -> new RuntimeException("Kategori bulunamadı: " + name));
        return convertToResponse(category);
    }
    
    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        // Slug oluştur
        String slug = request.getNameSlug();
        if (slug == null || slug.isEmpty()) {
            slug = request.getName().toLowerCase()
                .replace("ğ", "g")
                .replace("ü", "u")
                .replace("ş", "s")
                .replace("ı", "i")
                .replace("ö", "o")
                .replace("ç", "c")
                .replaceAll("[^a-z0-9]", "-");
        }
        
        Category category = Category.builder()
            .name(request.getName())
            .nameSlug(slug)
            .description(request.getDescription())
            .imageUrl(request.getImageUrl())
            .type(request.getType())
            .createdAt(LocalDateTime.now())
            .isActive(true)
            .build();
        
        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }
    
    @Override
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryCreateRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kategori bulunamadı: " + id));
        
        if (request.getName() != null) category.setName(request.getName());
        if (request.getNameSlug() != null) category.setNameSlug(request.getNameSlug());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getImageUrl() != null) category.setImageUrl(request.getImageUrl());
        if (request.getType() != null) category.setType(request.getType());
        
        Category updatedCategory = categoryRepository.save(category);
        return convertToResponse(updatedCategory);
    }
    
    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kategori bulunamadı: " + id));
        category.setIsActive(false);
        categoryRepository.save(category);
    }
    
    private CategoryResponse convertToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setNameSlug(category.getNameSlug());
        response.setDescription(category.getDescription());
        response.setImageUrl(category.getImageUrl());
        response.setType(category.getType());
        response.setCreatedAt(category.getCreatedAt());
        response.setIsActive(category.getIsActive());
        return response;
    }
}